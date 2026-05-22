import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: ["node_modules/**", ".next/**", "**/*.js", "**/*.mjs", "**/*.cjs"]
	},
	...tseslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
		}
	}
);