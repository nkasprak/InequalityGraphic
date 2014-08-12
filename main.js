
try {

var loadTime = Date.now();


$(document).ready(function () {

var mainGraphic = {};

mainGraphic.chartDrawn = [];
mainGraphic.chartDrawn[1] = false;
mainGraphic.chartDrawn[2] = false;
mainGraphic.chartDrawn[3] = false;
mainGraphic.chartDrawn[4] = false;
mainGraphic.playing = false;


mainGraphic.textSnippets = [];

mainGraphic.textSnippets[1] = "";
mainGraphic.textSnippets[2] = "These data show the percentage changes in after-tax income for each fifth of the income distribution and the top 1 percent, since 1979. Since 1979, the top 1 percent’s income has grown explosively, while incomes of other households have grown much more slowly.";
mainGraphic.textSnippets[3] = "Income inequality skyrocketed between 1979 and 2007";
mainGraphic.textSnippets[4] = "";

mainGraphic.textSnippets[5] = "Incomes at the top fell sharply in 2008 and 2009 due to the recession and financial crisis.";
//mainGraphic.textSnippets[6] = "Wealthy households receive much more of their income from capital gains (like selling stocks at a profit), and they can experience larger swings in their income as the stock market rides up and down.  Incomes at the top fell sharply in 2008 and 2009 due to the recession and financial crisis.  But even after those losses, the increase in the average income of the top 1 percent of households from 1979 to 2009 were still much larger than that of the middle 60 percent and bottom 20 percent.";

mainGraphic.textSnippets[7] = "Income inequality has rebounded with the economic recovery";
mainGraphic.textSnippets[8] = "While the top’s upward march of income hit speed bumps from the dot com collapse and the 2008 financial crisis, it appears to be gaining speed once again as the economy recovers.";

mainGraphic.textSnippets[9] = "The growth of income inequality - in dollars";
mainGraphic.textSnippets[10] = "Between 1979 and 2010, average after-tax income grew from about $340,000 to $1,013,000 for the top 1 percent of households and from $43,000 to $58,000 for the average middle-income household.";

mainGraphic.textSnippets[11] = "The top 1 percent is getting a larger share of total after-tax income";
mainGraphic.textSnippets[12] = "";
//mainGraphic.textSnippets[13] = "By 2010, the top 1 percent of households in 2010 had more annual income than the bottom 20 percent of households, and more annual income than the second 20 percent of households.";

mainGraphic.textSnippets[14] = "Federal taxes do less to push against growing income inequality than they used to";
mainGraphic.textSnippets[15] = "While federal taxes (income, payroll, and other taxes) have remained progressive overall, average federal tax rates fell for all income groups between 1979 and 2007 — one reason why federal taxes reduced inequality less in 2007 than in 1979.";
//mainGraphic.textSnippets[16] = 'However, average federal tax rates have declined for all income groups between 1979 and 2007. This is one of the reasons why the federal tax system did <a href="http://www.offthechartsblog.org/why-the-tax-system-is-doing-less-about-growing-inequality/">less to push against growing income inequality in 2007 than it did in 1979.</a>';

mainGraphic.textSnippets[17] = "Policymakers enacted temporary tax cuts during the recession and recovery to support the economy.";
//mainGraphic.textSnippets[18] = "During the recession and recovery, temporary tax cuts were enacted to support the economy.<br><br> (The Congressional Budget Office’s data do not yet extend to 2012 when these temporary measures expire, or to 2013, when parts of the high-income tax cuts first enacted under President Bush were allowed to expire.)";

mainGraphic.textConfig = [];
mainGraphic.textConfig[0] = {};
mainGraphic.textConfig[1] = {
					popup:2,
					1979:[1,4,1],
					1980:[3,4,2],
					2008:[5,4,3],
					2010:[7,4,4]
				};
mainGraphic.textConfig[2] = {
					1979:[9,10,1]
};
mainGraphic.textConfig[3] = {
					1979:[11,12,1],
					1980:[11,12,2]
};
mainGraphic.textConfig[4] = {
					1979:[14,15,1],
					1980:[14,15,2],
					2008:[17,15,3]
};

mainGraphic.playingStarted=false;
mainGraphic.popupsShown = [];
$("#closePopup").click(function() {
	try {
		$("#popup").fadeOut(100);
		event_fire(eventSequence[mainGraphic.eventIndex]);
		$("#playPauseArea").show();
		$("#playPauseArea img").attr("src","pause_light.png");
	} catch (ex) {
		console.log(ex);	
	}
});


function event_fire(eventParams) {
	try {
		function popup() {
			var year = eventParams[2];
			if (mainGraphic.textConfig[eventParams[0]]["popup"]) {
				var text = mainGraphic.textSnippets[mainGraphic.textConfig[eventParams[0]]["popup"]];
				mainGraphic.popupsShown[eventParams[0]] = true;
				$("#popup #textDiv").html(text);
				changeSlide(eventParams[0]);
				
				
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
					event_fire(eventSequence[mainGraphic.eventIndex])
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
}

function showPlay() {
	mainGraphic.playingStarted=true;
	$("#outermost #playPauseArea, #outermost #restartArea").css("visibility","visible");
}

function showsOver() {
	mainGraphic.popupsShown = [];
	mainGraphic.eventIndex=0;
	pauseEverything();
	$("#playPauseArea").hide();
}

var eventSequence = [	//slide, leftYear, rightYear, seconds
						[1,1979,1979,.1, showPlay],
						[1,1979,1980,.1],
						[1,1979,1981,.1],
						[1,1979,1982,.1],
						[1,1979,1983,.1],
						[1,1979,1984,.1],
						[1,1979,1985,.1],
						[1,1979,1986,.1],
						[1,1979,1987,.1],
						[1,1979,1988,.1],
						[1,1979,1989,.1],
						[1,1979,1990,.1],
						[1,1979,1991,.1],
						[1,1979,1992,.1],
						[1,1979,1993,.1],
						[1,1979,1994,.1],
						[1,1979,1995,.1],
						[1,1979,1996,.1],
						[1,1979,1997,.1],
						[1,1979,1998,.1],
						[1,1979,1999,.1],
						[1,1979,2000,.1],
						[1,1979,2001,.1],
						[1,1979,2002,.1],
						[1,1979,2003,.1],
						[1,1979,2004,.1],
						[1,1979,2005,.1],
						[1,1979,2006,.1],
						[1,1979,2007,5],
						[1,1979,2008,.1],
						[1,1979,2009,5],
						[1,1979,2010,5],
						
						[2,1979,1979,2],
						[2,1979,1980,.1],
						[2,1979,1981,.1],
						[2,1979,1982,.1],
						[2,1979,1983,.1],
						[2,1979,1984,.1],
						[2,1979,1985,.1],
						[2,1979,1986,.1],
						[2,1979,1987,.1],
						[2,1979,1988,.1],
						[2,1979,1989,.1],
						[2,1979,1990,.1],
						[2,1979,1991,.1],
						[2,1979,1992,.1],
						[2,1979,1993,.1],
						[2,1979,1994,.1],
						[2,1979,1995,.1],
						[2,1979,1996,.1],
						[2,1979,1997,.1],
						[2,1979,1998,.1],
						[2,1979,1999,.1],
						[2,1979,2000,.1],
						[2,1979,2001,.1],
						[2,1979,2002,.1],
						[2,1979,2003,.1],
						[2,1979,2004,.1],
						[2,1979,2005,.1],
						[2,1979,2006,.1],
						[2,1979,2007,.1],
						[2,1979,2008,.1],
						[2,1979,2009,.1],
						[2,1979,2010,3],
						
						[3,1979,1979,5],
						[3,1979,1980,.1],
						[3,1979,1981,.1],
						[3,1979,1982,.1],
						[3,1979,1983,.1],
						[3,1979,1984,.1],
						[3,1979,1985,.1],
						[3,1979,1986,.1],
						[3,1979,1987,.1],
						[3,1979,1988,.1],
						[3,1979,1989,.1],
						[3,1979,1990,.1],
						[3,1979,1991,.1],
						[3,1979,1992,.1],
						[3,1979,1993,.1],
						[3,1979,1994,.1],
						[3,1979,1995,.1],
						[3,1979,1996,.1],
						[3,1979,1997,.1],
						[3,1979,1998,.1],
						[3,1979,1999,.1],
						[3,1979,2000,.1],
						[3,1979,2001,.1],
						[3,1979,2002,.1],
						[3,1979,2003,.1],
						[3,1979,2004,.1],
						[3,1979,2005,.1],
						[3,1979,2006,.1],
						[3,1979,2007,.1],
						[3,1979,2008,.1],
						[3,1979,2009,.1],
						[3,1979,2010,3],
						
						[4,1979,1979,5],
						[4,1979,1980,.1],
						[4,1979,1981,.1],
						[4,1979,1982,.1],
						[4,1979,1983,.1],
						[4,1979,1984,.1],
						[4,1979,1985,.1],
						[4,1979,1986,.1],
						[4,1979,1987,.1],
						[4,1979,1988,.1],
						[4,1979,1989,.1],
						[4,1979,1990,.1],
						[4,1979,1991,.1],
						[4,1979,1992,.1],
						[4,1979,1993,.1],
						[4,1979,1994,.1],
						[4,1979,1995,.1],
						[4,1979,1996,.1],
						[4,1979,1997,.1],
						[4,1979,1998,.1],
						[4,1979,1999,.1],
						[4,1979,2000,.1],
						[4,1979,2001,.1],
						[4,1979,2002,.1],
						[4,1979,2003,.1],
						[4,1979,2004,.1],
						[4,1979,2005,.1],
						[4,1979,2006,.1],
						[4,1979,2007,5],
						[4,1979,2008,.1],
						[4,1979,2009,.1],
						[4,1979,2010,3,showsOver]
						
					];

$(".slideSelector").click(function () {
	if (!mainGraphic.playing) {
    this.slideClicked = this.id.slice(11);
    changeSlide(this.slideClicked);
	hideBlurbs();
	}
});

function changeSlide(slideClicked) {
	if ($("#slide" + slideClicked).is(":visible")) {
		
	} else {
		$(".chartSlide").fadeOut(200);
		$('.slideSelector').removeClass("selected");
		$("#selectSlide" + slideClicked).addClass("selected");
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
}

function hideBlurbs() {
	$(".chartDescHeader, .chartDescBody").hide();
	$(".vertical_divider").css("top","70px");
	$(".circleSelector").css("visibility","hidden");	
}

function showBlurbs() {
	$(".chartDescHeader, .chartDescBody").show();
	$(".vertical_divider").css("top","270px");
	$(".circleSelector").css("visibility","visible");
}

var ops = [];

ops[1] = {};
ops[1].left = {
    chartWidth: 403,
    chartHeight: 252,
    barStyle: "normal",
    barWidthPercent: .8,
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
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
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
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
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
    graphMargins: {
        left: .12,
        right: .02
    },
    gridOps: {
        label_percent: false,
        label_commas: true,
        label_prefix: "$"
    }

};
ops[2].right = {
    chartWidth: 81,
    chartHeight: 252,
    barStyle: "normal",
    barWidthPercent: .8,
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
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
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
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
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
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
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
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
    "font-family": "source-sans-pro, sans-serif",
    fontSize: 12,
    graphMargins: {
        left: 0,
        right: .05
    },
    gridOps: {
        label_hidden: true,
        label_percent: true
    }

};

    var cbodata = {};
	
	cbodata.percentGrowthIncome = [];
	cbodata.percentGrowthIncome[1979]=[0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000];
	cbodata.percentGrowthIncome[1980]=[-0.025,-0.033,-0.033,-0.031,-0.025,-0.027,-0.028,-0.023,-0.038,-0.015];
	cbodata.percentGrowthIncome[1981]=[-0.050,-0.047,-0.045,-0.027,-0.025,-0.027,-0.038,-0.026,-0.047,0.023];
	cbodata.percentGrowthIncome[1982]=[-0.063,-0.050,-0.047,-0.016,0.014,-0.004,-0.014,-0.007,-0.007,0.134];
	cbodata.percentGrowthIncome[1983]=[-0.094,-0.083,-0.056,-0.018,0.059,0.004,0.004,0.029,0.037,0.244];
	cbodata.percentGrowthIncome[1984]=[-0.069,-0.027,-0.007,0.032,0.145,0.057,0.065,0.109,0.123,0.372];
	cbodata.percentGrowthIncome[1985]=[-0.063,-0.037,-0.007,0.032,0.160,0.071,0.055,0.099,0.135,0.484];
	cbodata.percentGrowthIncome[1986]=[-0.050,-0.017,0.016,0.068,0.307,0.147,0.106,0.151,0.242,0.979];
	cbodata.percentGrowthIncome[1987]=[-0.044,-0.043,0.019,0.079,0.205,0.105,0.116,0.161,0.193,0.481];
	cbodata.percentGrowthIncome[1988]=[-0.019,-0.033,0.028,0.083,0.293,0.147,0.128,0.180,0.245,0.891];
	cbodata.percentGrowthIncome[1989]=[0.025,-0.010,0.040,0.097,0.295,0.161,0.146,0.205,0.270,0.781];
	cbodata.percentGrowthIncome[1990]=[0.063,0.020,0.047,0.088,0.267,0.157,0.133,0.183,0.238,0.726];
	cbodata.percentGrowthIncome[1991]=[0.082,0.010,0.038,0.083,0.220,0.134,0.119,0.171,0.211,0.526];
	cbodata.percentGrowthIncome[1992]=[0.094,0.020,0.045,0.095,0.270,0.166,0.136,0.197,0.254,0.707];
	cbodata.percentGrowthIncome[1993]=[0.113,0.037,0.054,0.104,0.253,0.164,0.150,0.202,0.247,0.559];
	cbodata.percentGrowthIncome[1994]=[0.138,0.043,0.059,0.118,0.268,0.174,0.166,0.215,0.268,0.574];
	cbodata.percentGrowthIncome[1995]=[0.182,0.093,0.096,0.142,0.324,0.220,0.199,0.246,0.328,0.742];
	cbodata.percentGrowthIncome[1996]=[0.182,0.103,0.115,0.169,0.394,0.262,0.224,0.295,0.378,0.929];
	cbodata.percentGrowthIncome[1997]=[0.201,0.127,0.131,0.194,0.481,0.314,0.248,0.338,0.470,1.261];
	cbodata.percentGrowthIncome[1998]=[0.252,0.180,0.171,0.246,0.590,0.388,0.302,0.397,0.555,1.625];
	cbodata.percentGrowthIncome[1999]=[0.277,0.217,0.209,0.284,0.684,0.451,0.350,0.452,0.619,1.855];
	cbodata.percentGrowthIncome[2000]=[0.239,0.210,0.214,0.305,0.768,0.484,0.380,0.498,0.666,2.155];
	cbodata.percentGrowthIncome[2001]=[0.296,0.257,0.263,0.320,0.639,0.449,0.387,0.475,0.601,1.525];
	cbodata.percentGrowthIncome[2002]=[0.270,0.237,0.246,0.309,0.577,0.407,0.384,0.461,0.551,1.242];
	cbodata.percentGrowthIncome[2003]=[0.270,0.247,0.261,0.339,0.653,0.447,0.420,0.512,0.628,1.441];
	cbodata.percentGrowthIncome[2004]=[0.302,0.287,0.308,0.388,0.798,0.530,0.475,0.570,0.723,1.931];
	cbodata.percentGrowthIncome[2005]=[0.346,0.317,0.326,0.409,0.940,0.606,0.506,0.633,0.847,2.534];
	cbodata.percentGrowthIncome[2006]=[0.390,0.330,0.338,0.434,1.024,0.658,0.542,0.673,0.902,2.848];
	cbodata.percentGrowthIncome[2007]=[0.447,0.377,0.380,0.474,1.121,0.717,0.573,0.724,0.986,3.140];
	cbodata.percentGrowthIncome[2008]=[0.478,0.373,0.378,0.469,0.946,0.631,0.570,0.682,0.848,2.384];
	cbodata.percentGrowthIncome[2009]=[0.484,0.367,0.362,0.451,0.779,0.556,0.546,0.651,0.748,1.621];
	cbodata.percentGrowthIncome[2010]=[0.491,0.367,0.359,0.447,0.853,0.583,0.542,0.671,0.792,2.018];

	
	
    cbodata.growthIncome = [];
    cbodata.growthIncome[1979]=[15900,30000,42600,55700,98100,47700,70500,85200,120100,335700];
	cbodata.growthIncome[1980]=[15500,29000,41200,54000,95600,46400,68500,83200,115500,330600];
	cbodata.growthIncome[1981]=[15100,28600,40700,54200,95600,46400,67800,83000,114400,343400];
	cbodata.growthIncome[1982]=[14900,28500,40600,54800,99500,47500,69500,84600,119200,380800];
	cbodata.growthIncome[1983]=[14400,27500,40200,54700,103900,47900,70800,87700,124500,417600];
	cbodata.growthIncome[1984]=[14800,29200,42300,57500,112300,50400,75100,94500,134900,460600];
	cbodata.growthIncome[1985]=[14900,28900,42300,57500,113800,51100,74400,93600,136300,498100];
	cbodata.growthIncome[1986]=[15100,29500,43300,59500,128200,54700,78000,98100,149200,664500];
	cbodata.growthIncome[1987]=[15200,28700,43400,60100,118200,52700,78700,98900,143300,497300];
	cbodata.growthIncome[1988]=[15600,29000,43800,60300,126800,54700,79500,100500,149500,634800];
	cbodata.growthIncome[1989]=[16300,29700,44300,61100,127000,55400,80800,102700,152500,597900];
	cbodata.growthIncome[1990]=[16900,30600,44600,60600,124300,55200,79900,100800,148700,579400];
	cbodata.growthIncome[1991]=[17200,30300,44200,60300,119700,54100,78900,99800,145500,512300];
	cbodata.growthIncome[1992]=[17400,30600,44500,61000,124600,55600,80100,102000,150600,573200];
	cbodata.growthIncome[1993]=[17700,31100,44900,61500,122900,55500,81100,102400,149800,523400];
	cbodata.growthIncome[1994]=[18100,31300,45100,62300,124400,56000,82200,103500,152300,528500];
	cbodata.growthIncome[1995]=[18800,32800,46700,63600,129900,58200,84500,106200,159500,584700];
	cbodata.growthIncome[1996]=[18800,33100,47500,65100,136800,60200,86300,110300,165500,647400];
	cbodata.growthIncome[1997]=[19100,33800,48200,66500,145300,62700,88000,114000,176500,759000];
	cbodata.growthIncome[1998]=[19900,35400,49900,69400,156000,66200,91800,119000,186800,881100];
	cbodata.growthIncome[1999]=[20300,36500,51500,71500,165200,69200,95200,123700,194400,958400];
	cbodata.growthIncome[2000]=[19700,36300,51700,72700,173400,70800,97300,127600,200100,1059000];
	cbodata.growthIncome[2001]=[20600,37700,53800,73500,160800,69100,97800,125700,192300,847600];
	cbodata.growthIncome[2002]=[20200,37100,53100,72900,154700,67100,97600,124500,186300,752800];
	cbodata.growthIncome[2003]=[20200,37400,53700,74600,162200,69000,100100,128800,195500,819300];
	cbodata.growthIncome[2004]=[20700,38600,55700,77300,176400,73000,104000,133800,206900,983800];
	cbodata.growthIncome[2005]=[21400,39500,56500,78500,190300,76600,106200,139100,221800,1186200];
	cbodata.growthIncome[2006]=[22100,39900,57000,79900,198600,79100,108700,142500,228400,1291900];
	cbodata.growthIncome[2007]=[23000,41300,58800,82100,208100,81900,110900,146900,238500,1389800];
	cbodata.growthIncome[2008]=[23500,41200,58700,81800,190900,77800,110700,143300,221900,1136000];
	cbodata.growthIncome[2009]=[23600,41000,58000,80800,174500,74200,109000,140700,209900,879800];
	cbodata.growthIncome[2010]=[23700,41000,57900,80600,181800,75500,108700,142400,215200,1013100];


    cbodata.shareIncome = [];
    cbodata.shareIncome[1979]=[0.074,0.123,0.165,0.222,0.42,1,0.147,0.094,0.105,0.074];
	cbodata.shareIncome[1980]=[0.073,0.122,0.164,0.221,0.424,1,0.148,0.094,0.106,0.076];
	cbodata.shareIncome[1981]=[0.07,0.12,0.165,0.221,0.43,1,0.148,0.094,0.108,0.079];
	cbodata.shareIncome[1982]=[0.066,0.117,0.162,0.221,0.441,1,0.15,0.096,0.109,0.086];
	cbodata.shareIncome[1983]=[0.061,0.113,0.16,0.221,0.452,1,0.15,0.097,0.112,0.093];
	cbodata.shareIncome[1984]=[0.063,0.112,0.159,0.221,0.453,1,0.149,0.096,0.112,0.097];
	cbodata.shareIncome[1985]=[0.061,0.11,0.157,0.218,0.462,1,0.148,0.096,0.113,0.104];
	cbodata.shareIncome[1986]=[0.057,0.105,0.152,0.211,0.482,1,0.143,0.094,0.115,0.13];
	cbodata.shareIncome[1987]=[0.057,0.112,0.161,0.224,0.457,1,0.15,0.096,0.113,0.097];
	cbodata.shareIncome[1988]=[0.056,0.109,0.156,0.217,0.473,1,0.147,0.095,0.113,0.118];
	cbodata.shareIncome[1989]=[0.057,0.11,0.157,0.217,0.469,1,0.147,0.096,0.115,0.111];
	cbodata.shareIncome[1990]=[0.06,0.112,0.157,0.217,0.465,1,0.147,0.095,0.114,0.108];
	cbodata.shareIncome[1991]=[0.062,0.113,0.161,0.218,0.457,1,0.148,0.096,0.115,0.099];
	cbodata.shareIncome[1992]=[0.06,0.112,0.158,0.216,0.465,1,0.147,0.096,0.115,0.106];
	cbodata.shareIncome[1993]=[0.062,0.114,0.159,0.218,0.458,1,0.148,0.097,0.114,0.098];
	cbodata.shareIncome[1994]=[0.061,0.114,0.161,0.219,0.455,1,0.148,0.096,0.114,0.097];
	cbodata.shareIncome[1995]=[0.063,0.114,0.159,0.215,0.459,1,0.146,0.096,0.115,0.101];
	cbodata.shareIncome[1996]=[0.06,0.112,0.156,0.212,0.469,1,0.146,0.095,0.116,0.112];
	cbodata.shareIncome[1997]=[0.059,0.109,0.153,0.207,0.481,1,0.145,0.096,0.117,0.123];
	cbodata.shareIncome[1998]=[0.058,0.107,0.151,0.204,0.487,1,0.142,0.095,0.117,0.133];
	cbodata.shareIncome[1999]=[0.057,0.105,0.149,0.202,0.495,1,0.141,0.094,0.119,0.141];
	cbodata.shareIncome[2000]=[0.055,0.102,0.146,0.2,0.505,1,0.14,0.094,0.119,0.152];
	cbodata.shareIncome[2001]=[0.059,0.109,0.153,0.212,0.477,1,0.143,0.095,0.116,0.123];
	cbodata.shareIncome[2002]=[0.059,0.111,0.156,0.215,0.468,1,0.145,0.095,0.116,0.111];
	cbodata.shareIncome[2003]=[0.057,0.109,0.155,0.212,0.476,1,0.146,0.095,0.116,0.119];
	cbodata.shareIncome[2004]=[0.056,0.107,0.151,0.208,0.487,1,0.142,0.094,0.116,0.136];
	cbodata.shareIncome[2005]=[0.055,0.103,0.147,0.202,0.501,1,0.138,0.093,0.118,0.152];
	cbodata.shareIncome[2006]=[0.054,0.102,0.145,0.2,0.508,1,0.137,0.093,0.119,0.159];
	cbodata.shareIncome[2007]=[0.056,0.1,0.143,0.196,0.514,1,0.136,0.092,0.118,0.167];
	cbodata.shareIncome[2008]=[0.06,0.106,0.15,0.207,0.491,1,0.141,0.094,0.116,0.141];
	cbodata.shareIncome[2009]=[0.061,0.111,0.157,0.216,0.472,1,0.147,0.096,0.114,0.115];
	cbodata.shareIncome[2010]=[0.062,0.109,0.154,0.21,0.481,1,0.143,0.095,0.115,0.128];
	
	cbodata.taxRate = [];
	cbodata.taxRate[1979]=[0.075,0.145,0.189,0.215,0.271,0.22,0.235,0.251,0.271,0.351];
	cbodata.taxRate[1980]=[0.074,0.141,0.189,0.218,0.269,0.22,0.239,0.255,0.274,0.331];
	cbodata.taxRate[1981]=[0.079,0.147,0.192,0.223,0.266,0.222,0.245,0.258,0.273,0.304];
	cbodata.taxRate[1982]=[0.077,0.135,0.179,0.206,0.242,0.205,0.226,0.237,0.246,0.267];
	cbodata.taxRate[1983]=[0.084,0.134,0.174,0.202,0.236,0.202,0.22,0.229,0.236,0.267];
	cbodata.taxRate[1984]=[0.094,0.143,0.178,0.203,0.238,0.206,0.224,0.23,0.236,0.27];
	cbodata.taxRate[1985]=[0.092,0.145,0.18,0.204,0.238,0.207,0.225,0.234,0.237,0.261];
	cbodata.taxRate[1986]=[0.091,0.143,0.179,0.205,0.236,0.206,0.227,0.234,0.236,0.246];
	cbodata.taxRate[1987]=[0.082,0.135,0.174,0.202,0.256,0.213,0.228,0.243,0.259,0.303];
	cbodata.taxRate[1988]=[0.079,0.138,0.178,0.206,0.254,0.215,0.231,0.242,0.255,0.29];
	cbodata.taxRate[1989]=[0.076,0.135,0.177,0.206,0.251,0.212,0.229,0.241,0.253,0.283];
	cbodata.taxRate[1990]=[0.084,0.141,0.177,0.206,0.249,0.212,0.229,0.24,0.252,0.281];
	cbodata.taxRate[1991]=[0.081,0.135,0.173,0.205,0.251,0.211,0.228,0.242,0.253,0.291];
	cbodata.taxRate[1992]=[0.08,0.129,0.171,0.202,0.254,0.211,0.226,0.239,0.256,0.3];
	cbodata.taxRate[1993]=[0.08,0.127,0.171,0.203,0.265,0.216,0.226,0.243,0.263,0.335];
	cbodata.taxRate[1994]=[0.068,0.125,0.171,0.205,0.271,0.219,0.231,0.247,0.267,0.348];
	cbodata.taxRate[1995]=[0.067,0.127,0.171,0.206,0.275,0.221,0.231,0.25,0.272,0.353];
	cbodata.taxRate[1996]=[0.064,0.126,0.17,0.205,0.278,0.223,0.231,0.25,0.274,0.352];
	cbodata.taxRate[1997]=[0.068,0.128,0.173,0.207,0.278,0.226,0.234,0.252,0.276,0.341];
	cbodata.taxRate[1998]=[0.066,0.123,0.166,0.206,0.274,0.223,0.233,0.251,0.274,0.326];
	cbodata.taxRate[1999]=[0.065,0.126,0.166,0.206,0.277,0.226,0.234,0.253,0.279,0.328];
	cbodata.taxRate[2000]=[0.068,0.124,0.165,0.206,0.277,0.227,0.235,0.253,0.279,0.324];
	cbodata.taxRate[2001]=[0.057,0.109,0.15,0.189,0.265,0.21,0.223,0.244,0.267,0.321];
	cbodata.taxRate[2002]=[0.055,0.103,0.144,0.183,0.258,0.203,0.216,0.238,0.261,0.32];
	cbodata.taxRate[2003]=[0.053,0.094,0.136,0.174,0.247,0.194,0.205,0.227,0.25,0.304];
	cbodata.taxRate[2004]=[0.051,0.096,0.137,0.174,0.249,0.196,0.205,0.227,0.253,0.301];
	cbodata.taxRate[2005]=[0.054,0.099,0.138,0.176,0.254,0.201,0.206,0.227,0.258,0.304];
	cbodata.taxRate[2006]=[0.058,0.101,0.14,0.178,0.255,0.203,0.208,0.228,0.26,0.3];
	cbodata.taxRate[2007]=[0.051,0.103,0.14,0.175,0.247,0.199,0.206,0.225,0.254,0.283];
	cbodata.taxRate[2008]=[0.015,0.073,0.116,0.156,0.236,0.18,0.191,0.217,0.247,0.281];
	cbodata.taxRate[2009]=[0.01,0.067,0.111,0.15,0.232,0.173,0.187,0.211,0.242,0.289];
	cbodata.taxRate[2010]=[0.015,0.072,0.115,0.156,0.24,0.181,0.193,0.216,0.249,0.294];



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
	
	$("#slide0 table td img").click(function() {
		var slideID = $(this).attr("src").replace(".png","").replace("thumb","");
		changeSlide(slideID);
		hideBlurbs();
		mainGraphic.playing = false;
	});

		
    var timers = {};
	
	mainGraphic.textSliding = {};
	mainGraphic.textSlidingTimer = {};
    mainGraphic.sliderChangeFunction = function (event, ui, chartNumber) {
        try {
			console.log("changing slide " + chartNumber + " at " + (Date.now() - loadTime));
			console.log(ui);
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
			changeSlide(chartNumber);
			
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
			$(".slideSelector, .circleSelector").removeClass("selected");
			$("#selectSlide" + chartNumber).addClass("selected");
			$("#circle" + mainGraphic.textConfig[chartNumber][yearToUse][2]).addClass("selected");
			
			//$("#slide" + chartNumber + "body").html(mainGraphic.textSnippets[mainGraphic.textConfig[chartNumber][yearToUse][1]]);
			
			if (chartNumber == 1) $("#slide" + chartNumber + "slider").slider('value',ui.value);
			else $("#slide" + chartNumber + "slider").slider('values',[ui.values[0],ui.values[1]]);
			
			
            chartNumber = chartNumber * 1;
            switch (chartNumber) {
			case 1:
				var chartData = {
					data: 
					[
						{
							series: [
								cbodata.percentGrowthIncome[ui.value][0],
								cbodata.percentGrowthIncome[ui.value][1],
								cbodata.percentGrowthIncome[ui.value][2],
								cbodata.percentGrowthIncome[ui.value][3],
								cbodata.percentGrowthIncome[ui.value][4]
							],
							bar_ops: {
								color:"#3e81b6"	
							}
						}
					],
					labels: ["Bottom 20%", "Second 20%", "Middle 20%", "Fourth 20%", "Top 20%"]
				};
				
				var chartData2 = {
                    data: [{
                        series: [cbodata.percentGrowthIncome[ui.value][9]],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    title: "",
                    labels: ["Top 1%"]
                };
				
				
				mainGraphic.customMax = 3.2;
				mainGraphic.customMin = -0.1;	
				break;
            case 2:

                var chartData = {
                    data: [{
                        series: [cbodata.growthIncome[ui.values[0]][0],
                            cbodata.growthIncome[ui.values[0]][1],
                            cbodata.growthIncome[ui.values[0]][2],
                            cbodata.growthIncome[ui.values[0]][3],
                            cbodata.growthIncome[ui.values[0]][4]
                        ],
                        bar_ops: {
                            color: "#aac8e0"
                        }
                    }, {
                        series: [cbodata.growthIncome[ui.values[1]][0],
                            cbodata.growthIncome[ui.values[1]][1],
                            cbodata.growthIncome[ui.values[1]][2],
                            cbodata.growthIncome[ui.values[1]][3],
                            cbodata.growthIncome[ui.values[1]][4]
                        ],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    labels: ["Bottom 20%", "Second 20%", "Middle 20%", "Fourth 20%", "Top 20%"]
                };


                var chartData2 = {
                    data: [{
                        series: [cbodata.growthIncome[ui.values[0]][9]],
                        bar_ops: {
                            color: "#aac8e0"
                        }
                    }, {
                        series: [cbodata.growthIncome[ui.values[1]][9]],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    title: "",
                    labels: ["Top 1%"]
                };

              
            mainGraphic.customMax = 1373700;
			mainGraphic.custonMin = 0;	
                break;

            case 3:

                var chartData = {
                    data: [{
                        series: [cbodata.shareIncome[ui.values[0]][0],
                            cbodata.shareIncome[ui.values[0]][1],
                            cbodata.shareIncome[ui.values[0]][2],
                            cbodata.shareIncome[ui.values[0]][3],
                            cbodata.shareIncome[ui.values[0]][4]
                        ],
                        bar_ops: {
                            color: "#aac8e0"
                        }
                    }, {
                        series: [cbodata.shareIncome[ui.values[1]][0],
                            cbodata.shareIncome[ui.values[1]][1],
                            cbodata.shareIncome[ui.values[1]][2],
                            cbodata.shareIncome[ui.values[1]][3],
                            cbodata.shareIncome[ui.values[1]][4]
                        ],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    labels: ["Bottom 20%", "Second 20%", "Middle 20%", "Fourth 20%", "Top 20%"]
                };


                var chartData2 = {
                    data: [{
                        series: [cbodata.shareIncome[ui.values[0]][8]],
                        bar_ops: {
                            color: "#aac8e0"
                        }
                    }, {
                        series: [cbodata.shareIncome[ui.values[1]][8]],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    title: "",
                    labels: ["Top 1%"]
                };
					mainGraphic.customMax = .52;
					mainGraphic.customMin = 0;
                break;
				
				 case 4:

                var chartData = {
                    data: [{
                        series: [cbodata.taxRate[ui.values[0]][0],
                            cbodata.taxRate[ui.values[0]][1],
                            cbodata.taxRate[ui.values[0]][2],
                            cbodata.taxRate[ui.values[0]][3],
                            cbodata.taxRate[ui.values[0]][4]
                        ],
                        bar_ops: {
                            color: "#aac8e0"
                        }
                    }, {
                        series: [cbodata.taxRate[ui.values[1]][0],
                            cbodata.taxRate[ui.values[1]][1],
                            cbodata.taxRate[ui.values[1]][2],
                            cbodata.taxRate[ui.values[1]][3],
                            cbodata.taxRate[ui.values[1]][4]
                        ],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    labels: ["Bottom 20%", "Second 20%", "Middle 20%", "Fourth 20%", "Top 20%"]
                };


                var chartData2 = {
                    data: [{
                        series: [cbodata.taxRate[ui.values[0]][8]],
                        bar_ops: {
                            color: "#aac8e0"
                        }
                    }, {
                        series: [cbodata.taxRate[ui.values[1]][8]],
                        bar_ops: {
                            color: "#3e81b6"
                        }
                    }],
                    title: "",
                    labels: ["Top 1%"]
                };
					mainGraphic.customMax = .4;
					mainGraphic.customMin = 0;
                break;

            default:
                console.log("error - no config for chart " + chartNumber);
                return false;
                break;
            }

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



            function tryDraw(barChartObjects, barChartCanvases, timerID, dataArrs, dataOptionsArrs) {
				try {
					clearTimeout(timers[timerID]);
					var inMotion = false;
					for (var barChartIndex = 0; barChartIndex < barChartObjects.length; barChartIndex++) {
						if (barChartObjects[barChartIndex].inMotion == true) {
							inMotion = true;
						}
					}
					
					if (inMotion == false) {
						clearTimeout(timers[timerID]);
						for (var barChartIndex = 0; barChartIndex < barChartObjects.length; barChartIndex++) {
							
							barChartObjects[barChartIndex].updateData(dataArrs[barChartIndex], dataOptionsArrs[barChartIndex]);
							
							barChartObjects[barChartIndex].draw(barChartCanvases[barChartIndex], 200);
							
						}
					} else {
						timers[timerID] = setTimeout(function () {
							tryDraw(barChartObjects, barChartCanvases, timerID, dataArrs, dataOptionsArrs);
						}, 20);
					}
				} catch (ex) {
					console.log("Error in tryDraw(): " + ex);	
				}
            }
			
            tryDraw([mainGraphic[chartNumber].left, mainGraphic[chartNumber].right], [mainGraphic.canvases["slide" + chartNumber + "left"], mainGraphic.canvases["slide" + chartNumber + "right"]], "slide" + chartNumber, [chartData.data, chartData2.data], [ops[chartNumber].left, ops[chartNumber].right]);


        } catch (ex) {
            console.log(ex);
        }
    }
	
   		function pauseEverything() {
			if (mainGraphic.playingStarted==true) {
				$("#playPauseArea img").attr("src",$("#playPauseArea img").attr("src").replace("pause","play"));
				clearTimeout(mainGraphic.mainGlobalEventTimer);
				mainGraphic.playing = false;	
			} 
		}
   
        $("#slide1slider").slider({
            range: false,
            min: mainGraphic.minYear,
            max: mainGraphic.maxYear,
            value: mainGraphic.minYear, 
            step: 1,
			start: pauseEverything,
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
			start: pauseEverything,
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
			start: pauseEverything,
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
			start: pauseEverything,
            slide: function (event, ui) {
                mainGraphic.sliderChangeFunction(event, ui, 4);
            }
        });

		
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
				event_fire(eventSequence[mainGraphic.eventIndex]);
				mainGraphic.playing = true;	
				showBlurbs();
			}
			
		});
		
		$("#restartArea").click(function() {
			clearTimeout(mainGraphic.mainGlobalEventTimer);
			mainGraphic.playing = false;
			$("#playPauseArea").css("visibility","hidden");
			$("#restartArea").css("visibility","hidden");
			showsOver();
			
			var uiObj = {values: [mainGraphic.minYear, mainGraphic.minYear],value:mainGraphic.minYear};
			
			mainGraphic.chartDrawn[1] = false;
			mainGraphic.chartDrawn[2] = false;
			mainGraphic.chartDrawn[3] = false;
			mainGraphic.chartDrawn[4] = false;
			$("#playPauseArea").show();
			
			setTimeout(function() {
				changeSlide(0);
			},200);
		});
		
		
		mainGraphic.eventIndex=0;
		$(".chartSlide").hide();
		$(".chartSlide").css({
			"visibility": "visible"
		});
		
		
		changeSlide(0);
		
		$(".beginStory").click(function() {
			showsOver();
			mainGraphic.playing = true;
			mainGraphic.chartDrawn[1] = false;
			mainGraphic.chartDrawn[2] = false;
			mainGraphic.chartDrawn[3] = false;
			mainGraphic.chartDrawn[4] = false;
			showBlurbs();
			event_fire(eventSequence[mainGraphic.eventIndex]);
		});
		
    });
	
	





} catch (ex) {
    console.log(ex);
}