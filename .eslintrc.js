// .eslintrc.js

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true, // Recognize Node.js globals
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Should be last
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Prettier errors as ESLint errors
    'prettier/prettier': 'error',

    // React 17+ doesn't require React to be in scope
    'react/react-in-jsx-scope': 'off',

    // Disable the rule that forbids the use of `any`
    '@typescript-eslint/no-explicit-any': 'off',

    // Customize additional rules as needed
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // **Disable the react/prop-types rule since TypeScript handles type checking**
    'react/prop-types': 'off',

    // You can add more custom rules here
    // For example:
    // '@typescript-eslint/explicit-function-return-type': 'off',
  },
}
