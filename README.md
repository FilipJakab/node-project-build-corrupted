# Repo for reproducing error with js build output

Hello, this project is to reproduce issue when building this project.

The following screenshot depicts the error (exact location in js build output, that contains corrupted code):

![js-build-output-error.png](./js-build-output-error.png)

I observed that the error is tied to the presence of `--watch` CLI switch which enables file changes watch.

## Steps to reproduce
- `npm i`
- `npm run dev-server` (starts dev server and HTTP server in output dir)
- Navigate to `http://localhost:8080`
- Observe output
  - **3** apps should be rendered for the build to be successful
  - less than **3** means that at least one app has corrupted output (see devtools console for hints)

### Successful approach
- `npm i`
- `npm run build` (just *builds* the project)
- `live-server ./output`
- Navigate to `http://localhost:8080`
- Observe output: **3** apps should be rendered

## Project structure description

In `./src/lib/apps` are 3 separate applications. The core of building process is a `./builder.js` file. This code looks into `./src/lib/apps`
and starts *build* process for each found app (plus one more - build of the `./src/lib/main.ts` file).
This `main.ts` file contains `AppsManager` (and other code omitted for brevity). Each of the individual apps register itself against this `AppsManager` and this manager
is responsible for creating and mounting registered apps at runtime.
