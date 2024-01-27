var lastselected=null;
function onCharHover(event,char,force=false){

	if (char === undefined||char===null) {
		char = event.target;
	}

	if (!char.className.includes("char")) {
		return;
	}


	var element = char.getElementsByClassName("tooltiptext")[0];
	if (element === undefined) {
		console.log("no definition for " + char + "of class " + char.className);
		return;
	}

	//char centerpoint
	var rect = char.getBoundingClientRect();
	var cx = rect.left + rect.width/2;
	var cy = rect.top + rect.height/2;
	//if cx is less than half the width of the screen, then the char is on the left side of the screen
	var left = cx < window.innerWidth/2;
	//if it's on the left, show the definition on the right, and vice versa
	if (left){
		element.style.left = "90%";
		element.style.right = "";		
	} else {
		element.style.left = "";
		element.style.right = "90%";		
	}
	

	if (lastselected===element&&!force) {
		console.log("already selected "+element.textContent);		
		return;
	}
	
	console.log(event.type);
	console.log("element on "+element+ "-"+element.className);

	element.style.top = "0px";
	element.style.display="block";
	//recalculate element bounds
	rect = element.getBoundingClientRect();

	//if bottom of element is below bottom of screen, move it up
	if (rect.bottom > window.innerHeight) {
		element.style.top = (window.innerHeight - rect.bottom-5) + "px";
	}

	
	char.style.color="var(--main-punctuation-colour)";
	if (lastselected !== null && lastselected !== element) {
		lastselected.style.display="";
		lastselected.parentElement.style.color="";
		console.log("clearing lastselected " + lastselected);
	}

	lastselected = element;
}

var unhover = function(event){
	event.target.style.display="";	
	event.target.parentElement.style.color="";
	console.log("unhover " + event.target);
}

var chars = document.getElementsByClassName("char");

for (var i = 0; i < chars.length; i++) {
	chars[i].addEventListener("pointerover", onCharHover);
	chars[i].addEventListener("touchstart", onCharHover,{passive: true});
	chars[i].addEventListener("touchmove", function(e){
		var touch = e.touches[0];
		var element = document.elementFromPoint(touch.clientX, touch.clientY);
		onCharHover(e,element,true);
	},{passive: true});
}

var display_c = document.getElementsByClassName("display_c");

for (var i = 0; i < display_c.length; i++) {
	display_c[i].addEventListener("click", function(e){
		console.log("touchstart");
		var char = e.target.textContent;
		var url = `plecoapi://x-callback-url/s?q=${char}`;
		window.open(url);
	});
}

document.body.addEventListener("pointerover", function(event){
	var objectatpoint = document.elementFromPoint(event.clientX, event.clientY);
	if (objectatpoint==null||objectatpoint.className.includes("page") || objectatpoint.className.includes("pageouter") || objectatpoint.tagName == "BODY" || objectatpoint.className.includes("content") ) 
	{
		if (lastselected !== null) {
			lastselected.style.display="";
			lastselected.parentElement.style.color="";
			lastselected=null;
		}
	}
});

document.body.addEventListener("touchend", function(event){
	console.log("touchened");
	var objectatpoint = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	if (objectatpoint === null) {
		console.log("objectatpoint is null");
	} else {
		console.log("objectatpoint " + objectatpoint.classList);
	}
	if (objectatpoint==null||objectatpoint.className.includes("page") || objectatpoint.className.includes("pageouter") || objectatpoint.tagName == "BODY" || objectatpoint.className.includes("content") ) {
		if (lastselected != null) {
			lastselected.style.display="";
			lastselected.parentElement.style.color="";
			lastselected=null;
		}
	}	
});