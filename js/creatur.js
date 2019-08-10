


function _creatur(_DNA) {
	let brain = createBrain(_DNA.brain);

	const This = {
		energy: 	100,
		angle: 		Math.random() * Math.PI * 2,
		x: 			Math.round(Math.random() * Renderer.canvas.width),
		y: 			Math.round(Math.random() * Renderer.canvas.height),
		size: 		(Math.random() * 1.5 + .5) * 10,


		DNA: 		_DNA,
		brain: 		brain,
	

		update: 	update
	}

	return This;





	function update() {

		let inputs = getEyeData();

		let actionValues = This.brain.feedForward(inputs);
		// console.log(actionValues);


	}


	function getEyeData() {


		return [Math.random(), Math.random(), Math.random()];
	}


	function detectIfCollisionPosible(_otherCreatur) {

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


