
module.exports = {
    presets: [
        '@vue/app'
    ],
    'plugins': [
        ['prismjs', {
            'languages': ['javascript', 'css', 'markup'],
            'plugins': ['line-numbers'],
            'theme': 'solarizedlight',
            'css': true
        }],
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ]
    ]
};
