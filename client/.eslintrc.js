// this file is intended for IDE. Not used to run builds and tests of ember apps.
// see README.md in this folder for reasons.
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    es6: true
  },
  rules: {
    'no-console': 'error', // error if console statements
    'max-len': ["error", { "code": 160 }],
    'indent': ['error', 2, { "SwitchCase": 1 }],
    'react/prop-types': [
       'enabled',
      { 'ignore': 'ignore', 'customValidators': 'customValidator' }
    ]
  }
};
