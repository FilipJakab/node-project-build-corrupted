import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import sveltePreprocess from "svelte-preprocess"

const appName = process.env.SVELTE_APP

console.debug(`app: ${process.env.SVELTE_APP}`)
export default defineConfig(({mode}) => {
	const production = mode !== "development"

	const baseBuildDir = "./output/__build"
	const outDir       = `${baseBuildDir}/apps/${appName}/`

	// ...
	return {
		build:   {
			emptyOutDir:   true,
			// minify:        production ? "esbuild" : false,
			sourcemap:     !production,
			lib:           {
				entry:    `src/lib/apps/${appName}/main.js`,
				name:     "app",
				fileName: `main`
			},
			outDir:        outDir,
			rollupOptions: {
				output: {
					entryFileNames: `[name].mjs`,
					chunkFileNames: `[name].[hash].mjs`
				}
			}
		},
		resolve: {
			dedupe: ["svelte"]
		},
		plugins: [
			svelte({
				preprocess:      sveltePreprocess({
					// sourceMap: !production,
					// postcss:   {}
				}),
				// compilerOptions: {
				// 	dev: !production
				// }
			})
		]
	}
})
