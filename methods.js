// JavaScript Document

var mainGraphic = {};

mainGraphic.event_fire = function(eventParams) {
	try {
		function popup() {
			var year = eventParams[2];
			if (mainGraphic.textConfig[eventParams[0]]["popup"]) {
				var text = mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]]["popup"]];
				mainGraphic.popupsShown[eventParams[0]] = true;
				$("#popup #textDiv").html(text);
				mainGraphic.changeSlide(eventParams[0]);
				
				
				$("#slide" + eventParams[0] + "title .animateInner").html(mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]][year][0]]);
				$("#slide" + eventParams[0] + "body .animateInner").html(mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]][year][1]]);
				$("#popup").fadeIn(100);
			} else {
				continueEvents();	
			}
		}
		function continueEvents() {
			mainGraphic.sliderChangeFunction(null,{values:[eventParams[1],eventParams[2]],value:eventParams[2]},eventParams[0]);
			
			if (mainGraphic.eventIndex < eventSequence.length-1) {
				
				mainGraphic.mainGlobalEventTimer = setTimeout(function() {
					mainGraphic.event_fire(eventSequence[mainGraphic.eventIndex])
				},eventParams[3]*1000);
				mainGraphic.eventIndex++;
			}
			
			if (eventParams[4]) {
				eventParams[4]();	
			}
		}
		if (eventSequence[mainGraphic.eventIndex-1]) {
			if ((eventSequence[mainGraphic.eventIndex][0] == eventSequence[mainGraphic.eventIndex-1][0]) || mainGraphic.popupsShown[eventParams[0]]) {
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

mainGraphic.changeSlide = function(slideClicked) {
	if ($("#slide" + slideClicked).is(":visible")) {
		
	} else {
		
		$(".chartSlide").fadeOut(200);
		if (mainGraphic.mode == "story") {
			$('.slideSelector').removeClass("selected");
			$("#selectSlide" + slideClicked).addClass("selected");
		}
		if (slideClicked==5) mainGraphic.enterExploreMode();
		$("#slide" + slideClicked).fadeIn(200, function () {
			var chartNumber = this.id.slice(5);
			if (mainGraphic.chartDrawn[chartNumber] == false) {
				mainGraphic.sliderChangeFunction(null, {
					value: mainGraphic.minYear,
					values: [mainGraphic.minYear, mainGraphic.maxYear]
				}, this.id.slice(5));
			}
		});
		
		//This is an admittedly highly dense and convoluted way to determine the number of a|b|c|d things
		//to display (called circle selectors because that's what they used to be), so I'm adding a note here
		//to explain what this is, despite my generally lousy commenting habits
		var maxCircles = 0;
		for (var year = mainGraphic.minYear;year <= mainGraphic.maxYear;year++) {
			if (mainGraphic.textConfig[slideClicked][year]) {
				if (mainGraphic.textConfig[slideClicked][year][2]) {
					maxCircles = Math.max(mainGraphic.textConfig[slideClicked][year][2],maxCircles);	
				}
			}
		}
		$(".circleSelector").hide();
		for (var i=1;i<=maxCircles;i++) {
			$("#circleSelectArea #circle" + i).show();
		}
	}
};

mainGraphic.hideBlurbs = function() {
	$(".chartDescHeader, .chartDescBody").hide();
	$(".vertical_divider").css("top","70px");
	$(".circleSelector").css("visibility","hidden");	
};

mainGraphic.showBlurbs = function() {
	if (mainGraphic.mode == "story") {
		$(".chartDescHeader, .chartDescBody").show();
		$(".vertical_divider").css("top","270px");
		$(".circleSelector").css("visibility","visible");
	}
};

mainGraphic.tryDraw = function(barChartObjects, barChartCanvases, timerID, dataArrs, dataOptionsArrs) {
	try {
		clearTimeout(mainGraphic.timers[timerID]);
		var inMotion = false;
		for (var barChartIndex = 0; barChartIndex < barChartObjects.length; barChartIndex++) {
			if (barChartObjects[barChartIndex].inMotion == true) {
				inMotion = true;
			}
		}
		
		if (inMotion == false) {
			clearTimeout(mainGraphic.timers[timerID]);
			for (var barChartIndex = 0; barChartIndex < barChartObjects.length; barChartIndex++) {
				
				barChartObjects[barChartIndex].updateData(dataArrs[barChartIndex], dataOptionsArrs[barChartIndex]);
				
				barChartObjects[barChartIndex].draw(barChartCanvases[barChartIndex], 200);
				
			}
		} else {
			mainGraphic.timers[timerID] = setTimeout(function () {
				mainGraphic.tryDraw(barChartObjects, barChartCanvases, timerID, dataArrs, dataOptionsArrs);
			}, 20);
		}
	} catch (ex) {
		console.log("Error in mainGraphic.tryDraw(): " + ex);	
	}
};

mainGraphic.pauseEverything = function() {
	if (mainGraphic.playingStarted==true) {
		$("#playPauseArea img").attr("src",$("#playPauseArea img").attr("src").replace("pause","play"));
		clearTimeout(mainGraphic.mainGlobalEventTimer);
		mainGraphic.playing = false;	
	} 
};

mainGraphic.showPlay = function() {
	mainGraphic.playingStarted=true;
	$("#outermost #playPauseArea, #outermost #restartArea").css("visibility","visible");
};

mainGraphic.showsOver = function() {
	mainGraphic.popupsShown = [];
	mainGraphic.eventIndex=0;
	mainGraphic.pauseEverything();
	$("#playPauseArea").hide();
};

mainGraphic.enterExploreMode = function() {
	mainGraphic.mode = "explore";
	mainGraphic.hideBlurbs();
	$("#playPauseArea, #restartArea").hide();
	$(".exploreSelector").show();
};

mainGraphic.enterStoryMode = function() {
	mainGraphic.mode = "story";
	mainGraphic.showBlurbs();	
	$("#playPauseArea, #restartArea").show();
	$(".exploreSelector").hide();
};

mainGraphic.sliderChangeFunction = function (event, ui, chartNumber) {
	try {
		mainGraphic.chartDrawn[chartNumber] = true;
		var years = [];
		for (var entry in mainGraphic.textConfig[chartNumber]) {
			years.push(entry*1);	
		}
		years.sort();
		var yearToUse = years[0];
		for (var yearIndex=0;yearIndex<years.length;yearIndex++) {
			if (chartNumber == 1) {
				if (ui.value >=years[yearIndex]) {
					yearToUse = years[yearIndex];	
				}
			} else {
				if (ui.values[1] >= years[yearIndex]) {
					yearToUse = years[yearIndex];
				}
			}
		}
		mainGraphic.changeSlide(chartNumber);
	
		function slideText(text, selector) {
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
		
		slideText(mainGraphic.textSnippets[mainGraphic.textConfig[chartNumber][yearToUse][0]],"#slide" + chartNumber + "title");
		slideText(mainGraphic.textSnippets[mainGraphic.textConfig[chartNumber][yearToUse][1]],"#slide" + chartNumber + "body");
		
		$("#circle" + mainGraphic.textConfig[chartNumber][yearToUse][2]).addClass("selected");
		
		if (chartNumber == 1) $("#slide" + chartNumber + "slider").slider('value',ui.value);
		else $("#slide" + chartNumber + "slider").slider('values',[ui.values[0],ui.values[1]]);
		
		
		chartNumber = chartNumber * 1;
		
		var gData = assignData(ui);
		var chartData = gData[chartNumber].data1;
		var chartData2 = gData[chartNumber].data2;
		mainGraphic.customMax = gData[chartNumber].customMax;
		mainGraphic.customMin = gData[chartNumber].customMin;
		
		var ops = getChartOptionsObj();
		ops[chartNumber].left.yMax = mainGraphic.customMax;
		ops[chartNumber].left.yMin = mainGraphic.customMin;
		ops[chartNumber].right.yMax = mainGraphic.customMax;
		ops[chartNumber].right.yMin = mainGraphic.customMin;

		if (typeof (mainGraphic[chartNumber]) == "undefined") mainGraphic[chartNumber] = {};

		if (mainGraphic[chartNumber].left) {} else {
			mainGraphic[chartNumber].left = new Raphael.fn.barchart(chartData, ops[chartNumber].left);
		}

		if (mainGraphic[chartNumber].right) {} else {
			mainGraphic[chartNumber].right = new Raphael.fn.barchart(chartData2, ops[chartNumber].right);
		}

		var slideMin = mainGraphic.minYear;
		var slideMax = mainGraphic.maxYear;
		if (chartNumber == 1) var leftPercent = ((ui.value - slideMin) / (slideMax - slideMin));
		else {
			var leftPercent = ((ui.values[0] - slideMin) / (slideMax - slideMin));
			var rightPercent = ((ui.values[1] - slideMin) / (slideMax - slideMin));
		}
		var leftPixels = leftPercent * $("#slide" + chartNumber + "slider").width() - 40;
		var rightPixels = rightPercent * $("#slide" + chartNumber + "slider").width() - 40;
	 
		if (chartNumber == 1) {
			$("#chart" + chartNumber + "_upperSliderText").text(ui.value);
		} else {
			$("#chart" + chartNumber + "_lowerSliderText").text(ui.values[0]);
			$("#chart" + chartNumber + "_upperSliderText").text(ui.values[1]);
		}
		
		mainGraphic.tryDraw([mainGraphic[chartNumber].left, mainGraphic[chartNumber].right], [mainGraphic.canvases["slide" + chartNumber + "left"], mainGraphic.canvases["slide" + chartNumber + "right"]], "slide" + chartNumber, [chartData.data, chartData2.data], [ops[chartNumber].left, ops[chartNumber].right]);
	} catch (ex) {
		console.log(ex);
	}
}
	