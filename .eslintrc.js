module.exports = {
  extends: ['expo'],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};




