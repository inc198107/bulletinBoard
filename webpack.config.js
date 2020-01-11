const path = require('path');
const webpack = require('webpack');
module.exports = {
    mode: 'development',
    entry: __dirname + '/src/javascripts/application.js',
    output: {
        path: path.resolve(__dirname, 'public/javascripts'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            '$': 'jquery',
            jquery: 'jquery',
            'window.jquery': 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      }
}