

$(document).ready(function(){
	resetVars();

	$('input[name=submit]').click(submit);
});


function resetVars(){
	clearBox();	
	// Global vars
	window.counts={};
	window.env2Tok={};
}

function findInLine(token, phone, ignoreLen) {

	//console.log(phone);

	var phLen = phone.length;

	token = token.trim();
	var origTok = token;

	token = token.replace(/\[|\]/g,""); // square brackets
	token = token.replace(/ː/g,":"); // normalize length symbol
	token = token.replace(/\.|ˈ/g,""); // syllable boundaries, stress

	if (ignoreLen){
		token = token.replace(/\:/g,""); 
	}


	var tokPatt = new RegExp(phone, 'g');

	var match, idx;
	var atLeastOne = false;

	while ((match = tokPatt.exec(token)) != null) {
		atLeastOne = true;
		idx = match.index;
	
		// LEFT
		if (idx>0){
			left = token[idx-1];

			if (left == ":") {
				left = token.substring(idx-2,idx);
			} else if (left == " " || left == "*") {
				left = "#";
			} 
		} else {
			left="#";
		}


		// RIGHT
		if (idx+phLen<token.length) {
			right = token[idx+phLen];
	
			if (right == ":" || right == "ʰ")
				continue;
			else if (right == " ")
				right = "#";
			
			// 2 characters over
			if (idx+phLen+1<token.length && (token[idx+phLen+1]==":"))
				right = token.substring(idx+phLen,idx+phLen+2);

		} else {
			right="#";
		}


		// Assembles environment entry
		var envt = left + "_" + right;
	
		if (token[0]=="*")
			envt = "*" + envt;


		// Increments the count for this envt
		if (!(envt in window.counts)){
			window.counts[envt]=1;
		} else {
			window.counts[envt]++;
		}

		// Adds the token to the growing list for this env't
    	if (atLeastOne){
			if (!(envt in window.env2Tok)){
				window.env2Tok[envt]=[origTok];
			} else {
				window.env2Tok[envt].push(origTok);
			}
		}
    }

	return envt;

}

/////////////////////////////////////////////////////////
// FORM CONTROL 

function setPrunable(){
	//$('input[name=submit]').val("Prune!");
	//$('input[name=submit]').unbind();
	$('input[name=submit]').click(submit);
}

function disablePrunable(){
	//$('input[name=submit]').val("Clear");
	//$('input[name=submit]').unbind();
	//$('input[name=submit]').click(clearBox);
}

// Gets called when the "Clear" button is hit
function clearBox(){
	$('textarea[name=out-counts]').val("ENVIRONMENT FREQUENCY COUNTS WILL APPEAR HERE");	
	$('textarea[name=out-tokens]').val("ENVIRONMENT-TOKEN MAPPINGS WILL APPEAR HERE");	
	//$('form').trigger('reset');
	//setPrunable();
}

// Gets called when the "Find!" button is hit
function submit(){

	resetVars();

	var text = $('textarea[name=my-input]').val();
	if (!text) { return; }
	text = text.split('\n');	

	var phone = $('input[name=phone]').val().trim();

	// Reads the highlighting option
	var ignoreLen = $('input[name=ignore-len]:checked').val()=="yes";

	// Processing of input text!
	var line;
	var output = "";
	var output2 = "";
	var result, progMsg;
	var numLines = text.length;

	for (var i=0; i<numLines; i++){
		progMsg = "PROCESSING LINE "+ (i+1)+" OF "+numLines;
		$('.out-txt').val(progMsg);
		line = text[i];
		result = findInLine(line,phone,ignoreLen);
	}

	// Populating the output textboxes

	
		for (var envt in window.counts){
			output += envt + "\t" + (window.counts[envt]) + "\n";
			output2 += envt + "\n\t" + window.env2Tok[envt].join("\n\t") + "\n";
		}
		$('textarea[name=out-counts]').val(output);	
		$('textarea[name=out-tokens]').val(output2);	
	

	//disablePrunable();
}



$(document).on('input propertychange', "form", function () {
    //setPrunable();
});
