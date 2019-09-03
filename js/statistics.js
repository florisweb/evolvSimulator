
const Statistics = new function() {
	let This = {
		canvas: $("#populationGraph")[0],
		update: update,
		settings: {
			updateEveryXFrames: 500
		}
	}

	let ctx = This.canvas.getContext("2d");

	
	let prefGraphLines = [];
	let colours = [
		"#fa0",
		"#f00",
		"#0f0",
		"#00f"
	];

	let lastFrame = 0;
	let drawCursorX = 0;
	let prefDrawCursorX = 0;

	function update(_data) {
		let framesSinceLastUpdate = _data.frames - lastFrame;
		drawCursorX += framesSinceLastUpdate / This.settings.updateEveryXFrames * 10;

		drawGraphLines(_data.graphLines);

		lastFrame = _data.frames;
		prevDrawCursorX = drawCursorX;


		if (drawCursorX > This.canvas.width)
		{
			drawCursorX = 0;
			prefDrawCursorX = 0;
			ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);
		}
	}

	function drawGraphLines(_graphLineValues) {
		for (let i = 0; i < prefGraphLines.length; i++)
		{
			drawLine(prefGraphLines[i], _graphLineValues[i], colours[i]);
		}

		prefGraphLines = _graphLineValues;
	}

	function drawLine(_from, _to, _colour) {
		if (drawCursorX == 0) return;
		let startY = This.canvas.height - mapY(_from);
		let endY = This.canvas.height - mapY(_to);
		ctx.strokeStyle = _colour;
		ctx.beginPath();
		ctx.moveTo(prevDrawCursorX, startY);
		ctx.lineTo(drawCursorX, endY);
		ctx.closePath();
		ctx.stroke();
	}



	function mapY(_value) {
		return _value / 200 * This.canvas.height; // 200 is max population size
	}
	return This;
}


