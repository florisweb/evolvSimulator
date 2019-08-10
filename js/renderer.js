



const Renderer = new function() {

	let This = {
		canvas: $("#worldCanvas")[0],
		renderCreatur: renderCreatur,
		renderCreaturs: function(_creaturs) {
			for (creatur of _creaturs) this.renderCreatur(creatur);
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
	


	function renderCreatur(_creatur) {
		dtx.strokeStyle = "rgb(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ")";
		dtx.fillStyle 	= "rgba(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ", .2)";

		dtx.circle(
			_creatur.x, 
			_creatur.y, 
			_creatur.size
		);
		


		for (let e = 0; e < _creatur.DNA.eyeCount; e++) renderCreaturEye(_creatur, e);




		dtx.stroke();
		dtx.fill();
	}

	function renderCreaturEye(_creatur, _eyeIndex = 0) {// left = 0
		let totalEyeAngle = (_creatur.DNA.eyeCount - 1) * _creatur.DNA.eyeAngle;
		let startAngle = -totalEyeAngle / 2;
		let thisAngle = startAngle + _eyeIndex * _creatur.DNA.eyeAngle + creatur.angle + Math.PI * .5;
		
		let relativeEyeX = Math.sin(thisAngle) * _creatur.DNA.eyeRange;
		let relativeEyeY = Math.cos(thisAngle) * _creatur.DNA.eyeRange;

		dtx.moveTo(_creatur.x, _creatur.y);
		dtx.lineTo(_creatur.x + relativeEyeX, _creatur.y + relativeEyeY);
	}





// 	dtx.

// 	function ellipse(centerX, centerY, width, height) {
//   c.beginPath();
//   c.moveTo(centerX, centerY - height/2); 
//   c.bezierCurveTo(
//     centerX + width/2, centerY - height/2, 
//     centerX + width/2, centerY + height/2, 
//     centerX, centerY + height/2); 
//   c.bezierCurveTo(
//     centerX - width/2, centerY + height/2, 
//     centerX - width/2, centerY - height/2, 
//     centerX, centerY - height/2); 
//   c.fill();
//   c.closePath();  
// }


}