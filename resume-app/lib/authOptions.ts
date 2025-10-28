import { AuthOptions } from "next-auth";
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

        const isValid = await bcrypt.compare(credentials.password, user.password!);
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

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" || account?.provider === "github") {
          await connectToDB();
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            token.user = {
              id: existingUser._id.toString(),
              name: existingUser.userName,
              email: existingUser.email,
              image: existingUser.avatar || DEFAULT_AVATAR,
            };
          } else {
            const newUser = await User.create({
              userName: user.name || "New User",
              email: user.email,
              emailVerified: true,
              avatar: user.image || DEFAULT_AVATAR,
              bio: "",
            });

            token.user = {
              id: newUser._id.toString(),
              name: newUser.userName,
              email: newUser.email,
              image: newUser.avatar || DEFAULT_AVATAR,
            };
          }
        }

        if (account?.provider === "credentials") {
          token.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image || DEFAULT_AVATAR,
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image || DEFAULT_AVATAR,
        };
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl + "/";
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
