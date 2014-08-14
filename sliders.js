// JavaScript Document

mainGraphic.applySliderConfig = function() {
	$("#slide1slider").slider({
		range: false,
		min: mainGraphic.minYear,
		max: mainGraphic.maxYear,
		value: mainGraphic.minYear, 
		step: 1,
		start: mainGraphic.pauseEverything,
		slide: function (event, ui) {
			mainGraphic.sliderChangeFunction(event, ui, 1);
		}
	});
	
	 $("#slide2slider").slider({
		range: true,
		min: mainGraphic.minYear,
		max: mainGraphic.maxYear,
		values: [mainGraphic.minYear, mainGraphic.minYear],
		step: 1,
		start: mainGraphic.pauseEverything,
		slide: function (event, ui) {
			mainGraphic.sliderChangeFunction(event, ui, 2);
		}
	});
	
	$("#slide3slider").slider({
		range: true,
		min: mainGraphic.minYear,
		max: mainGraphic.maxYear,
		values: [mainGraphic.minYear, mainGraphic.minYear],
		step: 1,
		start: mainGraphic.pauseEverything,
		slide: function (event, ui) {
			mainGraphic.sliderChangeFunction(event, ui, 3);
		}
	});
	
	$("#slide4slider").slider({
		range: true,
		min: mainGraphic.minYear,
		max: mainGraphic.maxYear,
		values: [mainGraphic.minYear, mainGraphic.minYear],
		step: 1,
		start: mainGraphic.pauseEverything,
		slide: function (event, ui) {
			mainGraphic.sliderChangeFunction(event, ui, 4);
		}
	});
};