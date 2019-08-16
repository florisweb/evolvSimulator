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
