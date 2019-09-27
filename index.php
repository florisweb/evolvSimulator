<!DOCTYPE html>
<html>
	<head>
		<title>Veratio - Florisweb.tk</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
		<meta name="theme-color" content="#636ad5">
		<link rel="manifest" href="manifest.json">

		

		<link rel="stylesheet" type="text/css" href="css/component.css">
		<link rel="stylesheet" type="text/css" href="css/mainContent/header.css">
		<link rel="stylesheet" type="text/css" href="css/infoMenu.css?a=8">
		<link rel="stylesheet" type="text/css" href="css/familyTree.css?a=4">
		<link rel="stylesheet" type="text/css" href="css/mainContent/mainContent.css?a=12">
		<script type="text/javascript" src="/JS/jQuery.js" asy nc></script>

	</head>	
	<body>
	

		<div id="mainContent" class="animatePageChange">
		<!-- 	<div id="mainContentHeader">
				<div class="header titleHolder userText"></div>

				<div class="functionHolder">
					<img src="images/icons/optionIcon.png" class="functionItem icon clickable" style="left: -5px">
					<div class="functionItem backButton clickable hide" onclick='MainContent.taskPage.tab.reopenCurTab()'>
						<img src="images/icons/dropDownIconDark.png" class="functionItem icon">
						<a class="functionItem button text">
							Back
						</a>
					</div>
					<a class="clickable functionItem button bDefault" onclick='MainContent.settingsPage.open(MainContent.curProjectId)'>
						Share
					</a>
					<div class="functionItem memberList userText" onclick='MainContent.settingsPage.open(MainContent.curProjectId)'></div>
				</div>
			</div> -->

			<div id="mainContentHolder">

				<div class="mainContentPage hi de">
					<div id="worldScrollHolder">
						<canvas id="worldCanvas" width="1000" height="700"></canvas>
					</div>
					<div style="position: absolute;">
						<button onclick="Main.startRunning()">Start</button>
						<button onclick="Main.startRunning(true)">HyperMode</button>
						<button onclick="Main.stopRunning()">Stop</button>
						<input type="range" value="1" min="1" max="10" step=".1" oninput="Main.frameRate = parseInt(this.value)">
					</div>

					
				</div>

			</div>
		</div>




		<div id="infoMenu">
			<div class="infoMenuPage">
				<div class="headerText preventTextOverflow">PROJECTS</div>

				<select onInput="InfoMenu.searchPage.sortBy = this.value; InfoMenu.searchPage.update(true)">
					<option value="age">Age</option>
					<option value="energy">Energy</option>
					<option value="brain">Brainsize</option>
				</select>
				<div id="entityListHolder"></div>
			</div>


			<div class="infoMenuPage hide">
				<img class="exitIcon" src="images/exitIcon.png" onclick="InfoMenu.searchPage.open()">

				<div class="header">
					<div class="text">
						<strong>Frame</strong>
						: 
						<a>0</a>
					</div>
				</div>
				<br>
				<div id="entityInfoMenu"> 
					<div class="textHolder">
						<div class="text">
							<strong>Type</strong>
							: 
							<a>plant</a>
						</div>
						<div class="text">
							<strong>Energy</strong>
							: 
							<a>100</a>
						</div>
						<div class="text">
							<strong>Age</strong>
							: 
							<a>0</a>
						</div>
						<div class="text">
							<strong>Generation</strong>
							: 
							<a>0</a>
						</div>
						<div class="text">
							<strong>Children</strong>
							: 
							<a>0</a>
						</div>
					</div>
				
					<canvas id="entityDisplayCanvas" width="100" height="100"></canvas>
				</div>

				<button onclick="FamilyTree.open(InfoMenu.entityPage.curEntity)">Open FamilyTree</button>
				<canvas id="populationGraph" width="1000" height="400"></canvas>
			</div>
		</div>


		<div id="familyTreeMenu" class="hide" onclick="FamilyTree.close()">
			<canvas id="familyTreeCanvas"></canvas>
		</div>


	

		<script type="text/javascript" src="js/renderer.js"></script>
		<script>
			
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/worldSaver.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/infoMenu.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/familyTree.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/statistics.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/main.js?antiCache=" 									+ antiCache, function() {});
		</script>
	</body>
</html>	
