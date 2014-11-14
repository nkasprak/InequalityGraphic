try {
	var loadTime = Date.now();
	$(document).ready(function () {
		
		
	
		//Keep track of which charts are drawn.
		mainGraphic.chartDrawn = [];
		mainGraphic.chartDrawn[1] = false;
		mainGraphic.chartDrawn[2] = false;
		mainGraphic.chartDrawn[3] = false;
		mainGraphic.chartDrawn[4] = false;
		
		mainGraphic.activeSlide = 0;
		
		//The graphic is initially paused.
		mainGraphic.playing = false;
		
		//There are two basic modes of operation - "story" and "explore"
		mainGraphic.mode = "explore";
		
		//Control start/end year
		mainGraphic.minYear = 1979;
		mainGraphic.maxYear = 2011;
		
		function drawSliderLines() {
			for (var year=mainGraphic.minYear;year<=mainGraphic.maxYear;year++) {
				var percent = Math.round((year-mainGraphic.minYear)/(mainGraphic.maxYear-mainGraphic.minYear)*1000)/10;
				var style = "left:" + percent + "%";
				if (year%5==0) {
					style += ";height:10px;top:-5px;"
				} 
				if ($.inArray(year,[1980,1990,2000,2010]) >= 0) {
					$(".yearSliderAutoGen .hLine").append("<div class=\"yLabel\" style=\"left:" + percent + "%\"><div>" + year + "</div></div>");
				}
				
				$(".yearSliderAutoGen .hLine").append("<div class=\"vLine\" style=\"" + style + "\">");
			}
		}
		function makeYearSelector() {
			for (var year=1978;year<=2013;year++) {
				$("#yearSelector").append("<option value=\"" + year + "\">" + year + "</option>");
			}
		}
	
		makeYearSelector();
	
		drawSliderLines();
		
		//Gets set to true once the "tell the story" button is clicked and keeps track of
		//whether the play/pause/restart buttons are visible.
		mainGraphic.playingStarted=false;
		
		//Tracks whether there's a pop-up dialog being shown.
		mainGraphic.popupsShown = [];
		
		//Will store chart objects.
		mainGraphic.charts = [];
		
		//Begin at the beginning.
		mainGraphic.eventIndex=0;
		
		//Load text snippes into graphic object from text.js file
		mainGraphic.assignTextSnippets();
		
		//Load event data into graphic object from data.js
		mainGraphic.eventSequence = mainGraphic.createEventSequence();
		var eventSequence = mainGraphic.eventSequence;
		
		//Loads configuration objects from sliders.js
		mainGraphic.applySliderConfig();
		
		//Store all event timers in their own object
		mainGraphic.timers = {};
		
		//Will keep track (by CSS selector) of text divs that are currently sliding
		mainGraphic.textSliding = {};
		mainGraphic.textSlidingTimer = {};
		
		mainGraphic.introAllowed = true;
		
		for (var chartIndex = 1; chartIndex <= 5; chartIndex++) {
			mainGraphic.styleSliderHandles(chartIndex);
		}
		
		//Stores references to the Raphael canvases.
		mainGraphic.canvases = {};
		for (chartIndex = 1;chartIndex <=5;chartIndex++) {
			mainGraphic.canvases["slide" + chartIndex + "left"] = Raphael("slide" + chartIndex + "Canvas", 403, 252);
			mainGraphic.canvases["slide" + chartIndex + "right"] = Raphael("slide" + chartIndex + "RightCanvas", 81, 252);
		}
		
		
		//Assign some handlers
		$(".closePopup").click(function() {
			try {
				mainGraphic.introAllowed = true;
				$(".popup").fadeOut(100);
				mainGraphic.enableSlider();
				mainGraphic.event_fire(eventSequence[mainGraphic.eventIndex]);
				$("#playPauseArea").show();
				$("#playPauseArea img").attr("src","pause_light.png");
			} catch (ex) {
				console.log(ex);	
			}
		});
					
		$(".slideSelector").click(function () {
			this.slideClicked = this.id.slice(11);
			if (!mainGraphic.introAllowed && this.slideClicked == 0) return false;
			if (mainGraphic.mode == "explore" && (this.slideClicked != 0 && this.slideClicked != 5)) {
				return false;
			}
			
			if (!mainGraphic.playing) {
				mainGraphic.changeSlide(this.slideClicked);
				mainGraphic.hideBlurbs();
			}
			if (this.slideClicked == 0) {
				
				$("#restartArea").trigger("click");
				$("#outermost #restartArea").show();
				mainGraphic.mode = "explore";	
			}
		});
		
		$("#exploreButton").click(function() {
			$("#selectSlide5").trigger("click");
		});
		
		$(".exploreSelector").change(function() {

			mainGraphic.mode = "explore";
			var chartNumber = $(this).val();
			if (mainGraphic[5]) {
				delete(mainGraphic[5].left);
				delete(mainGraphic[5].right);
			}
			$("#slide5Canvas, #slide5RightCanvas").html("");
			
			mainGraphic.canvases["slide5left"] = Raphael("slide5Canvas", 403, 252);
			mainGraphic.canvases["slide5right"] = Raphael("slide5RightCanvas", 81, 252);
			

			$("#slide5slider").remove();
			
			$("#slide5 .sliderContainer").append("<div id=\"slide5slider\" class=\"yearSlider\">");
			$("#slide5slider").slider(mainGraphic.sliderConfigs[chartNumber]);
			mainGraphic.styleSliderHandles(5);
			
			if ($("#slide5slider a").length > 1) {
				$("#slide5slider").slider("values",[mainGraphic.minYear,mainGraphic.maxYear]);
			}
			
			mainGraphic.initializeChartAfterSwitch(chartNumber);
			
			
		});
		
		$("#slide5slider").slider(mainGraphic.sliderConfigs[1]);
		
		$("#playPauseArea img, #restartArea img").hover(function() {
			$(this).attr("src",$(this).attr("src").replace("light","dark"));
		});
		$("#playPauseArea img, #restartArea img").mouseout(function() {
			$(this).attr("src",$(this).attr("src").replace("dark","light"));
		});
		
		
		$("#playPauseArea img").click(function() {
			if (mainGraphic.playing==true) {
				
				//Pause
				mainGraphic.hitPlay();
				
			} else {
				
				//Play
				mainGraphic.hitPause();
			}
			
		});
		
		$("#restartArea").click(function() {
			clearTimeout(mainGraphic.mainGlobalEventTimer);
			mainGraphic.playing = false;
			$("#playPauseArea").css("visibility","hidden");
			$("#restartArea").css("visibility","hidden");
			mainGraphic.showsOver();
			mainGraphic.mode="explore";
			var uiObj = {values: [mainGraphic.minYear, mainGraphic.minYear],value:mainGraphic.minYear};
			
			mainGraphic.chartDrawn[1] = false;
			mainGraphic.chartDrawn[2] = false;
			mainGraphic.chartDrawn[3] = false;
			mainGraphic.chartDrawn[4] = false;
			$("#playPauseArea").show();
			
			setTimeout(function() {
				mainGraphic.changeSlide(0);
			},200);
		});
		
		
		$(".chartSlide").hide();
		$(".chartSlide").css({
			"visibility": "visible"
		});
		
		$(".beginStory").click(function() {
			mainGraphic.introAllowed = false;
			mainGraphic.showsOver();
			mainGraphic.disableSlider();
			mainGraphic.playing = true;
			mainGraphic.mode = "story";
			mainGraphic.chartDrawn[1] = false;
			mainGraphic.chartDrawn[2] = false;
			mainGraphic.chartDrawn[3] = false;
			mainGraphic.chartDrawn[4] = false;
			mainGraphic.showBlurbs();
			mainGraphic.event_fire(eventSequence[mainGraphic.eventIndex]);
		});
		
		mainGraphic.changeSlide(0);
	});

} catch (ex) {
    console.log(ex);
}