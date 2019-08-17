
const Collision = new function() {
	const This = {
		getAllEntitiesWithinRange: getAllEntitiesWithinRange,
		calcFactor: calcFactor,
		addFactors: addFactors,
		apply: apply,
		getPointsWithinCircle: getPointsWithinCircle
	}

	function apply(_entity) {
		let coords = applyFactor(_entity, calcFactor(_entity));

		coords = setCoordsWithinWorld(coords.x, coords.y, _entity.DNA.size);
		Main.entityGrid.move(_entity, coords.x, coords.y);
	}

	function setCoordsWithinWorld(_x, _y, _size) {
		if (_x < _size) 							_x = _size
		if (_y < _size) 							_y = _size;
		if (_x > Renderer.canvas.width - _size) 	_x = Renderer.canvas.width - _size;
		if (_y > Renderer.canvas.height - _size)	_y = Renderer.canvas.height - _size;
		return {x: _x, y: _y};
	}

	function applyFactor(_entity, _factor) {
		let fx = Math.cos(_factor.angle) * _factor.power;
		let fy = -Math.sin(_factor.angle) * _factor.power;

		return {x: _entity.x + fx, y: _entity.y + fy};
	}

	function calcFactor(_entity) {
		let inRange = getAllEntityFactorsWithinRange(_entity);
		let sumFactor = {
			angle: 0,
			power: 0
		};

		for (factor of inRange)
		{
			sumFactor = addFactors(sumFactor, factor);
		}

		return sumFactor;
	}

	function addFactors(_factor1, _factor2) {
		let f1x = Math.cos(_factor1.angle) 	* _factor1.power;
		let f1y = -Math.sin(_factor1.angle) * _factor1.power;
		let f2x = Math.cos(_factor2.angle) 	* _factor2.power;
		let f2y = -Math.sin(_factor2.angle) * _factor2.power;

		let newX = f1x + f2x;
		let newY = f1y + f2y;

		return {
			angle: atanWithDX(newX, newY),
			power: Math.sqrt(newX * newX + newY * newY)
		}
	}


	function getAllEntitiesWithinRange(_self, _range = 0) {
		let visableEntities = [];

		for (entity of Main.entities)
		{
			if (entity.id == _self.id) continue;

			let maxDistance = entity.DNA.size + _range;
			let dx = entity.x - _self.x;
			let dy = entity.y - _self.y;
			let directDistance = Math.sqrt(dx * dx + dy * dy);

			let distance = maxDistance - directDistance;

			if (distance <= 0) continue;
			entity.distance = distance;
			visableEntities.push(entity);
		}

		return visableEntities;
	}

	function getPointsWithinCircle(_x, _y, _range) {
		let points = [];
		let minY = _y - _range;
		let maxY = _y + _range;
		for (let y = minY; y < maxY; y++) 
		{



		}



		return points;
	}


	function getAllEntityFactorsWithinRange(_self) {
		let visableEntities = [];
		for (entity of Main.entities)
		{
			if (entity.id == _self.id) continue;

			let maxDistance = _self.DNA.size + entity.DNA.size;
			let dx = entity.x - _self.x;
			let dy = entity.y - _self.y;
			let directDistance = Math.sqrt(dx * dx + dy * dy);

			let distance = maxDistance - directDistance;

			if (distance <= 0) continue;
			visableEntities.push({
				power: distance,
				angle: atanWithDX(dx, dy) + Math.PI
			});
		}

		return visableEntities;
	}

	return This;
}
