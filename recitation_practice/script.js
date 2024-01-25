var lastselected=null;
function onCharHover(event,char,force=false){
	// event.stopPropagation();

	
	//if char not set, set it to event.target
	if (char === undefined) {
		char = event.target;
	}
	//if char not of class char, return
	if (!char.className.includes("char")) {
		return;
	}
	var element = char.getElementsByClassName("tooltiptext")[0];
	if (element === undefined) {
		console.log("no definition for " + char + "of class " + char.className);
		return;
	}


	if (lastselected===element&&!force) {
		console.log("already selected "+element.textContent);		
		return;
	}
	
	//print event name
	console.log(event.type);

	console.log("element on "+element);

	element.style.display="block";
	char.style.color="var(--main-punctuation-colour)";
	if (lastselected !== null && lastselected !== element) {
		lastselected.style.display="";
		lastselected.parentElement.style.color="";
		console.log("clearing lastselected " + lastselected)
	}

	window.getComputedStyle(element);
	element.style.top = "0px";
	element.style.bottom ="";

	let is_left_of_parent = element.offsetLeft < 0;
	let is_above_parent = element.offsetLeft < 0;
	
	let rect = element.getBoundingClientRect();
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
	event.target.parentElement.style.color="";
	console.log("unhover " + event.target);
}

//attach an event that trigger whenever a char has onmouseover triggered
var chars = document.getElementsByClassName("char");
for (var i = 0; i < chars.length; i++) {
	chars[i].addEventListener("pointerover", onCharHover);
	//also do this for touch input
	chars[i].addEventListener("touchstart", onCharHover);
	//and touch drag
	chars[i].addEventListener("touchmove", function(e){
		// e.preventDefault();
		// e.bubbles = false;
		// e.stopPropagation();
		//get item at touch location
		var touch = e.touches[0];
		var element = document.elementFromPoint(touch.clientX, touch.clientY);
		onCharHover(e,element,true);
	});
}

document.body.addEventListener("pointerover", function(event){
	//if event target is char, ignore
	if (event.target.className.includes("char")) {
		return;
	}
	if (lastselected != null) {
		lastselected.style.display="";
		lastselected.parentElement.style.color="";
		lastselected=null;
		console.log("body over");
	}
});

/*
If you click and drag on a char element, scrolling will be disabled.
*/
document.body.addEventListener("pointerdown", function(event){
	//if target is char
	if (event.target.className.includes("char")) {
		// event.stopPropagation();
		// event.preventDefault();
	}
});

//also disable scrolling for touch input
// document.body.addEventListener("touchmove", function(event){
// 	//if target is char
// 	if (event.target.className.includes("char")) {
// 		event.stopPropagation();
// 		event.preventDefault();
// 	}
// });


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