/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for optimal performance
  output: "export",

  // Disable ESLint during builds for faster compilation
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization for static export
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Performance optimizations
  swcMinify: true,

  // React optimization
  reactStrictMode: true,

  // Production source maps (disable for smaller bundle)
  productionBrowserSourceMaps: false,

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Webpack configuration for optimization
  webpack: (config, { dev, isServer }) => {
    // Optimization for production
    if (!dev && !isServer) {
      // Code splitting optimization
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Mapbox specific chunk
            mapbox: {
              test: /[\\/]node_modules[\\/](mapbox-gl)[\\/]/,
              name: "mapbox",
              chunks: "all",
              priority: 40,
            },
            // Supabase specific chunk
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: "supabase",
              chunks: "all",
              priority: 30,
            },
            // Main vendor chunk
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
        // Minimize chunk overhead
        runtimeChunk: {
          name: "runtime",
        },
      };
    }

    // Performance hints
    config.performance = {
      hints: "warning",
      maxAssetSize: 512000, // 500kb
      maxEntrypointSize: 512000,
    };

    return config;
  },

  // Environment variables (public)
  env: {
    APP_NAME: "Ride App",
    APP_VERSION: "2.0.0",
  },

  // Trailing slash
  trailingSlash: false,

  // Power off X-Powered-By header
  poweredByHeader: false,

  // Generate ETags
  generateEtags: true,

  // Page extensions
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

module.exports = nextConfig;
