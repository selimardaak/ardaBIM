import { BimServerClient } from "./bimserverjavascriptapi/bimserverclient.js"
import { BimServerViewer } from "./viewer/bimserverviewer.js"

export class Main {

	constructor() {
		this.settings = {
			username: "ardaak248@gmail.com",
			password: "123"
		};

		this.firstProject = {};
	}

	start() {
		this.connectServer({
			address: "http://192.168.1.64:8082/"
		});
	}

	connectServer(server) {
		console.log("Connecting...", server.address);

		this.api = new BimServerClient(server.address);
		this.api.init().then(() => {
			console.log("Logging in...", server.address);
			this.api.login(this.settings.username, this.settings.password, (ds) => {
				console.log("Logging successfull");
				this.getProjects();
			}, (error) => {
				console.error(error.message);
			});
		});
	}

	getProjects() {
		this.api.call("ServiceInterface", "getAllProjects", {
			onlyTopLevel: false,
			onlyActive: true
		}, (projects) => {
			if (projects.length > 0) {
				//to open the first project available
				this.firstProject.oid = projects[0].oid;
				this.firstProject.revisionId = projects[0].revisions[0];
			}
			console.log("Got projects info");

			console.log(this.firstProject);
			this.loadModel(this.firstProject.revisionId);
			/*this.api.call("ServiceInterface", "getAllRevisionsOfProject", {
				poid: this.firstProject.oid
			}, (revisions) => {
				for (const revision of revisions) {
					console.log(revisions);
				}
			});
			*/
		});
	}

	loadModel(revision) {
		var canvas = document.getElementById("glcanvas");
		this.bimServerViewer = new BimServerViewer(this.settings, canvas, window.innerWidth, window.innerHeight, null);
		this.bimServerViewer.loadRevision(this.api, { oid: 131073 });
	}
}

new Main().start();