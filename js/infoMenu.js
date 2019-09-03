
const InfoMenu = new function() {
	let This = {
		canvas: $("#entityDisplayCanvas")[0],
		open: open,
		openState: false,
		renderEntityToWindow: renderEntity,
		curEntityId: false
	}

	let ctx	= This.canvas.getContext("2d");
	
	let curEntity;
	function open(_entity) {
		if (!_entity) return;
		This.openState 		= true;
		curEntity 			= _entity;
		This.curEntityId 	= _entity.id;
		
		renderEntity(curEntity);
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


