module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/vue3-essential'
    ],
    rules: {
        "semi": [0],
        'indent': 'off',
        'vue/script-indent': [
            'error',
            4,
            {
                'baseIndent': 1
            }
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': 'off',
        'vue/no-parsing-error': [
            2,
            {
                "x-invalid-end-tag": false
            }
        ]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
