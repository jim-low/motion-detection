module.exports = {
    entry: './main.js', // Entry point of your application
    output: {
        filename: 'bundle.js', // Output bundle file name
        path: __dirname + '/dist', // Output directory
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Apply the loader to JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
