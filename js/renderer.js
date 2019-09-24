
const Renderer = new function() {
	let This = {
		canvas: $("#worldCanvas")[0],
		renderEntity: renderEntity,
		rendercreatures: function(_creatures) {
			for (creatur of _creatures) this.renderEntity(creatur);
		},
		update: function(_renderData) {
			renderData = _renderData;

			dtx.fillStyle = "#fff";
			dtx.beginPath();
			dtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			dtx.closePath();
			renderMapTiles(_renderData.map);
			this.rendercreatures(_renderData.entities);
			
			// renderDebugInfo();
		},

	}

	let height = Math.ceil(
		This.canvas.width / This.canvas.offsetWidth * 
		This.canvas.offsetHeight / 50
	) * 50;

	This.canvas.height 			= height;
	This.canvas.style.height 	= height / This.canvas.width * This.canvas.offsetWidth + "px";
	let dtx	= This.canvas.getContext("2d");
	let ctx = dtx;
	let renderData = {};

	This.canvas.onclick = function(_e) {
		let x = _e.offsetX / This.canvas.offsetWidth * This.canvas.width;
		let y = _e.offsetY / This.canvas.offsetHeight * This.canvas.height;

		let entities = getAllEntitiesWithinRange(x, y, 5);
		if (!entities) return;

		InfoMenu.open(entities[0]);
	}


	function getAllEntitiesWithinRange(_x, _y, _range = 0) {
		let visableEntities = [];

		for (entity of renderData.entities)
		{
			let maxDistance = entity.DNA.size + _range;
			let dx = entity.x - _x;
			let dy = entity.y - _y;
			let directDistance = Math.sqrt(dx * dx + dy * dy);

			let distance = maxDistance - directDistance;

			if (distance <= 0) continue;
			entity.distance = distance;
			visableEntities.push(entity);
		}
		
		visableEntities.sort(function(a, b) {
			if (a.distance < b.distance) return -1;
			if (a.distance > b.distance) return 1;
			return 0;
		});

		return visableEntities;
	}





	ctx.constructor.prototype.circle = function(x, y, size) {
		if (size < 0) return;

		this.beginPath();
		this.ellipse(
			x, 
			y, 
			size,
			size,
			0,
			0,
			2 * Math.PI
		);
		this.closePath();
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


	function renderMapTiles(_map) {
		for (let y = 0; y < _map.nutrients.length; y++)
		{	
			for (let x = 0; x < _map.nutrients[y].length; x++)
			{
				let nutrients = _map.nutrients[y][x];
				let climate = _map.climate[y][x];
				renderMapTile(x, y, nutrients, climate);
			}
		}
	}

	function renderMapTile(_nx, _ny, _nutrientConcentration, _climate) {// nutrientTileX and y
		let actualX = _nx * Main.settings.nutrients.pxPerTile;
		let actualY = _ny * Main.settings.nutrients.pxPerTile;


		ctx.fillStyle = "rgba(" + _climate.r * 255 + ", " + _climate.g * 255 + ", " + _climate.b * 255 + ", " + (_nutrientConcentration * .5) + ")";
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
		dtx.font = Main.settings.nutrients.pxPerTile / 5 + 'px sans-serif';
		ctx.beginPath();
		ctx.fillText(
			Math.round(_nutrientConcentration * 10000) / 10000,
			actualX,
			actualY + Main.settings.nutrients.pxPerTile / 2,
		);
		ctx.closePath();
		ctx.fill();
	}



	function renderEntity(_entity, _ctx) {
		if (
			InfoMenu.openState &&
			InfoMenu.curEntityId == _entity.id &&
			!_ctx
		) InfoMenu.renderEntityToWindow(_entity);
	
		if (!_ctx) _ctx = ctx;

		// draw the energy bubble
		_ctx.fillStyle 	= "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", .1)";
		_ctx.strokeStyle = "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", .1)";
		_ctx.circle(
			_entity.x, 
			_entity.y, 
			_entity.DNA.size + Math.sqrt(4 * (_entity.energy - Main.settings.minimumEnergyToBeAlive) / Math.PI)
		);
		if (_entity.type == "creature") _ctx.fill();
		if (_entity.type == "plant") _ctx.stroke();
		

		_ctx.strokeStyle = "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", .9)";
		_ctx.fillStyle 	= "rgba(" + _entity.DNA.r * 255 + ", " + _entity.DNA.g * 255 + ", " + _entity.DNA.b * 255 + ", .2)";
		_ctx.lineWidth = 2;
		_ctx.circle(
			_entity.x, 
			_entity.y, 
			_entity.DNA.size
		);
		_ctx.stroke();
		_ctx.fill();




		if (_entity.type != "plant") renderEntityAngleArrow(_entity, _ctx);

		if (_entity.type != "creature") return;
		
		for (let e = 0; e < _entity.DNA.eyeCount; e++) renderCreaturEye(_entity, e, _ctx);

		let brainOuputs = _entity.brain.layers[_entity.brain.layers.length - 1].a;
		let lineWidth = brainOuputs[3] * 5;
		_ctx.strokeStyle = "rgba(255, 0, 0, .5)";
		_ctx.lineWidth = lineWidth;
		_ctx.beginPath();
		_ctx.circle(
			_entity.x, 
			_entity.y, 
			_entity.DNA.size + lineWidth
		);
		_ctx.closePath();
		_ctx.stroke();
	}

	function renderEntityAngleArrow(_entity, ctx) {
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
		
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(rx1 + _entity.x, ry1 + _entity.y);
		ctx.lineTo(rx2 + _entity.x, ry2 + _entity.y);

		ctx.moveTo(rx2 + _entity.x, ry2 + _entity.y);
		ctx.lineTo(rxArrowR + rx2 + _entity.x, ryArrowR + ry2 + _entity.y);

		ctx.moveTo(rx2 + _entity.x, ry2 + _entity.y);
		ctx.lineTo(rxArrowL + rx2 + _entity.x, ryArrowL + ry2 + _entity.y);
		ctx.closePath();
		ctx.stroke();
	}

	function renderCreaturEye(_creatur, _eyeIndex = 0, ctx) {
		let totalEyeAngle = (_creatur.DNA.eyeCount - 1) * _creatur.DNA.eyeAngle;
		let startAngle = -totalEyeAngle / 2;
		let thisAngle = startAngle + _eyeIndex * _creatur.DNA.eyeAngle + _creatur.angle;

		let relativeEyeX = Math.cos(thisAngle) * _creatur.DNA.eyeRange;
		let relativeEyeY = -Math.sin(thisAngle) * _creatur.DNA.eyeRange;
		
		ctx.lineWidth = .5;
		ctx.beginPath();
		ctx.moveTo(_creatur.x, _creatur.y);
		ctx.lineTo(_creatur.x + relativeEyeX, _creatur.y + relativeEyeY);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}





	return This;
}


