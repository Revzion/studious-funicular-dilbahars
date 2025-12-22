/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://jgq28ngcpf.us-east-1.awsapprunner.com/api/:path*',
            },
        ];
    },
};

export default nextConfig;