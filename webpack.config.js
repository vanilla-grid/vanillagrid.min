const path = require('path');

module.exports = {
  entry: './src/Vanillagrid.js',
  output: {
    filename: 'Vanillagrid.1.0.0.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Vanillagrid',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'production'
};
