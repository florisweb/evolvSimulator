
const Main = new function() {

	let This = {
		creatures: [],

		createRandomCreatur: createRandomCreatur,
		createCreatur: createCreatur,

		updates: 0,
		createcreatures: function(_amount = 10) {
			for (let i = 0; i < _amount; i++)
			{
				c = this.createRandomCreatur();
				c.i = i;
			} 
		},

		updatecreatures: function() {
			for (creatur of this.creatures) creatur.inpData = creatur.update();
		},

		update: function(_render = true) {
			this.updates++;
			this.updatecreatures();
			if (_render) Renderer.update();
		}
		
	}

	return This;


	function createRandomCreatur() {
		let DNA = {
			size: 		(Math.random() * 1.5 + .5) * 15,
			speed: 		Math.random() * 3 + 1,
			r: 			255 * Math.random(),
			g: 			255 * Math.random(),
			b: 			255 * Math.random(),

			eyeRange: 	200 * Math.random(),
			eyeCount: 	Math.round(50 * Math.random()),
			eyeAngle: 	0.1,//Math.PI / 50 * Math.random(),

			brain: 		[]
		};


		DNA.brain = [
			Math.random()
		];
		for (let i = 0; i < DNA.brain[0]; i++) DNA.brain.push(Math.random() * 2);

		return createCreatur(DNA);
	}


	function createCreatur(_DNA) {
		let creatur = new _creatur(_DNA);
		This.creatures.push(creatur);
		return creatur;
	}

}

let date = new Date();
Main.createcreatures(4);
Main.update();
console.warn("time", new Date() - date);
// setInterval("Main.update(true)", 500);



function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}