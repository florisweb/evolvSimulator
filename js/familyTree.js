
const FamilyTree = new function() {
	let This = {
		canvas: $("#familyTreeCanvas")[0],
		renderFamilyTree: renderFamilyTreeByEntity,
		
		settings: {
			rowHeight: 100,
			boxWidth: 40,
			startY: 50,
		}
	}

	let ctx = This.canvas.getContext("2d");

	

	function renderFamilyTreeByEntity(_entity, _maxDepth = 5) {
		ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);

		_entity.isTargetEntity = true;
		let masterParent = getMasterParent(_entity, _maxDepth - 1);
		assignChildWidthToEntities(masterParent, _maxDepth);
		This.canvas.width = masterParent.childWidth * This.settings.boxWidth * 1.1;
		This.canvas.style.width = This.canvas.width + "px";

		renderFamilyTree(masterParent, 0, This.canvas.width / 2, _maxDepth);

		return masterParent;
	}
	


	function assignChildWidthToEntities(_entity, _maxDepth) {
		if (_maxDepth <= 0) return 1;

		let childWidth = 0;
		for (let i = 0; i < _entity.children.length; i++)
		{
			let childId = _entity.children[i];
			let child = Main.getEntityById(childId);
			if (!child) continue;

			childWidth += assignChildWidthToEntities(child, _maxDepth - 1);
		}

		_entity.childWidth = childWidth;

		if (_entity.children.length == 0) return 1;
		return childWidth;
	}


	function renderFamilyTree(_entity, _depth = 0, _x, _maxDepth) {
		if (_maxDepth <= 0) return;
		let allowedSpace = This.settings.boxWidth * getActualChildWidth(_entity.children);
		let startX = _x - allowedSpace * .5;

		let passedChildWidth = 0;
		for (let i = 0; i < _entity.children.length; i++)
		{
			let childId = _entity.children[i];
			let child = Main.getEntityById(childId);
			if (!child) continue;

			passedChildWidth += child.childWidth * .5;

			let rx = passedChildWidth * This.settings.boxWidth;
			renderLineToEntity(
				_x, 
				_depth * This.settings.rowHeight + This.settings.startY, 
				startX + rx, 
				(_depth + 1) * This.settings.rowHeight + This.settings.startY,
				child.isTargetEntity ? "#fff" : "#f00"
			);

			renderFamilyTree(child, _depth + 1, startX + rx, _maxDepth - 1);

			passedChildWidth += child.childWidth * .5;
		}
		
		renderEntity(_entity, _x, _depth * This.settings.rowHeight + This.settings.startY);
	}

	function getActualChildWidth(_childIDs) {
		let actualChildWidth = 0;
		for (let i = 0; i < _childIDs.length; i++)
		{
			let childId = _childIDs[i];
			let child = Main.getEntityById(childId);
			if (!child) continue;

			actualChildWidth += child.childWidth;
		}
		return actualChildWidth;
	}

	function getLastChildWidth(_childIDs) {
		let arr = Object.assign([], _childIDs);
		while (arr.length > 0)
		{
			let lastChildId = arr[arr.length - 1];
			let child = Main.getEntityById(lastChildId);
			if (!child) 
			{
				arr.splice(arr.length - 1, 1);
				continue;
			}
			return child.childWidth;

		}
		return 0;
	}



	function getMasterParent(_entity, _maxDepth) {
		if (!_entity.parent) return _entity;
		if (_maxDepth <= 0) return _entity;
		return getMasterParent(_entity.parent, _maxDepth - 1);
	}


	function renderLineToEntity(_x1, _y1, _x2, _y2, _color) {
		ctx.strokeStyle = _color;
		ctx.beginPath();
		ctx.moveTo(_x1, _y1);
		ctx.lineTo(_x2, _y1);

		ctx.moveTo(_x2, _y1);
		ctx.lineTo(_x2, _y2);
		ctx.closePath();
		ctx.stroke();
	}

	function renderEntity(_entity, _x, _y) {
		let entity 	= Object.assign({}, _entity);
		entity.x 	= _x;
		entity.y 	= _y;
		
		Renderer.renderEntity(entity, ctx);
	}

	return This;
}


