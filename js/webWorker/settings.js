let Settings = {		
	//photosyntheses
	sunEnergyPerReaction: .03, //.3
	nutrientsPerReaction: .3, // .15

	nutrientsPercOnDeath: .3,
	minimumEnergyToBeAlive: 50,

	mutationChance: 1,
	mutationRate: 0.2,
	creatureBiteRange: 1.5,

	plantRange: [20, 500], // min - max plants
	creatureRange: [20, 2500], // min - max plants

	biteConstant: 0.2,

	reproduction: {
		plantReproductionFrequency: 1, // A plant can reproduce every 1000 frames
		creatureReproductionFrequency: 1, // A plant can reproduce every 1000 frames
	},

	energyConsumption: {
		default: 0, // to be kept alive
		plantAgeConstant: .00003,
		creatureAgeConstant: .0001, // degration of the body makes it less efficient
		sizeConstant: .001,
		eyeConstant: .000001,
		neuronConstant: 0.0,
		turnConstant: 0.005,
		moveConstant: .025,
		energyPercPerBite: .25,
	},

	performance: {
		checkCollisionFrameCount: 1, // checks the collisions every x frames
	},

	nutrients: {
		nutrientsPerUpdate: .5,
		percWasteToNutrients: .1,
		pxPerTile: 40,
		percNutrientsPerFrame: .001
	}
}

