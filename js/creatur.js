


function _creatur(_DNA, _metaData) {
	let brain = createBrain(_DNA.brain);

	const This = {
		id: 		newId(),
		energy: 	_metaData.energy,
		age: 		0, // in frames

		angle: 		_metaData.angle,
		x: 			_metaData.x,
		y: 			_metaData.y, 


		DNA: 		_DNA,
		brain: 		brain,
	

		update: 	update,
		die: 		function () {
			if (Main.settings.logging) console.warn("A creatur died:", This);
			Main.killCreatur(this.id);
		},
		move: 		move,
		reproduce: 	reproduce,
	}

	
	let prevActionValues = [];                   
	function update() {
		This.age++;
		if (This.energy <= 0) return This.die();
		
		const turnConstant = 0.2;
		if (prevActionValues.length)
		{
			This.angle += (.5 - prevActionValues[0]) * turnConstant;
			This.move(prevActionValues[1]);
			if (prevActionValues[2] > 0.5 && This.age % 100 == 0) This.reproduce();
		}


		let inputs = eye.getData();
		prevActionValues = This.brain.feedForward(inputs);

		let energyConsumption = calcEnergyConsumption();
		This.energy -= energyConsumption;
		Main.totalEnergyConsumption += energyConsumption;

		return {eyeData: inputs};
	}

	function calcEnergyConsumption() {
		This.energy += Main.settings.energyImportPerFrame / Main.creatures.length; // x = totalFoodInput
		
		let energyConsumption 	= Main.settings.energyConsumption.default;
		energyConsumption 		+= This.DNA.brain.length 							* Main.settings.energyConsumption.neuronConstant;
		energyConsumption 		+= Math.abs(This.DNA.eyeCount * This.DNA.eyeRange) 	* Main.settings.energyConsumption.eyeConstant;
		energyConsumption 		+= Math.abs(Math.pow(This.DNA.size, 3))				* Main.settings.energyConsumption.sizeConstant;
		energyConsumption 		+= This.age 										* Main.settings.energyConsumption.ageConstant;
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
		if (This.x < This.DNA.size) This.x = This.DNA.size;
		if (This.y < This.DNA.size) This.y = This.DNA.size;
		if (This.x > Renderer.canvas.width - This.DNA.size) This.x = Renderer.canvas.width - This.DNA.size;
		if (This.y > Renderer.canvas.height - This.DNA.size) This.y = Renderer.canvas.height - This.DNA.size;
	}




	const eye = new function() {
		return {
			getData: function() {
				let creatures 		= getAllcreaturesWithinRange();
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
						
						let percDistance = distance / This.DNA.eyeRange;
						if (percDistance < results[e]) results[e] = percDistance;
					}
				}
				return results;
			}
		}

		function getAllcreaturesWithinRange() {
			let visablecreatures = [];
			for (creatur of Main.creatures)
			{
				if (creatur.id == This.id) continue;
				let status = detectIfInViewingDistance(creatur);
				if (!status) continue;
				visablecreatures.push(status);
			}

			return visablecreatures;
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
		let startDNA = Object.assign({}, This.DNA);
		let newDNA = mutateDNA(startDNA, Main.settings.mutationChance, Main.settings.mutationRate);

		let metaData = {
			x: This.x, 
			y: This.y, 
			angle: This.angle,
			energy: This.energy / 2,
		};
		This.energy *= .5;

		let newCreatur = Main.createCreatur(newDNA, metaData);
		newCreatur.parent = This;
		return newCreatur;
	



		function mutateDNA(_startDNA, _mutationChance = 1, _mutationRate = 0.1) {
			let newDNA = {};
			for (genName in _startDNA)
			{
				if (genName == "brain") continue;
				let genValue = _startDNA[genName];
				newDNA[genName] = genValue;
				
				if (_mutationChance < Math.random()) continue;
				newDNA[genName] += _mutationRate - _mutationRate * 2 * Math.random();
			}

			newDNA.brain = mutateBrain(_startDNA.brain, _mutationChance, _mutationRate);
			return newDNA;
		}

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







	function createBrain(_brainDNA) {
		let brainStructure = [3]; // inputs

		let layers = Math.abs(Math.round(_brainDNA[0]));


		for (let l = 0; l < layers; l++)
		{
			let curLayerLength = Math.abs(Math.round(_brainDNA[l + 1]));
			brainStructure.push(curLayerLength);
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

	return This;
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