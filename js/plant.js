

function _plant(_DNA, _metaData) {
	_entity.call(this, _DNA, _metaData);
	let This 				= this;
	let entityUpdater 		= this.update;

	this.type				= "plant";
	this.update 			= update;

	const solarEfficiency = function() {
		let s = This.DNA.g * 0.7 - This.DNA.r * .3 - This.DNA.b * .5;
		return s > 0 ? s : 0;
	}();


	function update() {
		if (entityUpdater()) return; // the plant died;
		
		This.energy += calcPhotosynthesesGain();
		This.energy -= calcEnergyConsumption();

		if (This.age % 1000 == 0 && This.energy > 200) This.reproduce();
	}

	function calcEnergyConsumption() {		
		let energyConsumption 	= Main.settings.energyConsumption.default;
		energyConsumption 		+= Math.abs(Math.pow(This.DNA.size, 3))				* Main.settings.energyConsumption.sizeConstant;
		energyConsumption 		+= This.age 										* Main.settings.energyConsumption.plantAgeConstant;

		return energyConsumption;
	}


	function calcPhotosynthesesGain() {
		let leafSize = calcLeafSize();
		let surfaceArea = Math.pow(leafSize, 2) / 4 * Math.PI;
		
		let photoReactions = surfaceArea;
		let totalNutrients = Main.nutrients.eatByCoords(This.x, This.y, surfaceArea);
		let totalSun = solarEfficiency * surfaceArea;
		let nutrientsPerReaction = totalNutrients / photoReactions;
		let sunPerReaction = solarEfficiency;


		let energyPerReaction = 	nutrientsPerReaction / Main.settings.nutrientsPerReaction *
									sunPerReaction / Main.settings.sunEnergyPerReaction;

		// console.log(energyPerReaction * photoReactions, solarEfficiency);
		return energyPerReaction * photoReactions;
	}
		function calcLeafSize() {
			let leafSize = This.DNA.size * Main.settings.plantLeafSize;
			let inRange = Collision.getAllEntitiesWithinRange(This, leafSize);
			for (entity of inRange) 
			{
				if (entity.type == "creature") continue;
				if (leafSize < entity.distance) continue;
				leafSize = entity.distance;
			}
			return leafSize;
		}

}

