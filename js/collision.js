
const Collision = new function() {
	const This = {
		getAllEntitiesWithinRange: getAllEntitiesWithinRange,	
		calcFactor: calcFactor,
		addFactors: addFactors,
		apply: apply,
		getPointsWithinCircle: getPointsWithinCircle
	}

	function apply(_entity) {
		let coords = applyFactor(_entity, calcFactor(_entity));
		coords = setCoordsWithinWorld(coords.x, coords.y, _entity.DNA.size);
		_entity.x = coords.x;
		_entity.y = coords.y;
	}

	function setCoordsWithinWorld(_x, _y, _size) {
		if (_x < _size) 							_x = _size
		if (_y < _size) 							_y = _size;
		if (_x > Renderer.canvas.width - _size) 	_x = Renderer.canvas.width - _size;
		if (_y > Renderer.canvas.height - _size)	_y = Renderer.canvas.height - _size;
		return {x: _x, y: _y};
	}

	function applyFactor(_entity, _factor) {
		let fx = Math.cos(_factor.angle) * _factor.power;
		let fy = -Math.sin(_factor.angle) * _factor.power;

		return {x: _entity.x + fx, y: _entity.y + fy};
	}

	function calcFactor(_entity) {
		let inRange = getAllEntityFactorsWithinRange(_entity);
		let sumFactor = {
			angle: 0,
			power: 0
		};

		for (factor of inRange)
		{
			sumFactor = addFactors(sumFactor, factor);
		}

		return sumFactor;
	}

	function addFactors(_factor1, _factor2) {
		let f1x = Math.cos(_factor1.angle) 	* _factor1.power;
		let f1y = -Math.sin(_factor1.angle) * _factor1.power;
		let f2x = Math.cos(_factor2.angle) 	* _factor2.power;
		let f2y = -Math.sin(_factor2.angle) * _factor2.power;

		let newX = f1x + f2x;
		let newY = f1y + f2y;

		return {
			angle: atanWithDX(newX, newY),
			power: Math.sqrt(newX * newX + newY * newY)
		}
	}
	function getAllEntitiesWithinRange(_self, _range = 0) {
		let visableEntities = [];

		for (entity of Main.entities)
		{
			if (entity.id == _self.id) continue;

			let maxDistance = entity.DNA.size + _range;
			let dx = entity.x - _self.x;
			let dy = entity.y - _self.y;
			let directDistance = Math.sqrt(dx * dx + dy * dy);

			let distance = maxDistance - directDistance;

			if (distance <= 0) continue;
			entity.distance = distance;
			visableEntities.push(entity);
		}

		return visableEntities;
	}

	function getPointsWithinCircle(_x, _y, _range) {
		let points = [];
		let minY = _y - _range;
		let maxY = _y + _range;
		for (let y = minY; y < maxY; y++) 
		{
			if (y < 0 || y > Renderer.canvas.height) continue;
			for (let x = _x - _range; x < _x + _range; x++) 
			{
				if (x < 0 || x > Renderer.canvas.width) continue;
				points.push({
					x: x,
					y: y
				});
			}
		}


		return points;
	}


	function getAllEntityFactorsWithinRange(_self) {
		let visableEntities = [];
		for (entity of Main.entities)
		{
			if (entity.id == _self.id) continue;

			let maxDistance = _self.DNA.size + entity.DNA.size;
			let dx = entity.x - _self.x;
			let dy = entity.y - _self.y;
			let directDistance = Math.sqrt(dx * dx + dy * dy);

			let distance = maxDistance - directDistance;

			if (distance <= 0) continue;
			visableEntities.push({
				power: distance,
				angle: atanWithDX(dx, dy) + Math.PI
			});
		}

		return visableEntities;
	}

	return This;
}






let DEBUG = new function() {
  this.getAllNewVarNames = function() {
    const defaultKeys = JSON.parse("[\"document\",\"window\",\"self\",\"name\",\"location\",\"history\",\"locationbar\",\"menubar\",\"personalbar\",\"scrollbars\",\"statusbar\",\"toolbar\",\"status\",\"closed\",\"frames\",\"length\",\"top\",\"opener\",\"parent\",\"frameElement\",\"navigator\",\"applicationCache\",\"sessionStorage\",\"localStorage\",\"screen\",\"innerHeight\",\"innerWidth\",\"scrollX\",\"pageXOffset\",\"scrollY\",\"pageYOffset\",\"screenX\",\"screenY\",\"outerWidth\",\"outerHeight\",\"devicePixelRatio\",\"event\",\"defaultStatus\",\"defaultstatus\",\"offscreenBuffering\",\"screenLeft\",\"screenTop\",\"clientInformation\",\"styleMedia\",\"indexedDB\",\"webkitIndexedDB\",\"speechSynthesis\",\"onabort\",\"onblur\",\"oncanplay\",\"oncanplaythrough\",\"onchange\",\"onclick\",\"oncontextmenu\",\"oncuechange\",\"ondblclick\",\"ondrag\",\"ondragend\",\"ondragenter\",\"ondragleave\",\"ondragover\",\"ondragstart\",\"ondrop\",\"ondurationchange\",\"onemptied\",\"onended\",\"onerror\",\"onfocus\",\"oninput\",\"oninvalid\",\"onkeydown\",\"onkeypress\",\"onkeyup\",\"onload\",\"onloadeddata\",\"onloadedmetadata\",\"onloadstart\",\"onmousedown\",\"onmouseenter\",\"onmouseleave\",\"onmousemove\",\"onmouseout\",\"onmouseover\",\"onmouseup\",\"onmousewheel\",\"onpause\",\"onplay\",\"onplaying\",\"onprogress\",\"onratechange\",\"onrejectionhandled\",\"onreset\",\"onresize\",\"onscroll\",\"onseeked\",\"onseeking\",\"onselect\",\"onstalled\",\"onsubmit\",\"onsuspend\",\"ontimeupdate\",\"ontoggle\",\"onunhandledrejection\",\"onvolumechange\",\"onwaiting\",\"ontransitionend\",\"ontransitionrun\",\"ontransitionstart\",\"ontransitioncancel\",\"onanimationend\",\"onanimationiteration\",\"onanimationstart\",\"onanimationcancel\",\"crypto\",\"performance\",\"onbeforeunload\",\"onhashchange\",\"onlanguagechange\",\"onmessage\",\"onoffline\",\"ononline\",\"onpagehide\",\"onpageshow\",\"onpopstate\",\"onstorage\",\"onunload\",\"origin\",\"close\",\"stop\",\"focus\",\"blur\",\"open\",\"alert\",\"confirm\",\"prompt\",\"print\",\"requestAnimationFrame\",\"cancelAnimationFrame\",\"postMessage\",\"captureEvents\",\"releaseEvents\",\"getComputedStyle\",\"matchMedia\",\"moveTo\",\"moveBy\",\"resizeTo\",\"resizeBy\",\"scroll\",\"scrollTo\",\"scrollBy\",\"getSelection\",\"find\",\"webkitRequestAnimationFrame\",\"webkitCancelAnimationFrame\",\"webkitCancelRequestAnimationFrame\",\"getMatchedCSSRules\",\"showModalDialog\",\"webkitConvertPointFromPageToNode\",\"webkitConvertPointFromNodeToPage\",\"openDatabase\",\"setTimeout\",\"clearTimeout\",\"setInterval\",\"clearInterval\",\"atob\",\"btoa\",\"customElements\",\"caches\",\"isSecureContext\",\"fetch\",\"safari\",\"self\",\"location\",\"locationbar\",\"personalbar\",\"statusbar\",\"status\",\"frames\",\"top\",\"parent\",\"navigator\",\"sessionStorage\",\"screen\",\"innerWidth\",\"pageXOffset\",\"pageYOffset\",\"screenY\",\"outerHeight\",\"event\",\"defaultstatus\",\"screenLeft\",\"clientInformation\",\"indexedDB\",\"speechSynthesis\",\"onblur\",\"oncanplaythrough\",\"onclick\",\"oncuechange\",\"ondrag\",\"ondragenter\",\"ondragover\",\"ondrop\",\"onemptied\",\"onerror\",\"oninput\",\"onkeydown\",\"onkeyup\",\"onloadeddata\",\"onloadstart\",\"onmouseenter\",\"onmousemove\",\"onmouseover\",\"onmousewheel\",\"onplay\",\"onprogress\",\"onrejectionhandled\",\"onresize\",\"onseeked\",\"onselect\",\"onsubmit\",\"ontimeupdate\",\"onunhandledrejection\",\"onwaiting\",\"ontransitionrun\",\"ontransitioncancel\",\"onanimationiteration\",\"onanimationcancel\",\"performance\",\"onhashchange\",\"onmessage\",\"ononline\",\"onpageshow\",\"onstorage\",\"origin\",\"stop\",\"blur\",\"alert\",\"prompt\",\"requestAnimationFrame\",\"postMessage\",\"releaseEvents\",\"matchMedia\",\"moveBy\",\"resizeBy\",\"scrollTo\",\"getSelection\",\"webkitRequestAnimationFrame\",\"webkitCancelRequestAnimationFrame\",\"showModalDialog\",\"webkitConvertPointFromNodeToPage\",\"setTimeout\",\"setInterval\",\"atob\",\"customElements\",\"isSecureContext\",\"safari\", \"getAllNewVarNames\"]");
    let foundKeys = Object.keys(window);
    let newKeys = [];
    for (let i = 0; i < foundKeys.length; i++)if (!isInArray(defaultKeys, foundKeys[i])) newKeys.push(foundKeys[i]);
    
    function isInArray(arr, item) {
      for (let i = 0; i < arr.length; i++)
      {
        if (arr[i] == item) return true;
      }
      return false;
    }

    return newKeys;
  }

  this.getFunctionSpeed = function(_function) {
    let start = new Date();
    if (typeof _function == "function")
    {
      _function();
    } else eval(_function);
    return new Date() - start; 
  }

  this.getAverageFunctionSpeed = function(_function, _samples = 100) {
    let totalScore = 0;
    for (let i = 0; i < _samples; i++)
    {
      let score = this.getFunctionSpeed(_function);
      totalScore += score;
    }
    return totalScore / _samples;
  }



  this.scanPerformance = function(_functionList, _samples) {
    let resultList = [];
    let total = 0;
    for (let i = 0; i < _functionList.length; i++)
    {
      let curFunction = _functionList[i];
      if (typeof curFunction != "string" && typeof curFunction != "function") continue;
      let score = this.getAverageFunctionSpeed(curFunction, _samples);
      total += score;

      resultList.push(
        {
          speed: score,
          function: curFunction
        }
      );
    }

    return {
      speed: total / resultList.length,
      functions: resultList
    };
  }



}