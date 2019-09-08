

function _entity(_DNA, _metaData) {
	const This = this;
	this.id 		= newId();
	this.age 		= 0;
	this.parent 	= false;

	this.energy 	= _metaData.energy;

	this.type		= _metaData.type;
	this.angle 		= _metaData.angle;
	this.x 			= _metaData.x;
	this.y	 		= _metaData.y; 



	this.DNA 		= _DNA;

	this.update 	= update;
	this.reproduce 	= reproduce;
	this.die = function () {
		Main.map.nutrients.addByCoords(
			This.x, 
			This.y, 
			Settings.minimumEnergyToBeAlive * Settings.nutrientsPercOnDeath
		);
		Main.killEntity(this.id);
		return true;
	};
	

	function update() {
		This.age++;
		if (This.energy <= Settings.minimumEnergyToBeAlive) return This.die();
		if (This.age % Settings.performance.checkCollisionFrameCount == 0) Collision.apply(This);
	}


	function reproduce(_startDNA, metaData = {}) {
		switch (This.type) 
		{
			case "plant": if (Main.plants >= Settings.plantRange[1]) return false; break;
			default: if (Main.creatures >= Settings.creatureRange[1]) return false; break;
		}

		let startDNA 	= Object.assign({}, This.DNA);
		if (_startDNA) 	startDNA = _startDNA;
		let newDNA	 	= mutateDNA(startDNA, Settings.mutationChance, Settings.mutationRate);

		let angleMutation = Math.PI * .5;
		metaData.angle 	= This.angle + angleMutation - angleMutation * 2 * Math.random();

		let distance	= (newDNA.size + This.DNA.size) * 4;
		let rx 			=  Math.cos(This.angle) * distance;
		let ry 			= -Math.sin(This.angle) * distance;
		metaData.x 		= This.x + rx;
		metaData.y 		= This.y + ry;

		
		metaData.energy	= This.energy * .5;
		This.energy 	*= .5;

		let newEntity 		= Main.createEntity(newDNA, metaData, metaData.type);
		newEntity.parent 	= This;
		return newEntity;
	}

	function mutateDNA(_startDNA, _mutationChance = 1, _mutationRate = 0.1) {
		let newDNA = {};
		for (genName in _startDNA)
		{
			newDNA[genName] = _startDNA[genName];
			
			if (typeof _startDNA[genName] != "number") continue;
			if (_mutationChance < Math.random()) continue;
			
			newDNA[genName] += _mutationRate - _mutationRate * 2 * Math.random();
		}

		return newDNA;
	}
}

