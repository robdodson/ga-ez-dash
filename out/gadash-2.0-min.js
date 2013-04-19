var gadash=gadash||{};gadash.auth=gadash.auth||{};gadash.auth.config={};gadash.userInfo={};gadash.isLoaded=!1;gadash.auth.SCOPES_=["https://www.googleapis.com/auth/analytics.readonly","https://www.googleapis.com/auth/userinfo.email"];gadash.commandQueue_=[];
gadash.init=function(a){gadash.util.extend(a,gadash.auth.config);gadash.util.loadJs_(["https://www.google.com/jsapi?autoload="+encodeURIComponent('{"modules":[{"name":"visualization","version":"1","callback":"__globalCallback","packages":["corechart","table"]}]}'),"https://apis.google.com/js/client.js?onload=__globalCallback"],window.gadashInit_,!0)};
gadash.auth.onUnAuthorizedDefault=function(){document.getElementById("gadash-auth").innerHTML='<button id="authorize-button">Authorize Analytics</button>';document.getElementById("authorize-button").onclick=gadash.auth.authorize};
gadash.auth.onAuthorizedDefault=function(){var a="You are authorized";gadash.userInfo.email&&(a+=" as "+gadash.userInfo.email);document.getElementById("gadash-auth").innerHTML=a+' <button id="authorize-button">Logout</button>';document.getElementById("authorize-button").onclick=gadash.auth.accountLogout};gadash.auth.accountLogout=function(){window.document.location="https://accounts.google.com/logout"};
window.gadashInit_=function(){gapi.client.setApiKey(gadash.auth.config.apiKey);window.setTimeout(gadash.auth.checkAuth_,1)};gadash.auth.checkAuth_=function(){gapi.auth.authorize({client_id:gadash.auth.config.clientId,scope:gadash.auth.SCOPES_,immediate:!0},gadash.auth.handleAuthResult_)};
gadash.auth.handleAuthResult_=function(a){if(a)gapi.client.load("analytics",gadash.auth.config.version||"v3",gadash.auth.loadUserName_);else if("function"==gadash.util.getType(gadash.auth.config.onUnAuthorized)){if(!1!==gadash.auth.config.onUnAuthorized())gadash.auth.onUnAuthorizedDefault()}else gadash.auth.onUnAuthorizedDefault()};gadash.auth.loadUserName_=function(){gapi.client.request({path:"/oauth2/v2/userinfo"}).execute(gadash.auth.loadUserNameHander_)};
gadash.auth.loadUserNameHander_=function(a){gadash.userInfo=a;gadash.userInfo.email&&(gadash.userInfo.email=gadash.util.htmlEscape(gadash.userInfo.email));if("function"==gadash.util.getType(gadash.auth.config.onAuthorized)){if(!1!==gadash.auth.config.onAuthorized())gadash.auth.onAuthorizedDefault()}else gadash.auth.onAuthorizedDefault();gadash.isLoaded=!0;gadash.auth.executeCommandQueue_()};
gadash.auth.authorize=function(){gapi.auth.authorize({client_id:gadash.auth.config.clientId,scope:gadash.auth.SCOPES_,immediate:!1},gadash.auth.handleAuthResult_);return!1};gadash.auth.executeCommandQueue_=function(){for(var a=0,b;b=gadash.commandQueue_[a];++a)b()};gadash.control=gadash.control||{};gadash.Control=function(a){this.settings=a;a=gadash.control.getConfigObjDetails(this.settings.configObjKey);this.configObj=a.configObj;this.configLastObj=a.configLastObj;this.configLastKey=a.configLastKey;return this};gadash.Control.prototype.getValue=function(){return this.settings.getValue.apply(this)};gadash.Control.prototype.getConfig=function(){this.configLastObj[this.configLastKey]=this.getValue();return this.configObj};
gadash.getTextInputControl=function(a,b){return new gadash.Control({id:a,configObjKey:b,getValue:gadash.control.getTextInputValue})};gadash.control.getTextInputValue=function(){return document.getElementById(this.settings.id).value};gadash.control.getConfigObjDetails=function(a){var b=configLastObj={};a=a.split(".");for(var c=0;c<a.length-1;++c){var e=a[c];configLastObj[e]={};configLastObj=configLastObj[e]}a=a[a.length-1];configLastObj[a]={};return{configObj:b,configLastObj:configLastObj,configLastKey:a}};gadash.GaQuery=function(a){this.config={};this.setConfig(a);return this};gadash.GaQuery.prototype.setConfig=function(a){gadash.util.extend(a,this.config);return this};gadash.GaQuery.prototype.execute=function(a){a&&this.setConfig(a);gadash.isLoaded?this.executeFunction_():(a=gadash.util.bindMethod(this,this.executeFunction_),gadash.commandQueue_.push(a));return this};gadash.GaQuery.prototype.executeFunction_=function(){this.executeHandlers_("onRequest","onRequestDefault")};
gadash.GaQuery.prototype.callback=function(a){this.executeHandlers_("onResponse","onResponseDefault");a.error?this.executeHandlers_("onError","onErrorDefault",a.error):this.executeHandlers_("onSuccess","onSuccessDefault",a)};gadash.GaQuery.prototype.executeHandlers_=function(a,b,c){a=this.config[a];b=this.config[b];"function"==gadash.util.getType(a)?!1!==gadash.util.bindMethod(this,a)(c)&&b&&gadash.util.bindMethod(this,b)(c):b&&gadash.util.bindMethod(this,b)(c)};gadash.core=gadash.core||{};gadash.getCoreQuery=function(a){return(new gadash.GaQuery({onRequestDefault:gadash.core.onRequestDefault,onErrorDefault:gadash.onErrorDefault})).setConfig(a)};gadash.core.onRequestDefault=function(){gadash.core.setDefaultDates(this.config);gapi.client.analytics.data.ga.get(this.config.query).execute(gadash.util.bindMethod(this,this.callback))};
gadash.core.setDefaultDates=function(a){if(a["last-n-days"])a.query["end-date"]=gadash.util.lastNdays(0),a.query["start-date"]=gadash.util.lastNdays(a["last-n-days"]);else if(!a.query["start-date"]||!a.query["end-date"])a.query["end-date"]=gadash.util.lastNdays(0),a.query["start-date"]=gadash.util.lastNdays(28)};
gadash.onErrorDefault=function(a){var b=document.getElementById("errors");b||(b=document.createElement("div"),b.style.color="red",b.setAttribute("id","errors"),b.innerHTML="ERRORS:<br />",document.body.appendChild(b));b.innerHTML+=" error: "+a.code+" "+a.message+"<br />"};gadash.util=gadash.util||{};gadash.util.convertDateFormat=function(a){0==(new String(a.getValue(0,0))).search(/^(20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)&&gadash.util.convertToMMMd(a)};gadash.util.convertToMMMd=function(a){for(var b=a.getNumberOfRows(),c=0;c<b;c++)a.setValue(c,0,gadash.util.stringDateToString(a.getValue(c,0)));return a};
gadash.util.stringDateToString=function(a){if(0==a.search(/^(20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)){var b={"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep",10:"Oct",11:"Nov",12:"Dec"}[a.substring(4,6)];a=a.substring(6,8);10>a&&(a=a.substring(1,2));a=b+" "+a}return a};gadash.util.bindMethod=function(a,b){return function(){return b.apply(a,arguments)}};
gadash.util.lastNdays=function(a){var b=new Date;b.setDate((new Date).getDate()-a);a=b.getFullYear();var c=b.getMonth()+1;10>c&&(c="0"+c);b=b.getDate();10>b&&(b="0"+b);return[a,c,b].join("-")};gadash.util.lastNweeks=function(a){var b=new Date,c=new Date;c.setDate(b.getDate()-7*a);a=c.getFullYear();b=c.getMonth()+1;10>b&&(b="0"+b);c=c.getDate();10>c&&(c="0"+c);return[a,b,c].join("-")};
gadash.util.lastNmonths=function(a){var b=new Date;if(0>=a)return[b.getFullYear(),b.getMonth()+1,b.getDate()].join("-");var c=Math.floor(a/12);a%=12;0<c&&b.setFullYear(b.getFullYear()-c);0<a&&(a>=b.getMonth()?(b.setFullYear(b.getFullYear()-1),b.setMonth(b.getMonth()+(12-a))):b.setMonth(b.getMonth()-a));c=b.getDate();c=10>c?"0"+c:c;a=b.getMonth()+1;return[b.getFullYear(),10>a?"0"+a:a,c].join("-")};
gadash.util.stringToDate=function(a){var b=a.substring(0,4),c=a.substring(4,6);a=a.substring(6,8);10>c&&(c=c.substring(1,2));c-=1;10>a&&(a=a.substring(1,2));return new Date(b,c,a)};gadash.util.formatGAString=function(a){var b=a.substring(3),b=b.charAt(0).toUpperCase()+b.slice(1);for(a=1;a<b.length;a++)if(b.charAt(a)==b.charAt(a).toUpperCase()){var c=b.substring(0,a),b=b.substring(a,b.length),b=[c,b].join(" ");a++}return b};
gadash.util.extend=function(a,b){for(var c in a)"object"==gadash.util.getType(a[c])?(b[c]=b[c]||{},gadash.util.extend(a[c],b[c])):b[c]=a[c]};gadash.util.getType=function(a){return{"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Array]":"array","[object Date]":"date","[object RegExp]":"regex","[object Function]":"function","[object Object]":"object"}[Object.prototype.toString.call(a)]};
gadash.util.htmlEscape=function(a){if(!/[&<>\"]/.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(/&/g,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(/</g,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(/>/g,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(/"/g,"&quot;"));return a};gadash.util.loadJs_Resource=function(a,b){var c=document.createElement("script");c.async=!0;c.src=a;b&&(c.onload=b);var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(c,e)};window.__globalCallback={};
gadash.util.loadJs_=function(a,b,c){b=gadash.getIncrementalCallback(a.length,b);c&&(window.__globalCallback=b);for(var e=0,f;f=a[e];++e)c?gadash.util.loadJs_Resource(f):gadash.util.loadJs_Resource(f,b)};gadash.getIncrementalCallback=function(a,b){var c=0;return function(){++c;c>=a&&b()}};gadash.util.getLoaderUri=function(){return"data:image/gif;base64,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"};gadash.gviz=gadash.gviz||{};gadash.gviz.onRequestDefault=function(){document.getElementById(this.config.elementId).innerHTML=['<div class="ga-loader" style="color:#777;font-size:18px;overflow:hidden"><img style="display:block;float:left" src="',gadash.util.getLoaderUri(),'"><div style="margin:6px 0 0 12px;float:left">Loading...</div></p>'].join("");gadash.util.bindMethod(this,gadash.core.onRequestDefault)()};
gadash.gviz.onResponseDefault=function(){document.getElementById(this.config.elementId).innerHTML=""};gadash.gviz.onSuccessDefault=function(a){a=gadash.gviz.getDataTable(a,this.config.type);var b=gadash.gviz.getChart(this.config.elementId,this.config.type);gadash.gviz.draw(b,a,this.config.chartOptions)};
gadash.gviz.getDataTable=function(a,b){var c=b||!1,e=new google.visualization.DataTable,f=a.columnHeaders.length,j;a.rows&&a.rows.length?j=a.rows.length:this.defaultOnError("No rows returned for that query.");for(var d=0;d<f;d++){var g=a.columnHeaders[d].dataType,l=a.columnHeaders[d].name,g="ga:date"==l&&!("ColumnChart"==c||"BarChart"==c)?"date":"STRING"==g?"string":"number";e.addColumn(g,gadash.util.formatGAString(l))}for(d=0;d<j;d++){for(var k=[],h=0;h<f;h++)l=a.columnHeaders[h].name,g=a.columnHeaders[h].dataType,
"ga:date"==l&&!("ColumnChart"==c||"BarChart"==c)?k.push(gadash.util.stringToDate(a.rows[d][h])):"INTEGER"==g?k.push(parseInt(a.rows[d][h])):"CURRENCY"==g?k.push(parseFloat(a.rows[d][h])):"PERCENT"==g||"TIME"==g||"FLOAT"==g?k.push(Math.round(100*a.rows[d][h])/100):k.push(a.rows[d][h]);e.addRow(k)}for(d=0;d<f;d++)g=a.columnHeaders[d].dataType,"CURRENCY"==g&&(new google.visualization.NumberFormat({fractionDigits:2})).format(e,d);return e};
gadash.gviz.getChart=function(a,b){var c=document.getElementById(a);return google.visualization[b]?new google.visualization[b](c):new google.visualization.Table(c)};gadash.gviz.draw=function(a,b,c){gadash.util.convertDateFormat(b);gadash.gviz.createDateFormater(b);a.draw(b,c)};gadash.gviz.createDateFormater=function(a){(new google.visualization.DateFormat({pattern:"MMM d"})).format(a,0)};
gadash.gviz.coreChartConfig={onRequestDefault:gadash.gviz.onRequestDefault,onResponseDefault:gadash.gviz.onResponseDefault,onSuccessDefault:gadash.gviz.onSuccessDefault,onErrorDefault:gadash.onErrorDefault};gadash.getCoreChart=function(a){return(new gadash.GaQuery).setConfig(gadash.gviz.coreChartConfig).setConfig(a)};gadash.getCoreLineChart=function(a){var b=gadash.gviz.getCommonConfigFromArgs(arguments);return(new gadash.GaQuery(gadash.gviz.coreChartConfig)).setConfig(b.baseConfig).setConfig(gadash.gviz.defaultGvizChartOptions).setConfig(gadash.gviz.areaChart).setConfig(b.userConfig)};
gadash.getCorePieChart=function(a){var b=gadash.gviz.getConfigFromArgs({elementId:"",query:{ids:"",metrics:"",sort:"",dimensions:"","max-results":5}},[function(a,b){a.elementId=b},function(a,b){a.query.metrics=b;a.query.sort="-"+b},function(a,b){a.query.dimensions=b},function(a,b){a.query.ids=b}],arguments);return(new gadash.GaQuery(gadash.gviz.coreChartConfig)).setConfig(b.baseConfig).setConfig(gadash.gviz.defaultGvizChartOptions).setConfig(gadash.gviz.pieChart).setConfig(b.userConfig)};
gadash.getCoreBarChart=function(a){var b=gadash.gviz.getCommonConfigFromArgs(arguments);return(new gadash.GaQuery(gadash.gviz.coreChartConfig)).setConfig(b.baseConfig).setConfig(gadash.gviz.defaultGvizChartOptions).setConfig(gadash.gviz.barChart).setConfig(b.userConfig)};gadash.getCoreColumnChart=function(a){var b=gadash.gviz.getCommonConfigFromArgs(arguments);return(new gadash.GaQuery(gadash.gviz.coreChartConfig)).setConfig(b.baseConfig).setConfig(gadash.gviz.defaultGvizChartOptions).setConfig(gadash.gviz.columnChart).setConfig(b.userConfig)};
gadash.gviz.getConfigFromArgs=function(a,b,c){for(var e,f=0;f<c.length;++f){var j=c[f];if("object"==gadash.util.getType(j)){e=j;break}else if(f<b.length)b[f](a,j)}return{baseConfig:a,userConfig:e}};gadash.gviz.getCommonConfigFromArgs=function(a){return gadash.gviz.getConfigFromArgs({elementId:"",query:{ids:"",metrics:"",dimensions:"ga:date"}},[function(a,c){a.elementId=c},function(a,c){a.query.metrics=c},function(a,c){a.query.ids=c}],a)};
gadash.gviz.defaultGvizChartOptions={chartOptions:{height:300,width:450,fontSize:12,curveType:"function",chartArea:{width:"100%"},titleTextStyle:{fontName:"Arial",fontSize:15,bold:!1}}};gadash.gviz.lineChart={type:"LineChart",chartOptions:{pointSize:6,lineWidth:4,areaOpacity:0.1,legend:{position:"top",alignment:"start"},colors:["#058dc7","#d14836"],hAxis:{format:"MMM d",gridlines:{color:"transparent"},baselineColor:"transparent"},vAxis:{gridlines:{color:"#efefef",logScale:"true",count:3},textPosition:"in"}}};
gadash.gviz.areaChart={type:"AreaChart",chartOptions:{pointSize:6,lineWidth:4,areaOpacity:0.1,legend:{position:"top",alignment:"start"},colors:["#058dc7"],hAxis:{format:"MMM d",gridlines:{count:3,color:"transparent"},baselineColor:"transparent"},vAxis:{gridlines:{color:"#efefef",logScale:"true",count:3},textPosition:"in"}}};gadash.gviz.pieChart={type:"PieChart",chartOptions:{legend:{position:"right",textStyle:{bold:"true",fontSize:13},alignment:"center",pieSliceText:"none"}}};
gadash.gviz.barChart={type:"BarChart",chartOptions:{legend:{position:"top",alignment:"start"},colors:["#058dc7","#d14836"],hAxis:{gridlines:{count:3,color:"#efefef"},minValue:0,baselineColor:"transparent"},vAxis:{gridlines:{color:"transparent"},count:3,textPosition:"in"}}};
gadash.gviz.columnChart={type:"ColumnChart",chartOptions:{legend:{position:"top",alignment:"start"},colors:["#058dc7","#d14836"],hAxis:{gridlines:{count:3,color:"transparent"},baselineColor:"transparent"},vAxis:{gridlines:{color:"#efefef",count:3},minValue:0,textPosition:"in"},chartArea:{width:"90%"}}};gadash.getGaComponent=function(a){return(new gadash.GaComponent).add(a)};gadash.GaComponent=function(){this.objects_=[];return this};gadash.GaComponent.prototype.add=function(a){if("array"==gadash.util.getType(a))for(var b=0,c;c=a[b];++b)this.add(c);else this.objects_.push(a);return this};gadash.GaComponent.prototype.getConfig=function(){for(var a={},b=0,c;c=this.objects_[b];++b)c.getConfig&&gadash.util.extend(c.getConfig(),a);return a};
gadash.GaComponent.prototype.setConfig=function(a){for(var b=0,c;c=this.objects_[b];++b)c.setConfig&&c.setConfig(a);return this};gadash.GaComponent.prototype.execute=function(a){var b=this.getConfig();a&&gadash.util.extend(a,b);a=0;for(var c;c=this.objects_[a];++a)c.execute&&c.execute(b);return this};
