import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    image?: string;
    email: string;
    name: string;
    accessToken?: string;
    provider:string;
  }
  interface Session {
    user: {
      _id?: string;
      image?: string;
      email: string;
      name: string;
      provider:string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    image?: string;
    email: string;
    name: string;
    accessToken?: string;
    provider:string;
  }
}
