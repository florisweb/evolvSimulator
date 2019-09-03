

var WebWorker;
if (window.Worker)
{
	WebWorker = new Worker("js/webWorker/webWorker.js");
	WebWorker.postMessage({
		action: "setup", 
		parameters: {
			width: 	Renderer.canvas.width,
			height: Renderer.canvas.height,
		}
	});

	WebWorker.postMessage({
		action: "getSettings", 
		parameters: {}
	});

	WebWorker.postMessage({
		action: "getData", 
		parameters: {}
	});



	WebWorker.onmessage = function(_e) {
		switch (_e.data.action) 
		{
			case "getData": 
				// console.log(_e.data.result.statistics.frames);
				let frames = _e.data.result.statistics.frames;
				let updateEveryXFrames = Statistics.settings.updateEveryXFrames;
				if (
					Math.floor(frames / updateEveryXFrames / 10) * updateEveryXFrames * 10 % updateEveryXFrames == 0
				) Statistics.update(_e.data.result.statistics);


				if (Main.updates % Main.frameRate == 0) Renderer.update(_e.data.result); 
				if (Main.running) requestAnimationFrame(function () {Main.update()});
			break;
			case "getSettings": Main.settings = _e.data.result; break;
			default: console.warn("Feedbackless action: ", _e.data.action, _e.data); break;
		}
	}
}




const Main = new function() {
	let This = {
		settings: {},
		update: update,
		startRunning: startRunning,
		stopRunning: stopRunning,
		
		running: false,
		updates: 0,
		frameRate: 1,
	}

	function update() {
		This.updates++

	 	WebWorker.postMessage({
			action: "getData", 
			parameters: {}
		});
	}

	function startRunning(_hyperMode = false) {
		let actionName = "startRunning";
		if (_hyperMode)	actionName = "startHyperRun";
		WebWorker.postMessage({action: actionName, parameters: {}});

		This.running = true;
		This.update();
	}
	

	function stopRunning() {
		This.running = false;
		WebWorker.postMessage({
			action: "stopRunning", 
			parameters: {}
		});
	}



	return This;
}
