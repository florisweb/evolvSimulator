
const FamilyTree = new function() {
	let This = {
		HTML: {
			Self: $("#familyTreeMenu")[0],
		},
		canvas: $("#familyTreeCanvas")[0],
		renderFamilyTree: renderFamilyTreeByEntity,
		
		open: open,
		close: close,


		settings: {
			rowHeight: 50,
			boxWidth: 30,
			startY: 50,
			xScale: 1.5,
		}
	}

	let ctx = This.canvas.getContext("2d");

	function open(_entity) {
		if (!_entity) return false;


		renderFamilyTreeByEntity(_entity, Infinity);
		This.HTML.Self.classList.remove("hide");
	}

	
	function close() {
		This.HTML.Self.classList.add("hide");
	}


	function renderFamilyTreeByEntity(_entity, _maxDepth) {
		ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);

		_entity.isTargetEntity = true;
		let masterParent = getMasterParent(_entity, _maxDepth - 1);
		assignChildWidthToEntities(masterParent, _maxDepth);
		

		This.canvas.width = masterParent.childWidth * This.settings.boxWidth + 100;
		
		let canvasLeft = (window.innerWidth - This.canvas.width * This.settings.xScale) / 2;
		This.canvas.style.width = This.canvas.width * This.settings.xScale + "px";
		This.canvas.style.left = (canvasLeft > 0 ? canvasLeft : 0) + "px";

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

		if (!childWidth) childWidth = 1;
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

			let rx = (passedChildWidth + child.childWidth * .5) * This.settings.boxWidth;
			renderLineToEntity(
				_x, 
				_depth * This.settings.rowHeight + This.settings.startY, 
				startX + rx, 
				(_depth + 1) * This.settings.rowHeight + This.settings.startY,
				child.isTargetEntity ? "#fff" : "rgba(255, 255, 255, .7)",
				true
			);
		

			renderFamilyTree(child, _depth + 1, startX + rx, _maxDepth - 1);

			passedChildWidth += child.childWidth;
		}
		
		console.log("Render: " + _entity.id, _entity, !!_entity.parent);

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


	function getMasterParent(_entity, _maxDepth) {
		if (!_entity.parent) return _entity;
		if (_maxDepth <= 0) return _entity;
		let entity = Main.getEntityById(_entity.parent.id);
		if (!entity) return _entity;
		return getMasterParent(_entity.parent, _maxDepth - 1);
	}


	function renderLineToEntity(_x1, _y1, _x2, _y2, _color, _dotted = false) {
		ctx.strokeStyle = _color;
		ctx.beginPath();

		// let lineDash = [];
		// if (_dotted) lineDash = [5, 5];
		ctx.setLineDash([5, 5]);
		
		ctx.moveTo(_x1, _y1);
		ctx.lineTo(_x2, _y1);

		ctx.setLineDash([5, 5]);
		ctx.moveTo(_x2, _y1);
		ctx.lineTo(_x2, _y2);
		ctx.closePath();
		ctx.stroke();
	}

	function renderEntity(_entity, _x, _y) {
		ctx.setLineDash([]);
		let entity 	= Object.assign({}, _entity);
		entity.x 	= _x;
		entity.y 	= _y;

		Renderer.renderEntity(entity, ctx);
	}

	return This;
}


