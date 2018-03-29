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

var progressbar =  '<div id="progressbar"><div id="bar"></div></div>'+
										'<style>'+
             					'#progressbar'+
             					'{'+
                 					'background-color: #ff6142;'+
                 					'border-radius: 13px;'+
                 					'padding: 0px;'+
             					'}'+
 
             					'#progressbar > div'+
             					'{'+
                					'background-color: #00a66b;'+
                					'width: 70%;'+
                					'height: 20px;'+
                					'border-radius: 13px;'+
             					'}'+
         					'</style>';

var header = document.getElementsByClassName('content-control header');
header[0].innerHTML = progressbar;

var trends = Array.prototype.slice.call(document.getElementsByClassName("tv-change-abs"));
var table = document.getElementById("realtime-table");
var course = document.evaluate("//span[@data-field='_changeAbsolute']", table, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
trends.shift();

var key = [];
var value = [];
var currentValues = [];

for(var i = 0; i < course.snapshotLength; i++)
{
  key.push(trends[i].children[0].getAttribute("data-item"));
  value.push(parseFloat(course.snapshotItem(i).innerHTML.replace(",", ".")));
}

currentValues.push(key);
currentValues.push(value);

function updateValues()
{
  var rising = 50;
  var falling = 50;
  
	for(var i = 0; i < course.snapshotLength; i++)
	{
    var newValue = parseFloat(course.snapshotItem(i).innerHTML.replace(",", "."));
    if(newValue > currentValues[1][i])
    	{rising++;falling--}
    else if(newValue < currentValues[1][i])
    	{rising--;falling++;}
    document.getElementById("bar").style.width = rising + "%";
    //console.log(trends[i].children[0].getAttribute("data-item") + ": " + course.snapshotItem(i).innerHTML.replace(",", "."));
  }
  
  window.setTimeout(updateValues, 1000);
}

updateValues();
