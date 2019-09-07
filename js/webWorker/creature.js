

function _creature(_DNA, _metaData) {
	_entity.call(this, _DNA, _metaData);
	let This 				= this;
	let entityUpdater 		= this.update;
	let entityReproducer 	= this.reproduce;

	this.type				= "creature";
	this.brain 				= createBrain(_DNA.brain);

	this.move 				= move;
	this.update 			= update;
	this.reproduce 			= reproduce;
	this.bite				= bite;


	
	let prevActionValues = [];                   
	function update() {
		if (entityUpdater()) return; // the creature died
		if (This.age % Settings.performance.checkCollisionFrameCount == 0) Collision.apply(This);
		
		Main.totalAge 		+= This.age;
		Main.totalEnergy 	+= This.energy;
		
		const turnConstant = 0.2;
		if (prevActionValues.length)
		{
			This.angle += (.5 - prevActionValues[0]) * turnConstant;
			if (prevActionValues[1] > .1) This.move((prevActionValues[1] - .1) / 0.9);
			if (
				prevActionValues[2] > 
				1 - .05 * Math.sqrt(This.energy - Settings.minimumEnergyToBeAlive)
				&& This.age % Settings.reproduction.creatureReproductionFrequency == 0
			) This.reproduce();

			if (prevActionValues[3] > .5) This.bite((prevActionValues[3] - .5) * 2);
		}


		let inputs = [
			sigmoid(This.energy / 100) // energy
		];
		inputs = inputs.concat(eye.getData());

		prevActionValues = This.brain.feedForward(inputs);

		let energyConsumption = calcEnergyConsumption();
		Main.nutrients.addByCoords(This.x, This.y, energyConsumption * Settings.nutrients.percWasteToNutrients)
		This.energy -= energyConsumption;
		Main.totalEnergyConsumption += energyConsumption;

		return {eyeData: inputs};
	}


	function calcEnergyConsumption() {
		let energyConsumption 	= Settings.energyConsumption.default;
		energyConsumption 		+= This.DNA.brain.length 							* Settings.energyConsumption.neuronConstant;
		energyConsumption 		+= Math.abs(This.DNA.eyeCount * This.DNA.eyeRange) 	* Settings.energyConsumption.eyeConstant;
		energyConsumption 		+= Math.abs(Math.pow(This.DNA.size, 3))				* Settings.energyConsumption.sizeConstant;
		energyConsumption 		+= This.age 										* Settings.energyConsumption.creatureAgeConstant;
		
		if (!prevActionValues.length) return energyConsumption;
		energyConsumption += Math.abs(1 - prevActionValues[0]) 						* Settings.energyConsumption.turnConstant;
		energyConsumption += prevActionValues[1] 									* Settings.energyConsumption.moveConstant;

		return energyConsumption;
	}


	let prevAngle = 0;
	function move(_stepSize = 1) {
		const movementConstant = 10;
		let rx = Math.cos(This.angle) * _stepSize * movementConstant * This.DNA.speed;
		let ry = -Math.sin(This.angle) * _stepSize * movementConstant * This.DNA.speed;
		This.x += rx;
		This.y += ry;
	}




	const eye = new function() {
		return {
			getData: function() {
				let entities 		= getAllEntitiesWithinRange();
				let totalEyeAngle 	= (This.DNA.eyeCount - 1) * This.DNA.eyeAngle;
				let startAngle 		= -totalEyeAngle / 2;

				let results = createArrayWithValues(This.DNA.eyeCount, 0);
				for (entity of entities)
				{
					!!This.DNA.eyeCount
					let dx = entity.x - This.x;
					let dy = entity.y - This.y;
					let directAngleToCreature = atanWithDX(dx, dy);
					let distanceToEntity = Math.sqrt(dx * dx + dy * dy);
						
					
					for (let e = 0; e < This.DNA.eyeCount; e++)
					{
						let thisAngle = startAngle + e * This.DNA.eyeAngle + This.angle;
						let dAngle = Math.abs(thisAngle - directAngleToCreature);
						let distance = calcDistanceFromEye(dAngle, distanceToEntity, entity.DNA.size);
						if (isNaN(distance) || distance < 0) distance = This.DNA.eyeRange;

						let percDistance = 1 - distance / This.DNA.eyeRange;
						if (percDistance > results[e]) results[e] = percDistance;
					}
				}
				return results;
			}
		}

		function getAllEntitiesWithinRange() {
			let visableEntities = [];
			for (entity of Main.entities)
			{
				if (entity.id == This.id) continue;
				let status = detectIfInViewingDistance(entity);
				if (!status) continue;
				if (entity.type != "plant") continue; // only plants are visable for now
				visableEntities.push(status);
			}

			return visableEntities;
		}

		function detectIfInViewingDistance(_otherCreatur) {
			let maxDistance = This.DNA.eyeRange * !!This.DNA.eyeCount + _otherCreatur.DNA.size;

			let dx = Math.abs(This.x - _otherCreatur.x);
			let dy = Math.abs(This.y - _otherCreatur.y);
			let actualDistance = Math.sqrt(dx * dx + dy * dy);
			if (actualDistance > maxDistance) return false;
			return _otherCreatur;
		}

		function calcDistanceFromEye(a, v, r) {
			r = 1 / r;
			let x = (v*r - Math.sqrt(-Math.pow(Math.tan(a), 2) * (v*v*r*r-1) + 1))
					/
					(r*Math.pow(Math.tan(a), 2) + r);

			return x / Math.cos(a);
		}
	}



	function reproduce() {
		let newDNA = Object.assign({}, This.DNA);
		newDNA.brain = mutateBrain(newDNA.brain, Settings.mutationChance, Settings.mutationRate);
		entityReproducer(newDNA, {type: This.type});

		function mutateBrain(_brainDNA, _mutationChance = 1, _mutationRate = 0.1) {
			let newBrainDNA = [];
			
			for (let n = 0; n < _brainDNA.length; n++)
			{
				if (_mutationChance < Math.random()) continue;
				let neuronValue = _brainDNA[n];
				newBrainDNA[n] = neuronValue + _mutationRate - _mutationRate * 2 * Math.random();
			}

			return newBrainDNA;
		}
	}



	function bite(_bitePower) {
		let entities = Collision.getAllEntitiesWithinRange(This, This.DNA.size * Settings.creatureBiteRange);
		let energyPerByte = _bitePower * This.DNA.size * Settings.biteConstant;

		let startEnergy = This.energy;
		This.energy -= energyPerByte * Settings.energyConsumption.energyPercPerBite; //some of the bites energy is used to bite

		for (entity of entities) 
		{
			let energy 		= energyPerByte / (entity.DNA.size * .1);
			if (entity.type == "plant") energy * 20;
			if (energy.energy < energy) energy = entity.energy;
			entity.energy 	-= energy;
			This.energy 	+= energy;
		}

		Main.bites++;
		Main.totalBiteEnergy += This.energy - startEnergy;
	}






	function createBrain(_brainDNA) {
		const outputNeurons = 4;

		let brainStructure = [1 + Math.abs(Math.round(This.DNA.eyeCount))]; // inputs [energy + eyes]
		let layers = Math.abs(Math.round(_brainDNA[0]));

		let newBrainDNA = Object.assign([], _brainDNA);
		let curBrainIndex = layers;

		let supposedBrainDNASize = layers + 1;

		for (let l = 1; l < layers + 2; l++)
		{
			let prevLayerLength = brainStructure[l - 1];
			let curLayerLength = Math.abs(Math.round(_brainDNA[l]));
			if (curLayerLength <= 0) curLayerLength = 1; 

			if (l != layers + 1) 
			{
				brainStructure.push(curLayerLength);
			} else curLayerLength = outputNeurons;
			
			supposedBrainDNASize += curLayerLength + prevLayerLength * curLayerLength;

			for (let n = 0; n < curLayerLength; n++)
			{
				curBrainIndex++;
				if (!newBrainDNA[curBrainIndex])
				{
					newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
				}
			
				for (let w = 0; w < prevLayerLength; w++)
				{
					curBrainIndex++;
					if (newBrainDNA[curBrainIndex]) continue;
					newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
				}
			}	
		}

		brainStructure.push(outputNeurons); // outputs


		if (supposedBrainDNASize > newBrainDNA.length)
		{
			console.warn("Brain-error", This, supposedBrainDNASize, newBrainDNA.length, brainStructure);
			Main.running = false;
		}


		let brain = new NeuralNetwork(brainStructure);
		let brainData = Object.assign([], newBrainDNA).splice(layers + 1, newBrainDNA.length);
		This.DNA.brain = newBrainDNA;
		return populateBrain(brain, brainData, brainStructure);
	}

	function populateBrain(_brain, _brainData, _brainStructure) {
		for (let l = 1; l < _brain.layers.length; l++)
		{
			let cLayer 	= _brain.layers[l];
			cLayer.b 	= _brainData.splice(0, _brainStructure[l]);

			for (let n = 0; n < cLayer.w.length; n++)
			{
				cLayer.w[n] = _brainData.splice(0, _brainStructure[l - 1]);
			}
		}

		return _brain;
	}

}





function createArrayWithValues(_length, _value) {
	let arr = [];
	for (let i = 0; i < _length; i++) arr.push(_value);
	return arr;
}	


function atanWithDX(dx, dy) {
	let angle = -Math.atan(dy / dx);
	if (dx < 0) angle += Math.PI;
	return angle;
}