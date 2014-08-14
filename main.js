try {
	var loadTime = Date.now();
	$(document).ready(function () {
	
		mainGraphic.chartDrawn = [];
		mainGraphic.chartDrawn[1] = false;
		mainGraphic.chartDrawn[2] = false;
		mainGraphic.chartDrawn[3] = false;
		mainGraphic.chartDrawn[4] = false;
		mainGraphic.playing = false;
		mainGraphic.mode = "story";
		mainGraphic.playingStarted=false;
		mainGraphic.popupsShown = [];
		
		mainGraphic.canvases = {};
		mainGraphic.canvases["slide1left"] = Raphael("slide1Canvas", 403, 252);
		mainGraphic.canvases["slide1right"] = Raphael("slide1RightCanvas", 81, 252);
		mainGraphic.canvases["slide2left"] = Raphael("slide2Canvas", 403, 252);
		mainGraphic.canvases["slide2right"] = Raphael("slide2RightCanvas", 81, 252);
		mainGraphic.canvases["slide3left"] = Raphael("slide3Canvas", 403, 252);
		mainGraphic.canvases["slide3right"] = Raphael("slide3RightCanvas", 81, 252);
		mainGraphic.canvases["slide4left"] = Raphael("slide4Canvas", 403, 252);
		mainGraphic.canvases["slide4right"] = Raphael("slide4RightCanvas", 81, 252);
		mainGraphic.minYear = 1979;
		mainGraphic.maxYear = 2010;
		mainGraphic.charts = [];
		mainGraphic.eventIndex=0;
		
		assignTextSnippets(mainGraphic);
		var eventSequence = createEventSequence(mainGraphic);
		
		$("#slide0 table td img").click(function() {
			var slideID = $(this).attr("src").replace(".png","").replace("thumb","");
			mainGraphic.changeSlide(slideID);
			mainGraphic.hideBlurbs();
			mainGraphic.playing = false;
		});
		
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

		mainGraphic.timers = {};
		mainGraphic.textSliding = {};
		mainGraphic.textSlidingTimer = {};
		
		mainGraphic.applySliderConfig();
		
		var sliderHandles;
		
		for (chartIndex = 1; chartIndex <= 4; chartIndex++) {
			try {
				var sliderHandles = $("#slide" + chartIndex + "slider .ui-slider-handle");
				if (sliderHandles.length == 1) {
					 $(sliderHandles[0]).attr("id", "slide" + chartIndex + "slider_upperHandle");
					 $(sliderHandles[0]).html('<div class="upperSliderHandle sliderHandle" id="chart' + chartIndex + '_upperSliderHandle"><div class="sliderLegendBox"></div><div id="chart' + chartIndex + '_upperSliderText" class="sliderText">' + mainGraphic.maxYear + '</div></div>');
					} else {
					$(sliderHandles[0]).attr("id", "slide" + chartIndex + "slider_lowerHandle");
					$(sliderHandles[0]).html('<div class="lowerSliderHandle sliderHandle" id="chart' + chartIndex + '_lowerSliderHandle"><div class="sliderLegendBox"><div id="chart' + chartIndex + '_lowerSliderText" class="sliderText">' + mainGraphic.minYear + '</div></div>');
					$(sliderHandles[1]).attr("id", "slide" + chartIndex + "slider_upperHandle");
					$(sliderHandles[1]).html('<div class="upperSliderHandle sliderHandle" id="chart' + chartIndex + '_upperSliderHandle"><div class="sliderLegendBox"><div id="chart' + chartIndex + '_upperSliderText" class="sliderText">' + mainGraphic.maxYear + '</div></div>');
				}
			} catch (ex) {
				console.log(ex);	
			}
	
		}
		
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