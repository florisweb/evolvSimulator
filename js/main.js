
const Main = new function() {

	let This = {
		totalEnergyConsumption: 0,
		totalBrainOutput: [0, 0, 0, 0],
		updates: 0,

		bites: 0,
		totalBiteEnergy: 0,
		totalEnergy: 0,
		totalAge: 0,


		settings: {
			logging: false,
			renderEveryXFrames: 1,
			
			sunEnergyPerPixel: .0005,
			mutationChance: 1,
			mutationRate: 0.2,
			plantLeafSize: 5,
			creatureBiteRange: 2,

			plantRange: [5, 250], // min - max plants
			creatureRange: [1, 1], // min - max plants

			biteConstant: 0.1,

			energyConsumption: {
				default: 0, // to be kept alive
				plantAgeConstant: .0002,
				creatureAgeConstant: .00005, // degration of the body makes it less efficient
				sizeConstant: .0001,
				eyeConstant: .0,
				neuronConstant: 0.0,
				turnConstant: 0.005,
				moveConstant: .05,
			}
		},

		entities: [],
		plants: 0,
		creatures: 0,



		running: false,
		frameRate: 1,

		update: function(_update = true) {
			this.updates++;
			this.updateEntities();

			for (let p = 0; p < this.settings.plantRange[0] - this.plants; p++) 		this.createRandomPlant();
			for (let c = 0; c < this.settings.creatureRange[0] - this.creatures; c++) 	this.createRandomCreature();
			
			if (this.updates % this.settings.renderEveryXFrames == 0) Renderer.update();

			This.totalEnergyConsumption 	= 0;
			This.totalBrainOutput		 	= [0, 0, 0, 0];
			This.totalBiteEnergy 			= 0;
			This.bites 						= 0;
			This.totalEnergy 				= 0;
			This.totalAge 					= 0;
			// if (this.running && _update) requestAnimationFrame(function () {Main.update()});
			if (this.running && _update) setTimeout(function () {Main.update()}, This.frameRate);
		},

		totalRuns: 0,
		loop: function(_times, msPerLoop = 50) {
			if (_times) this.totalRuns = _times;
			
			let updateLength = new Date();
			this.update(false);
			updateLength = new Date() - updateLength + 1;
			let updatesPerLoop = msPerLoop / updateLength;

			This.totalRuns -= updatesPerLoop + 1;

			for (let i = 1; i < updatesPerLoop; i++) this.update(false);
			if (this.running && This.totalRuns > 0) {requestAnimationFrame(function () {Main.loop()});} else {console.log("finished")}
		},




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

	}

	function createRandomCreature() {
		let DNA = {
			size: 		(Math.random() + .1) * 10,
			speed: 		Math.random() + .1,
			r: 			Math.random(),
			g: 			Math.random(),
			b: 			Math.random(),

			eyeRange: 	Renderer.canvas.width * Math.random() * 0.25,
			eyeCount: 	Math.round(5 * Math.pow(Math.random(), 2)),
			eyeAngle: 	Math.PI * Math.pow(Math.random(), 4),

			brain: 		[]
		};

		DNA.brain = [
			Math.random() * 5
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
			size: 		(Math.random() * 1.5 + .5) * 10,
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
		Collision.apply(entity);


		This[_type + "s"]++; // to keep track of the amount of plants / creatures there are
		This.entities.push(entity);
		return entity;
	}


	return This;
}

let startTime = new Date();
Main.update();
console.warn("time", new Date() - startTime);


// sort creatures on energylevel 
// Main.entities.sort(function (a, b) {
// 	if (a.type == "plant") return 1;
// 	if (a.energy > b.energy) return -1;
// 	if (a.energy < b.energy) return 1;
// 	return 0;
// });

// sort creatures on brainLength 
// Main.entities.sort(function (a, b) {
// 	if (a.type == "plant") return 1;
// 	if (b.type == "plant") return -1;
// 	if (a.DNA.brain.length > b.DNA.brain.length) return -1;
// 	if (a.DNA.brain.length < b.DNA.brain.length) return 1;
// 	return 0;
// });


function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}
