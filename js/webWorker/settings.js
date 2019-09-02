const Settings = {		
	//photosyntheses
	sunEnergyPerReaction: .2,
	nutrientsPerReaction: .05,

	nutrientsPercOnDeath: .3,
	minimumEnergyToBeAlive: 50,

	mutationChance: 1,
	mutationRate: 0.2,
	creatureBiteRange: 2,

	plantRange: [5, 150], // min - max plants
	creatureRange: [5, 150], // min - max plants

	biteConstant: 0.1,

	reproduction: {
		plantReproductionFrequency: 1000, // A plant can reproduce every 1000 frames
		creatureReproductionFrequency: 300, // A plant can reproduce every 1000 frames
	},

	energyConsumption: {
		default: 0, // to be kept alive
		plantAgeConstant: .00002,
		creatureAgeConstant: .0001, // degration of the body makes it less efficient
		sizeConstant: .0001,
		eyeConstant: .000001,
		neuronConstant: 0.0,
		turnConstant: 0.005,
		moveConstant: .05,
		energyPercPerBite: .2,
	},

	performance: {
		checkCollisionFrameCount: 1, // checks the collisions every x frames
	},

	nutrients: {
		nutrientsPerUpdate: 5,
		percWasteToNutrients: .1,
		pxPerTile: 30,
		percNutrientsPerFrame: .0005
	}
}

