module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  root: true,
  settings: {
    'import/resolver':{
      typescript: true,
      node: {
        paths: [
            'src/**/*.ts'
        ],
        extensions:[
            '.js',
            '.ts'
        ]
      }
    }
  }
}
