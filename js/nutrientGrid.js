

function createNutrientGrid() {
	let grid = [];// concentration
	let surfaceArea = Math.pow(Main.settings.nutrients.pxPerTile, 2);
	for (let y = 0; y < Renderer.canvas.width / Main.settings.nutrients.pxPerTile; y++)
	{	
		grid[y] = [];
		for (let x = 0; x < Renderer.canvas.width / Main.settings.nutrients.pxPerTile; x++)
		{
			grid[y][x] = .2 * Math.random(); 
		}
	}


	grid.addByCoords = function(_x, _y, _energy) {
		let x = Math.floor(_x / Main.settings.nutrients.pxPerTile);
		let y = Math.floor(_y / Main.settings.nutrients.pxPerTile);
		if (!grid[y] || !grid[y][x]) return false;

		grid[y][x] += _energy / surfaceArea;
	}

	grid.eatByCoords = function(_x, _y, _takerArea) { 
		let x = Math.floor(_x / Main.settings.nutrients.pxPerTile);
		let y = Math.floor(_y / Main.settings.nutrients.pxPerTile);
		if (!grid[y] || !grid[y][x]) return 0;
		
		let totalNutrients = grid[y][x] * surfaceArea;
		let availableNutrients = grid[y][x] * _takerArea;
		let eatableNutrients = availableNutrients * Main.settings.nutrients.percNutrientsPerFrame; 

		grid[y][x] -= eatableNutrients / totalNutrients;
		if (grid[y][x] > 1) grid[y][x] = 1;
		if (grid[y][x] < 0) grid[y][x] = 0;

		return eatableNutrients;
	}

	grid.addRandomNutrients = function(_totalNutrients) {
		let nutrientsLeft = _totalNutrients;
		while (nutrientsLeft > 0)
		{
			let x = Math.floor(Math.random() * grid[0].length);
			let y = Math.floor(Math.random() * grid.length);
			let nutrients = _totalNutrients * .1 * Math.random();
			if (nutrients > nutrientsLeft) nutrients = nutrientsLeft;
			nutrientsLeft -= nutrients;

			grid[y][x] += nutrients / surfaceArea;
		}
	}


	return grid;
}

