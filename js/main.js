
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
			for (creatur of this.creaturs) creatur.update();
		}
		
	}

	return This;


	function createRandomCreatur() {
		let DNA = {
			size: 1,
			speed: 1,
			r: 255 * Math.random(),
			g: 255 * Math.random(),
			b: 255 * Math.random(),

			eyeRange: 50 * Math.random(),
			eyeCount: 1, //Math.round(5 * Math.random()),
			eyeAngle: Math.PI / 6,

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

let date = new Date();
Main.createCreaturs(1);
Main.updateCreaturs();
Renderer.renderCreaturs(Main.creaturs)

console.log(new Date() - date);