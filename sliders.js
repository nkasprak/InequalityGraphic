// JavaScript Document

mainGraphic.applySliderConfig = function() {
	
	mainGraphic.sliderConfigs = {
		1: {
			range: false,
			min: mainGraphic.minYear,
			max: mainGraphic.maxYear,
			value: mainGraphic.minYear, 
			step: 1,
			start: mainGraphic.pauseEverything,
			slide: function (event, ui) {
				mainGraphic.sliderChangeFunction(event, ui, 1);
			}
		},
		2: {
			range: true,
			min: mainGraphic.minYear,
			max: mainGraphic.maxYear,
			values: [mainGraphic.minYear, mainGraphic.maxYear],
			step: 1,
			start: mainGraphic.pauseEverything,
			slide: function (event, ui) {
				mainGraphic.sliderChangeFunction(event, ui, 2);
			},
		},
		3: {
			range: true,
			min: mainGraphic.minYear,
			max: mainGraphic.maxYear,
			values: [mainGraphic.minYear, mainGraphic.maxYear],
			step: 1,
			start: mainGraphic.pauseEverything,
			slide: function (event, ui) {
				mainGraphic.sliderChangeFunction(event, ui, 3);
			}
		},
		4: {
			range: true,
			min: mainGraphic.minYear,
			max: mainGraphic.maxYear,
			values: [mainGraphic.minYear, mainGraphic.maxYear],
			step: 1,
			start: mainGraphic.pauseEverything,
			slide: function (event, ui) {
				mainGraphic.sliderChangeFunction(event, ui, 4);
			}	
		},
		5: {
			range: false,
			min: mainGraphic.minYear,
			max: mainGraphic.maxYear,
			value: mainGraphic.minYear, 
			step: 1,
			start: mainGraphic.pauseEverything,
			slide: function (event, ui) {
				mainGraphic.sliderChangeFunction(event, ui, 5);
			}	
		}
	};
	
	for (var i = 1;i<=5;i++) {
		$("#slide" + i + "slider").slider(mainGraphic.sliderConfigs[i]);
	}
};