

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
	this.die = function () {
		if (Main.settings.logging) console.warn("A entity of type " + this.type + "died:", This);
		Main.killEntity(this.id);
	};
	this.reproduce 	= reproduce;

	

	
	function update() {
		This.age++;
		if (This.energy <= 0) return This.die();
	}


	function reproduce(_startDNA, metaData = {}) {
		let startDNA 	= Object.assign({}, This.DNA);
		if (_startDNA) 	startDNA = _startDNA;
		let newDNA	 	= mutateDNA(startDNA, Main.settings.mutationChance, Main.settings.mutationRate);

		let angleMutation = Math.PI * .5;
		metaData.angle 	= This.angle + angleMutation - angleMutation * 2 * Math.random();

		let distance	= (newDNA.size + This.DNA.size) * 2;
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

