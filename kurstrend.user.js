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

var h2s = document.getElementsByTagName('h2');
h2s[2].innerHTML = "AKTUELLER KURS TREND";

var trends = document.getElementsByClassName("tv-change-abs");
var spans = document.getElementsByTagName("span");

for(i = 0; i < spans.length; i++)
{
	var style = spans[i].getAttribute("style"); 
  if(style != null)
  {
    if(style.indexOf("background-color") != -1)
    	{console.log(style);}
  }
}

var table = document.getElementById("realtime-table");
var course = document.evaluate("//span[@data-field='last']", table, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for(var i = 0; i < course.snapshotLength; i++)
	{console.log(course.snapshotItem(i).innerHTML);}
