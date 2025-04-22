module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', "./.eslintrc-auto-import.json"  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es2023: true,
  },
  plugins: ['vue', 'import'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/require-v-for-key': 'error',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'no-undef': 'error',
    'no-unused-vars': 'warn',
  },
  globals: {
    defineStore: 'readonly',
    axios: 'readonly',
    reactive: 'readonly',
    toRefs: 'readonly',
    ref: 'readonly',
    useQuasar: 'readonly',
  },
};
