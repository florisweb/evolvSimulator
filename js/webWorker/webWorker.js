

importScripts("settings.js");
importScripts("collision.js");
importScripts("neuralNetwork.js");
importScripts("nutrientGrid.js");
importScripts("entity.js");
importScripts("creature.js");
importScripts("plant.js");
importScripts("main.js");




const actions = {
	startRunning: 		function () {Main.running = true; Main.update()},
	startHyperRun: 		function () {Main.running = true; Main.loop(Infinity);},
	stopRunning: 		function () {Main.running = false;},
	setup: 				setup,
	getData: 			exportData,
	getSettings: 		getSettings
};



this.onmessage = function(_e) {
	let data = _e.data;

	let result = "E_actionNotFound";
	for (action in actions) 
	{
		if (data.action != action) continue;
		
		try {
			result = actions[action](data.parameters);
		}
		catch (e) {
			console.warn("An error accured", e);
		}
		
	}

	if (result == "E_actionNotFound") return false;

	this.postMessage({
		action: _e.data.action,
		result: result
	});
}






function setup(_parameters) {
	Main.worldWidth = _parameters.width;
	Main.worldHeight = _parameters.height
	Main.update();
}

function exportData() {
	let data = {};
	data.nutrients = Main.nutrients.export();
	data.entities = JSON.parse(JSON.stringify(Main.entities));

	return data;
}

function getSettings() {
	return Settings;
}






