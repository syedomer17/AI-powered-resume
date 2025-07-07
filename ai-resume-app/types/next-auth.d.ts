import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string | null; // ✅ Add GitHub username
    };
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    login?: string | null; // ✅ Add GitHub username
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string | null; // ✅ Add GitHub username
    };
  }
}
