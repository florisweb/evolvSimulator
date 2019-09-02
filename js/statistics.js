
const Statistics = new function() {
	let This = {
		canvas: $("#populationGraph")[0],
		addPopulationLines: addPopulationLines,
		settings: {
			addPopulationBarEveryXFrames: 10
		}
	}

	let ctx = This.canvas.getContext("2d");
	let bars = 0;

	
	let prefGraphLines = [];
	let colours = [
		"#f00",
		"#0f0",
	];


	function addPopulationLines(_graphLineValues) {
		for (let i = 0; i < prefGraphLines.length; i++)
		{
			drawLine(prefGraphLines[i], _graphLineValues[i], colours[i]);
		}

		prefGraphLines = _graphLineValues;

		bars++;
	}

	function drawLine(_from, _to, _colour) {
		let startY = This.canvas.height - mapY(_from);
		let endY = This.canvas.height - mapY(_to);
		ctx.strokeStyle = _colour;
		ctx.beginPath();
		ctx.moveTo(bars - 1, startY);
		ctx.lineTo(bars, endY);
		ctx.closePath();
		ctx.stroke();
	}



	function mapY(_value) {
		return _value / 200 * This.canvas.height; // 200 is max population size
	}
	return This;
}


