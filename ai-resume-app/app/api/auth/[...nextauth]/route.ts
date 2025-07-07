// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const DEFAULT_AVATAR =
  "https://play-lh.googleusercontent.com/nV5JHE9tyyqNcVqh0JLVGoV2ldpAqC8htiBpsbjqxATjXQnpNTKgU99B-euShOJPu-8";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        // ✅ Capture GitHub username here
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login, // ✅ GitHub username
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");
        if (!user.emailVerified) throw new Error("Email not verified");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password!
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          name: user.userName,
          email: user.email,
          image: user.avatar || DEFAULT_AVATAR,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✅ Add login (GitHub username) if available
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          login: user.login, // may be undefined for Google/Credentials
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image || DEFAULT_AVATAR,
          login: token.user.login, // may be undefined
        };
      }
      return session;
    },
    async signIn({ user, account }) {
      await connectToDB();

      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            userName: user.name || user.login || "New User",
            email: user.email,
            emailVerified: true,
            avatar: user.image || DEFAULT_AVATAR,
            bio: "",
            githubUsername: user.login,
            // ✅ Optional: If you want to store login in DB, add a field in your User schema
            // githubUsername: user.login,
          });
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/";
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
