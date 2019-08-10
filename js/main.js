
const Main = new function() {

	let This = {
		creaturs: [],

		createRandomCreatur: createRandomCreatur,
		createCreatur: createCreatur
	}

	return This;


	function createRandomCreatur() {
		let DNA = {
			size: 1,
			speed: 1,
			r: 255 * Math.random(),
			g: 255 * Math.random(),
			b: 255 * Math.random(),

			eyeRange: 100,

			brain: []
		};


		DNA.brain = [
			Math.random()
		];
		for (let i = 0; i < DNA.brain[0]; i++) DNA.brain.push(Math.random() * 2);

		return createCreatur(DNA);
	}


	function createCreatur(_DNA) {
		let creatur = new _creatur(_DNA);
		This.creaturs.push(creatur);
		return creatur;
	}

}