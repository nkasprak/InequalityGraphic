<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>CBO Inequality Graphic</title>
<script src="//use.edgefonts.net/source-sans-pro.js"></script>
<link rel="stylesheet" href="jquery-ui-1.10.3/css/smoothness/jquery-ui-1.10.3.custom.min.css" />
<link rel="stylesheet" href="style.css" />
</head>

<body>
<div id="outermost">
	<div id="slideSelectArea">
    	<?php 
		$tabText = array(
			array("text"=>"Intro","numeral"=>""),
			array("text"=>"The growth of<br />income inequality","numeral"=>"I"),
			array("text"=>"Income inequality<br />in dollar terms","numeral"=>"II"),
			array("text"=>"Intensifying<br />income concentration","numeral"=>"III"),
			array("text"=>"The role of<br />federal taxes","numeral"=>"IV"),
			array("text"=>"Explore","numeral"=>"")
		);
		for ($i=0;$i<=5;$i++) : ?>
    	<div id="selectSlide<?php echo $i?>" class="slideSelector <?php echo ($i==0 ? "selected" : "");?>"><div class="inner"><div class="numeral"><?php echo $tabText[$i]["numeral"]; ?></div><div class="text"><?php echo $tabText[$i]["text"]; ?></div></div></div>
        <?php endfor; ?>
    </div> <!-- end slideSelectArea -->
    
    <div id="slide0" class="chartSlide">
    	<div class="slideTextMargin">
            <div class="introBlurb">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</div>
            <div class="beginWrapper"><div class="beginStory">See the story</div></div>
         </div>
    </div>
    <?php 
	$titles = array(
		"",
		"Percentage change in after tax income since 1979",
		"Average after-tax income, in 2010 dollars",
		"Share of after-tax income",
		"Average share of income owed in federal taxes"
	);
	function outputExploreSelector() {
		global $titles; ?>
		<select class="exploreSelector">
        	<?php for ($i=1;$i<=4;$i++) : ?>
            <option value="<?php echo $i;?>"><?php echo $titles[$i];?></option>
            <?php endfor; ?>
        </select>
	<?php }; 
	for ($i=1;$i<=4;$i++) : ?>
    <div id="slide<?php echo $i; ?>" class="chartSlide">
    	 <?php outputExploreSelector(); ?>
    	<div class="slideTextMargin">
        	<div class="chartDescHeader" id="slide<?php echo $i;?>title">
            	<div class="animateInner"></div>
            </div>
           
           	<div class="chartDescBody" id="slide<?php echo $i;?>body"><div class="animateInner"></div></div>
            <p>&nbsp;</p>
            <div class="sliderContainer">
                <div class="sliderGrid"><img src="slider_grid.png" /></div>
            	<div id="slide<?php echo $i;?>slider" class="yearSlider"></div>
            </div>
            <p>&nbsp;</p>
            <div><strong><?php echo $titles[$i];?></strong></div>
            <div class="slideCharts">
                <div id="slide<?php echo $i;?>Canvas" class="leftCanvas"></div>
                <div class="vertical_divider"><img src="vertical_divider.png" /></div>
                <div id="slide<?php echo $i;?>RightCanvas" class="rightCanvas"></div>
            </div> <!--end slideCharts-->
	    </div> <!-- end slideTextMargin-->
    </div> <!--end slide <?php echo $i;?> -->
    <?php endfor; ?>
    <div id="slide5" class="chartSlide">
    <?php outputExploreSelector(); ?>
    <div class="chartDescBody" id="slide5body">
    <p>&nbsp;</p>
    	<p><strong>Explore the data</strong></p>
    </div>    
    </div>
    <div id="popup">
    	<div id="textDiv"></div>
        <div id="closePopup">Continue</div>
    </div>
    <div id="playPauseArea">
    	<img src="pause_light.png" />
    </div>
    <div id="restartArea">
    	<img src="restart_light.png" />
    </div>
</div> <!-- end div outermost -->

<script type="text/javascript" src = "raphael-min.js"></script>
<script type="text/javascript" src = "raphael.barchart.js"></script>
<script type="text/javascript" src="jquery-ui-1.10.3/js/jquery-1.9.1.js"></script>
<script type="text/javascript" src="jquery-ui-1.10.3/js/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="main.js"></script>


</body>
</html>
