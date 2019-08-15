

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


		if (This.age % 500 == 0 && This.energy > 100 && Math.random() > 0.5)
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
		let gain 	= This.DNA.g;
		gain 		-= This.DNA.r;
		gain 		-= This.DNA.b * .5;
		gain 		+= Math.pow(This.DNA.size, 2) * 0.005; // bigger surface-area
		if (gain < 0) gain = 0;
		return gain * Main.settings.sunBrightness;
	}

}

