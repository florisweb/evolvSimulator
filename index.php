<!DOCTYPE html>
<html>
	<head>
		<title>Veratio - Florisweb.tk</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
		<meta name="theme-color" content="#636ad5">
		<link rel="manifest" href="manifest.json">

		

		<link rel="stylesheet" type="text/css" href="css/component.css">
		<link rel="stylesheet" type="text/css" href="css/sideBar.css">
		<link rel="stylesheet" type="text/css" href="css/mainContent/header.css">
		<link rel="stylesheet" type="text/css" href="css/mainContent/mainContent.css?a=7">
		<script type="text/javascript" src="/JS/jQuery.js" asy nc></script>

	</head>	
	<body>
		<div id="sideBar">
			<img class="sideBarBackground" src="../todo/images/sideBarBackground/?type=sidebar">
			<div class="navigationHolder">
				<div class="header clickable" onclick="MainContent.taskPage.tab.open('Today')">
					<img src="images/icons/todayIcon.png" class="headerIcon">
					<div class="headerText">Today</div>
				</div>
				<div class="header clickable" onclick="MainContent.taskPage.tab.open('Inbox')">
					<img src="images/icons/weekIcon.png" class="headerIcon">
					<div class="headerText">Inbox</div>
				</div>
			</div>
			<br>
			<div class="projectListHolder hide">
				<div class="header clickable" onclick="SideBar.projectList.toggleOpenState()">
					<img src="images/icons/dropDownIcon.png" class="headerIcon dropDownButton close">
					<div class="headerText">Projects</div>
				</div>
				<div class="projectList hide">
					<div>
					</div>
					<div class="smallTextHolder clickable" onclick="MainContent.createProjectPage.open()"> 
						<a class="smallText smallTextIcon">+</a>
						<a class="smallText">Create project</a>
					</div>
				</div>
				
			</div>
		</div>

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
					<canvas id="worldCanvas" width="3000" height="2000"></canvas>
					<div style="position: absolute;">
						<button onclick="Main.startRunning()">Start</button>
						<button onclick="Main.startRunning(true)">HyperMode</button>
						<button onclick="Main.stopRunning()">Stop</button>
						<input type="range" value="1" min="1" max="10" step=".1" oninput="Main.frameRate = parseInt(this.value)">
					</div>

					<canvas id="populationGraph" width="1500" height="300"></canvas>
				</div>

			</div>
		</div>





	

		<script type="text/javascript" src="js/renderer.js"></script>
		<script>
			
			// temporary so things don't get cached
			let antiCache = Math.round(Math.random() * 100000000);
			$.getScript("js/statistics.js?antiCache=" 								+ antiCache, function() {});
			$.getScript("js/main.js?antiCache=" 									+ antiCache, function() {});
		</script>
	</body>
</html>	
