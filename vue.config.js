const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    baseUrl: '/',
    outputDir: 'dist',
    lintOnSave: false,
    chainWebpack: config => {
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('markdown-loader')
            .loader('markdown-loader')
            .loader('html-loader')
            .end();
        config.resolve.alias
            .set('@', resolve('src'))
            .set('~', resolve('src'));
    },
    devServer: {
        proxy: {
            '/gateway': {
                target: 'http://scs.dev.cloudyigou.com',
                ws: true,
                changeOrigin: true,
            },
        },
        overlay: {
            warnings: false,
            errors: false,
        },
    },
    css: {
        loaderOptions: {
            // pass options to sass-loader
            sass: {
                // @/ is an alias to src/
                // so this assumes you have a file named `src/variables.scss`
                //data: '@import "@/style/common.scss";',
            },
        },
    },
};
