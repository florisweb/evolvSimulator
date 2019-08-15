
const Main = new function() {

	let This = {
		totalEnergyConsumption: 0,
		totalBrainOutput: [0, 0, 0, 0],
		updates: 0,



		settings: {
			logging: false,
			renderEveryXFrames: 1,
			
			sunBrightness: 10,
			mutationChance: 1,
			mutationRate: 0.1,

			plantRange: [10, 100], // min - max plants
			creatureRange: [10, 100], // min - max plants



			energyConsumption: {
				default: 0.1, // to be kept alive
				creatureAgeConstant: 0.001, // degration of the body makes it less efficient
				plantAgeConstant: 0.1,
				sizeConstant: 0.001,
				eyeConstant: 0.001,
				neuronConstant: 0.01,
				turnConstant: 0.2,
				moveConstant: 1,
			}
		},

		entities: [],
		plants: 0,
		creatures: 0,

		running: true,


		createRandomCreature: 	createRandomCreature,
		createRandomPlant: 		createRandomPlant,
		createEntity: 			createEntity,
		
		createCreatures: function(_amount = 10) {
			for (let i = 0; i < _amount; i++)
			{
				this.createRandomCreature();
			} 
		},
		createPlants: function(_amount = 10) {
			for (let i = 0; i < _amount; i++)
			{
				this.createRandomPlant();
			} 
		},

		updateEntities: function() {
			for (entity of this.entities) entity.inpData = entity.update();
		},

		getEntity: function(_id) {
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
				this[This.entities[i].type + "s"]--;
				This.entities.splice(i, 1);
				return true;
			}
			return false;
		},

		update: function() {
			this.updates++;
			this.updateEntities();

			if (this.plants < this.settings.plantRange[0])		 this.createRandomPlant();
			if (this.creatures < this.settings.creatureRange[0]) this.createRandomCreature();
			
			if (this.updates % this.settings.renderEveryXFrames == 0) Renderer.update();

			This.totalEnergyConsumption = 0;
			This.totalBrainOutput = [0, 0, 0, 0];
			if (this.running) requestAnimationFrame(function () {Main.update()});
		}
	}

	return This;


	function createRandomCreature() {
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

		return createEntity(DNA, {
			energy: 100,
			angle: 	Math.random() * Math.PI * 2,
			x: 		Math.round(Math.random() * Renderer.canvas.width),
			y: 		Math.round(Math.random() * Renderer.canvas.height),
		}, "creature");
	}

	function createRandomPlant() {
		let DNA = {
			size: 		(Math.random() * 1.5 + .5) * 15,
			r: 			Math.random(),
			g: 			Math.random(),
			b: 			Math.random()
		};

		return createEntity(DNA, {
			energy: 100,
			angle: 	Math.random() * Math.PI * 2,
			x: 		Math.round(Math.random() * Renderer.canvas.width),
			y: 		Math.round(Math.random() * Renderer.canvas.height),
		}, "plant");
	}


	function createEntity(_DNA, _metaData, _type = "plant") {
		let constructor = _creature;
		if (_type == "plant")
		{
			constructor = _plant;
			if (This.plants >= This.settings.plantRange[1]) return false;
		} else {
			if (This.creatures >= This.settings.creatureRange[1]) return false;
		}
		
		let entity = new constructor(_DNA, _metaData);


		This[_type + "s"]++; // to keep track of the amount of plants / creatures there are
		This.entities.push(entity);
		return entity;
	}

}

let startTime = new Date();
Main.createCreatures(10);
Main.createPlants(10);
Main.update();
console.warn("time", new Date() - startTime);




function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}