




const WorldSaver = new function() {
	let This = {
		setup: setup,
		getWorlds: getWorlds,

		exportWorld: exportWorld,
		importWorld: importWorld,

		settings: {

		},
	}

	function importWorld(_world) {
		if (!_world) return false;
		
		Renderer.canvas.width 	= _world.metaData.width;
		Renderer.canvas.height 	= _world.metaData.height;

		WebWorker.postMessage({
			action: "importWorld", 
			parameters: _world,
		});
	}









	let curWorld;
	async function exportWorld(_title) {
		let worldAdress = curWorld && curWorld.id ? curWorld.id : newId();
		let world = await createWorldExport(_title);
		world.id = worldAdress;

		writeWorld(world, worldAdress);
	}

	function writeWorld(_world, _adress) {
		let worldList = getWorlds();
		worldList[_adress] = _world;

		localStorage.setItem(
			"evolutionSimulator_worlds", 
			JSON.stringify(worldList)
		);
	}

	function getWorlds() {
		let worldListData = localStorage.getItem("evolutionSimulator_worlds");
		let worldList = {};
		try {
			worldList = JSON.parse(worldListData);	
		}
		catch (_e) {}
		
		if (!worldList) worldList = {};
		return worldList;
	}




	let resolveExportPromise;
	function createWorldExport(_title) {
		let world = {
			title: _title,
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

					resolveExportPromise(curWorld);
				break;
			}
		});
	}
	

	return This;
}
