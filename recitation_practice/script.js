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

	if (lastselected===element&&!force) {
		console.log("already selected "+element.textContent);		
		return;
	}
	
	console.log(event.type);
	console.log("element on "+element+ "-"+element.className);

	element.style.display="block";
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