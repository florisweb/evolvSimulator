
const Main = new function() {

	let This = {
		totalEnergyConsumption: 0,
		totalBrainOutput: [0, 0, 0, 0],
		updates: 0,



		settings: {
			logging: false,
			renderEveryXFrames: 1,
			
			energyImportPerFrame: 50,
			mutationChance: 1,
			mutationRate: 0.1,

			energyConsumption: {
				default: 0.1, // to be kept alive
				ageConstant: 0.001, // degration of the body makes it less efficient
				sizeConstant: 0.001,
				eyeConstant: 0.001,
				neuronConstant: 0.01,
				turnConstant: 0.2,
				moveConstant: 1,
			}
		},

		entities: [],



		createRandomCreatur: createRandomCreatur,
		createCreatur: createCreatur,
		
		createCreatures: function(_amount = 10) {
			for (let i = 0; i < _amount; i++)
			{
				this.createRandomCreatur();
			} 
		},

		updateCreatures: function() {
			for (creatur of this.entities) creatur.inpData = creatur.update();
		},

		getCreature: function(_id) {
			for (let i = 0; i < This.entities.length; i++)
			{
				if (This.entities[i].id != _id) continue;
				return This.entities[i];
			}
			return false;
		},

		killEntity: function(_id) {
			for (let i = 0; i < This.entities.length; i++)
			{
				if (This.entities[i].id != _id) continue;
				This.entities.splice(i, 1);
				return true;
			}
			return false;
		},

		update: function(_render = true) {
			this.updates++;
			this.updateCreatures();
			
			if (
				this.updates % this.settings.renderEveryXFrames == 0 && 
				_render
			) Renderer.update();
			This.totalEnergyConsumption = 0;
			This.totalBrainOutput = [0, 0, 0, 0];
		}
	}

	return This;


	function createRandomCreatur() {
		let DNA = {
			size: 		(Math.random() * 1.5 + .5) * 15,
			speed: 		Math.random() * 3 + 1,
			r: 			Math.random(),
			g: 			Math.random(),
			b: 			Math.random(),

			eyeRange: 	Renderer.canvas.width * Math.random() * 0.5,
			eyeCount: 	Math.round(2 * Math.random()),
			eyeAngle: 	Math.PI / 20 * Math.random(),

			brain: 		[]
		};


		DNA.brain = [
			Math.random()
		];
		for (let i = 0; i < DNA.brain[0]; i++) DNA.brain.push(Math.random() * 2);

		return createCreatur(DNA, {
			energy: 100,
			angle: Math.random() * Math.PI * 2,
			x: Math.round(Math.random() * Renderer.canvas.width),
			y: Math.round(Math.random() * Renderer.canvas.height),
		});
	}


	function createCreatur(_DNA, _metaData) {
		let creatur = new _creatur(_DNA, _metaData);
		This.entities.push(creatur);
		return creatur;
	}

}

let startTime = new Date();
Main.createCreatures(50);
Main.update();
console.warn("time", new Date() - startTime);
setInterval("Main.update(true)", 1);



function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}