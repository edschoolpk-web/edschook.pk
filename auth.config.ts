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

      // DEBUG: console.log("Redirect check:", { url, baseUrl, authUrl });

      // 1. If relative, prepend the proper public domain
      if (url.startsWith("/")) {
        return `${authUrl}${url}`;
      }

      // 2. If the URL is explicitly pointing to local/internal network, FORCE it to public domain
      // This catches http://0.0.0.0:3000/admin... from container internals
      try {
        const parsedUrl = new URL(url);
        if (
          parsedUrl.hostname === '0.0.0.0' ||
          parsedUrl.hostname === 'localhost' ||
          parsedUrl.hostname === '127.0.0.1'
        ) {
          return `${authUrl}${parsedUrl.pathname}${parsedUrl.search}`;
        }
      } catch (e) {
        // invalid url, ignore
      }

      // 3. Fallback: if origin matches what system thinks is baseUrl (which might be 0.0.0.0)
      // but we want to ignore that if it's internal. 
      // Instead, we just trust standard NextAuth behavior IF it's not internal.
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
