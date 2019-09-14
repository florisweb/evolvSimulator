
const antiCache = Math.round(Math.random() * 100000);
importScripts("settings.js?a="			+ antiCache);
importScripts("collision.js?a=" 		+ antiCache);
importScripts("neuralNetwork.js?a="		+ antiCache);

importScripts("map/nutrientGrid.js?a=" 	+ antiCache);
importScripts("map/climateGrid.js?a=" 	+ antiCache);
importScripts("map/map.js?a=" 			+ antiCache);

importScripts("entity.js?a=" 			+ antiCache);
importScripts("creature.js?a=" 			+ antiCache);
importScripts("plant.js?a=" 			+ antiCache);
importScripts("main.js?a="		 		+ antiCache);




const actions = {
	startRunning: 		function () {Main.running = true; Main.update()},
	startHyperRun: 		function () {Main.running = true; Main.loop(Infinity);},
	stopRunning: 		function () {Main.running = false;},
	getMain: 			function () {return JSON.parse(JSON.stringify(Main))},
	setup: 				setup,
	getData: 			exportData,
	getSettings: 		function() {return Settings;},
	writeSettings: 		function(_settings) {Settings = _settings},

	exportWorld: 		exportData,
	importWorld: 		importData
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
			console.error("An error accured", e);
		}
	}

	if (result == "E_actionNotFound") return console.warn("An unknown error accured, perhaps the function doesn't exist.");

	this.postMessage({
		action: _e.data.action,
		result: result
	});
}






function setup(_parameters) {
	Main.worldWidth		= _parameters.width;
	Main.worldHeight 	= _parameters.height
	Main.map 			= createMap();
	Main.update();
}

function exportData() {
	let data = {};
	data.map = JSON.parse(JSON.stringify(Main.map));
	data.entities = JSON.parse(JSON.stringify(Main.entities));
	data.statistics = {
		frames: Main.updates,
		graphLines: [
			Main.creatures,
			Main.plants,
			Main.totalNutrients / Main.map.nutrients.length / Main.map.nutrients[0].length * 1000,
		]
	}
	
	return data;
}



function importData(_world) {
	Main.worldWidth 	= _world.metaData.width;
	Main.worldHeight 	= _world.metaData.height;
	Main.map.importMap(_world.data.map);
	Main.importEntities(_world.data.entities);
}








