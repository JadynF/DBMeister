/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,  // Ignore TypeScript errors during the build
    },
    images: {
        domains: ['dbm-project-customiconimages.nyc3.digitaloceanspaces.com'],
    },
};


export default nextConfig;
