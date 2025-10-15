// Minimal flat config (ESM)
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Ignore build artifacts
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".vite/**",
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript (non type-aware for speed)
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Project-wide settings for TS/JS + JSX
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // If you later want type-aware rules, add:
        // project: ['./tsconfig.json'],
        // tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Prefer TS version of no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
];
