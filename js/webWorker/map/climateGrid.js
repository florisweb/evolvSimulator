

function createClimateGrid(_grid) {
	let surfaceArea 	= Math.pow(Settings.nutrients.pxPerTile, 2);
	const climateChangeConstant = .2;
	
	let grid 	= _grid;
	if (!grid) 	grid = createGrid();


	function createGrid() {
		grid = [];
		for (let y = 0; y < Main.worldHeight / Settings.nutrients.pxPerTile; y++)
		{	
			grid[y] = [];
			for (let x = 0; x < Main.worldWidth / Settings.nutrients.pxPerTile; x++)
			{
				let climate = getAverageClimateOfNeighbourTiles(x, y);
				if (x == 0 && y == 0) climate = {
					r: Seed.random(),
					g: Seed.random(),
					b: Seed.random(),
				}
			

				let mapRange = climateChangeConstant;
				climate.r += mapRange - 2 * mapRange * Seed.random();
				climate.g += mapRange - 2 * mapRange * Seed.random();
				climate.b += mapRange - 2 * mapRange * Seed.random();

				grid[y][x] = climate;
			}
		}
		return grid;
	}


	function getAverageClimateOfNeighbourTiles(_x, _y) {
		let neighbourCount = 0;
		let climate = {
			r: 0,
			g: 0,
			b: 0
		}

		for (let y = -1; y < 1; y++)
		{
			let ny = _y + y;
			if (ny < 0) continue;
			for (let x = -1; x < 2; x++)
			{
				let nx = _x + x;
				if (nx < 0) continue;
				let neighbour = grid[ny][nx]
				if (!neighbour) continue;
				
				neighbourCount++;

				climate.r += neighbour.r;
				climate.g += neighbour.g;
				climate.b += neighbour.b;
			}
		}
		climate.r /= neighbourCount;
		climate.g /= neighbourCount;
		climate.b /= neighbourCount;

		return climate;
	}

	grid.getByCoords = function(_x, _y) { 
		let x = Math.floor(_x / Settings.nutrients.pxPerTile);
		let y = Math.floor(_y / Settings.nutrients.pxPerTile);
		if (!grid[y] || !grid[y][x]) return false;
		return grid[y][x];
	}

	return grid;
}

