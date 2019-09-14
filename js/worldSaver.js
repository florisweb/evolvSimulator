
const WorldSaver = new function() {
	let This = {
		setup: setup,
		getWorld: getWorld,

		exportWorld: exportWorld,
		importWorld: importWorld,

		settings: {

		},
	}

	function importWorld() {
		let world = getWorld();
		if (!world) return false;
		
		Renderer.canvas.width 	= world.metaData.width;
		Renderer.canvas.height 	= world.metaData.height;

		WebWorker.postMessage({
			action: "importWorld", 
			parameters: world,
		});
	}




	let curWorld;
	async function exportWorld() {
		let world = await createWorldExport();

		writeWorld(world);
	}

	function writeWorld(_world) {
		localStorage.setItem(
			"evolutionSimulator_worlds", 
			JSON.stringify(_world)
		);
	}

	function getWorld() {
		let worldListData = localStorage.getItem("evolutionSimulator_worlds");
		let world = {};
		try {
			world = JSON.parse(worldListData);	
		}
		catch (_e) {}
		return world;
	}



	let resolveExportPromise;
	function createWorldExport() {
		let world = {
			metaData: {
				width: Renderer.canvas.width,
				height: Renderer.canvas.height,
				statistics: {
					frames: 0
				},
			},
			data: {}
		}

		curWorld = world;
		This.curWorld = curWorld;


		WebWorker.postMessage({
			action: "exportWorld", 
			parameters: {}
		});
		
		return new Promise(function (resolve) {
			resolveExportPromise = resolve;
		});
	}







	function setup() {
		WebWorker.addEventListener("message", function(_e) {
			switch (_e.data.action) 
			{
				case "exportWorld": 
					let result 							= _e.data.result;
					curWorld.data.map 					= result.map;
					curWorld.data.entities 				= result.entities;
					curWorld.metaData.statistics.frames = result.statistics.frames;

					resolveExportPromise(
						minifyWorldData(
							curWorld
						)
					);
				break;
			}
		});
	}



	function minifyWorldData(_world) {
		return _world;
	}
	

	return This;
}
