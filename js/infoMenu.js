
const InfoMenu = new function() {
	let This = {
		canvas: $("#entityDisplayCanvas")[0],
		open: open,
		openState: false,
		renderEntityToWindow: renderEntity,
		curEntity: false
	}

	let ctx	= This.canvas.getContext("2d");
	
	function open(_entity) {
		if (!_entity) return;
		This.openState 		= true;
		This.curEntity 		= _entity;
		
		renderEntity(This.curEntity);
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


