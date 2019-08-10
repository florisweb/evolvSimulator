



const Renderer = new function() {

	let This = {
		canvas: $("#worldCanvas")[0],
		renderCreatur: renderCreatur
	}

	let dtx	= This.canvas.getContext("2d")

	return This;
	

	function renderCreatur(_creatur) {


		dtx.strokeStyle = "rgb(" + _creatur.DNA.r + ", " + _creatur.DNA.g + ", "+ _creatur.DNA.b + ")";
		dtx.stroke();
		dtx.



	}


}