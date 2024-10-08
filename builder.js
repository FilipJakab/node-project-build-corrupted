import { readdir } from "fs/promises";
import { exec } from "child_process";
import fs from "fs";
import yargs from "yargs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArguments() {
	console.log("argv", process.argv);

	/**
	 * @type any
	 */
	let args = yargs(process.argv.slice(2))
		.alias("w", "watch")
		.describe("w", "Recompile when files change")
		.default("w", false)
		.alias("m", "mode")
		.describe("m", "Build mode")
		// .describe("m", "Build mode")
		.choices("m", ["development", "production", "km", "gcp-test", "gcp-prod"])
		.nargs("m", 1)
		.demandOption(["m"])
		.describe("d", "debug logs")
		.boolean(["d", "w"])
		.help("h")
		.alias("h", "help").argv;

	if (args.d) {
		console.log(args);
	}

	return { watch: args.w, mode: args.m, apps: args._, debug: !!args.d };
}

let settings;

async function run() {
	settings = parseArguments();

	if (settings.debug) {
		console.debug({ settings });
	}

	let commands = await getCommands();

	if (settings.debug) {
		console.debug({ commands });
	}

	await executeCommands(commands);
	console.log("Finished commands")
}

async function getCommands() {
	if (settings.apps?.length > 0) {
		return createCommands(settings.apps);
	} else {
		let applications = await getDirectories("src/lib/apps");
		applications.push("main");

		return createCommands(applications);
	}
}

function createCommands(applications) {
	console.log("starting build for application: " + applications.join(", "));

	if (settings.debug) {
		console.debug({ applications });
	}

	return applications.map((name) => createCommand(name));
}

function createCommand(name) {
	console.log("BUILDING:", name)
	let script;


	if (name === "main") {
		script = `vite build --mode ${settings.mode} --config main.vite.config.js`;
	} else {
		script = `cross-env SVELTE_APP=${name} vite build --mode ${settings.mode} --config apps.vite.config.js`;
	}

	if (settings.watch) {
		script += " --watch";
	}

	return { name, cmd: script };
}

async function executeCommands(scripts) {
	return Promise.all(scripts.map((command) => executeCommand(command)))
}

function executeCommand(script) {
	return new Promise(resolve => {
		console.log("starting process for " + script.name);
		let process = exec(script.cmd);
		//stream output from process to console
		process.stdout.on("data", (data) => passToStdout(script.name, data));

		process.stderr.on("data", (data) => passToStdout(script.name, data));

		process.on("exit", () => {
			resolve()
		})
	})
}

function passToStdout(name, data, err) {
	let withoutLastEnter = data.replace(/\n+$/, "");

	let formattedData = withoutLastEnter.replace(/^/gm, putAppName(name, err));

	process.stdout.write(formattedData + "\n");
}

function putAppName(name, err) {
	const Reset = "\u001b[0m";
	const Gray = "\u001b[38;5;239m";
	const Red = "\u001b[31m";

	let ansiColor = err ? Red : Gray;

	return `${ansiColor}[${name}]${Reset} `;
}

async function getDirectories(file) {
	let fullPath = path.resolve(__dirname, file);

	if (!fs.existsSync(fullPath)) {
		return [];
	}

	let directories = (
		await readdir(fullPath, {
			withFileTypes: true,
		})
	).filter((dirent) => dirent.isDirectory());

	return directories.map((dirent) => dirent.name);
}

run();
