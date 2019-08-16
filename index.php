<!DOCTYPE html>
<html>
	<head>
		<title>Veratio - Florisweb.tk</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
		<meta name="theme-color" content="#636ad5">
		<link rel="manifest" href="manifest.json">

		<!-- <link rel="stylesheet" type="text/css" href="css/component.css?a=37"> -->
		<script type="text/javascript" src="/JS/jQuery.js" asy nc></script>

		<style>
			body {
				margin: 0;
				padding: 0;
			}
			button, input {
				position: relative;
				float: left;
			}
			input {
				width: 50vw;
			}

			#worldCanvas {
				width: auto;
				height: 100vh;

				border: 1px solid red;
			}
		</style>
	</head>	
	<body>
		<button onclick="Main.running = true; Main.update()">Start</button>
		<button onclick="Main.running = false">Stop</button>
		<input type="range" value="1" min="0" max="50" step="1" oninput="Main.settings.renderEveryXFrames = this.value * this.value">
		<canvas id="worldCanvas" width="1000" height="1000"></canvas>
	
	

		<script>
			function createBrain(_brainDNA) {
				This = {
					DNA: {
						eyeCount: 5
					}
				}

				let brainStructure = [1 + This.DNA.eyeCount]; // inputs [energy + eyes]
				let layers = Math.abs(Math.round(_brainDNA[0]));

				let newBrainDNA = Object.assign([], _brainDNA);
				let curBrainIndex = layers;

				for (let l = 0; l < layers + 1; l++)
				{
					let prevLayerLength = brainStructure[l - 1];
					let curLayerLength = Math.abs(Math.round(_brainDNA[l + 1]));
					if (curLayerLength <= 0) curLayerLength = 1; 
					if (l == layers) brainStructure.push(curLayerLength);

					for (let b = 0; b < curLayerLength; b++)
					{
						curBrainIndex++;
						if (newBrainDNA[curBrainIndex]) continue;
						newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
					
						for (let w = 0; w < prevLayerLength; w++)
						{
							curBrainIndex++;
							if (newBrainDNA[curBrainIndex]) continue;
							newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
						}
					}
				}
				

				brainStructure.push(4); // outputs
				

				console.log(newBrainDNA);				


				let brain = new NeuralNetwork(brainStructure);
				let brainData = Object.assign([], newBrainDNA).splice(layers + 1, newBrainDNA.length);

				return {brain: populateBrain(brain, brainData, brainStructure), DNA: newBrainDNA}
			}

			function populateBrain(_brain, _brainData, _brainStructure) {
				for (let l = 1; l < _brain.layers.length; l++)
				{
					let cLayer 	= _brain.layers[l];
					// console.log(_brainData, _brainData.splice(0, _brainStructure[l]), _brainStructure[l]);
					cLayer.b 	= _brainData.splice(0, _brainStructure[l]);

					for (let n = 0; n < cLayer.w.length; n++)
					{
						cLayer.w[n] = _brainData.splice(0, _brainStructure[l - 1]);
					}
				}

				return _brain;
			}
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/renderer.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/collision.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/neuralNetwork.js?antiCache=" 							+ antiCache, function() {});
			$.getScript("js/entity.js?antiCache=" 									+ antiCache, function() {});
			$.getScript("js/creature.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/plant.js?antiCache=" 									+ antiCache, function() {});
			$.getScript("js/main.js?antiCache=" 									+ antiCache, function() {});
		</script>
 	
	</body>
</html>	
