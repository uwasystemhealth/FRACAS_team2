const path = require("path");

module.exports = {
  entry: "./src/index.js", // Update with your entry point
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // Change to match your build directory
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    watchContentBase: true, // Watch for changes in content base
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Add .ts and .tsx
  },
  module: {
    rules: [
      // ...other rules
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
