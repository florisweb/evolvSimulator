

function createMap() {
	let This = {
		nutrients: 	createNutrientGrid(),
		climate: 	createClimateGrid(),
		importMap: 	importMap
	}
	
	function importMap(_mapData) {
		This.nutrients 	= createNutrientGrid(_mapData.nutrients);
		This.climate 	= createClimateGrid(_mapData.climate);
	}


	return This;
}

