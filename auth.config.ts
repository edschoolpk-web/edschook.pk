import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      const isOnLoginPage = nextUrl.pathname.startsWith("/admin/login");

      if (isOnAdminPanel) {
        if (isOnLoginPage) {
          if (isLoggedIn) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }

        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      const authUrl = process.env.AUTH_URL || "https://darkgray-squirrel-611553.hostingersite.com";

      // If the url is relative, prepend the authUrl
      if (url.startsWith("/")) {
        return `${authUrl}${url}`;
      }

      // If the url contains localhost or 0.0.0.0 (internal docker/local IPs), fix it
      if (url.includes("0.0.0.0") || url.includes("localhost")) {
        const path = new URL(url).pathname;
        return `${authUrl}${path}`;
      }

      // Allow redirects to the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return authUrl;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now

  debug: true,
  trustHost: true,
} satisfies NextAuthConfig;
