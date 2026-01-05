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
        return Response.redirect(new URL("/admin/login", nextUrl));
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
      // Use AUTH_URL from env if set, otherwise use the default baseUrl
      let effectiveBase = process.env.AUTH_URL || baseUrl;

      // Ensure effectiveBase has a protocol
      if (effectiveBase && !effectiveBase.startsWith("http")) {
        effectiveBase = `https://${effectiveBase}`;
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) {
        return `${effectiveBase}${url}`;
      }

      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === effectiveBase) {
          return url;
        }
      } catch {
        // If url is not a valid URL (e.g. relative without leading slash), fallback to default
      }

      return effectiveBase;
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
