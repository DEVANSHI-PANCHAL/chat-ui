const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/plugin.js', // new entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'ChatPlugin', // This will make your app accessible as a global variable
    libraryTarget: 'umd', // Universal Module Definition, works everywhere
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/, // Load and bundle CSS files
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // optional, for local development
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'production' // Ensure the mode is set to production for optimization
};
