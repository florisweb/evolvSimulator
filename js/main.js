
const Main = new function() {

	let This = {
		settings: {
			logging: false,
			energyConcumption: {
				default: 0.1, // to be kept alive
				neuronConstant: 0.01,
				turnConstant: 0.1,
				moveConstant: 0.1,
			}
		},




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

		killCreatur: function(_id) {
			for (let i = 0; i < This.creatures.length; i++)
			{
				if (This.creatures[i].id != _id) continue;
				This.creatures.splice(i, 1);
				return true;
			}
			return false;
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
			r: 			Math.random(),
			g: 			Math.random(),
			b: 			Math.random(),

			eyeRange: 	200 * Math.random() + 300,
			eyeCount: 	Math.round(2 * Math.random()),
			eyeAngle: 	Math.PI / 20 * Math.random(),

			brain: 		[]
		};


		DNA.brain = [
			Math.random()
		];
		for (let i = 0; i < DNA.brain[0]; i++) DNA.brain.push(Math.random() * 2);

		return createCreatur(DNA, {
			energy: 100,
			angle: Math.random() * Math.PI * 2,
			x: Math.round(Math.random() * Renderer.canvas.width),
			y: Math.round(Math.random() * Renderer.canvas.height),
		});
	}


	function createCreatur(_DNA, _metaData) {
		let creatur = new _creatur(_DNA, _metaData);
		This.creatures.push(creatur);
		return creatur;
	}

}

let date = new Date();
Main.createcreatures(50);
Main.update();
console.warn("time", new Date() - date);
// setInterval("Main.update(true)", 500);



function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}