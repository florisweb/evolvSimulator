



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
			this.rendercreatures(Main.entities);
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

	
	

	let prevRenderTime = new Date();
	let prevRenderUpdates = 0;
	function renderDebugInfo() {
		let fontSize = 25;
		dtx.fillStyle = "#555";
		dtx.font = fontSize + 'px sans-serif';

		dtx.fill();
		dtx.fillText("Entities: " + Main.entities.length + " (Plants: " + Main.plants + " creatures: " + Main.creatures + ")" , 5, fontSize);
		dtx.fillText("Average biteIncome: " + Math.round(Main.totalBiteEnergy / Main.bites * 1000) / 1000, 5, fontSize * 2);
		dtx.fillText("Average energyConsumption (without biteCost): " + Math.round(Main.totalEnergyConsumption / Main.creatures * 1000) / 1000, 5, fontSize * 3);
		dtx.fillText("Frames: " + Main.updates, 5, fontSize * 4);
		
		
		
		dtx.fillText("Fps: " + Math.round((Main.updates - prevRenderUpdates) / (new Date() - prevRenderTime) * 10000) / 10, 5, fontSize * 5);
		prevRenderUpdates 	= Main.updates;
		prevRenderTime 		= new Date();


		for (let i = 0; i < Main.totalBrainOutput.length; i++)
		{
			dtx.fillText("Brain [" + i + "]: " + Math.round(Main.totalBrainOutput[i] / Main.creatures * 1000) / 1000, 5, fontSize * 6 + fontSize * i + fontSize * .5);
		}
	}



	function renderCreatur(_entity) {
		dtx.strokeStyle = "rgb(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ")";
		dtx.fillStyle 	= "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", .2)";
		dtx.lineWidth = 2;
		dtx.circle(
			_entity.x, 
			_entity.y, 
			_entity.DNA.size
		);
		dtx.stroke();
		dtx.fill();

		if (_entity.type != "plant") renderEntityAngleArrow(_entity);

		if (_entity.inpData && _entity.type == "creature")
		{
			for (let e = 0; e < _entity.DNA.eyeCount; e++) renderCreaturEye(_entity, e, _entity.inpData.eyeData[e]);
		}
	}

	function renderEntityAngleArrow(_entity) {
		let arrowSize = _entity.DNA.size / 2;

		let rx1 = Math.cos(_entity.angle + Math.PI) * arrowSize;
		let ry1 = -Math.sin(_entity.angle + Math.PI) * arrowSize;

		let rx2 = Math.cos(_entity.angle) * arrowSize;
		let ry2 = -Math.sin(_entity.angle) * arrowSize;

		const arrowAngle = Math.PI / 0.85;
		let rxArrowR = Math.cos(_entity.angle - arrowAngle) * arrowSize;
		let ryArrowR = -Math.sin(_entity.angle - arrowAngle) * arrowSize;

		let rxArrowL = Math.cos(_entity.angle + arrowAngle) * arrowSize;
		let ryArrowL = -Math.sin(_entity.angle + arrowAngle) * arrowSize;
		
		dtx.lineWidth = 3;
		dtx.beginPath();
		dtx.moveTo(rx1 + _entity.x, ry1 + _entity.y);
		dtx.lineTo(rx2 + _entity.x, ry2 + _entity.y);

		dtx.moveTo(rx2 + _entity.x, ry2 + _entity.y);
		dtx.lineTo(rxArrowR + rx2 + _entity.x, ryArrowR + ry2 + _entity.y);

		dtx.moveTo(rx2 + _entity.x, ry2 + _entity.y);
		dtx.lineTo(rxArrowL + rx2 + _entity.x, ryArrowL + ry2 + _entity.y);
		dtx.closePath();
		dtx.stroke();;
	}

	function renderCreaturEye(_creatur, _eyeIndex = 0, _eyeDistance = 1) {
		let totalEyeAngle = (_creatur.DNA.eyeCount - 1) * _creatur.DNA.eyeAngle;
		let startAngle = -totalEyeAngle / 2;
		let thisAngle = startAngle + _eyeIndex * _creatur.DNA.eyeAngle + _creatur.angle;

		let relativeEyeX = Math.cos(thisAngle) * _creatur.DNA.eyeRange;
		let relativeEyeY = -Math.sin(thisAngle) * _creatur.DNA.eyeRange;
		
		dtx.lineWidth = 1;
		dtx.beginPath();
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

		dtx.closePath();
		dtx.fill();
		dtx.stroke();
	}

	return This;
}


