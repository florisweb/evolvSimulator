let Settings = {		
	//photosyntheses
	// energy/nutrient = 1 / nutrientsPerReaction * [-.5, 1] / sunEnergyPerReaction 
	sunEnergyPerReaction: .1, 
	nutrientsPerReaction: .25,

	nutrientsPercOnDeath: .15,
	minimumEnergyToBeAlive: 50,

	mutationChance: 1,
	mutationRate: .2,
	creatureBiteRange: 1.3,

	plantRange: [20, 1000], // min - max plants
	creatureRange: [20, 1000], // min - max plants

	biteConstant: 0.2,

	reproduction: {
		plantReproductionFrequency: 1, 		// A plant can reproduce every 1000 frames
		creatureReproductionFrequency: 1, 	// A plant can reproduce every 1000 frames
	},

	energyConsumption: {
		default: 0, // to be kept alive
		plantAgeConstant: .00003,
		creatureAgeConstant: .0001, // degration of the body makes it less efficient
		sizeConstant: .003,
		eyeConstant: .00000,
		neuronConstant: 0.0,
		turnConstant: 0.005,
		moveConstant: .03,
		energyPercPerBite: .3,
	},

	performance: {
		checkCollisionFrameCount: 1, // checks the collisions every x frames
	},

	nutrients: {
		nutrientsPerUpdate: 1,
		percWasteToNutrients: .05,
		pxPerTile: 40,
		percNutrientsPerFrame: .002,
	}
}