import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig(({ mode }) => {
	console.log(mode);
	const production = mode !== "development";

	const baseOutDir = "./output/__build";

	console.log("🚀 ~ defineConfig ~ baseOutDir:", baseOutDir);
	return {
		build: {
			minify: production ? "esbuild" : false,

			lib: {
				entry: "src/lib/main.ts",
				format: "iife",
				name: "app",
				fileName: "main",
			},
			outDir: baseOutDir,
			rollupOptions: {
				output: {
					entryFileNames: `[name].mjs`,
					chunkFileNames: `[name].[hash].mjs`,
				},
			},
		},
		resolve: {
			dedupe: ["svelte"],
		},
		plugins: [
			svelte({
				preprocess: sveltePreprocess({
					sourceMap: !production,
					postcss: {},
				}),
				compilerOptions: {
					dev: !production,
				},
			}),
		],
	};
});
