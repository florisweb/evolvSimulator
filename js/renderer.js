
const Renderer = new function() {
	let This = {
		canvas: $("#worldCanvas")[0],
		renderCreatur: renderCreatur,
		rendercreatures: function(_creatures) {
			for (creatur of _creatures) this.renderCreatur(creatur);
		},
		update: function(_renderData) {
			dtx.fillStyle = "#fff";
			dtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			renderNutrientTiles(_renderData.nutrients);
			this.rendercreatures(_renderData.entities);
			
			// renderDebugInfo();
		}
	}

	This.canvas.height = Math.floor(
		1000 / This.canvas.offsetWidth * 
		This.canvas.offsetHeight / 50
	) * 50;


	let dtx	= This.canvas.getContext("2d");
	let ctx = dtx;
	
	dtx.circle = function(x, y, size) {
		if (size < 0) return;

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
		let fontSize = 3 * This.canvas.width / 100;
		dtx.fillStyle = "#555";
		dtx.font = fontSize + 'px sans-serif';

		dtx.beginPath();
		dtx.fillText("Entities: " + Main.entities.length + " (Plants: " + Main.plants + " creatures: " + Main.creatures + ")" , 5, fontSize);
		dtx.fillText("Average biteIncome: " + Math.round(Main.totalBiteEnergy / Main.bites * 1000) / 1000, 5, fontSize * 2);
		dtx.fillText("Average energyConsumption (without biteCost): " + Math.round(Main.totalEnergyConsumption / Main.creatures * 1000) / 1000, 5, fontSize * 3);
		dtx.fillText("Average age: " + Math.round(Main.totalAge / Main.creatures * 1000) / 1000, 5, fontSize * 4);
		dtx.fillText("Average energy: " + Math.round(Main.totalEnergy / Main.creatures * 1000) / 1000, 5, fontSize * 5);
		dtx.fillText("Frames: " + Main.updates, 5, fontSize * 6);
		
		
		dtx.fillText("Fps: " + Math.round((Main.updates - prevRenderUpdates) / (new Date() - prevRenderTime) * 10000) / 10, 5, fontSize * 7);
		prevRenderUpdates 	= Main.updates;
		prevRenderTime 		= new Date();
		dtx.closePath();
		dtx.fill();
	}


	function renderNutrientTiles(_nutrients) {
		for (let y = 0; y < _nutrients.length; y++)
		{	
			for (let x = 0; x < _nutrients[y].length; x++)
			{
				renderNutrientTile(x, y, _nutrients[y][x]);
			}
		}
	}

	function renderNutrientTile(_nx, _ny, _nutrientConcentration) {// nutrientTileX and y
		let actualX = _nx * Main.settings.nutrients.pxPerTile;
		let actualY = _ny * Main.settings.nutrients.pxPerTile;

		ctx.fillStyle = "rgba(0, 255, 0, " + (_nutrientConcentration * .5) + ")";
		ctx.beginPath();
		ctx.fillRect(
			actualX, 
			actualY, 
			Main.settings.nutrients.pxPerTile, 
			Main.settings.nutrients.pxPerTile
		);
		ctx.closePath();
		ctx.fill();

		
		if (!Main.settings.renderNutrientConcentration) return;
		ctx.fillStyle = "#0f0";
		dtx.font = '15px sans-serif';
		ctx.beginPath();
		ctx.fillText(
			Math.round(nutrientConcentration * 10000) / 10000,
			actualX,
			actualY + Main.settings.nutrients.pxPerTile / 2,
		);
		ctx.closePath();
		ctx.fill();
	}



	function renderCreatur(_entity) {
		// draw the energy bubble
		
		dtx.fillStyle 	= "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", 0.1)";
		dtx.strokeStyle = "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", 0.1)";
		dtx.circle(
			_entity.x, 
			_entity.y, 
			_entity.DNA.size + Math.sqrt(4 * _entity.energy / Math.PI)
		);
		if (_entity.type == "creature") dtx.fill();
		if (_entity.type == "plant") dtx.stroke();
		

		dtx.strokeStyle = "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", .9)";
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


