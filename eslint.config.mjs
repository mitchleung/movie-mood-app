import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    ignores: ["hooks/useMovies.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/tmdb",
              importNames: ["discoverByMood", "searchMovies"],
              message:
                "Import TMDB API calls via hooks/useMovies.ts, not directly. (getPosterUrl is fine to import directly — it's a pure utility, not an API call.)",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
