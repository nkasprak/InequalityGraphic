// JavaScript Document

var mainGraphic = {};

//Takes a row from the event sequence object (see events.js) and executes it.
mainGraphic.event_fire = function(eventParams) {
	try {
		//Start with a couple of closure functions for later use.
		
		//This is currently only used on the first slide, but it makes a fake-ish popup box with text.
		function popup() {
			
			//Get year from parms row
			var year = eventParams[2];
			
			//Check if there's a popup entry in the text config object (see text.js) for that year
			if (mainGraphic.textConfig[eventParams[0]]["popup"]) {
				
				//If so, grab the text....
				var text = mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]]["popup"]];
				
				//...indicate that a popup is being shown on the current slide...
				mainGraphic.popupsShown[eventParams[0]] = true;
				
				//..and use the text.
				$(".popup .textDiv").html(text);
				
				//Switch to the slide associated with the event if we're not already on it
				mainGraphic.changeSlide(eventParams[0]);
				
				//The popup jumps the gun on the event continue function, 
				//and this anticipates the change that will happen once the "OK" button is clicked
				$("#slide" + eventParams[0] + "title .animateInner").html(mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]][year][0]]);
				$("#slide" + eventParams[0] + "body .animateInner").html(mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]][year][1]]);
				
				//Make the popup visible
				$(".popup").fadeIn(100);
				
			} else {
				
				//If not, continue onward.
				continueEvents();	
			}
		}
		
		//Continue to the next event.
		function continueEvents() {
			
			//Move the slider(s) and trigger all the code that needs to run when the data changes.
			var ui = {};
			if (eventParams[1]) ui.values = [eventParams[1],eventParams[2]];
			else ui.value = eventParams[2];
			mainGraphic.sliderChangeFunction(null,ui,eventParams[0]);
			
			
			
			//Check to make sure it's not on the last event. 
			if (mainGraphic.eventIndex < mainGraphic.eventSequence.length-1) {
				
				//Set a timer to run the next event based on the event length (eventParms[3])
				mainGraphic.mainGlobalEventTimer = setTimeout(function() {
					mainGraphic.event_fire(mainGraphic.eventSequence[mainGraphic.eventIndex])
				},eventParams[3]*1000);
				
				//Increment the event tracker
				mainGraphic.eventIndex++;
			}
			
			//If there's a function to execute, execute it.
			if (eventParams[4]) {
				eventParams[4]();	
			}
		}
		
		//End of closure functions. 
		//mainGraphic.event_fire execution begins:
		
		//Check if there's a previous event
		if (mainGraphic.eventSequence[mainGraphic.eventIndex-1]) { //There is a previous event
		
			//Check if the previous event is on the same slide, or if 
			if ((mainGraphic.eventSequence[mainGraphic.eventIndex][0] == mainGraphic.eventSequence[mainGraphic.eventIndex-1][0]) || mainGraphic.popupsShown[eventParams[0]]) {
				continueEvents();
			} else {
				popup();
			}
		} else {
			if (mainGraphic.popupsShown[eventParams[0]]) {
				continueEvents();	
			} else {
				popup();	
			}
		}
	} catch (ex) {
		console.log(ex);	
	}
};

//Switch to a new slide.
mainGraphic.changeSlide = function(slideClicked) {
	if ($("#slide" + slideClicked).is(":visible")) {
		//We're already on this slide! Hooray. Don't need to do anything.
	} else {
		
		//Fade out all the slides.
		$(".chartSlide").fadeOut(200);
		
		//Change the tabs at the top to reflect the slide we're in
		$('.slideSelector').removeClass("selected");
		$("#selectSlide" + slideClicked).addClass("selected");
		
		
		//Last tab is for explore mode.
		if (slideClicked==5) {
			mainGraphic.enterExploreMode();
		}
		
		//Fade in the correct slide.
		$("#slide" + slideClicked).fadeIn(200, function () {
			
			//If we haven't drawn this slide's chart yet, draw it.
			if (mainGraphic.chartDrawn[slideClicked] == false) {
				
				mainGraphic.initializeChartAfterSwitch(slideClicked);
				
			}
		});
		
		if (slideClicked==5) {
			$(".exploreSelector").trigger("change");
		}
		
		//Color the arrows properly
		$("#slideSelectArea .slideSelector .betweenSelect .caret").removeClass("dark");
		for (var i=0;i<slideClicked;i++) {
			$("#selectSlide" + i + " .betweenSelect .caret").addClass("dark");
		}
	}
	mainGraphic.activeSlide = slideClicked;
};

mainGraphic.initializeChartAfterSwitch = function(slideNumber) {
	var ui = {};
			
	//Check number of handles in chart
	if ($("#slide" + slideNumber + "slider a").length > 1) ui.values = [mainGraphic.minYear, mainGraphic.maxYear];
	else ui.value = mainGraphic.minYear;
	
	mainGraphic.sliderChangeFunction(null, ui, slideNumber);
};

//Edit the slider objects (created by jQuery UI) a bit to control styling.
mainGraphic.styleSliderHandles = function(chartIndex) {
	//Get slider handles of current slide
	var sliderHandles = $("#slide" + chartIndex + "slider .ui-slider-handle");
	if (sliderHandles.length == 1) {
		var mainSlider = 0;
	} else {
		var mainSlider = 1;
		var otherSlider = 0;
		
		//add CSS ID
		$(sliderHandles[otherSlider]).attr("id", "slide" + chartIndex + "slider_lowerHandle");
		
		//add inner divs
		$(sliderHandles[otherSlider]).html('<div class="lowerSliderHandle sliderHandle" id="chart' + chartIndex + '_lowerSliderHandle"><div class="sliderLegendBox"><div id="chart' + chartIndex + '_lowerSliderText" class="sliderText">' + mainGraphic.minYear + '</div></div>');
	
	}
	
	//add CSS ID
	$(sliderHandles[mainSlider]).attr("id", "slide" + chartIndex + "slider_upperHandle");
		
	//add inner divs
	$(sliderHandles[mainSlider]).html('<div class="upperSliderHandle sliderHandle" id="chart' + chartIndex + '_upperSliderHandle"><div class="sliderLegendBox"></div><div id="chart' + chartIndex + '_upperSliderText" class="sliderText">' + mainGraphic.maxYear + '</div></div>');
}

//Hide all the text that would otherwise appear (for explore mode)
mainGraphic.hideBlurbs = function() {
	$(".chartDescHeader, .chartDescBody").hide();
	$(".vertical_divider").css("top","70px");
};

//Unhide that text
mainGraphic.showBlurbs = function() {
	if (mainGraphic.mode == "story") {
		$(".chartDescHeader, .chartDescBody").slideDown(600);
		$(".vertical_divider").css("top","270px");
	}
};

//Try to update the chart with a new data point.
mainGraphic.tryDraw = function(barChartObjects, barChartCanvases, timerID, dataArrs, dataOptionsArrs) {
	try {
		try {
			clearTimeout(mainGraphic.timers[timerID]);
		} catch (ex) {
			console.log("no timer: " + ex);	
		}
		
		//In order to check if anything's in motion, we'll assume no initially...
		var inMotion = false;
		
		//...and loop through all the charts given (should just be two - left and right) to see if any of them are animating.
		for (var barChartIndex = 0; barChartIndex < barChartObjects.length; barChartIndex++) {
			if (barChartObjects[barChartIndex].inMotion == true) {
				inMotion = true;
			}
		}
		
		//If none of them are...
		if (inMotion == false) {
			//loop through the charts again...
			for (var barChartIndex = 0; barChartIndex < barChartObjects.length; barChartIndex++) {
				
				//Update the chart's underlying data...
				barChartObjects[barChartIndex].updateData(dataArrs[barChartIndex], dataOptionsArrs[barChartIndex]);
				
				//and redraw it.
				barChartObjects[barChartIndex].draw(barChartCanvases[barChartIndex], 200);
				
			}
		} else {
			//If the charts are still in motion, check back in 20 milliseconds.
			mainGraphic.timers[timerID] = setTimeout(function () {
				mainGraphic.tryDraw(barChartObjects, barChartCanvases, timerID, dataArrs, dataOptionsArrs);
			}, 5);
		}
	} catch (ex) {
		console.log(ex);	
	}
};


mainGraphic.pauseEverything = function() {
	if (mainGraphic.playingStarted==true) {
		
		//Change the play/pause image
		$("#playPauseArea img").attr("src",$("#playPauseArea img").attr("src").replace("pause","play"));
		
		//Stop the main event timer
		clearTimeout(mainGraphic.mainGlobalEventTimer);
		
		//Store the change
		mainGraphic.playing = false;	
	} 
};

//Show the play/pause button
mainGraphic.showPlay = function() {
	mainGraphic.playingStarted=true;
	$("#outermost #playPauseArea, #outermost #restartArea").css("visibility","visible");
};

//Hit play button
mainGraphic.hitPlay = function() {
	$("#playPauseArea img").attr("src",$("#playPauseArea img").attr("src").replace("pause","play"));
	clearTimeout(mainGraphic.mainGlobalEventTimer);
	mainGraphic.playing = false;
	mainGraphic.returnToEvent = mainGraphic.eventIndex;
	$(".chartDescHeader, .chartDescBody").css("opacity",0.5);
};

//Hit pause button
mainGraphic.hitPause = function() {
	$(".chartDescHeader, .chartDescBody").css("opacity",1);
	var returnToChart =mainGraphic.eventSequence[mainGraphic.returnToEvent][0];
	var currentChart = mainGraphic.activeSlide;
	if (returnToChart == currentChart) {
		if ($("#slide" + currentChart + "slider a").length > 1) {
			var yearToUse = $("#slide" + currentChart + "slider").slider("option","values")[1];	
		} else {
			var yearToUse = $("#slide" + currentChart + "slider").slider("option","value");
		}
		for (var i = 0;i<mainGraphic.eventSequence.length;i++) {
			if (mainGraphic.eventSequence[i][2] == yearToUse && mainGraphic.eventSequence[i][0] == currentChart) {
				mainGraphic.eventIndex = i;
				break;
			}
		}
	} else {
		for (var i = 0;i<mainGraphic.eventSequence.length;i++) {
			if (mainGraphic.eventSequence[i][0] == currentChart) {
				mainGraphic.eventIndex = i;
				break;
			}
		}
	}
	$("#playPauseArea img").attr("src",$("#playPauseArea img").attr("src").replace("play","pause"));
	mainGraphic.event_fire(mainGraphic.eventSequence[mainGraphic.eventIndex]);
	mainGraphic.playing = true;	
	mainGraphic.showBlurbs();
}

//Reset everything
mainGraphic.showsOver = function() {
	$(".chartDescHeader, .chartDescBody").css("opacity",1);
	mainGraphic.popupsShown = [];
	mainGraphic.eventIndex=0;
	mainGraphic.pauseEverything();
	$("#playPauseArea").hide();
};

//Switch to explore mode
mainGraphic.enterExploreMode = function() {
	mainGraphic.mode = "explore";
	mainGraphic.hideBlurbs();
	$("#playPauseArea, #restartArea").hide();
};

//Switch to story mode
mainGraphic.enterStoryMode = function() {
	mainGraphic.mode = "story";
	$("#restartArea").trigger("click");
	$("#outermost #restartArea").show();
};



//Draw a new data point. This function is called sliderChangeFunction because that's when it runs,
//but it does a whole lot.
mainGraphic.sliderChangeFunction = function (event, ui, chartNumber) {
	
	//Closure function to slide text in and out.
	function slideText(text, selector) {
		clearTimeout(mainGraphic.textSlidingTimer[selector]);
		if (mainGraphic.textSliding[selector] == true) {
			mainGraphic.textSlidingTimer[selector] = setTimeout(function() {
				slideText(text,selector);
			},50);
			return false;
		}
		if (text != $(selector + " div.animateInner").html()) {
			
			mainGraphic.textSliding[selector] = true;
			clearTimeout(mainGraphic.textSlidingTimer[selector]);
			$(selector + " div.animateInner").animate({"left":"-100%"},200,null,function() {
				$(selector + " div.animateInner").html(text);
				$(selector + " div.animateInner").css("left","100%");
				$(selector + " div.animateInner").animate({"left":"0%"},200, function() {
					mainGraphic.textSliding[selector] = false;	
				});
			});
		}
	}
	
	try {
		
		chartNumber = chartNumber * 1;
		
		var chartToDraw = chartNumber;
		
		if (mainGraphic.mode=="explore") {
			chartToDraw = 5;
		}
		mainGraphic.changeSlide(chartToDraw);
		
		//This might be false if we haven't drawn a chart for this slide yet, but is henceforth true
		mainGraphic.chartDrawn[chartNumber] = true;
		
		//Will store years where there are text changes
		var years = [];
		for (var entry in mainGraphic.textConfig[chartNumber]) {
			if (!isNaN(entry*1)) years.push(entry*1);	
		}
		years.sort();
		
		//yearToUse will store the year that determines what text to show. Set it to an initial value for now...
		var yearToUse = years[0];
		
		//and now set it to the correct value.
		for (var yearIndex=0;yearIndex<years.length;yearIndex++) {
			if (!ui.values) {
				if (ui.value >=years[yearIndex]) {
					yearToUse = years[yearIndex];	
				}
			} else {
				if (ui.values[1] >= years[yearIndex]) {
					yearToUse = years[yearIndex];
				}
			}
		}
		
		//Slide the correct text in
		if (mainGraphic.mode != "explore") {
			slideText(mainGraphic.textSnippets[mainGraphic.textConfig[chartNumber][yearToUse][0]],"#slide" + chartNumber + "title");
			slideText(mainGraphic.textSnippets[mainGraphic.textConfig[chartNumber][yearToUse][1]],"#slide" + chartNumber + "body");
		}
		
		if (!ui.values) $("#slide" + chartNumber + "slider").slider('value',ui.value);
		else $("#slide" + chartNumber + "slider").slider('values',[ui.values[0],ui.values[1]]);
		
		//Slice up data in the correct way based on by-chart configuration in data.js
		var gData = mainGraphic.assignData(ui,chartNumber);
		var chartData = gData.data1;
		var chartData2 = gData.data2;
		mainGraphic.customMax = gData.customMax;
		mainGraphic.customMin = gData.customMin;
		
		//Get chart options configuration object from chartOptions.js
		var ops = mainGraphic.getChartOptionsObj();
		ops[chartNumber].left.yMax = mainGraphic.customMax;
		ops[chartNumber].left.yMin = mainGraphic.customMin;
		ops[chartNumber].right.yMax = mainGraphic.customMax;
		ops[chartNumber].right.yMin = mainGraphic.customMin;

		//If we haven't created the object yet, create it
		if (typeof (mainGraphic[chartToDraw]) == "undefined") mainGraphic[chartToDraw] = {};

		//If we haven't created the left chart yet, create it
		if (mainGraphic[chartToDraw].left) {} else {
			mainGraphic[chartToDraw].left = new Raphael.fn.barchart(chartData, ops[chartNumber].left);
		}

		//If we haven't created the right chart yet, create it
		if (mainGraphic[chartToDraw].right) {} else {
			mainGraphic[chartToDraw].right = new Raphael.fn.barchart(chartData2, ops[chartNumber].right);
		}

		var slideMin = mainGraphic.minYear;
		var slideMax = mainGraphic.maxYear;
		
		//Calculate percentage along slider
		if (!ui.values) var leftPercent = ((ui.value - slideMin) / (slideMax - slideMin));
		else {
			var leftPercent = ((ui.values[0] - slideMin) / (slideMax - slideMin));
			var rightPercent = ((ui.values[1] - slideMin) / (slideMax - slideMin));
		}
		
		//Position handle based on percentage
		var leftPixels = leftPercent * $("#slide" + chartNumber + "slider").width() - 40;
		var rightPixels = rightPercent * $("#slide" + chartNumber + "slider").width() - 40;
	 
		if (!ui.values) {
			$("#chart" + chartToDraw + "_upperSliderText").text(ui.value);
		} else {
			$("#chart" + chartToDraw + "_lowerSliderText").text(ui.values[0]);
			$("#chart" + chartToDraw + "_upperSliderText").text(ui.values[1]);
		}

		
		mainGraphic.tryDraw(
			[mainGraphic[chartToDraw].left, mainGraphic[chartToDraw].right], 
			[mainGraphic.canvases["slide" + chartToDraw + "left"], mainGraphic.canvases["slide" + chartToDraw + "right"]], 
			"slide" + chartToDraw, 
			[chartData.data, chartData2.data], 
			[ops[chartNumber].left, ops[chartNumber].right]
		);
		
		
	} catch (ex) {
		console.log(ex);
	}
};
	