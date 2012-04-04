
$(function() {
	$(".percentSelector").each(function() {
		PercentSelector.initBar(this);
	});
});

var PercentSelector = {};

PercentSelector.fallbackMode = ($.browser.msie && $.browser.version < 9);

//This will init a bar (calling this directly is useful for re-doing a bar's sizes in the event it's been resized).
PercentSelector.initBar = function(bar) {
	if(!bar) return;

	var $bar = $(bar);
	var height=$bar.innerHeight();
	$bar.children(".PBcolorGrad").remove();
	$bar.children(".PBoverlay").remove();

	var opcAttr = $bar.attr("onpercentchange");
	if(opcAttr) {
		if(typeof opcAttr == "function") {
			$bar.get(0).onpercentchange = opcAttr;
		} else if (typeof opcAttr == "string") {
			if (/^function/.test(opcAttr)) {
				eval("$bar.get(0).onpercentchange = " + opcAttr);
			} else {
				eval("$bar.get(0).onpercentchange = function() {" + opcAttr + "}");
			}
		}
	}

	if(!PercentSelector.fallbackMode) {
		$bar.append($("<canvas class='PBoverlay'></canvas>").css("height", height).css("width", $bar.innerWidth()));
		$bar.append($("<div class='PBcolorGrad'></div>").css("height", height*20).css("top", -(2 * height)));
		PercentSelector.createOverlay($bar);
	} else {
		$bar.addClass("fallback");
		$bar.append($("<div class='PBfallbackColor'></div>").css("height", height).css("width", $bar.innerWidth()));
		//$bar.append($("<div class='PBfallbackOverlay'></div>").css("height", height).css("width", $bar.innerWidth()).css("margin-top", -$bar.innerHeight()));
	}
	
	if($bar.attr("percent") != null) {
		//ok, I know this is odd. It's because setPercent ignores the change if it's changing to the percent 
		// the bar is already at. It remembers what percent it's at using the percent attribute. So trying to 
		// initialize it to the percent attribute causes problems. So I just "reset" the attribute to 100% and then 
		// re-initialize to the percent given.
		var percent = parseInt($bar.attr("percent"));
		$bar.attr("percent", 100);
		PercentSelector.setPercent($bar, percent, true);
	}
	
	if(!($bar.attr("enabled") && $bar.attr("enabled").toLowerCase() == "false")) {
		var $bindBar = $bar;
	
		if(document.createTouch == undefined) {
			$bindBar.bind("mousedown", PercentSelector.handlers.mouseDown);
			$bindBar.bind("mousemove", PercentSelector.handlers.mouseMove);
			$bindBar.bind("mouseup", PercentSelector.handlers.mouseUp);
			$bindBar.bind("mouseout", PercentSelector.handlers.mouseOut);
		} else {
			$bindBar.bind("touchstart", PercentSelector.handlers.touchStart);
			$bindBar.bind("touchmove", PercentSelector.handlers.touchMove);
			$bindBar.bind("touchend", PercentSelector.handlers.touchEnd);
		}
	}
}

PercentSelector.setPercent = function(bar, newPercent, animate) {
	var $bar = $(bar);
	
	var step = $bar.attr("step");
	if(!step) step = 1;
	else step = parseInt(step);
	newPercent=Math.round(newPercent/step)*step;
	
	//short circuit if the percent is not changing!
	if(newPercent == parseInt($bar.attr("percent"))) return;
	
	$bar.attr("percent", newPercent);
	
	if(PercentSelector.fallbackMode) {
		$bar.children(".PBfallbackColor").css("width", $bar.innerWidth() * newPercent / 100.0);
		console.log("setting percent to: " + newPercent);
	} else {
		
		if(animate) {
			$bar.children(".PBcolorGrad").css("-webkit-transition", "-webkit-transform 0.6s ease-in");
			$bar.children(".PBcolorGrad").css("-moz-transition", "-moz-transform 0.6s ease-in");
		} else {
			$bar.children(".PBcolorGrad").css("-webkit-transition", "-webkit-transform 0.1s ease-in"); //turn off the animation in case it's on!
			$bar.children(".PBcolorGrad").css("-moz-transition", "-moz-transform 0.1s ease-in"); //turn off the animation in case it's on!
		}
		
		var yTrans = Math.round(($bar.children(".PBcolorGrad").outerHeight() *.90) * (100 - newPercent) / 100.0);
		var xTrans = Math.round($bar.children(".PBcolorGrad").innerWidth() * ((100 - newPercent) / 100.0));
		
		if(animate) {
			setTimeout(function() { 
				$bar.children(".PBcolorGrad").css("-webkit-transform", "translate(-" + xTrans + "px, -" + yTrans + "px)"); 
				$bar.children(".PBcolorGrad").css("-moz-transform", "translate(-" + xTrans + "px, -" + yTrans + "px)"); 
				$bar.children(".PBcolorGrad").css("-ms-transform", "translate(-" + xTrans + "px, -" + yTrans + "px)"); 
			}, 1);
		} else {
			$bar.children(".PBcolorGrad").css("-webkit-transform", "translate(-" + xTrans + "px, -" + yTrans + "px)");
			$bar.children(".PBcolorGrad").css("-moz-transform", "translate(-" + xTrans + "px, -" + yTrans + "px)");
			$bar.children(".PBcolorGrad").css("-ms-transform", "translate(-" + xTrans + "px, -" + yTrans + "px)");
		}
	}
}

PercentSelector.setPercentFromPageX = function(bar, page_x, animate) {
	var $bar = $(bar);
	var x = page_x - $bar.offset().left;
	var width = $bar.outerWidth();

	var percent = 100*x/width;
	if(percent > 100) percent = 100;
	if(percent < 0) percent = 0;
	percent = Math.round(percent);
		
	PercentSelector.setPercent(bar, percent, animate);
}

PercentSelector.createOverlay = function(bar) {
	var $bar = $(bar);
	$overlay = $bar.children(".PBoverlay");
	var width = $overlay.innerWidth();
	var height = $overlay.innerHeight();
	var canvas = $overlay.get(0);
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	
	//Create the plastic overlay
	var lingrad = ctx.createLinearGradient(0,0,0,height);  
	lingrad.addColorStop(0, 'rgba(0,0,0,0.05)');  
	lingrad.addColorStop(1, 'rgba(0,0,0,0.3)');  
	ctx.fillStyle = lingrad;
	ctx.fillRect(0,0, width, height);
	ctx.clearRect(3,3, width-6, height-6);
	
	lingrad = ctx.createLinearGradient(0,0,0,height);  
	lingrad.addColorStop(0, 'rgba(0,0,0,0.2)');  
	lingrad.addColorStop(1, 'rgba(0,0,0,0.05)');
	ctx.fillStyle = lingrad;
	ctx.fillRect(3,3, width-6, height-6);
	
	//create the steps
	var step = $bar.attr("step");
	if(!step) step = 100;
	ctx.lineWidth = 1;
	
	for(var curStep=1; curStep * step < 100; curStep += 1) {
		var x = Math.floor(curStep * step * width / 100) - .5;
		ctx.beginPath();  
		ctx.moveTo(x,height);  
		ctx.lineTo(x,height*.75);  
		ctx.closePath();  
		ctx.stroke();  
	}
}

PercentSelector.handlers = {};

/**** touch handling ****/
PercentSelector.handlers.touchDragging = false;

PercentSelector.handlers.touchStart = function(event) {
	var touches = event.originalEvent.touches;
	if(touches.length > 1) return;
	event.preventDefault();
	PercentSelector.handlers.touchDragging = false;
}

PercentSelector.handlers.touchEnd = function(event) {
	if(!PercentSelector.handlers.touchDragging) {
		touches = event.originalEvent.touches;
		if(touches.length == 0) touches = event.originalEvent.changedTouches;
		if(touches.length > 1) return;
		
		var bar = touches[0].target.parentNode;
		
		PercentSelector.setPercentFromPageX(bar, touches[0].pageX, true);
		if(bar.onpercentchange != undefined) 
			bar.onpercentchange($(bar).attr("percent"));
	}
	
	event.preventDefault();

}

PercentSelector.handlers.touchMove = function(event) {
	PercentSelector.handlers.touchDragging = true;
	var touches = event.originalEvent.touches;
	if(touches.length > 1) return;
	event.preventDefault();
	
	PercentSelector.setPercentFromPageX(touches[0].target.parentNode, touches[0].pageX);
	
}

/*** mouse handling ***/
PercentSelector.handlers.mouseDragging = false;
PercentSelector.handlers.mouseDown = function(event) { PercentSelector.handlers.mouseDragging = true; }
PercentSelector.handlers.mouseOut = function(event) { 
	if(PercentSelector.handlers.mouseDragging) {
		var bar = (PercentSelector.fallbackMode) ? event.currentTarget : event.originalEvent.target.parentNode;
		if(bar.onpercentchange != undefined) 
			bar.onpercentchange($(bar).attr("percent"));
	}
	PercentSelector.handlers.mouseDragging = false; 
}
PercentSelector.handlers.mouseUp = function(event) { 
	PercentSelector.handlers.mouseDragging = false; 
	var bar = (PercentSelector.fallbackMode) ? event.currentTarget : event.originalEvent.target.parentNode;
	PercentSelector.setPercentFromPageX(bar, event.pageX, true);
	if(bar.onpercentchange != undefined) 
		bar.onpercentchange($(bar).attr("percent"));
}

PercentSelector.handlers.mouseMove = function(event) {
	if(PercentSelector.handlers.mouseDragging) {
		event.preventDefault();
		var bar = (PercentSelector.fallbackMode) ? event.currentTarget : event.originalEvent.target.parentNode;
		PercentSelector.setPercentFromPageX(bar, event.pageX);
	}
}