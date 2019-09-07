

function _plant(_DNA, _metaData) {
	_entity.call(this, _DNA, _metaData);
	let This 				= this;
	let entityUpdater 		= this.update;

	this.type				= "plant";
	this.update 			= update;

	const solarEfficiency = function() {
		return This.DNA.g * 0.7 - This.DNA.r * .3 - This.DNA.b * .5;
	}();
	Collision.apply(This);


	function update() {
		if (entityUpdater()) return; // the plant died;
		
		This.energy += calcPhotosynthesesGain();
		This.energy -= calcEnergyConsumption();

		if (This.age % Settings.reproduction.plantReproductionFrequency == 0 && This.energy > 200) This.reproduce();
	}

	function calcEnergyConsumption() {		
		let energyConsumption 	= Settings.energyConsumption.default;
		energyConsumption 		+= Math.abs(Math.pow(This.DNA.size, 3))				* Settings.energyConsumption.sizeConstant;
		energyConsumption 		+= This.age 										* Settings.energyConsumption.plantAgeConstant;

		return energyConsumption;
	}


	function calcPhotosynthesesGain() {
		let leafSize = This.DNA.size;
		let surfaceArea = Math.pow(This.DNA.size, 2) / 4 * Math.PI;
		
		let photoReactions = surfaceArea;
		let totalNutrients = Main.nutrients.eatByCoords(This.x, This.y, surfaceArea);
		let totalSun = solarEfficiency * surfaceArea;
		let nutrientsPerReaction = totalNutrients / photoReactions;
		let sunPerReaction = solarEfficiency;


		let energyPerReaction = 	nutrientsPerReaction / Settings.nutrientsPerReaction *
									sunPerReaction / Settings.sunEnergyPerReaction;

		return energyPerReaction * photoReactions;
	}
}

