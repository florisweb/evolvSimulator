



const Renderer = new function() {

	let This = {
		canvas: $("#worldCanvas")[0],
		renderCreatur: renderCreatur,
		rendercreatures: function(_creatures) {
			for (creatur of _creatures) this.renderCreatur(creatur);
		},
		update: function() {
			dtx.fillStyle = "#fff";
			dtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			renderDebugInfo();
			this.rendercreatures(Main.creatures);
		}
	}

	let dtx	= This.canvas.getContext("2d");
	
	dtx.circle = function(x, y, size) {
		dtx.beginPath();
		dtx.ellipse(
			x, 
			y, 
			size,
			size,
			0,
			0,
			2 * Math.PI
		);
		dtx.closePath();
	}

	return This;
	

	function renderDebugInfo() {
		dtx.fillStyle = "#555";
		dtx.fill();
		let theoraticalCreatureLimit = Main.settings.energyImportPerFrame / (Main.totalEnergyConcumption / Main.creatures.length);
		dtx.fillText("Creatures: " + Main.creatures.length + " / " + Math.round(theoraticalCreatureLimit * 100) / 100, 5, 10);
		dtx.fillText("Average energyconcumption: " + Math.round(Main.totalEnergyConcumption / Main.creatures.length * 100) / 100, 5, 25);
		dtx.fillText("Frames: " + Main.updates, 5, 40);
	}



	function renderCreatur(_creatur) {
		dtx.strokeStyle = "rgb(" + _creatur.DNA.r * 255 + ", " + _creatur.DNA.g * 255 + ", "+ _creatur.DNA.b * 255 + ")";
		dtx.fillStyle 	= "rgba(" + _creatur.DNA.r * 255 + ", " + _creatur.DNA.g * 255 + ", "+ _creatur.DNA.b * 255 + ", .2)";

		dtx.circle(
			_creatur.x, 
			_creatur.y, 
			_creatur.DNA.size
		);
		
		if (_creatur.inpData)
		{
			for (let e = 0; e < _creatur.DNA.eyeCount; e++) renderCreaturEye(_creatur, e, _creatur.inpData.eyeData[e]);
		}

		dtx.stroke();
		dtx.fill();
	}

	function renderCreaturEye(_creatur, _eyeIndex = 0, _eyeDistance = 1) {
		let totalEyeAngle = (_creatur.DNA.eyeCount - 1) * _creatur.DNA.eyeAngle;
		let startAngle = -totalEyeAngle / 2;
		let thisAngle = startAngle + _eyeIndex * _creatur.DNA.eyeAngle + _creatur.angle;

		let relativeEyeX = Math.cos(thisAngle) * _creatur.DNA.eyeRange;
		let relativeEyeY = -Math.sin(thisAngle) * _creatur.DNA.eyeRange;
		
		dtx.moveTo(_creatur.x, _creatur.y);
		dtx.lineTo(_creatur.x + relativeEyeX, _creatur.y + relativeEyeY);

		let relativeEyeXDetector = Math.cos(thisAngle) * _creatur.DNA.eyeRange * _eyeDistance;
		let relativeEyeYDetector = -Math.sin(thisAngle) * _creatur.DNA.eyeRange * _eyeDistance;
		
		let eyeDetectorSize = 10;//_creatur.DNA.size / 2;
		dtx.fillRect(
			relativeEyeXDetector + _creatur.x - eyeDetectorSize / 2,
			relativeEyeYDetector + _creatur.y - eyeDetectorSize / 2,
			eyeDetectorSize,
			eyeDetectorSize,
		);
	}
}


