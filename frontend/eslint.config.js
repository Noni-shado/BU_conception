import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react,
      sonarjs,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // ✅ Complexité cyclomatique
      complexity: ["warn", 10],

      // ✅ Complexité cognitive (SonarJS)
      "sonarjs/cognitive-complexity": ["warn", 15],

      // ✅ Si tu ne veux pas écrire PropTypes partout
      "react/prop-types": "off",
    },
  },

  js.configs.recommended,
  react.configs.flat.recommended,
]);
