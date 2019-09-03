
const InfoMenu = new function() {
	let This = {
		canvas: $("#entityDisplayCanvas")[0],
		open: open,
		openState: false,
	}
	let ctx	= This.canvas.getContext("2d");
	
	let curEntity;
	function open(_entity) {
		ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);

		curEntity = Object.assign({}, _entity);
		curEntity.x = This.canvas.width / 2;
		curEntity.y = This.canvas.height / 2;

		Renderer.renderEntity(curEntity, ctx);
	}




	

	return This;
}


