/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/feed", destination: "/api/alerts" },
      { source: "/feed/:id", destination: "/api/alerts/:id" },
      { source: "/login", destination: "/auth/login" },
      { source: "/register", destination: "/auth/register" },
      {
        source: "/api/webauthn/authenticate",
        destination: "/api/auth/webauthn/authenticate",
      },
      {
        source: "/api/webauthn/register",
        destination: "/api/auth/webauthn/register",
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en", "fr", "es"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
