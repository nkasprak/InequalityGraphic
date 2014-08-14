// JavaScript Document


var assignTextSnippets = function(obj) {
	obj.textSnippets = [];
	obj.textSnippets[1] = "";
	obj.textSnippets[2] = "These data show the percentage changes in after-tax income for each fifth of the income distribution and the top 1 percent, since 1979. Since 1979, the top 1 percent’s income has grown explosively, while incomes of other households have grown much more slowly.";
	obj.textSnippets[3] = "Income inequality skyrocketed between 1979 and 2007";
	obj.textSnippets[4] = "";
	
	obj.textSnippets[5] = "Incomes at the top fell sharply in 2008 and 2009 due to the recession and financial crisis.";
	//obj.textSnippets[6] = "Wealthy households receive much more of their income from capital gains (like selling stocks at a profit), and they can experience larger swings in their income as the stock market rides up and down.  Incomes at the top fell sharply in 2008 and 2009 due to the recession and financial crisis.  But even after those losses, the increase in the average income of the top 1 percent of households from 1979 to 2009 were still much larger than that of the middle 60 percent and bottom 20 percent.";
	obj.textSnippets[7] = "Income inequality has rebounded with the economic recovery";
	obj.textSnippets[8] = "While the top’s upward march of income hit speed bumps from the dot com collapse and the 2008 financial crisis, it appears to be gaining speed once again as the economy recovers.";
	obj.textSnippets[9] = "The growth of income inequality - in dollars";
	obj.textSnippets[10] = "Between 1979 and 2010, average after-tax income grew from about $340,000 to $1,013,000 for the top 1 percent of households and from $43,000 to $58,000 for the average middle-income household.";
	obj.textSnippets[11] = "The top 1 percent is getting a larger share of total after-tax income";
	obj.textSnippets[12] = "";
	//obj.textSnippets[13] = "By 2010, the top 1 percent of households in 2010 had more annual income than the bottom 20 percent of households, and more annual income than the second 20 percent of households.";
	obj.textSnippets[14] = "Federal taxes do less to push against growing income inequality than they used to";
	obj.textSnippets[15] = "While federal taxes (income, payroll, and other taxes) have remained progressive overall, average federal tax rates fell for all income groups between 1979 and 2007 — one reason why federal taxes reduced inequality less in 2007 than in 1979.";
	//obj.textSnippets[16] = 'However, average federal tax rates have declined for all income groups between 1979 and 2007. This is one of the reasons why the federal tax system did <a href="http://www.offthechartsblog.org/why-the-tax-system-is-doing-less-about-growing-inequality/">less to push against growing income inequality in 2007 than it did in 1979.</a>';
	obj.textSnippets[17] = "Policymakers enacted temporary tax cuts during the recession and recovery to support the economy.";
	//obj.textSnippets[18] = "During the recession and recovery, temporary tax cuts were enacted to support the economy.<br><br> (The Congressional Budget Office’s data do not yet extend to 2012 when these temporary measures expire, or to 2013, when parts of the high-income tax cuts first enacted under President Bush were allowed to expire.)";
	
	obj.textConfig = [];
	obj.textConfig[0] = {};
	obj.textConfig[1] = {
						popup:2,
						1979:[1,4,1],
						1980:[3,4,2],
						2008:[5,4,3],
						2010:[7,4,4]
					};
	obj.textConfig[2] = {
						1979:[9,10,1]
	};
	obj.textConfig[3] = {
						1979:[11,12,1],
						1980:[11,12,2]
	};
	obj.textConfig[4] = {
						1979:[14,15,1],
						1980:[14,15,2],
						2008:[17,15,3]
	};
};