const path = require('path');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'production/'),
    // publicPath: path.resolve(__dirname, 'src/'),
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ],
    alias: {
      '/src/shared/styles': path.join(__dirname, 'src/shared/styles/index.scss'),
      '/src': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new StaticSiteGeneratorPlugin({
      paths: [
        '/1',
        '/2',
        '/3',
        '/4',
      ],
      locals: {
        // Properties here are merged into `locals`
        // passed to the exported render function
        greet: 'Hello'
      }
    })
  ]
};
