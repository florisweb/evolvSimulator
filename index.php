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

			#worldCanvas {
				position: fixed;
				top: 0;
				left: 0;
				width: auto;
				height: 100vh;

				
				border: 1px solid red;
			}
		</style>
	</head>	
	<body>
		<canvas id="worldCanvas" width="1000" height="1000"></canvas>
	

		<script>
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/renderer.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/neuralNetwork.js?antiCache=" 							+ antiCache, function() {});
			$.getScript("js/entity.js?antiCache=" 									+ antiCache, function() {});
			$.getScript("js/creatur.js?antiCache=" 									+ antiCache, function() {});
			$.getScript("js/plant.js?antiCache=" 									+ antiCache, function() {});
			$.getScript("js/main.js?antiCache=" 									+ antiCache, function() {});
		</script>
 	
	</body>
</html>	
