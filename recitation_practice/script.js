var lastselected=null;
function onCharHover(event){
	event.stopPropagation();
	
	if (lastselected==event.target) {
		return;
	}

	
	var char = event.target;
	var element = char.getElementsByClassName("tooltiptext")[0];

	element.style.display="block";
	if (lastselected != null) {
		lastselected.style.display="";
	}

	window.getComputedStyle(element);
	element.style.top = "0px";
	element.style.bottom ="";

	let is_left_of_parent = element.offsetLeft < 0;
	let is_above_parent = element.offsetLeft < 0;
	
	let rect = element.getBoundingClientRect();
	console.log("The bounding Rect of element is ", rect)
	// get the height of the window 
	let viewPortBottom = window.innerHeight || document.documentElement.clientHeight;
	// get the width of the window 
	let viewPortRight = window.innerWidth || document.documentElement.clientWidth;

	let isTopInViewPort = rect.top >= 0;
	let	isLeftInViewPort = rect.left >= 0;
	let	isBottomInViewPort = rect.bottom +10<= viewPortBottom;
	let	isRightInViewPort = rect.right <= viewPortRight;

	/*
	default style coordinates of element are:
	top: 0px;
	left: 100%;
	*/
	if (!isTopInViewPort) {
		element.style.height = "";
		element.style.top = "";
		element.style.bottom ="100%";
	}
	if (!isBottomInViewPort) {
		/*position top so that the bottom is flush with the bottom of the viewport*/
		element.style.top = `${viewPortBottom-rect.bottom-10}px`;				
		element.style.bottom = "";
	}
	//if left part isn't in view, flip to right side of char
	if (!isLeftInViewPort) {
		element.style.left = "100%";
		element.style.right = "";
	}

	//if right part isn't in view, flip to left side of char
	if (!isRightInViewPort) {
		element.style.left = "";
		element.style.right = "0%";
	}

	lastselected = element;
	//don't bubble up to body
}

var unhover = function(event){
	event.target.style.display="";
}

//attach an event that trigger whenever a char has onmouseover triggered
var chars = document.getElementsByClassName("char");
for (var i = 0; i < chars.length; i++) {
	chars[i].addEventListener("pointerover", onCharHover);
	// chars[i].addEventListener("pointerdown", onCharHover);
}

document.body.addEventListener("pointerover", function(event){
	if (lastselected != null) {
		lastselected.style.display="";
	}
});

// document.body.addEventListener("touchstart", function(event){
// 	if (lastselected != null) {
// 		lastselected.style.display="";
// 	}
// });

// on mouseover definition, hide it
// var definitions = document.getElementsByClassName("tooltiptext");
// for (var i = 0; i < definitions.length; i++) {
// 	var d = definitions[i];
// 	d.addEventListener("mouseover", function(event){
// 		event.target.style.visibility = "hidden";
// 	});
// }