
const InfoMenu = new function() {
	let This = {
		canvas: $("#entityDisplayCanvas")[0],
		open: open,
		update: update,
		openState: true,
		curEntity: false
	}

	let HTML = {
		frameHolder: $(".infoMenuPage .header .text")[0].children[1],
		entityMenu: {
			entityInfo: {
				type: 			$("#entityInfoMenu .textHolder .text")[0].children[1],
				energy: 		$("#entityInfoMenu .textHolder .text")[1].children[1],
				age: 			$("#entityInfoMenu .textHolder .text")[2].children[1],
				generation: 	$("#entityInfoMenu .textHolder .text")[3].children[1],
			}
		}
	}

	let ctx	= This.canvas.getContext("2d");
	
	function open(_entity) {
		if (!_entity) return;
		This.openState 		= true;
		This.curEntity 		= _entity;
	
		HTML.entityMenu.entityInfo.type.innerHTML = This.curEntity.type;
	
		update();
	}

	function update() {
		if (!This.openState) return;

		HTML.frameHolder.innerHTML = Main.data.statistics.frames;
		

		let entity = Main.getEntityById(This.curEntity.id);
		if (!entity) return;

		This.curEntity = entity;
		renderEntity(This.curEntity);
		
		HTML.entityMenu.entityInfo.energy.innerHTML = Math.round(This.curEntity.energy * 10) / 10;
		HTML.entityMenu.entityInfo.age.innerHTML 	= This.curEntity.age;
	}






	function renderEntity(_entity) {
		let entity 	= Object.assign({}, _entity);
		entity.x 	= This.canvas.width / 2;
		entity.y 	= This.canvas.height / 2;
		
		ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);
		Renderer.renderEntity(entity, ctx);
	}







	

	return This;
}


