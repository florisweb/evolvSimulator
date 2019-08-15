

function _plant(_DNA, _metaData) {
	_entity.call(this, _DNA, _metaData);
	let This 				= this;
	let entityUpdater 		= this.update;

	this.type				= "plant";
	this.update 			= update;


	
	function update() {
		entityUpdater();
		
		This.energy += calcPhotosynthesesGain();
		This.energy -= calcEnergyConsumption();


		if (This.age % 1000 == 0 && This.energy > 200)
		{
			This.reproduce();
		}
	}

	function calcEnergyConsumption() {		
		let energyConsumption 	= Main.settings.energyConsumption.default;
		energyConsumption 		+= Math.abs(Math.pow(This.DNA.size, 3))				* Main.settings.energyConsumption.sizeConstant;
		energyConsumption 		+= This.age 										* Main.settings.energyConsumption.plantAgeConstant;

		return energyConsumption;
	}


	function calcPhotosynthesesGain() {
		let solarEfficiency = This.DNA.g * 0.7;
		solarEfficiency 	-= This.DNA.r * 0.3;
		solarEfficiency 	-= This.DNA.b * .5;

		let surfaceArea = Math.pow(This.DNA.size, 2) / 4 * Math.PI;
		let gain = surfaceArea * Main.settings.sunEnergyPerPixel * solarEfficiency;

		if (gain < 0) gain = 0;
		return gain;
	}

}

