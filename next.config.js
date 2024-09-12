/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,      // Enable React strict mode for improved error handling
    swcMinify: true,            // Enable SWC minification for improved performance
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
    }
}

//module.exports = nextConfig

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    scope: "/app",
    disable: process.env.NODE_ENV === "development",
    register: true,         // register the PWA service worker
    skipWaiting: true,      // skip waiting for service worker activation
});

module.exports = withPWA(
    // Your Next.js config
    nextConfig
);
