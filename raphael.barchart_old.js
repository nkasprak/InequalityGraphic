/*	A barchart plugin for Raphael
	by Nick Kasprak
	CBPP.org	*/

Raphael.fn.barchart = function(chartdata,ops) {
	
	data = chartdata.data;
	if (chartdata.labels) this.labels = chartdata.labels;
	if (chartdata.title) this.title = chartdata.title;
	if (typeof(this.inMotion) == "undefined") this.inMotion = false;
	
	//Grab options from ops and set defaults if not defined
	this.chartWidth = 100;
	this.chartHeight = 100;
	this.globalYOff = 5;
	this.globalXOff = 5;
	this.barWidthPercent = .6;
	this.maxGridlines = 10;
	this.graphMargins = {left:.1,right:.1,top:.05,bottom:.15};
	this.gridOps = {
		color:"#dddddd",
		width:1,
		label_percent:false,
		label_commas:false,
		label_prefix:null,
		label_hidden:false
	}
	this["font-family"] = "Arial, sans-serif";
	this.bar_ops = {};
	this.bar_ops.color = "#f00";
	this.bar_ops.border = {};
	this.bar_ops.border.width = 0;
	this.bar_ops.border.color = "#000";
	this.barStyle = "normal";
	this.barLabelColor = "#555";
	
	if (ops) {
		if (ops.barStyle) this.barStyle = ops.barStyle;
		if (ops.defGridlines) this.defGridlines = ops.defGridlines;
		if (ops.chartHeight) this.chartHeight = ops.chartHeight;
		if (ops.chartWidth) this.chartWidth = ops.chartWidth;	
		if (ops["font-family"]) this["font-family"] = ops["font-family"];
		if (ops.graphMargins) {
			for (graphMargin in ops.graphMargins) {
				if (ops.graphMargins[graphMargin]) this.graphMargins[graphMargin] = ops.graphMargins[graphMargin];
			}
		}
		this.chartAreaHeight = (1 - this.graphMargins.top - this.graphMargins.bottom)*this.chartHeight;
	
		this.chartAreaWidth = (1 - this.graphMargins.left - this.graphMargins.right)*this.chartWidth;
		this.globalYOff = this.graphMargins.top*ops.chartHeight;
		this.globalXOff = this.graphMargins.left*ops.chartWidth;
		if (ops.barWidthPercent) this.barWidthPercent = ops.barWidthPercent;
		if (ops.barColor) this.bar_ops.color = ops.barColor;
		if (ops.barLabelColor) this.barLabelColor = ops.barLabelColor;
		var gridOp;
		if (ops.gridOps) {
			for (gridOp in ops.gridOps) {
				if (ops.gridOps[gridOp]) this.gridOps[gridOp] = ops.gridOps[gridOp];
			}
		}
	}
	
	this.fontSize = Math.sqrt(0.7*this.chartAreaHeight);
	if (ops) {if (ops.fontSize) {this.fontSize = ops.fontSize;}}
	this.listOfGridlineIDs = [];
	
	//To retrieve data from data object
	this.getData = function(x) {
		if (isNaN(x)) {
			//if data point has options attached...
			return x.val;
		} else {
			//if data point is a plain old data point...
			return x;	
		}	
	}
	
	this.log10 = function(x) {return Math.log(x)/Math.LN10};
	this.commaSeparateNumber = function(val) {
		while (/(\d+)(\d{3})/.test(val.toString())){
		  val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		return val;
	}
	
	this.updateData = function(data,ops) {
		
		this.oldYMax = 0;
		this.oldYMin = 0;
		if (this.yMax) this.oldYMax = this.yMax;
		if (this.yMin) this.oldYMin = this.yMin;
		
		this.yMax = 0;
		this.yMin = 0;
		//loop through data first time to determine min/max values
		var dataPoint;
		var dataObj;
		var maxminTracker = [];
		for (var seriesIndex=0;seriesIndex<data.length;seriesIndex++) {
			for (var barIndex=0;barIndex<data[seriesIndex].series.length;barIndex++) {
				dataPoint = this.getData(data[seriesIndex].series[barIndex]);
				switch (this.barStyle) {
				case "stacked":
					if (typeof(maxminTracker[barIndex]) == "undefined") maxminTracker[barIndex] = 0;
					maxminTracker[barIndex] += dataPoint;
					this.yMax = Math.max(this.yMax, Math.max(maxminTracker[barIndex],dataPoint));
					this.yMin = Math.min(this.yMin, Math.min(maxminTracker[barIndex],dataPoint));
				break;
				default:
					this.yMax = Math.max(this.yMax,dataPoint);
					this.yMin = Math.min(this.yMin,dataPoint);
				break;
				}
			}
		}

		if (ops) {
			if (ops.yMax) this.yMax = ops.yMax;
			if (ops.yMin) this.yMin = ops.yMin;	
		}

		var zeroPoint = (1-(0 - this.yMin)/(this.yMax - this.yMin))*this.chartAreaHeight;
		
		if (this.zeroPoint) this.oldZeroPoint = this.zeroPoint;
		else this.oldZeroPoint = zeroPoint;
		
		this.zeroPoint = zeroPoint;
		
		
		this.toDraw = {};
		
		//Prepare horizontal gridlines
		
		if (this.defGridlines) {
			//Case for predefined gridlines
		
			//set gridlines to defined gridlines
			gridYs = this.defGridlines;
		} else {
			//Case for default gridline determination
			//Determine number of lines/increment
			var allowedIncrements = [1,2,2.5,3,4,5];
			var rangeMag = Math.ceil(this.log10(this.yMax - this.yMin));
			var increment = 1;
			var loopIncrement;
			var allowedIncIndex;
			var incFound = false;
			var numGridlines;
			for (var power = 1;power<4;power++) {
				for (allowedIncIndex = 0;allowedIncIndex<allowedIncrements.length;allowedIncIndex++) {
					loopIncrement = allowedIncrements[allowedIncIndex]*Math.pow(10,rangeMag - 3 + power);
					if (incFound == false) increment=loopIncrement;
					numGridlines = (this.yMax - this.yMin)/loopIncrement;
					if (numGridlines <= this.maxGridlines) incFound = true;	
				}
			}
			
			
			//Determine y values of gridlines
			var gridYs = [];
			var y = 0;
			while (y <= this.yMax) {
				gridYs.push(y);
				y=y+increment;
			}
			y = 0-increment;
			while (y >= this.yMin) {
				gridYs.push(y);	
				y=y-increment;
			}
		}
		
		//Determine canvas coordinates of gridlines
		var yCoord;
		var idString;
		for (var gridlInd = 0;gridlInd<gridYs.length;gridlInd++) {
			idString = (gridYs[gridlInd]) + "";
			idString = idString.replace(".","_");
			idString = idString.replace("-","n");
			this.toDraw["grid" + idString] = {	loc: Math.round((1-(gridYs[gridlInd]-this.yMin)/(this.yMax - this.yMin))*this.chartAreaHeight),
												type:"gridline",
												left:0,
												right:this.chartAreaWidth};
			if (this.oldYMax != this.oldYMin) {
				this.toDraw["grid" + idString].oldloc = Math.round((1-(gridYs[gridlInd]-this.oldYMin)/(this.oldYMax - this.oldYMin))*this.chartAreaHeight)
			} else {
				this.toDraw["grid" + idString].oldloc = this.toDraw["grid" + idString].loc;	
			}
		}
		
		//loop through data again to prepare drawing of elements
		var barHeight;
		var barWidth;
		var barXOff;
		var elemID;
		
		var currentData = [];
		var tempSeries = [];
		var yOffsetTracker = []; //keeps track of start points for stacked charts
		
		for (seriesIndex=0;seriesIndex<data.length;seriesIndex++) {
			tempSeries = [];
			
			for (barIndex=0;barIndex<data[seriesIndex].series.length;barIndex++) {
				
				dataObj = data[seriesIndex].series[barIndex];
				dataPoint = this.getData(data[seriesIndex].series[barIndex]);
				//Compare old data to current data so we determine where the sign changes are,
				//which affects the animation
				tempSeries.push(dataPoint);
				
				switch (this.barStyle) {
					case "normal":
						//bars alongside each other
						barHeight = Math.abs((dataPoint/(this.yMax - this.yMin))*this.chartAreaHeight);
						barWidth = (this.barWidthPercent * (this.chartAreaWidth/data[seriesIndex].series.length))/data.length;
						barXOff = ((1-this.barWidthPercent)/2) * (this.chartAreaWidth/data[seriesIndex].series.length) + (barIndex/data[seriesIndex].series.length)*this.chartAreaWidth+barWidth*seriesIndex;
						if (dataPoint < 0) {
							barYOff = this.zeroPoint;
						} else {
							barYOff = this.zeroPoint - barHeight;	
						}
					break;
					case "stacked":
						barHeight = Math.abs((dataPoint/(this.yMax - this.yMin))*this.chartAreaHeight);
						barWidth = (this.barWidthPercent * (this.chartAreaWidth/data[seriesIndex].series.length));
						barXOff = ((1-this.barWidthPercent)/2) * (this.chartAreaWidth/data[seriesIndex].series.length) + (barIndex/data[seriesIndex].series.length)*this.chartAreaWidth;
						if (typeof(yOffsetTracker[barIndex]) == "undefined") yOffsetTracker[barIndex] = [0,0];
						
						if (dataPoint < 0) {
							barYOff = this.zeroPoint + yOffsetTracker[barIndex][0];
							yOffsetTracker[barIndex][0] += barHeight;
						} else {
							barYOff = this.zeroPoint - barHeight - yOffsetTracker[barIndex][1];	
							yOffsetTracker[barIndex][1] += barHeight;
						}
						
					break;
				
				}
				elemID = "s" + seriesIndex + "b" + barIndex;
				this.toDraw[elemID] = {	type: "rect",
										x: Math.round(barXOff*1000)/1000,
										y: Math.round(barYOff*1000)/1000,
										width: Math.round(barWidth*1000)/1000,
										height: Math.round(barHeight*1000)/1000};
				//Add attributes to bars - precedence based on point - series - chart
				var attrArray = ["color","border"];
				
				for (attrIndex = 0;attrIndex < attrArray.length; attrIndex++) {
					//chart global
					this.toDraw[elemID][attrArray[attrIndex]] = this.bar_ops[attrArray[attrIndex]];
					
					//series level
					if (data[seriesIndex].bar_ops) {
						if (data[seriesIndex].bar_ops[attrArray[attrIndex]]) this.toDraw[elemID][attrArray[attrIndex]] = data[seriesIndex].bar_ops[attrArray[attrIndex]];
					}
					
					//data level
					if (dataObj.ops) {
						if (dataObj.ops[attrArray[attrIndex]]) this.toDraw[elemID][attrArray[attrIndex]] = dataObj.ops[attrArray[attrIndex]];
					}
					
				}
				//Fix so border doesn't affect overall width/height
				var borderWidth = this.toDraw[elemID].border.width;
				if (borderWidth > 0) {
					this.toDraw[elemID].width -= borderWidth;
					this.toDraw[elemID].height -= borderWidth;
					this.toDraw[elemID].x += (borderWidth/2);
					this.toDraw[elemID].y += (borderWidth/2);
				}
				
				if (barIndex == 0) {
				//tasks that need to be handled only once per bar group
					
				}
			}
			currentData.push(tempSeries);
			
		}
		
		//Check for sign changes - affects animation.
		if (this.currentdata) this.olddata = this.currentdata;
		else this.olddata = currentData;
		this.currentdata = currentData;
		var signChanges = [];
		var oldSign;
		var newSign;
		for (var seriesIndex = 0;seriesIndex<this.olddata.length;seriesIndex++) {
			signChanges[seriesIndex] = [];
			for (var dataIndex=0;dataIndex<this.olddata[seriesIndex].length;dataIndex++) {
				elemID = "s" + seriesIndex + "b" + dataIndex;
				oldSign = (this.olddata[seriesIndex][dataIndex] > 0) ? 1:0;
				newSign = (this.currentdata[seriesIndex][dataIndex] > 0) ? 1:0;
				signChange = (oldSign == newSign) ? 0:1;
				if (oldSign == newSign) this.toDraw[elemID].signChange = true;
				else this.toDraw[elemID].signChange = false;
				
			}
		}
	}
	
	this.updateData(data,ops);
	
	this.draw = function (canvas, length) {
		//get id of canvas to avoid namespace conflicts
		this.inMotion = true;
		var parentID = canvas.canvas.parentNode.id;
		
		
		//make list of current gridline IDs. Any that still exist in the new chart will get removed from thist list; the ones that are left at tne end are deleted.
		var activeIDList = this.listOfGridlineIDs;
		
		//Except we don't want to delete anything if we're drawing the chart for the first time.
		var deleteAtEnd = false;
		
		//If this list has anything in it, that means we're redrawing, rather than drawing, the chart, so it's okay to delete old gridlines at the end.
		if (activeIDList.length > 0) deleteAtEnd = true;
		
		//Declaring various variables used in the subsequent loop
		var elemID;
		var labelID;
		var textObj;
		var toRemove;
		var newYval;
		var dummyID = parentID + "_dummyAnimator";
		if (document.getElementById(dummyID)) {
			var dummyRect = canvas.getById(document.getElementById(dummyID).raphaelid);
			dummyRect.attr({x:0});
		} else {
			var dummyRect = canvas.rect(0,0,4,4);
			dummyRect.attr({"fill-opacity":0,"stroke-opacity":0});
		}
		var animationSyncObject = Raphael.animation({x:this.chartWidth},length,animationDone);
		
		dummyRect.node.id = parentID + "_dummyAnimator";
		//dummyRect.attr("stroke-opacity",0);
		dummyRect.animate(animationSyncObject);
		dummyRect.parentCanvas = this;
		function animationDone() {
			this.parentCanvas.inMotion = false;
		}
		
		//Loop through all elements in the toDraw list and handle appropriately.
		for (elem in this.toDraw) {
			elemID = parentID + "_barchartsub_" + elem;
			labelID = parentID + "_barchartsub_" + elem + "_label";
			switch (this.toDraw[elem].type) {
			case "rect":
				//Drawing a bar
				if (document.getElementById(elemID)) {
					//Case where bar already exists in chart. Need to animate change.
					elemObj = canvas.getById(document.getElementById(elemID).raphaelid);
					elemObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({	x:this.toDraw[elem].x + this.globalXOff,
										width:this.toDraw[elem].width,
										stroke:this.toDraw[elem].border.color,
										fill:this.toDraw[elem].color,
										"stroke-width":this.toDraw[elem].border.width
									},length));
					if (this.toDraw[elem].signChange == false) {
						halfwayZeroPoint = (this.zeroPoint + this.oldZeroPoint)/2; 
						elemObj.finalEndingY = this.toDraw[elem].y + this.globalYOff;
						elemObj.finalEndingHeight = this.toDraw[elem].height;
						elemObj.animate({	height:0,
											y:halfwayZeroPoint + this.globalYOff},
											length/2,
											null,
											function() {
												this.animate({y:this.finalEndingY,
																height:this.finalEndingHeight},
																length/2);
											});
					} else {
						elemObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({y:this.toDraw[elem].y + this.globalYOff,
											height:this.toDraw[elem].height},length));
					}
				} else {
					//Case where we're drawing a new bar.
					elemObj = canvas.rect(this.toDraw[elem].x + this.globalXOff,
							this.toDraw[elem].y + this.globalYOff,
							this.toDraw[elem].width,
							this.toDraw[elem].height);
					elemObj.attr("fill",this.toDraw[elem].color);
					elemObj.attr("stroke",this.toDraw[elem].border.color);
					elemObj.attr("stroke-width",this.toDraw[elem].border.width);
					elemObj.node.id = elemID;
				}
			break;
			case "gridline":
				//Drawing a gridline
				if (document.getElementById(elemID)) {
					//Case where the gridline already exists in the chart and will continue to exist in the new chart
					
					//This path represents where the gridline will end up at the end of the animation
					var pathString = "M"+Math.round(this.toDraw[elem].left + this.globalXOff)+","+Math.round(this.toDraw[elem].loc + this.globalYOff)+"H"+Math.round(this.toDraw[elem].right + this.globalXOff);
					
					elemObj = canvas.getById(document.getElementById(elemID).raphaelid); 
					elemObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({path:pathString},length));
									
					//Remove the gridline from the activeIDList so it doesn't get deleted later				
					activeIDList = Raphael.fn.barchart.removeFromArrayByValue(activeIDList,elemID);
					if (this.gridOps.label_hidden == false) {
						if (document.getElementById(labelID)) { //No reason the label shouldn't exist if the element does, but doesn't hurt to check
							labelObj = canvas.getById(document.getElementById(labelID).raphaelid);
							labelObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({y:this.toDraw[elem].loc + this.globalYOff},length));	
						}
					}
				} else {
					//Case where we're creating a new gridline
					
					//Path to represent where the gridline would lie on the old chart (it starts out there and moves along with the rest of the animation)
					var pathString = "M"+Math.round(this.toDraw[elem].left + this.globalXOff)+","+Math.round(this.toDraw[elem].oldloc + this.globalYOff)+"H"+Math.round(this.toDraw[elem].right + this.globalXOff);
					label = elem.slice(4); //cut out "grid" in element name, left with encoded y-value
					label = label.replace("n","-"); //change back to number
					label = label.replace("_",".");
					
					
					elemObj = canvas.path(pathString);
					
					if (label == 0) {
						elemObj.attr("stroke-width",this.gridOps.width+1);
						elemObj.attr("stroke","#333");
					} else {
						elemObj.attr("stroke-width",this.gridOps.width);
						elemObj.attr("stroke",this.gridOps.color);
					}
					
					if (this.gridOps.label_percent == true) {
						label = label*1;
						label = Math.round((label*100)) + "%";
					}
					
					if (this.gridOps.label_commas) {
						label = this.commaSeparateNumber(label);
					}
					if (this.gridOps.label_prefix) {
						label = this.gridOps.label_prefix + label;	
					}
					
					elemObj.toBack(); //needs to go behind bars
					elemObj.attr("stroke-opacity",0);
					elemObj.node.id =elemID;
					
					pathString = "M"+Math.round(this.toDraw[elem].left + this.globalXOff)+","+Math.round(this.toDraw[elem].loc + this.globalYOff)+"H"+Math.round(this.toDraw[elem].right + this.globalXOff);
					this.listOfGridlineIDs.push(parentID + "_barchartsub_" + elem); //add to list of active gridlines so future animations can keep track of them
			
					if (this.gridOps.label_hidden == false) {
						if (!document.getElementById(labelID)) { //the label shouldn't exist but may as well check to make sure it doesn't
							
							//Draw the label in the "old" location so it can be animated into the new one
							textObj = canvas.text(this.toDraw[elem].left + this.globalXOff-(0.01*this.chartAreaWidth),this.toDraw[elem].oldloc + this.globalYOff, label);
							textObj.attr("fill",this.gridOps.color);
							textObj.attr("font-size",this.fontSize);
							textObj.attr("font-family",this["font-family"]);
							textObj.attr("fill-opacity",0);
							textObj.attr("text-anchor","end");
							textObj.node.id = labelID;
							textObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({y:this.toDraw[elem].loc + this.globalYOff,"fill-opacity":1}, length));
						}
					
						
						
					}
					elemObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({path:pathString,"stroke-opacity":1},length));
				}
			break;
			}
		}
		//bring axis to front
		canvas.getById(document.getElementById(parentID + "_barchartsub_grid0").raphaelid).toFront();
		
		//draw labels
	
		
		for (var labelIndex = 0;labelIndex<this.labels.length;labelIndex++) {
			labelID = parentID + "barchartsub_barlabel_" + labelIndex;
			labelX = (labelIndex+0.5)*this.chartAreaWidth/this.labels.length + this.globalXOff;
			labelY = this.chartAreaHeight + this.globalYOff + 10;
			if (document.getElementById(labelID)) {
				textObj = canvas.getById(document.getElementById(labelID).raphaelid);
				textObj.animateWith(dummyRect,animationSyncObject,Raphael.animation({x:labelX,y:labelY + textObj._getBBox().height/2},length));
			} else {
				textObj = canvas.text(labelX,labelY,this.labels[labelIndex]);
				textObj.attr("font-size",this.fontSize);
				textObj.attr("font-family",this["font-family"]);
				textObj.attr("y",textObj.attrs.y + textObj._getBBox().height/2);
				textObj.attr("fill",this.barLabelColor);
				textObj.node.id = labelID;
			}
		}
		
		
		//Go through and animate away and then delete any gridlines left in the activeIDlist - anything that still needs to be there should have been
		//removed from the array already so as to not get deleted here
		if (deleteAtEnd) {
			for (var toRemoveInd = 0;toRemoveInd<activeIDList.length;toRemoveInd++) {
				toRemove = canvas.getById(document.getElementById(activeIDList[toRemoveInd]).raphaelid);
				if (this.gridOps.label_hidden == false) {
					labelToRemove = canvas.getById(document.getElementById(activeIDList[toRemoveInd] + "_label").raphaelid);
				}
				
				//get y-coordinate of new location from element ID and animate (it will disappear eventually but needs to move as it's fading away.)
				
				yCoord = activeIDList[toRemoveInd].slice(parentID.length+17);
				yCoord = yCoord.replace("_",".");
				yCoord = yCoord.replace("n","-");
				
				yCoord = yCoord*1;
				//determine target location based on y-coordinate
				
				newYval = Math.round((1-(yCoord - this.yMin)/(this.yMax - this.yMin))*this.chartAreaHeight) + this.globalYOff;
				pathString = "M" + Math.round(this.globalXOff) + "," + Math.round(newYval) + "H" + Math.round(this.chartAreaWidth + this.globalXOff);
				this.listOfGridlineIDs = Raphael.fn.barchart.removeFromArrayByValue(this.listOfGridlineIDs, activeIDList[toRemoveInd]);
				
				//start animation but remove element completely at the end.
					
				labelToRemove.animateWith(dummyRect,animationSyncObject,Raphael.animation({"fill-opacity":0,y:newYval},length,null,function() {this.remove();}));
				
				toRemove.animateWith(dummyRect,animationSyncObject,Raphael.animation({"stroke-opacity":0,path:pathString},length,null,function() {this.remove();}));
			}
		}
	}
}

Raphael.fn.barchart.removeFromArrayByValue = function(arr, toRemove) {
	returnarr = [];
	for (var i = 0;i<arr.length;i++) {
		if (arr[i] != toRemove) {
			returnarr.push(arr[i]);
		}
	}
	return returnarr;
}