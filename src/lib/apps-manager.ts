declare global {
	interface Window {
		AppsManager: AppsManager;
	}
}
export {}

export class AppsManager {
	apps: { [key: string]: any }

	constructor() {
		window.AppsManager = this
		console.log("app manager created")
		this.apps = {}
	}

	static initAppsManager() {
		const appsManager = new AppsManager()

		console.log("Setting apps manager", appsManager)
		window.AppsManager = appsManager

		window.addEventListener("load", function () {
			console.log("window loaded")
			appsManager.createAll()
		})

		return appsManager
	}

	register(name: string, constructor: any) {
		console.log("register overlay editor")
		this.apps[name] = constructor
	}

	create(name: string, element: HTMLElement) {
		if (!element || !this.apps[name]) {
			console.warn("Not creating app because mount element or app constructor is missing", element, this.apps, name)
			return
		}

		let filteredDataset = Object
			.entries(element.dataset)
			.filter(([key, _]) => key !== "app")
		let props           = Object.fromEntries(filteredDataset)

		this.apps[name](element, props)
	}

	createAll() {
		console.log("gonna create all apss")
		Object.entries(this.apps).forEach(([name, constructor]) => {
			let elements = document.querySelectorAll<HTMLElement>(
				`[data-app='${name}'`
			)

			console.log("for app", name, "found elements", elements)
			console.log(elements, name)
			elements.forEach((element) => {
				this.create(name, element)
			})
		})
	}
}
