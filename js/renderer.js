



const Renderer = new function() {

	let This = {
		canvas: $("#worldCanvas")[0],
		renderCreatur: renderCreatur,
		renderCreaturs: function(_creaturs) {
			for (creatur of _creaturs) this.renderCreatur(creatur);
		}
	}

	let dtx	= This.canvas.getContext("2d");
	This.dtx = dtx;
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
	


	function renderCreatur(_creatur) {
		dtx.strokeStyle = "rgb(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ")";
		dtx.fillStyle 	= "rgba(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ", .2)";

		dtx.circle(
			_creatur.x, 
			_creatur.y, 
			_creatur.DNA.size
		);
		

		for (let e = 0; e < _creatur.DNA.eyeCount; e++) renderCreaturEye(_creatur, e, _creatur.inpData.eyeData[e]);


		dtx.stroke();
		dtx.fill();
	}

	function renderCreaturEye(_creatur, _eyeIndex = 0, _eyeDistance = 1) {// right = 0
		let totalEyeAngle = (_creatur.DNA.eyeCount - 1) * _creatur.DNA.eyeAngle;
		let startAngle = -totalEyeAngle / 2;
		let thisAngle = startAngle + _eyeIndex * _creatur.DNA.eyeAngle + _creatur.angle;
		
		let relativeEyeX = Math.cos(thisAngle) * _creatur.DNA.eyeRange;
		let relativeEyeY = -Math.sin(thisAngle) * _creatur.DNA.eyeRange;
		
		dtx.moveTo(_creatur.x, _creatur.y);
		dtx.lineTo(_creatur.x + relativeEyeX, _creatur.y + relativeEyeY);

		let relativeEyeXDetector = Math.cos(thisAngle) * _creatur.DNA.eyeRange * _eyeDistance;
		let relativeEyeYDetector = -Math.sin(thisAngle) * _creatur.DNA.eyeRange * _eyeDistance;
		
		dtx.fillRect(
			relativeEyeXDetector + _creatur.x - _creatur.DNA.size / 4, 
			relativeEyeYDetector + _creatur.y - _creatur.DNA.size / 4,
			_creatur.DNA.size / 2,
			_creatur.DNA.size / 2,
		);
	}

}