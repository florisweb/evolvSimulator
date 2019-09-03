



const Main = new function() {
	let This = {
		totalEnergyConsumption: 0,
		updates: 0,

		bites: 0,
		totalBiteEnergy: 0,
		totalEnergy: 0,
		averageEnergy: 0,
		totalAge: 0,

		worldWidth: 1000,
		worldHeight: 1000,

		entities: [],
		nutrients: [],
		plants: 0,
		creatures: 0,



		running: false,
		frameRate: 1,




		update: function(_update = true) {
			this.updates++;
			this.nutrients.addRandomNutrients(Settings.nutrients.nutrientsPerUpdate);
			this.updateEntities();

			for (let p = 0; p < Settings.plantRange[0] - this.plants; p++) 			this.createRandomPlant();
			for (let c = 0; c < Settings.creatureRange[0] - this.creatures; c++) 	this.createRandomCreature();
			
			This.averageEnergy				= This.totalEnergy / This.creatures;
			This.totalEnergyConsumption 	= 0;
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
			if (this.running && This.totalRuns > 0) {setTimeout(function () {Main.loop()}, 1)} else {console.log("finished")}
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
			for (entity of this.entities) entity.update();
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
				let entity = This.entities.splice(i, 1);
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

			eyeRange: 	This.worldWidth * Math.random() * .1,
			eyeCount: 	Math.round(5 * Math.pow(Math.random(), 2)),
			eyeAngle: 	Math.PI * Math.pow(Math.random(), 4),

			brain: 		[]
		};

		DNA.brain = [
			Math.random()
		];
		for (let i = 0; i < DNA.brain[0]; i++) DNA.brain.push(Math.random() * 4);

		return createEntity(DNA, {
			energy: 100,
			angle: 	Math.random() * Math.PI * 2,
			x: 		Math.round(Math.random() * Main.worldWidth),
			y: 		Math.round(Math.random() * Main.worldHeight),
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
			x: 		Math.round(Math.random() * Main.worldWidth),
			y: 		Math.round(Math.random() * Main.worldHeight),
		}, "plant");
	}


	function createEntity(_DNA, _metaData, _type = "plant") {
		let constructor = _creature;
		if (_type == "plant") constructor = _plant;
		
		let entity = new constructor(_DNA, _metaData);
		This[_type + "s"]++; // to keep track of the amount of plants / creatures there are
		This.entities.push(entity);

		Collision.apply(entity);

		return entity;
	}


	return This;
}








function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}
