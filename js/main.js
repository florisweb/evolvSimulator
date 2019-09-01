

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
			case "getData": Renderer.update(_e.data.result); break;
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
		
		running: true,
		frameRate: 10,
	}

	function update() {
	 	WebWorker.postMessage({
			action: "getData", 
			parameters: {}
		});
		// if (this.running && _update) requestAnimationFrame(function () {Main.update()});
		if (this.running) setTimeout(function () {This.update()}, This.frameRate);
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
