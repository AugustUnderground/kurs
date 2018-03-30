// Stock Trends +/-
// version 0.1 BETA!
// 2018−03−27
// Copyright (c) 2018, Yannick Uhlmann
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Hello World", and click Uninstall.
//
// −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
//
// ==UserScript==
// @name          Stock Trend
// @description   Shows the overall trend of all stocks.
// @include       https://www.derivate.bnpparibas.com/realtime*
// ==/UserScript==

var header = document.getElementsByClassName('content-control header');
var progressbar =  '<div id="progressbar"><div id="bar"></div></div>'+
										'<style>'+
             					'#progressbar'+
             					'{'+
                 					'background-color: #ff6142;'+
    											'width: 85%;'+
                 					'border-radius: 3px;'+
                 					'padding: 0px;'+
             					'}'+
 
             					'#progressbar > div'+
             					'{'+
                					'background-color: #00a66b;'+
                					'width: 70%;'+
                					'height: 20px;'+
                					'border-radius: 3px;'+
             					'}'+
         					'</style>';

var table = document.getElementById("realtime-table");
var course = document.evaluate("//span[@data-field='_changeAbsolute']", table, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var trend = [];
var value = [];
var current = [];

function init()
{
	header[0].innerHTML = progressbar;
  for(var i = 0; i < course.snapshotLength; i++)
	{
    trend.push("0");
  	value.push(parseFloat(course.snapshotItem(i).innerHTML.replace(",", ".")));
	}

	current.push(trend);
	current.push(value);
}

function updateValues()
{
  var falling = 0;
  var rising = 0;
  
	for(var i = 0; i < course.snapshotLength; i++)
	{
  	var newValue = parseFloat(course.snapshotItem(i).innerHTML.replace(",", "."));
    if(newValue > current[1][i])
  		{current[0][i] = "+";rising++;}
    else if(newValue < current[1][i])
    	{current[0][i] = "-";falling++;}
    else
    {
    	if(current[0][i] == "+")
      	{rising++;}
      else if(current[0][i] == "-")
      	{falling++;}
    }
    
    current[1][i] = newValue;
    
    var trend = rising * 100 / (rising + falling);
    document.getElementById("bar").style.width = trend + "%";
    
    //if(currentValues[0][i] != "0")
    //	{console.log("(" + i + ") " + currentValues[0][i] + ": " + currentValues[1][i]);}
  }
  
  window.setTimeout(updateValues, 1000);
}

init();
updateValues();

