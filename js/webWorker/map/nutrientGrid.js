

function createNutrientGrid(_grid) {
	let grid 	= _grid;
	if (!grid) 	grid = createGrid();
	
	let surfaceArea = Math.pow(Settings.nutrients.pxPerTile, 2);

	function createGrid() {
		let grid = [];
		for (let y = 0; y < Main.worldHeight / Settings.nutrients.pxPerTile; y++)
		{	
			grid[y] = [];
			for (let x = 0; x < Main.worldWidth / Settings.nutrients.pxPerTile; x++)
			{
				grid[y][x] = .3 * Seed.random(); 
				Main.totalNutrients += grid[y][x];
			}
		}
		return grid;
	}


	grid.export = function() {
		let newGrid = [];
		for (let y = 0; y < grid.length; y++)
		{	
			newGrid[y] = grid[y];
		}
		return newGrid;
	}


	grid.addByCoords = function(_x, _y, _energy) {
		let x = Math.floor(_x / Settings.nutrients.pxPerTile);
		let y = Math.floor(_y / Settings.nutrients.pxPerTile);
		if (!grid[y] || !grid[y][x]) return false;
		Main.totalNutrients += _energy / surfaceArea;
		grid[y][x] += _energy / surfaceArea;
	}

	grid.eatByCoords = function(_x, _y, _takerArea) { 
		let x = Math.floor(_x / Settings.nutrients.pxPerTile);
		let y = Math.floor(_y / Settings.nutrients.pxPerTile);
		if (!grid[y] || !grid[y][x]) return 0;
		
		let totalNutrients = grid[y][x] * surfaceArea;
		let availableNutrients = grid[y][x] * _takerArea;
		let eatableNutrients = availableNutrients * Settings.nutrients.percNutrientsPerFrame; 

		if (eatableNutrients > totalNutrients) eatableNutrients = totalNutrients;

		Main.totalNutrients -= eatableNutrients / totalNutrients;
		grid[y][x] -= eatableNutrients / totalNutrients;
		if (grid[y][x] > 1) grid[y][x] = 1;
		if (grid[y][x] < 0) grid[y][x] = 0;

		return eatableNutrients;
	}

	grid.addRandomNutrients = function(_totalNutrients) {
		let nutrientsLeft = _totalNutrients;
		while (nutrientsLeft > 0)
		{
			let x = Math.floor(Seed.random() * grid[0].length);
			let y = Math.floor(Seed.random() * grid.length);
			let nutrients = _totalNutrients * .1 * Seed.random();
			if (nutrients > nutrientsLeft) nutrients = nutrientsLeft;
			nutrientsLeft -= nutrients;

			Main.totalNutrients += nutrients / surfaceArea;
			grid[y][x] += nutrients / surfaceArea;
		}
	}


	return grid;
}

