// this file is intended for IDE. Not used to run builds and tests of ember apps.
// see README.md in this folder for reasons.
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    'no-console': 'error', // error if console statements
    'max-len': ["error", { "code": 160 }],
    'indent': ['error', 2, { "SwitchCase": 1 }],
  },
  "overrides": [
    {
      "files": ["*.config.js"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  settings: {
    "react": {
      "version": "detect",
    },
  }
}
