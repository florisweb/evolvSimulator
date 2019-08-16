

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
		entityUpdater();
		Main.totalAge 		+= This.age;
		Main.totalEnergy 	+= This.energy;
		
		const turnConstant = 0.2;
		if (prevActionValues.length)
		{
			This.angle += (.5 - prevActionValues[0]) * turnConstant;
			if (prevActionValues[1] > .1) This.move((prevActionValues[1] - .1) / 0.9);
			// if (prevActionValues[2] > .5 && This.age % 100 == 0) This.reproduce();
			if (This.energy >= 150 && This.age % 100 == 0) This.reproduce();
			if (prevActionValues[3] > .5) This.bite((prevActionValues[3] - .5) * 2);
		}


		let inputs = [
			sigmoid(This.energy / 100) // energy
		];
		inputs = inputs.concat(eye.getData());

		prevActionValues = This.brain.feedForward(inputs);

		let energyConsumption = calcEnergyConsumption();
		This.energy -= energyConsumption;
		Main.totalEnergyConsumption += energyConsumption;

		return {eyeData: inputs};
	}


	function calcEnergyConsumption() {
		let energyConsumption 	= Main.settings.energyConsumption.default;
		energyConsumption 		+= This.DNA.brain.length 							* Main.settings.energyConsumption.neuronConstant;
		energyConsumption 		+= Math.abs(This.DNA.eyeCount * This.DNA.eyeRange) 	* Main.settings.energyConsumption.eyeConstant;
		energyConsumption 		+= Math.abs(Math.pow(This.DNA.size, 3))				* Main.settings.energyConsumption.sizeConstant;
		energyConsumption 		+= This.age 										* Main.settings.energyConsumption.creatureAgeConstant;
		
		if (prevActionValues.length)
		{
			energyConsumption += Math.abs(1 - prevActionValues[0]) 					* Main.settings.energyConsumption.turnConstant;
			energyConsumption += prevActionValues[1] 								* Main.settings.energyConsumption.moveConstant;

			for (let i = 0; i < prevActionValues.length; i++)
			{
				Main.totalBrainOutput[i] += prevActionValues[i];
			}
		}


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
				let creatures 		= getAllEntitiesWithinRange();
				let totalEyeAngle 	= (This.DNA.eyeCount - 1) * This.DNA.eyeAngle;
				let startAngle 		= -totalEyeAngle / 2;

				let results = createArrayWithValues(This.DNA.eyeCount, 1);
				for (creatur of creatures)
				{
					let dx = creatur.x - This.x;
					let dy = creatur.y - This.y;
					let directAngleToCreature = atanWithDX(dx, dy);
					let distanceToCreatur = Math.sqrt(dx * dx + dy * dy);
						
					
					for (let e = 0; e < This.DNA.eyeCount; e++)
					{
						let thisAngle = startAngle + e * This.DNA.eyeAngle + This.angle;
						let dAngle = Math.abs(thisAngle - directAngleToCreature);
						let distance = calcDistanceFromEye(dAngle, distanceToCreatur, creatur.DNA.size);
						if (isNaN(distance) || distance < 0) distance = This.DNA.eyeRange;
						
						let percDistance = 1 - distance / This.DNA.eyeRange;
						if (percDistance < results[e]) results[e] = percDistance;
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
			let maxDistance = This.DNA.eyeRange + _otherCreatur.DNA.size;

			let dx = Math.abs(This.x - _otherCreatur.x);
			let dy = Math.abs(This.y - _otherCreatur.y);
			let actualDistance = Math.sqrt(dx * dx + dy * dy);
			if (actualDistance > maxDistance) return false;
			
			_otherCreatur.distanceFromCreatur = actualDistance;
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
		newDNA.brain = mutateBrain(newDNA.brain, Main.settings.mutationChance, Main.settings.mutationRate);
		return entityReproducer(newDNA, {type: This.type});

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
		let entities = Collision.getAllEntitiesWithinRange(This, This.DNA.size * Main.settings.creatureBiteRange);
		let energyPerByte = _bitePower * This.DNA.size * Main.settings.biteConstant;

		let startEnergy = This.energy;
		This.energy -= energyPerByte * 0.05; //1% of the bites energy is used to bite

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
		let brainStructure = [1 + This.DNA.eyeCount]; // inputs [energy + eyes]
		let layers = Math.abs(Math.round(_brainDNA[0]));

		let newBrainDNA = Object.assign([], _brainDNA);
		let curBrainIndex = layers;

		for (let l = 0; l < layers; l++)
		{
			let prevLayerLength = brainStructure[l - 1];
			let curLayerLength = Math.abs(Math.round(_brainDNA[l + 1]));
			if (curLayerLength <= 0) curLayerLength = 1; 
			brainStructure.push(curLayerLength);

			for (let b = 0; b < curLayerLength; b++)
			{
				curBrainIndex++;
				if (_brainDNA[curBrainIndex]) continue;
				newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
			}

			for (let n = 0; n < curLayerLength; n++)
			{
				for (let w = 0; w < prevLayerLength; w++)
				{
					curBrainIndex++;
					if (_brainDNA[curBrainIndex]) continue;
					newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
				}
			}
		}


		brainStructure.push(4); // outputs
		


		let brain = new NeuralNetwork(brainStructure);
		let brainData = _brainDNA.splice(layers + 1, _brainDNA.length);



		return populateBrain(brain, brainData);
	}


	function populateBrain(_brain, _brainData) {
		for (let l = 1; l < _brain.layers.length; l++)
		{
			let cLayer 	= _brain.layers[l];
			cLayer.b 	= arraySplice(_brainData, cLayer.b.length);

			for (let n = 0; n < cLayer.w.length; n++)
			{
				cLayer.w[n] = arraySplice(_brainData, cLayer.w[n].length);
			}
		}

		return _brain;
	}

}





function arraySplice(_array, _length) {
	let arr = _array.splice(0, _length);
	for (let i = 0; i < _length; i++)
	{
		if (arr[i]) continue;
		arr[i] = 1 - Math.random() * 2;
	}
	return arr;
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