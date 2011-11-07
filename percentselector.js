var fallbackMode = ($.browser.msie && $.browser.version < 9);

$(function() {
	$(".percentSelector").each(function() {
		initBar(this);
	});
});

//This will init a bar (calling this directly is useful for re-doing a bar's sizes in the event it's been resized).
var initBar = function(bar) {
	var $bar = $(bar);
	var height=$bar.innerHeight();
	$bar.children(".PBcolorGrad").css("height", height*20).css("top", -(2 * height));
	$bar.children(".PBoverlay").remove();

	if(!fallbackMode) {
		$bar.append($("<canvas class='PBoverlay'></canvas>").css("height", height).css("width", $bar.innerWidth()));
		$bar.append($("<div class='PBcolorGrad'></div>").css("height", height*20).css("top", -(2 * height)));
		createOverlay($bar);
	} else {
		$bar.append($("<div class='PBfallbackColor'></div>").css("height", height).css("width", $bar.innerWidth()));
	}
	
	if($bar.attr("percent") != null) {
		//ok, I know this is odd. It's because setPercent ignores the change if it's changing to the percent 
		// the bar is already at. It remembers what percent it's at using the percent attribute. So trying to 
		// initialize it to the percent attribute causes problems. So I just "reset" the attribute to 100% and then 
		// re-initialize to the percent given.
		var percent = parseInt($bar.attr("percent"));
		$bar.attr("percent", 100);
		setPercent($bar, percent, true);
	}
	
	if(!($bar.attr("enabled") && $bar.attr("enabled").toLowerCase() == "false")) {
		if(document.createTouch == undefined) {
			$bar.bind("mousedown", pbMousedown);
			$bar.bind("mousemove", pbMousemove);
			$bar.bind("mouseup", pbMouseup);
			$bar.bind("mouseout", pbMouseout);
		} else {
			$bar.bind("touchstart", pbTouchStart);
			$bar.bind("touchmove", pbTouchMove);
			$bar.bind("touchend", pbTouchEnd);
		}
	}
}

var setPercent = function(bar, newPercent, animate) {
	var $bar = $(bar);
	
	var step = $bar.attr("step");
	if(!step) step = 1;
	else step = parseInt(step);
	newPercent=Math.round(newPercent/step)*step;
	
	//short circuit if the percent is not changing!
	if(newPercent == parseInt($bar.attr("percent"))) return;
	
	$bar.attr("percent", newPercent);
	
	if(fallbackMode) {
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

var setPercentFromPageX = function(bar, page_x, animate) {
	var $bar = $(bar);
	var x = page_x - $bar.offset().left;
	var width = $bar.outerWidth();

	var percent = 100*x/width;
	if(percent > 100) percent = 100;
	if(percent < 0) percent = 0;
	percent = Math.round(percent);
		
	setPercent(bar, percent, animate);
}

var createOverlay = function(bar) {
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

/**** touch handling ****/
var touchDragging = false;

var pbTouchStart = function(event) {
	var touches = event.originalEvent.touches;
	if(touches.length > 1) return;
	event.preventDefault();
	touchDragging = false;
}

var pbTouchEnd = function(event) {
	if(!touchDragging) {
		touches = event.originalEvent.touches;
		if(touches.length == 0) touches = event.originalEvent.changedTouches;
		if(touches.length > 1) return;
		event.preventDefault();
		
		var bar = touches[0].target.parentNode;
		
		setPercentFromPageX(bar, touches[0].pageX, true);
		if(bar.onpercentchange != undefined) 
			bar.onpercentchange($(bar).attr("percent"));
	}
}

var pbTouchMove = function(event) {
	var touchDragging = true;
	var touches = event.originalEvent.touches;
	if(touches.length > 1) return;
	event.preventDefault();
	
	setPercentFromPageX(touches[0].target.parentNode, touches[0].pageX);
	
}

/*** mouse handling ***/
var isDragging = false;
var pbMousedown = function(event) { isDragging = true; }
var pbMouseout = function(event) { 
	if(isDragging) {
		var bar = (fallbackMode) ? event.currentTarget : event.originalEvent.target.parentNode;
		if(bar.onpercentchange != undefined) 
			bar.onpercentchange($(bar).attr("percent"));
	}
	isDragging = false; 
}
var pbMouseup = function(event) { 
	isDragging = false; 
	var bar = (fallbackMode) ? event.currentTarget : event.originalEvent.target.parentNode;
	setPercentFromPageX(bar, event.pageX, true);
	if(bar.onpercentchange != undefined) 
		bar.onpercentchange($(bar).attr("percent"));
}

var pbMousemove = function(event) {
	if(isDragging) {
		event.preventDefault();
		var bar = (fallbackMode) ? event.currentTarget : event.originalEvent.target.parentNode;
		setPercentFromPageX(bar, event.pageX);
	}
}