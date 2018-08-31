// Stock Trends +/-
// version 0.1 BETA!
// 2018−03−27
// Copyright (c) 2018, Yannick Uhlmann
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−− −−−−−−−−−−
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Stock Trend", and click Uninstall.
//
// −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−− −−−−−−−−−−
//
// ==UserScript==
// @name          Stock Trend
// @description   Shows the overall trend of all stocks.
// @include       https://www.derivate.bnpparibas.com/realtime*
// ==/UserScript==

var TIME = 1000;

var progressbar =   '<style>'+
                        '#progressbar'+
                        '{'+
                            'background-color: #ff6142;'+
                            'width: 99%;'+
                            'border-radius: 0px;'+
                            'padding: 0px;'+
                        '}'+

                        '#percent'+
                        '{'+
                            'position: absolute;'+
                            'left: 43%;'+
                        '}'+

                        '#bar'+
                        '{'+
                            'background-color: #00a66b;'+
                            'width: 50%;'+
                            'height: 20px;'+
                            'border-radius: 0px;'+
                        '}'+

                        '.dropbtn'+
                        '{'+
                        '    background-color: #027499;'+
                        '    color: white;'+
    										'		 height: 20px;'+
                        '    font-size: 12px;'+
                        '    border: none;'+
                        '    cursor: pointer;'+
                        '}'+

                        '.dropbtn:hover, .dropbtn:focus'+
                        '{'+
                        '    background-color: #2980B9;'+
                        '}'+

                        '.dropdown'+
                        '{'+
                        '    position: relative;'+
                        '    display: inline-block;'+
                        '}'+

                        '.content'+
                        '{'+
                        '    display: none;'+
                        '    position: absolute;'+
                        '    background-color: #f1f1f1;'+
                        '    min-width: 52px;'+
                        '    overflow: auto;'+
                        '    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);'+
                        '    z-index: 1;'+
                        '}'+

                        'content a'+
                        '{'+
                        '    color: black;'+
                        '    padding: 12px 16px;'+
                        '    text-decoration: none;'+
                        '    display: block;'+
                        '}'+

    										'content button'+
                        '{'+
                        '    color: black;'+
                        '    padding: 12px 16px;'+
                        '    text-decoration: none;'+
                        '    display: block;'+
                        '}'+
    
                        '.dropdown a:hover {background-color: #ddd}'+

                        '.show {display:block;}'+
    
    										'.modal'+
    										'{'+
    												'display: none;'+
    												'position: fixed;'+
    												'z-index: 1000;'+
    												'padding-top: 155px;'+
    												'left: 0;'+
    												'top: 0;'+
    												'width: 100%;'+
    												'height: 100%;'+
    												'overflow: auto;'+
    												'background-color: rgb(0,0,0);'+
    												'background-color: rgba(0,0,0,0.4);'+
												'}'+
											
    										'.modal-content'+
    										'{'+
    												'background-color: #fefefe;'+
    												'margin: auto;'+
    												'padding: 20px;'+
    												'border: 1px solid #888;'+
    												'width: 80%;'+
    												'height: 80%'+
    												'overflow: auto'+
												'}'+

												'.close'+
    										'{'+
    												'color: #aaaaaa;'+
    												'float: right;'+
    												'font-size: 28px;'+
    												'font-weight: bold;'+
												'}'+

												'.close:hover, .close:focus'+
    										'{'+
    												'color: #000;'+
    												'text-decoration: none;'+
    												'cursor: pointer;'+
												'}'+
    
    										'#protoTable'+
    										'{'+
    												'font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;'+
    												'border-collapse: collapse;'+
    												'width: 100%;'+
    												'height: 100%'+
												'}'+

												'#protoTable td, #protoTable th'+
    										'{'+
    												'border: 1px solid #ddd;'+
    												'padding: 8px;'+
												'}'+

												'#protoTable tr:nth-child(even){background-color: #f2f2f2;}'+

												'#protoTable tr:hover {background-color: #ddd;}'+

												'#protoTable th'+
												'{'+
    												'padding-top: 12px;'+
    												'padding-bottom: 12px;'+
    												'text-align: left;'+
    												'background-color: #027499;'+
    												'color: white;'+
												'}'+
    										
    										'td.rising'+
    										'{'+
    												'color: #00a66b;'+
    										'}'+
    
    										'td.falling'+
    										'{'+
    												'color: #ff6142;'+
    										'}'+
												
    										'div.proto-container'+
    										'{'+
    												'max-height: 400px;'+
    												'overflow: auto;'+
    										'}'+
                    '</style>'+
                    '<table>'+
                        '<tr><td width="80%">'+
    					    '<div id="progressbar">'+
                                '<span id="percent">50%</span>'+
                                '<div id="bar"></div>'+
                            '</div>'+
									'</td><td>'+
                        '<button class="dropbtn" id="graphBtn">Graph</button>&nbsp;'+
                        '<button class="dropbtn" id="protoBtn">Log</button>'+
               					'<div id="protoModal" class="modal">'+
  													'<div class="modal-content">'+
    														'<span id="protoClose" class="close">&times;</span>'+
    														'<h2>Protokoll des durschnittlichen Kurses:</h2>'+
    														'<div class="proto-container">'+
    																'<table id="protoTable">'+
                          							'<tr><th>Zeitstempel</th><th>Kurs</th></tr>'+
																		'</table>'+
    														'</div>'+
  													'</div>'+
												'</div>'+
    				'</td></tr>'+
    				'<tr><td>'+
    					'<div id="avg"></div>'+
    				'</td></tr>'+
    			'</table>';

var table = document.getElementById("realtime-table");
var course = document.evaluate("//span[@data-field='_changeAbsolute']", table, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
var change = document.evaluate("//span[@data-field='_changePercent']", table, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var current = [];

var avgBuffer = [0];
var avgProtocol = [];
var avgTimer = 120000; //300000;


function showContent()
{
    var protoModal = document.getElementById("protoModal");
  	var closeBtn = document.getElementById("protoClose");

  	protoModal.style.display = "block";
  
  	closeBtn.onclick = () => {protoModal.style.display = "none";};
  
  	window.onclick = (event) =>
    		{
    				if(event.target == protoModal)
            		{protoModal.style.display = "none";}
				};
}

function setUpdateTime1s()
{
  	var dropdown = document.getElementById('timeSelect');  
    dropdown.innerHTML = "1 SEC";
	setUpdateTime(1000);
}
function setUpdateTime30s()
{
   	var dropdown = document.getElementById('timeSelect');  
    dropdown.innerHTML = "30 SEC";
  	setUpdateTime(30000);
}
function setUpdateTime1m()
{
  	var dropdown = document.getElementById('timeSelect');  
    dropdown.innerHTML = "1 MIN";
  	setUpdateTime(60000);
}
function setUpdateTime2m()
{
  	var dropdown = document.getElementById('timeSelect');  
    dropdown.innerHTML = "2 MIN";
  	setUpdateTime(120000);
}

function setUpdateTime(ms)
{
  	TIME = ms;
  	updateValues();
  	//console.log("NEW TIME: " + ms + "ms");
}

window.onclick = function(event)
{
    if(!event.target.matches('.dropbtn'))
    {
        var dropdowns = document.getElementsByClassName("content");
        var i;
        for(i = 0; i < dropdowns.length; i++)
        {
            var openDropdown = dropdowns[i];
            if(openDropdown.classList.contains('show'))
                {openDropdown.classList.remove('show');}
        }
    }
}

function init()
{
		var trend = [];
		var value = [];
		var header = document.getElementsByClassName('content-control header');  
    header[0].innerHTML = progressbar;
  
  	//var selection = document.getElementById('timeSelect');
  	//selection.addEventListener('click', showContent, false);
  	
  	var protoBtn = document.getElementById('protoBtn');
  	protoBtn.addEventListener('click', showContent, false);
  	
  	//var option = document.getElementById('option1s');
  	//option.addEventListener('click', setUpdateTime1s, false);
  	//option = document.getElementById('option30s');
  	//option.addEventListener('click', setUpdateTime30s, false);
  	//option = document.getElementById('option1m');
  	//option.addEventListener('click', setUpdateTime1m, false);
  	//option = document.getElementById('option2m');
  	//option.addEventListener('click', setUpdateTime2m, false);
  
  	for(var i = 0; i < course.snapshotLength; i++)
    {
        trend.push("0");
        value.push(parseFloat(course.snapshotItem(i).innerHTML.replace(",", ".")));
    }

    current.push(trend);
    current.push(value);
}

function calculateAvg()
{
  	if(avgBuffer.length > 1)
    {
  			var sum = avgBuffer.reduce((a, b) => {return a + b;});
  			var avg = sum / avgBuffer.length;
      
      	avgProtocol.push({timeStamp: Date(), value: avg.toFixed(2)});
      	
      	var tableRow = `<tr><td>${avgProtocol.slice(-1)[0].timeStamp}</td><td class="${avg > 50? 'rising':'falling'}">${avgProtocol.slice(-1)[0].value}%</td></tr>`;
      
      	var protoTable = document.getElementById('protoTable');
      	protoTable.innerHTML = `${protoTable.innerHTML}${tableRow}`;
  	
  			avgBuffer.length = 0;
    }
      
  	window.setTimeout(calculateAvg, avgTimer);
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

    	var trend = (rising * 100 / (rising + falling)).toFixed(2);
    	document.getElementById("bar").style.width = trend + "%";
    	document.getElementById("percent").innerHTML = "&#9650; " + trend + "%";
      
      if(!isNaN(Number(trend)))
      {
      		avgBuffer.push(Number(trend));
      }

    	//if(currentValues[0][i] != "0")
        //  {console.log("(" + i + ") " + currentValues[0][i] + ": " + currentValues[1][i]);}
    }

    window.setTimeout(updateValues, TIME);
}

init();
updateValues();
calculateAvg();
