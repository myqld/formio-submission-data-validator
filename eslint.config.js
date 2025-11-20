const globals = require('globals');

/**
 * eslint config based on Formio projects
 * formio/formio @link - https://github.com/formio/formio/blob/v4.2.8-rc.2/.eslintrc
 * formio/eslint-config-formio @link - https://github.com/formio/eslint-config-formio/blob/v1.1.4/index.js
 */
module.exports = [
    {
        files: ['**/*.js'],
        ignores: ['dist/**', 'lib/**', 'src/util/**', 'node_modules/**'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.es2020,
            },
        },
        rules: {
            'array-bracket-spacing': ['error', 'never'],
            'block-scoped-var': 'error',
            camelcase: 'error',
            'callback-return': ['error', ['callback', '_callback', '_cb', 'cb', 'next', '_next']],
            'comma-style': 'error',
            curly: ['error', 'multi-line'],
            'eol-last': 'error',
            eqeqeq: ['error', 'smart'],
            'import/prefer-default-export': 'off',
            'jsx-a11y/no-noninteractive-element-interactions': 'off',
            'max-depth': ['warn', 3],
            'max-statements': ['warn', 30],
            'max-len': ['warn', 120, 4, { ignoreComments: true, ignoreUrls: true }],
            'new-cap': [
                'error',
                {
                    newIsCap: true,
                    capIsNew: true,
                    newIsCapExceptions: [],
                    capIsNewExceptions: ['Router', 'Resource', 'Schema', 'ObjectId', 'Q', 'Chance'],
                },
            ],
            'no-cond-assign': 'error',
            'no-extend-native': 'error',
            'no-extra-semi': 'error',
            'no-mixed-spaces-and-tabs': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-spaced-func': 'error',
            'no-trailing-spaces': 'error',
            'no-underscore-dangle': 'off',
            'no-use-before-define': ['error', 'nofunc'],
            'no-unexpected-multiline': 'error',
            'no-unused-vars': 'warn',
            'padded-blocks': ['error', 'never'],
            quotes: ['error', 'single', 'avoid-escape'],
            semi: ['error', 'always'],
            'keyword-spacing': ['error', { after: true }],
            'space-before-blocks': 'error',
            'space-unary-ops': 'error',
        },
    },
];
