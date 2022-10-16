module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:jest/recommended', 'plugin:jest/style', 'airbnb-base'],
  plugins: ['jest'],
  overrides: [{ files: './src/__test__/*' }],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
  },

};
