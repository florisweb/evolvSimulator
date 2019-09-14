
const FamilyTree = new function() {
	let This = {
		HTML: {
			Self: $("#familyTreeMenu")[0],
		},
		canvas: $("#familyTreeCanvas")[0],
		renderFamilyTree: renderFamilyTreeByEntity,
		
		open: open,
		close: close,
		loopRender: loopRender,


		settings: {
			rowHeight: 40,
			boxWidth: 30,
			startY: 40,
			xScale: 1.5,
			maxDepth: Infinity,
			maxWidth: 5000
		}
	}

	let ctx = This.canvas.getContext("2d");
	let curEntity;
	let highestDepth = 0;

	function open(_entity) {
		if (!_entity) return false;
		curEntity = _entity;


		renderFamilyTreeByEntity(curEntity, This.settings.maxDepth);
		This.HTML.Self.classList.remove("hide");
	}

	
	function close() {
		This.HTML.Self.classList.add("hide");
	}

	function loopRender() {
		if (curEntity.energy <= 50) return This.close();
		renderFamilyTreeByEntity(curEntity, This.settings.maxDepth);
		setTimeout(loopRender, 1000);
	}


	function renderFamilyTreeByEntity(_entity, _maxDepth) {
		if (!_entity) return false;
		highestDepth = 0;
		ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);

		_entity.isTargetEntity = true;
		let masterParent = getMasterParent(_entity, _maxDepth - 1);
		assignChildWidthToEntities(masterParent, _maxDepth);
		
		
		This.canvas.width 		= masterParent.childWidth * This.settings.boxWidth + 100;
		This.canvas.height 		= (highestDepth + 1) * This.settings.rowHeight + This.settings.startY + 100;
		let canvasLeft 			= (window.innerWidth - This.canvas.width * This.settings.xScale) / 2;
		let canvasWidth 		= This.canvas.width * This.settings.xScale;
		This.canvas.style.width = (canvasWidth > This.settings.maxWidth ? This.settings.maxWidth : canvasWidth) + "px";
		This.canvas.style.left 	= (canvasLeft > 0 ? canvasLeft : 0) + "px";

		for (entity of Main.data.entities)
		{
			addDeadFamily(entity);
		}


		renderFamilyTree(masterParent, 0, This.canvas.width / 2, _maxDepth);

		return masterParent;
	}
	


	function assignChildWidthToEntities(_entity, _maxDepth, _curDepth = 0) {
		if (_maxDepth <= 0) return 1;
		if (_curDepth > highestDepth) highestDepth = _curDepth;
		
		let childWidth = 0;
		for (let i = 0; i < _entity.children.length; i++)
		{
			let childId = _entity.children[i];
			let child = Main.getEntityById(childId);
			if (!child) continue;

			childWidth += assignChildWidthToEntities(child, _maxDepth - 1, _curDepth + 1);
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
				isParentOf(child, curEntity) ? "rgb(255, 255, 255)" : "rgb(150, 150, 150)"
			);
		

			renderFamilyTree(child, _depth + 1, startX + rx, _maxDepth - 1);

			passedChildWidth += child.childWidth;
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


	function getMasterParent(_entity, _maxDepth) {
		if (!_entity.parent) return _entity;
		if (_maxDepth <= 0) return _entity;
		return getMasterParent(_entity.parent, _maxDepth - 1);
	}

	function isParentOf(_entity, _target) {
		if (!_target || !_entity) return false;
		if (_target.id == _entity.id) return true;
		return isParentOf(_entity, _target.parent);
	}



	function addDeadFamily(_entity) {
		if (!_entity.parent) return false;

		let parent = _entity.parent;
		addDeadFamily(parent);

		let found = Main.getEntityById(parent.id);
		if (found) return true;
		parent.isDead = true;
		Main.data.entities.push(parent);
	}




	function renderLineToEntity(_x1, _y1, _x2, _y2, _colour) {
		ctx.strokeStyle = _colour;
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


		if (_entity.id == curEntity.id) 
		{
			let size = 30;
			ctx.strokeStyle = "rgba(255, 255, 255, .6)";
			ctx.beginPath();
			ctx.strokeRect(_x - size / 2, _y - size / 2, size, size);
			ctx.closePath();
			ctx.stroke();
		}

		
		if (_entity.isDead) 
		{
			
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.beginPath();
			ctx.fillText("RIP", _x - 8, _y + _entity.DNA.size + 10);
			ctx.closePath();
			ctx.fill();
		}
	}

	return This;
}


