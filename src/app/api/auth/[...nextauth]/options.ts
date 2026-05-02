import { ApiSignin } from "@/utils/api.constant";
import { eHTTPStatusCode } from "@/utils/enum";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const google_client_Id = process.env.GOOGLE_CLIENT_ID;
const google_client_Secret = process.env.GOOGLE_CLIENT_SECRET;

if (!google_client_Id || !google_client_Secret) {
  throw new Error("Google Client ID & secret are required");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: google_client_Id,
      clientSecret: google_client_Secret,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const payload = {
            email: credentials.username,
            password: credentials.password,
            provider: "credentials",
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASEURL}${ApiSignin}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();
          const { statusCode } = data;

          if (statusCode === eHTTPStatusCode.OK) {
            const user = data.data;
            return {
              _id: user.user._id,
              name: user.user.full_name,
              email: user.user.email,
              image: user.user.profile_picture ?? "",
              accessToken: user.accessToken,
            };
          } else {
            throw new Error("User not found");
          }
        } catch (error: any) {
          console.error("Authorize error:", error);
          throw new Error("Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "credentials" && user) {
        token._id = user._id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accessToken = user.accessToken;
      }
      if (account?.provider === "google") {
        // console.log("profile-----<", profile);
        // Call your backend API to sign in or register the Google user
        try {
          const googleProfile = profile as {
            email?: string;
            name?: string;
            picture?: string;
          };
          const payload = {
            email: googleProfile ?.email,
            full_name: googleProfile ?.name,
            profile_picture: googleProfile ?.picture,
            provider: "google",
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASEURL}${ApiSignin}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();
          console.log("data from backend------->",data)
          if (data.statusCode === eHTTPStatusCode.OK) {
            const userData = data.data.user;
            token._id = userData._id;
            token.name = userData.full_name;
            token.email = userData.email;
            token.image = userData.profile_picture ?? "";
            token.accessToken = data.data.accessToken;
          } else {
            throw new Error("Google user login failed in backend");
          }
        } catch (err) {
          console.error("Google Auth API error:", err);
          throw new Error("Google sign-in failed");
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
