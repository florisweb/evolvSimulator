



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
		const defaultCreaturSize = 10;

		dtx.strokeStyle = "rgb(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ")";
		dtx.fillStyle = "rgba(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ", 0.2)";
		
		dtx.circle(
			_creatur.x, 
			_creatur.y, 
			_creatur.size * defaultCreaturSize
		);

		dtx.stroke();
		dtx.fill();
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