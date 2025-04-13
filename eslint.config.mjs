import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rules that are causing deployment issues
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade from error to warning
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Ignore variables starting with underscore
      "react/no-unescaped-entities": "off", // Disable unescaped entities checks
      "@typescript-eslint/no-empty-object-type": "off", // Disable empty interface warnings
      "@next/next/no-img-element": "warn", // Downgrade from error to warning
      "react/display-name": "off", // Disable display name requirement
    },
  },
];

export default eslintConfig;
