import nextConfig from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "scripts/**",
      "src/data/letras-presenca-build.ts",
    ],
  },
  ...nextConfig,
  ...tsConfig,
];
