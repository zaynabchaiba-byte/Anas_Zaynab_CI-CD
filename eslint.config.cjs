const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = [
  // ✅ Ignorer ce qui ne doit jamais être linté
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "eslint.config.cjs",
      "test/**/*.js",
      "test/**/*.d.ts"
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ✅ Lint TS uniquement (src + test)
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parserOptions: { project: "./tsconfig.eslint.json" }
    }
  }
];
