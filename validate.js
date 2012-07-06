/********************************************************************************************************************************************************************
*	Version 0.3a
*
*	Dependencies:	jQuery 1.72
*
*	To use		: 	import jQuery 1.72 js file
*				import validate.js file
*				attach to desired form (e.g. $("selector").formValidator();
*				can take options such as background & color for customization (e.g. $("selector").formValidator({ "background": "red", "color": "white" });
*				when you define a dom element add the appropriate classes for validation to happen on change or keyup, whichever is defined in the plugin
*			
*	Classes		: 	required 	- 	requires input
*				numeric 	-	required numeric input
*				phone 		-	masks text with phone number (###) ###-####
*				date 		- 	masks text with date mm/20yy
*				card		- 	accepts only 3,4,5,6 as valid input and determines appropriate max length of cvv and of card number, also chooses corresponding card type
*                   		email       	-   checks for correctly formatted email against a regular expression
*
*	Functions	:	createTip(message, context) 	- creates tip dialog with the specified message and attaches to the appropriate DOM element
*				removeTip(context)		- removes tip dialog from the appropriate DOM element
                   		createSummary(message, e) 	- creates summary of missing fields
                   		removeSummary()           	- removes summary dialog
*
*	Options		:	background	-	Default is transparent.
*				color		-	Default is red.
*				orientation	-	Defaults to right. Takes right, top, left, or bottom. Anything else will default to right.
*				disableSubmit	-	Default is true. Disables any submit event from firing if a tooltip exists.
                    		excludedList    -   JSON array, default is blank. Allows for other input elements with the type of submit to not have validation rules applied.
*
*	Updates		:	V 0.2a	-	Added disable functionality and options,
*						Added orientation options
*						Changed tooltips from <div> to <span> & display from block to inline
*                               		Changed disabled button selector from "button" to "input[type=submit]"
*                              			Added email regex test
*                               		Added max length for routing and account #'s
*                               		Fixed phone number mask bug
*                   		V 0.3a  -   	Added excludedList option
*                               		Added enable/renable to keyup, keydown, keypress, blur, and change events
*                               		Only displaying Required Field on blur and change events
*							
*
*************************************************************************************************************************************************************************/

(function ($) {

    $.fn.formValidator = function (options) {
        //default settings
        var settings = $.extend({

            "background": "transparent",
            "color": "red",
            "orientation": "right",
            "disableSubmit": "true",
            "excludeList": []

        }, options);

        $(document).ready(function () {
            $(".phone").attr("maxlength", "14");
            $(".card").attr("maxlength", "16"); // Default is 16, changes if a card is an AMEX
            $(".cvv").attr("maxlength", "3"); // Defrault is 3, changes if a card is an AMEX
            $(".routing").attr("maxlength", "9");
            $(".account").attr("maxlength", "17");
            $(".required").each(function (i) {
                if ($(this).val() == "") {

                    $(this).addClass("unvalidated");

                }
                else
                    return true;
            });
            if ($(".unvalidated").length > 0) {
                $("input[type=submit]").addClass("disabled");

                $(settings.excludeList).each(function () {
                    this.find("input").removeClass("disabled");
                });
            }

        });

        //check while inputting
        this.live("keyup keypress keydown", function (evt) {    

            //if the user doesn't change the default value, or if they declared this true
            if (settings.disableSubmit == "true") {
                //if you don't find a box with an unvalidated class
                if ($('.unvalidated').length == 0) {
                    //enable any button in the form
                    $("input[type=submit]").removeClass("disabled");
                } //else
                else { //disable button if a tooltip div is found
                    $("input[type=submit]").addClass("disabled");
                }
                $(settings.excludeList).each(function () {
                    this.find("input").removeClass("disabled");
                });
            }

            if ($(evt.target).hasClass("date")) {
                var $dateVal = $("input.date").val();
                if ($dateVal.length > 1 && $dateVal.length < 4) {
                    if (charCode != 47) {
                        var firstVal = $dateVal.substr(0, 2);
                        $("input.date").val(firstVal + "/");
                    }
                }
                if ($dateVal.length >= 3 && $dateVal.length < 5) {
                    $("input.date").val($dateVal + "20")
                }
            }
            //Reads card type and applies formatting rules based upon the type
            if ($(evt.target).hasClass("card")) {

                var $phoneVal = $("input.card").val();
                var $cardType = $phoneVal.charAt(0);

                if ($cardType == "3") {
                    removeTip($(evt.target));
                    $(evt.target).attr("maxlength", "15");
                    $(".cvv").attr("maxlength", "4");
                    $("#cardType").val("AMEX");
                }
                else if ($cardType == "4") {
                    removeTip($(evt.target));
                    $("#cardType").val("VISA");
                }
                else if ($cardType == "5") {
                    removeTip($(evt.target));
                    $("#cardType").val("MC");
                }
                else if ($cardType == "6") {
                    removeTip($(evt.target));
                    $("#cardType").val("DISC");
                }
                else if ($cardType == "") {
                    removeTip($(evt.target));
                    createTip("Field Required", $(evt.target));
                }
                else {
                    removeTip($(evt.target));
                    createTip("Incorrect card type", $(evt.target));
                }
            }
            //if input box is required
            if ($(evt.target).hasClass("required")) {
                if ($(evt.target).val() == "") {
                    $(evt.target).addClass("unvalidated");
                }
                else {
                    removeTip($(evt.target));
                    $(evt.target).removeClass("unvalidated");
                }
            }

            //Phone formatting
            if ($(evt.target).hasClass("phone")) {
                //don't apply filters on backspace, prevents input boxes from applying rules when user is trying to make corrections
                var charCode = (evt.which) ? evt.which : evt.keyCode
                if (charCode == 8)
                    return true;

                var $phoneVal = $("input.phone").val();

                if ($phoneVal.length == 1) {
                    $firstVal = $("input.phone").val().charAt(0);
                    if ($firstVal == "(") {
                        return true;
                    }
                    else {
                        $("input.phone").val("(" + $firstVal)
                    }
                }
                if ($phoneVal.length == 4) {
                    $("input.phone").val($phoneVal + ") ")
                }
                if ($phoneVal.length == 9) {
                    $("input.phone").val($phoneVal + "-")
                }
            }
            //Numeric only
            if ($(evt.target).hasClass("numeric")) {
                var charC = (evt.which) ? evt.which : evt.keyCode
                if (charC == 46 || charC == 8 || charC == 9 || charC == 27 || charC == 13 ||
                // Allow: Ctrl+A
					(charC == 65 && charC === true) ||
                // Allow: home, end, left, right
					(charC >= 35 && charC <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                else {
                    // Ensure that it is a number and stop the keypress
                    if (evt.shiftKey || (charC < 48 || charC > 57) && (charC < 96 || charC > 105)) {
                        evt.preventDefault();
                    }
                }
            }
        });

        //check after changing or leaving
        this.live("blur change", function (evt) {

            if ($(evt.target).hasClass("required")) {
                if ($(evt.target).val() == "") {
                    createTip("Required Field", $(evt.target));
                    $(evt.target).addClass("unvalidated");
                }
                else {
                    removeTip($(evt.target));
                    $(evt.target).removeClass("unvalidated");
                }
            }

            //if the user doesn't change the default value, or if they declared this true
            if (settings.disableSubmit == "true") {
                //if you don't find a box with an unvalidated class
                if ($('.unvalidated').length == 0) {
                    //enable any button in the form
                    $("input[type=submit]").removeClass("disabled");
                } //else
                else { //disable button if a tooltip div is found
                    $("input[type=submit]").addClass("disabled");
                }
                $(settings.excludeList).each(function () {
                    this.find("input").removeClass("disabled");
                });
            }
            //email validation
            if ($(evt.target).hasClass("email")) {
                var re = /\S+@\S+/;
                if ($(evt.target).val() == "") {
                    removeTip($(evt.target));
                    $(evt.target).removeClass("unvalidated");
                    return true;
                }
                if (!(re.test($(evt.target).val()))) {
                    createTip("Invalid Email Address", $(evt.target));
                    $(evt.target).addClass("unvalidated");
                }
                else {
                    removeTip($(evt.target));
                    $(evt.target).removeClass("unvalidated");
                    return true;
                }
            }
            //phone validation
            if ($(evt.target).hasClass("phone")) {
                if ($(evt.target).val().length < 14) {
                    createTip("Invalid Phone #", $(evt.target));
                    $(evt.target).addClass("unvalidated");
                }
                else {
                    removeTip($(evt.target));
                    $(evt.target).removeClass("unvalidated");
                    return true;
                }
            }

        });
        //summary for invalid fields
        this.live("mouseenter mouseover", function (evt) {

            if ($(evt.target).hasClass("disabled")) {

                createSummary("Please fill out:", evt);

            }

        });

        this.live("click", function (evt) {

            if ($(evt.target).hasClass("disabled") || $("input.required").val() == "") {
                evt.preventDefault();
            }

        });

        this.live("mouseout mouseleave", function (evt) {

            removeSummary();

        });

        var createSummary = function (message, e) {

            $("body").append('<div id="validationSummary"></div>');
            var $summary = $("#validationSummary");
            $summary.css("background", "red");
            $summary.css("color", "white");
            $summary.css("font-size", "0.8em");
            $summary.css("top", e.pageY - 125);
            $summary.css("left", e.pageX - 150);
            $summary.fadeIn("slow");
            $summary.html(message);
            $(".unvalidated").each(function () {

                $summary.append("<li>" + $(this).attr("rel") + "</li>");

            })
        };

        var removeSummary = function () {

            $("#validationSummary").fadeOut("fast");
            $("#validationSummary").remove();

        }

        //Create tip function takes a message and DOM element to attach the tooltip to
        var createTip = function (message, context) {

            context.css("box-shadow", "0 0 3px 0 red");

            //if tooltip doesn't already exist next to
            if (!context.next().is(".tooltip")) {
                context.after('<span class="tooltip"></span>');
                context.next(".tooltip").html(message);
                context.next(".tooltip").css("background", settings.background);
                context.next(".tooltip").css("color", settings.color);
                context.next(".tooltip").css("display", "inline");
                context.next(".tooltip").css("font-size", "0.8em");
                context.next(".tooltip").fadeIn("slow");
                //Settings for tooltip orientation
                if (settings.orientation == "right") {
                    context.next(".tooltip").css("top", context.position().top);
                    context.next(".tooltip").css("left", (context.position().left + (context.outerWidth() + 10)));
                    context.next(".tooltip").css("padding-left", "5px");
                }
                else if (settings.orientation == "top") {
                    context.next(".tooltip").css("top", (context.position().top - (context.outerHeight())));
                    context.next(".tooltip").css("left", (context.position().left));
                }
                else if (settings.orientation == "left") {
                    context.next(".tooltip").css("top", (context.position().top));
                    context.next(".tooltip").css("left", (context.position().left - 100));
                    context.next(".tooltip").css("padding-right", "5px");
                }
                else if (settings.orientation == "bottom") {
                    context.next(".tooltip").css("top", (context.position().top + (context.outerHeight())));
                    context.next(".tooltip").css("left", (context.position().left));
                }
                else {
                    context.next(".tooltip").css("top", context.position().top);
                    context.next(".tooltip").css("left", (context.position().left + (context.outerWidth())));
                }
            }

        }
        //Remove the tip from the DOM element
        var removeTip = function (context) {

            $(context).css("box-shadow", "none");
            $(context).next(".tooltip").fadeOut("slow");
            $(context).next(".tooltip").remove();

        }

    };

})(jQuery);