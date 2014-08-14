try {
	var loadTime = Date.now();
	$(document).ready(function () {
	
		//Keep track of which charts are drawn.
		mainGraphic.chartDrawn = [];
		mainGraphic.chartDrawn[1] = false;
		mainGraphic.chartDrawn[2] = false;
		mainGraphic.chartDrawn[3] = false;
		mainGraphic.chartDrawn[4] = false;
		
		//The graphic is initially paused.
		mainGraphic.playing = false;
		
		//There are two basic modes of operation - "story" and "explore"
		mainGraphic.mode = "story";
		
		//Control start/end year
		mainGraphic.minYear = 1979;
		mainGraphic.maxYear = 2010;
		
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
		assignTextSnippets(mainGraphic);
		
		//Load event data into graphic object from data.js
		var eventSequence = createEventSequence(mainGraphic);
		
		//Loads configuration objects from sliders.js
		mainGraphic.applySliderConfig();
		
		//Store all event timers in their own object
		mainGraphic.timers = {};
		
		//Will keep track (by CSS selector) of text divs that are currently sliding
		mainGraphic.textSliding = {};
		mainGraphic.textSlidingTimer = {};
		
		//Edit the slider objects (created by jQuery UI) a bit to control styling.
		var sliderHandles;
		for (chartIndex = 1; chartIndex <= 4; chartIndex++) {
		
			//Get slider handles of current slide
			sliderHandles = $("#slide" + chartIndex + "slider .ui-slider-handle");
			
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
		
		//Stores references to the Raphael canvases.
		mainGraphic.canvases = {};
		mainGraphic.canvases["slide1left"] = Raphael("slide1Canvas", 403, 252);
		mainGraphic.canvases["slide1right"] = Raphael("slide1RightCanvas", 81, 252);
		mainGraphic.canvases["slide2left"] = Raphael("slide2Canvas", 403, 252);
		mainGraphic.canvases["slide2right"] = Raphael("slide2RightCanvas", 81, 252);
		mainGraphic.canvases["slide3left"] = Raphael("slide3Canvas", 403, 252);
		mainGraphic.canvases["slide3right"] = Raphael("slide3RightCanvas", 81, 252);
		mainGraphic.canvases["slide4left"] = Raphael("slide4Canvas", 403, 252);
		mainGraphic.canvases["slide4right"] = Raphael("slide4RightCanvas", 81, 252);
		
		
		//Assign some handlers
		$("#closePopup").click(function() {
			try {
				$("#popup").fadeOut(100);
				mainGraphic.event_fire(eventSequence[mainGraphic.eventIndex]);
				$("#playPauseArea").show();
				$("#playPauseArea img").attr("src","pause_light.png");
			} catch (ex) {
				console.log(ex);	
			}
		});
					
		$("#selectSlide0, #selectSlide5").click(function () {
			if (!mainGraphic.playing) {
				this.slideClicked = this.id.slice(11);
				mainGraphic.changeSlide(this.slideClicked);
				mainGraphic.hideBlurbs();
			}
		});
		
		$(".exploreSelector").change(function() {
			var slide = $(this).val();
			mainGraphic.changeSlide(slide);
		});
		
		$("#playPauseArea img, #restartArea img").hover(function() {
			$(this).attr("src",$(this).attr("src").replace("light","dark"));
		});
		$("#playPauseArea img, #restartArea img").mouseout(function() {
			$(this).attr("src",$(this).attr("src").replace("dark","light"));
		});
		$("#playPauseArea img").click(function() {
			if (mainGraphic.playing==true) {
				$(this).attr("src",$(this).attr("src").replace("pause","play"));
				clearTimeout(mainGraphic.mainGlobalEventTimer);
				mainGraphic.playing = false;
			} else {
				$(this).attr("src",$(this).attr("src").replace("play","pause"));
				mainGraphic.event_fire(eventSequence[mainGraphic.eventIndex]);
				mainGraphic.playing = true;	
				mainGraphic.showBlurbs();
			}
			
		});
		
		$("#restartArea").click(function() {
			clearTimeout(mainGraphic.mainGlobalEventTimer);
			mainGraphic.playing = false;
			$("#playPauseArea").css("visibility","hidden");
			$("#restartArea").css("visibility","hidden");
			mainGraphic.showsOver();
			
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
			mainGraphic.showsOver();
			mainGraphic.playing = true;
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