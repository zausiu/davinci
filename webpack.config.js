const path = require('path');

module.exports = {
    entry: './client/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
},
    mode: 'production',
    //mode: 'development',
    module: {
        rules: [
              {
                    test: /\.css$/,
                    use: [
                           'style-loader',
                           'css-loader'
                         ]
             }
       ]
   }
};
