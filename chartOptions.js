// JavaScript Document

mainGraphic.getChartOptionsObj = function() {
	var ops = [];
	
	ops[1] = {};
	ops[1].left = {
		chartWidth: 403,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: .12,
			right: .02
		},
		gridOps: {
			label_percent: true,
			label_commas: false
		}
	
	};
	ops[1].right = {
		chartWidth: 81,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: 0,
			right: .05
		},
		gridOps: {
			label_hidden: true,
			label_percent: true,
			label_commas: false
		}
	};
	
	ops[2] = {};
	ops[2].left = {
		chartWidth: 403,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: .12,
			right: .02
		},
		gridOps: {
			label_percent: false,
			label_commas: true,
			label_prefix: "$",
			label_divideBy: 1000,
			label_appendix: "K"
		}
	
	};
	ops[2].right = {
		chartWidth: 81,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: 0,
			right: .05
		},
		gridOps: {
			label_hidden: true,
			label_percent: false,
			label_commas: true,
			label_prefix: "$"
		}
	};
	
	ops[3] = {};
	ops[3].left = {
		chartWidth: 403,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: .12,
			right: .02
		},
		gridOps: {
			label_percent: true,
			label_commas: false
		}
	
	};
	ops[3].right = {
		chartWidth: 81,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: 0,
			right: .05
		},
		gridOps: {
			label_hidden: true,
			label_percent: false
		}
	
	};
	
	ops[4] = {};
	ops[4].left = {
		chartWidth: 403,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: .12,
			right: .02
		},
		gridOps: {
			label_percent: true,
			label_commas: true
		}
	
	};
	ops[4].right = {
		chartWidth: 81,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: 0,
			right: .05
		},
		gridOps: {
			label_hidden: true,
			label_percent: true
		}
	
	};
	
	ops[5] = {};
	ops[5].left = {
		chartWidth: 403,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: .12,
			right: .02
		},
		gridOps: {
			label_percent: true,
			label_commas: true
		}
	
	};
	ops[5].right = {
		chartWidth: 81,
		chartHeight: 252,
		barStyle: "normal",
		barWidthPercent: .8,
		"font-family": "myriad-pro-condensed, sans-serif",
		fontSize: 16,
		graphMargins: {
			left: 0,
			right: .05
		},
		gridOps: {
			label_hidden: true,
			label_percent: true
		}
	
	};
	
	return ops;

}