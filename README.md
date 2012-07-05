formvalidator
=============

jQuery Form Validation plugin

/********************************************************************************************************************************************************************
*  Version 0.3a
*
*	Dependencies:	jQuery 1.72
*
*	To use		: 	import jQuery 1.72 js file
*					import validate.js file
*					attach to desired form (e.g. $("selector").formValidator();
*					can take options such as background & color for customization (e.g. $("selector").formValidator({ "background": "red", "color": "white" });
*					when you define a dom element add the appropriate classes for validation to happen on change or keyup, whichever is defined in the plugin
*			
*	Classes		: 	required 	- 	requires input
*					numeric 	-	required numeric input
*					phone 		-	masks text with phone number (###) ###-####
*					date 		- 	masks text with date mm/20yy
*					card		- 	accepts only 3,4,5,6 as valid input and determines appropriate max length of cvv and of card number, also chooses corresponding card type
*                   email       -   checks for correctly formatted email against a regular expression
*
*	Functions	:	createTip(message, context) - creates tip dialog with the specified message and attaches to the appropriate DOM element
*					removeTip(context)			- removes tip dialog from the appropriate DOM element
                    createSummary(message, e)   - creates summary of missing fields
                    removeSummary()             - removes summary dialog
*
*	Options		:	background		-	Default is transparent.
*					color			-	Default is red.
*					orientation		-	Defaults to right. Takes right, top, left, or bottom. Anything else will default to right.
*					disableSubmit	-	Default is true. Disables any submit event from firing if a tooltip exists.
                    excludedList    -   JSON array, default is blank. Allows for other input elements with the type of submit to not have validation rules applied.
*
*	Updates		:	V 0.2a	-	Added disable functionality and options,
*								Added orientation options
*								Changed tooltips from <div> to <span> & display from block to inline
*                               Changed disabled button selector from "button" to "input[type=submit]"
*                               Added email regex test
*                               Added max length for routing and account #'s
*                               Fixed phone number mask bug
*                   V 0.3a  -   Added excludedList option
*                               Added enable/renable to keyup, keydown, keypress, blur, and change events
*                               Only displaying Required Field on blur and change events
*							
*