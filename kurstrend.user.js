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
// select "Stock Trend", and click Uninstall.
//
// −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
//
// ==UserScript==
// @name          Stock Trend
// @description   Shows the overall trend of all stocks.
// @include       https://www.derivate.bnpparibas.com/realtime*
// ==/UserScript==

var TIME = 1000;

var header = document.getElementsByClassName('content-control header');
var progressbar =   '<div id="progressbar">'+
                        '<span id="percent">50%</span>'+
                        '<div id="bar"></div>'+
                    '</div>'+

                    '<div class="timeSelection">'+
                    '<button onclick="showContent()" class="dropbtn">'+TIME+'</button>'+
                    '  <div id="timeSelection" class="content">'+
                    '    <a onclick="select(1000)" class=option">1 sec</a>'+
                    '    <a onclick="select(5000)" class=option">5 sec</a>'+
                    '    <a onclick="select(10000)" class=option">10 sec</a>'+
                    '    <a onclick="select(30000)" class=option">30 sec</a>'+
                    '    <a onclick="select(60000)" class=option">1 min</a>'+
                    '    <a onclick="select(120000)" class=option">2 min</a>'+
                    '  </div>'+
                    '</div>'+

                    '<style>'+
                        '#progressbar'+
                        '{'+
                            'background-color: #ff6142;'+
                            'width: 85%;'+
                            'border-radius: 3px;'+
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
                            'border-radius: 3px;'+
                        '}'+

    					'.dropbtn'+
                        '{'+
                        '    background-color: #3498DB;'+
                        '    color: white;'+
                        '    padding: 16px;'+
                        '    font-size: 16px;'+
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

                        '.dropdown-content'+
                        '{'+
                        '    display: none;'+
                        '    position: absolute;'+
                        '    background-color: #f1f1f1;'+
                        '    min-width: 160px;'+
                        '    overflow: auto;'+
                        '    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);'+
                        '    z-index: 1;'+
                        '}'+

                        '.dropdown-content a'+
                        '{'+
                        '    color: black;'+
                        '    padding: 12px 16px;'+
                        '    text-decoration: none;'+
                        '    display: block;'+
                        '}'+

                        '.dropdown a:hover {background-color: #ddd}'+

                        '.show {display:block;}'+

                    '</style>';

var table = document.getElementById("realtime-table");
var course = document.evaluate("//span[@data-field='_changeAbsolute']", table, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

var trend = [];
var value = [];
var current = [];

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showContent()
{
    document.getElementById("timeSelection").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
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

    var trend = (rising * 100 / (rising + falling)).toFixed(2);
    document.getElementById("bar").style.width = trend + "%";
    document.getElementById("percent").innerHTML = trend + "%";

    //if(currentValues[0][i] != "0")
    //	{console.log("(" + i + ") " + currentValues[0][i] + ": " + currentValues[1][i]);}
    }

    window.setTimeout(updateValues, TIME);
}

init();
updateValues();

