
const Statistics = new function() {
	let This = {
		canvas: $("#populationGraph")[0],
		update: update,
		shiftCanvas: shiftCanvas,
		settings: {
			updateEveryXFrames: 500
		}
	}

	let ctx = This.canvas.getContext("2d");

	
	let prefGraphLines = [];
	let colours = [
		"#f00",
		"#0f0",
		"#00f"
	];

	let lastFrame = 0;
	let drawCursorX = 0;
	let prefDrawCursorX = 0;
	let canvasShift = 0;
	let prefCanvasShift = 0;

	function update(_data) {
		let framesSinceLastUpdate = _data.frames - lastFrame;
		
		let cursorShift = framesSinceLastUpdate / This.settings.updateEveryXFrames * 30;
		drawCursorX 	+= cursorShift;
		
		
		if (drawCursorX > This.canvas.width)
		{
			canvasShift += cursorShift;
			let dShift = canvasShift - prefCanvasShift;
			
			if (dShift >= 1) 
			{
				shiftCanvas(Math.floor(dShift));
				prefCanvasShift += Math.floor(dShift);
			}
		}



		drawGraphLines(_data.graphLines);

		lastFrame 		= _data.frames;
		prevDrawCursorX = drawCursorX;
	}

	function drawGraphLines(_graphLineValues) {
		for (let i = 0; i < prefGraphLines.length; i++)
		{
			drawLine(prefGraphLines[i], _graphLineValues[i], colours[i]);
		}

		prefGraphLines = _graphLineValues;
	}

	function drawLine(_from, _to, _colour) {
		let startY = This.canvas.height - mapY(_from);
		let endY = This.canvas.height - mapY(_to);
		ctx.strokeStyle = _colour;
		ctx.beginPath();
		ctx.moveTo(prevDrawCursorX - canvasShift, startY);
		ctx.lineTo(drawCursorX - canvasShift, endY);
		ctx.closePath();
		ctx.stroke();
	}

	function shiftCanvas(_px) {
		var imageData = ctx.getImageData(_px, 0, ctx.canvas.width - _px, ctx.canvas.height);
		ctx.putImageData(imageData, 0, 0);
		// now clear the right-most pixels:
		ctx.clearRect(ctx.canvas.width - _px, 0, _px, ctx.canvas.height);
	}


	function mapY(_value) {
		return _value / 500 * This.canvas.height; // 200 is max population size
	}
	return This;
}


