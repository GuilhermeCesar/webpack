const path = require('path');
const babiliPlugin = require('babili-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let plugins=[];

// cria o arquivo html
plugins.push(new HtmlWebpackPlugin({
    hash:true,
    minify:{
        html5:true,
        collapseWhitespace:true,
        removeComments:true
    },
    filename:'index.html',
    template:__dirname+'/main.html'
}));

// extrai o css em um bundle
plugins.push(new extractTextPlugin('styles.css'));
// coloca o jquery como escopo globol
plugins.push(
    new webpack.ProvidePlugin(
        {
            '$':'jquery/dist/jquery.js',
            'JQuery':'jquery/dist/jquery.js',
            'jQuery':'jquery/dist/jquery.js'
        }
    )
)
plugins.push(new webpack.optimize.CommonsChunkPlugin(
        {
            name:'vendor',
            filename:'vendor.bundle.js'
        }
    )
)


let SERVICE_URL = JSON.stringify('http://localhost:3000');
if(process.env.NODE_ENV == 'production'){
    //processamento mais rápido    
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

    SERVICE_URL=JSON.stringify('http://endereco-da-sua-api');

    // minifica
    plugins.push(new babiliPlugin());
    // minificar csss
    plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor:require('cssnano'),
        cssProcessorOptions:{
            discardComments:{
                removeAll:true
            }
        },
        canPrint:true
    }))
}

//trocar
plugins.push(new webpack.DefinePlugin({SERVICE_URL}));

module.exports={
    // bundles
    entry:{        
        app:'./app-src/app.js',
        vendor:['jquery','bootstrap','reflect-metadata']
    }, 
        // saidas
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')        
    },
    // modules
    module:{
        rules:
        [
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                }

            },
            {
                test:/\.css$/,
                use:extractTextPlugin.extract({
                    fallback:'style-loader',
                    use:'css-loader'
                })
            },
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            }         
        ]
    },
    plugins
}