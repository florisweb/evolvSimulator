
const Main = new function() {

	let This = {
		creaturs: [],

		createRandomCreatur: createRandomCreatur,
		createCreatur: createCreatur,
		createCreaturs: function(_amount = 10) {
			for (let i = 0; i < _amount; i++)
			{
				c = this.createRandomCreatur();
				c.i = i;
			} 
		},

		updateCreaturs: function() {
			for (creatur of this.creaturs) creatur.inpData = creatur.update();
		}
		
	}

	return This;


	function createRandomCreatur() {
		let DNA = {
			size: 		(Math.random() * 1.5 + .5) * 10,
			speed: 		1,
			r: 			255 * Math.random(),
			g: 			255 * Math.random(),
			b: 			255 * Math.random(),

			eyeRange: 	500,
			eyeCount: 	Math.round(10 * Math.random()),
			eyeAngle: 	Math.PI / 24,

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
		This.creaturs.push(creatur);
		return creatur;
	}

}

let date = new Date();
Main.createCreaturs(2);
Main.updateCreaturs();
Renderer.renderCreaturs(Main.creaturs);

console.warn("time", new Date() - date);









function newId() {return parseInt(Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000));}