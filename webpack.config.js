const path = require('path');
const glob = require('glob')
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src')
  }

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'docs')
    },
    devServer: {
        contentBase: './docs',
        writeToDisk: true
    },
    resolve: {
        alias: {
            "../../theme.config$": path.join(__dirname, "/semantic-ui/theme.config"),
            "../semantic-ui/site": path.join(__dirname, "/semantic-ui/site")
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            outputPath: 'css'
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(a?png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            outputPath: 'images'
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav)$/,
                use: 'file-loader'
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.ejs'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', "!CNAME"]
        }),
        new OptimizeCssAssetsPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new PurgecssPlugin({
          paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
          rejected: true
        })
    ],
    mode: mode,
    devtool: prod ? false : 'inline-source-map'
};