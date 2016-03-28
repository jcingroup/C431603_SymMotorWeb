var path = require('path');
var webpack = require('webpack');
//var node_modules_dir = path.resolve(__dirname, 'node_modules');
module.exports = {
    entry: {
        //基礎功能
        m_menu: path.resolve(__dirname, 'Scripts/src/tsx/m-menu.js'),
        m_menu_set: path.resolve(__dirname, 'Scripts/src/tsx/m-menu_set.js'),
        m_login: path.resolve(__dirname, 'Scripts/src/tsx/m-login.js'),
        m_roles: path.resolve(__dirname, 'Scripts/src/tsx/m-roles.js'),
        m_change_password: path.resolve(__dirname, 'Scripts/src/tsx/m-change_password.js'),
        m_users: path.resolve(__dirname, 'Scripts/src/tsx/m-users.js'),
        //後台 管理者
        m_event: path.resolve(__dirname, 'Scripts/src/tsx/m-event.js'),
        m_event_type: path.resolve(__dirname, 'Scripts/src/tsx/m-event_type.js'),
        m_news: path.resolve(__dirname, 'Scripts/src/tsx/m-news.js'),
        m_parm: path.resolve(__dirname, 'Scripts/src/tsx/m-parm.js'),
        m_banner: path.resolve(__dirname, 'Scripts/src/tsx/m-banner.js'),
        m_faq_category: path.resolve(__dirname, 'Scripts/src/tsx/m-faq_category.js'),
        m_faq: path.resolve(__dirname, 'Scripts/src/tsx/m-faq.js'),
        m_editor: path.resolve(__dirname, 'Scripts/src/tsx/m-editor.js'),
        m_editor_detail: path.resolve(__dirname, 'Scripts/src/tsx/m-editor_detail.js'),
        m_brand: path.resolve(__dirname, 'Scripts/src/tsx/m-brand.js'),
        m_brand_category: path.resolve(__dirname, 'Scripts/src/tsx/m-brand_category.js'),
        m_location: path.resolve(__dirname, 'Scripts/src/tsx/m-location.js'),
        m_test_drive: path.resolve(__dirname, 'Scripts/src/tsx/m-test_drive.js'),
        //前台
        w_loan_email: path.resolve(__dirname, 'Scripts/src/tsx/w-loan_email.js'),
        w_testdrive_email: path.resolve(__dirname, 'Scripts/src/tsx/w-testdrive_email.js'),
        w_location: path.resolve(__dirname, 'Scripts/src/tsx/w-location.js'),
        w_location_v2: path.resolve(__dirname, 'Scripts/src/tsx/w-location_v2.js'),
        w_usedcar_list: path.resolve(__dirname, 'Scripts/src/jsx/w-usedcar-list.jsx'),
        w_usedcar_content: path.resolve(__dirname, 'Scripts/src/jsx/w-usedcar-content.jsx'),
        vendors: ['jquery', 'react', 'react-bootstrap', 'moment'],
        vendorsforweb: ['react', 'react-dom', 'moment', 'es5-shim', 'es5-shim/es5-sham', 'console-polyfill']
    },
    output: {
        path: path.resolve(__dirname, 'Scripts/build/app'),
        filename: '[name].js'
    },
    module: {
        loaders: [
          { test: /\.jsx$/, loader: 'babel', query: { presets: ['react', 'es2015'] } },
          { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    resolve: {
        alias: {
            moment: "moment/moment.js"
        },
        modulesDirectories: ["app_modules", "node_modules"],
        extensions: ['', '.js', 'jsx', '.json']
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({ names: ['vendors', 'vendorsforweb'] }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-tw/),
      //new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    ]
};