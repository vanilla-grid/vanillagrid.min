import path from 'path';

export default {
  entry: './src/Vanillagrid.ts',
  output: {
    filename: 'Vanillagrid.bundle.js',
    path: path.resolve(process.cwd(), 'dist'),
    library: {
      name: 'Vanillagrid',
      type: 'umd',
      export: 'default',
    },
    globalObject: "globalThis",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: 'production'
};
