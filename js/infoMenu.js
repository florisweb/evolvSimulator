
const InfoMenu = new function() {
	let This = {
		update: update,
		openState: true,
		animateOpenPage: animateOpenPage,

		curPage: "search",

		searchPage: new InfoMenu_searchPage,
		entityPage: new InfoMenu_entityPage,
	}

	let HTML = {
		pages: $("#infoMenu .infoMenuPage")
	}

	function update() {
		if (!This.openState) return;
		This.entityPage.update();
		This.searchPage.update();
	}


	function animateOpenPage(_pageIndex) {
		for (page of HTML.pages) page.classList.add("hide");
		HTML.pages[_pageIndex].classList.remove("hide");
	}


	

	return This;
}


function InfoMenu_searchPage() {
	let HTML = {
		listHolder: entityListHolder
	}
	const pageName = "search";

	let This = {
		open: open,
		update: update,
		createSearchItem: createSearchItem,

		showPlants: true,
		showCreatures: true,
		sortBy: "energy",


		settings: {
			updateSearchResultsRate: 100,
			maxEntityCount: 50,
		}
	}

	const sortOptions = {
		brain: {
			creatureOnly: true,
			getValue: function (_e) {return _e.DNA.brain.length},
			displayName: "axons"
		},
		energy: {
			getValue: function (_e) {return _e.energy},
			displayName: "energy"
		},
		age: {
			getValue: function (_e) {return _e.age},
			displayName: "frames old"
		}
	}


	function open() {
		InfoMenu.animateOpenPage(0);
		InfoMenu.curPage = pageName;
		update();
	}

	let prevUpdate = 0;
	function update(_force = false) {
		if (InfoMenu.curPage != pageName) return;
		prevUpdate++;
		if (prevUpdate % This.settings.updateSearchResultsRate != 0 && !_force) return;

		
		let sorter = sortOptions[This.sortBy];
		let displayData = createDisplayData();
		displayData.sort(function (a, b) {
			return sorter.getValue(a) < sorter.getValue(b);
		});

		createSearchResult(displayData);
	}


		function createDisplayData() {
			let sorter = sortOptions[This.sortBy];
			let displayData = Object.assign([], Main.data.entities);

			for (let i = displayData.length - 1; i >= 0; i--)
			{
				let remove = false;
				let entity = displayData[i];
				if ((sorter.creatureOnly || !This.showPlants) 	&& entity.type != "creature") remove = true;
				if ((sorter.plantOnly || !This.showCreatures) 	&& entity.type != "plant") remove = true;
				
				if (!remove) continue;
				displayData.splice(i, 1);
			}

			return displayData;
		}



		function createSearchResult(_results) {
			HTML.listHolder.innerHTML = "";
			let entityIndex = 0;
			for (entity of _results) 
			{
				if (entityIndex > This.settings.maxEntityCount) break;

				entityIndex++;
				createSearchItem(entity, entity.searchValue + " " + This.sortBy);
			}
		}






	function createSearchItem(_entity) {
		let sorter = sortOptions[This.sortBy];
		let html = document.createElement("div");
		html.className = "entityItem clickable";
		html.innerHTML = 	"<canvas class='entityPreviewCanvas' width='60' height='60'></canvas>" + 
							"<div class='text titleHolder'></div>";
							
		
		HTML.listHolder.append(html);		
		renderEntityToCanvas(_entity, html.children[0]);

		html.children[1].innerHTML = Math.round(sorter.getValue(_entity) * 10) / 10 + " " + sorter.displayName;
		html.onclick = function() {
			InfoMenu.entityPage.open(_entity);
		}
	}


	function renderEntityToCanvas(_entity, _canvas) {
		let ctx		= _canvas.getContext("2d");
		let entity 	= Object.assign({}, _entity);
		entity.x 	= _canvas.width / 2;
		entity.y 	= _canvas.height / 2;
		
		Renderer.renderEntity(entity, ctx);
	}





	return This;
}









function InfoMenu_entityPage() {
	let This = {
		open: open,
		update: update,
		curEntity: false,
	}
	const pageName = "entity";

	let HTML = {
		canvas: $("#entityDisplayCanvas")[0],
		frameHolder: $(".infoMenuPage .header .text")[0].children[1],
		entityMenu: {
			entityInfo: {
				type: 			$("#entityInfoMenu .textHolder .text")[0].children[1],
				energy: 		$("#entityInfoMenu .textHolder .text")[1].children[1],
				age: 			$("#entityInfoMenu .textHolder .text")[2].children[1],
				generation: 	$("#entityInfoMenu .textHolder .text")[3].children[1],
				children: 		$("#entityInfoMenu .textHolder .text")[4].children[1],
			}
		}
	}

	let ctx	= HTML.canvas.getContext("2d");

	function open(_entity) {
		if (!_entity) return;
		InfoMenu.curPage = pageName;
		This.curEntity 		= _entity;

		InfoMenu.animateOpenPage(1);

		HTML.entityMenu.entityInfo.type.innerHTML		 	= This.curEntity.type;
		HTML.entityMenu.entityInfo.generation.innerHTML 	= This.curEntity.generation;
		update();
	}


	function update() {
		if (InfoMenu.curPage != pageName) return;
		HTML.frameHolder.innerHTML = Main.data.statistics.frames;

		let entity = Main.getEntityById(This.curEntity.id);
		if (!entity) return;

		This.curEntity = entity;
		renderEntity(This.curEntity);
		
		HTML.entityMenu.entityInfo.energy.innerHTML		 	= Math.round(This.curEntity.energy * 10) / 10;
		HTML.entityMenu.entityInfo.age.innerHTML 			= This.curEntity.age;
		HTML.entityMenu.entityInfo.children.innerHTML 		= This.curEntity.children.length;
	}






	function renderEntity(_entity) {
		let entity 	= Object.assign({}, _entity);
		entity.x 	= HTML.canvas.width / 2;
		entity.y 	= HTML.canvas.height / 2;
		
		ctx.clearRect(0, 0, HTML.canvas.width, HTML.canvas.height);
		Renderer.renderEntity(entity, ctx);
	}



	return This;
}

