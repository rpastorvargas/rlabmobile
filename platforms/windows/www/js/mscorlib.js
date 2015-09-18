﻿(function(){var e={version:"0.7.4.0",isUndefined:function(a){return a===undefined},isNull:function(a){return a===null},isNullOrUndefined:function(a){return a===null||a===undefined},isValue:function(a){return a!==null&&a!==undefined}},g=false,a=[];function d(b){a?a.push(b):setTimeout(b,0)}function b(){if(a){var c=a;a=null;for(var b=0,d=c.length;b<d;b++)c[b]()}}if(document.addEventListener)document.readyState=="complete"?b():document.addEventListener("DOMContentLoaded",b,false);else window.attachEvent&&window.attachEvent("onload",function(){b()});var c=window.ss;if(!c)window.ss=c={init:d,ready:d};for(var f in e)c[f]=e[f]})();Object.__typeName="Object";Object.__baseType=null;Object.clearKeys=function(a){for(var b in a)delete a[b]};Object.keyExists=function(b,a){return b[a]!==undefined};if(!Object.keys){Object.keys=function(b){var a=[];for(var c in b)a.push(c);return a};Object.getKeyCount=function(b){var a=0;for(var c in b)a++;return a}}else Object.getKeyCount=function(a){return Object.keys(a).length};Boolean.__typeName="Boolean";Boolean.parse=function(a){return a.toLowerCase()=="true"};Number.__typeName="Number";Number.parse=function(a){return!a||!a.length?0:a.indexOf(".")>=0||a.indexOf("e")>=0||a.endsWith("f")||a.endsWith("F")?parseFloat(a):parseInt(a,10)};Number.prototype.format=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toString():this._netFormat(a,false)};Number.prototype.localeFormat=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toLocaleString():this._netFormat(a,true)};Number._commaFormat=function(a,i,n,o){var c=null,h=a.indexOf(n);if(h>0){c=a.substr(h);a=a.substr(0,h)}var j=a.startsWith("-");if(j)a=a.substr(1);var f=0,g=i[f];if(a.length<g)return c?a+c:a;var k=a.length,b="",l=false;while(!l){var e=g,d=k-e;if(d<0){g+=d;e+=d;d=0;l=true}if(!e)break;var m=a.substr(d,e);if(b.length)b=m+o+b;else b=m;k-=e;if(f<i.length-1){f++;g=i[f]}}if(j)b="-"+b;return c?b+c:b};Number.prototype._netFormat=function(f,g){var b=g?ss.CultureInfo.CurrentCulture.numberFormat:ss.CultureInfo.InvariantCulture.numberFormat,a="",c=-1;if(f.length>1)c=parseInt(f.substr(1));var e=f.charAt(0);switch(e){case"d":case"D":a=parseInt(Math.abs(this)).toString();if(c!=-1)a=a.padLeft(c,"0");if(this<0)a="-"+a;break;case"x":case"X":a=parseInt(Math.abs(this)).toString(16);if(e=="X")a=a.toUpperCase();if(c!=-1)a=a.padLeft(c,"0");break;case"e":case"E":if(c==-1)a=this.toExponential();else a=this.toExponential(c);if(e=="E")a=a.toUpperCase();break;case"f":case"F":case"n":case"N":if(c==-1)c=b.numberDecimalDigits;a=this.toFixed(c).toString();if(c&&b.numberDecimalSeparator!="."){var d=a.indexOf(".");a=a.substr(0,d)+b.numberDecimalSeparator+a.substr(d+1)}if(e=="n"||e=="N")a=Number._commaFormat(a,b.numberGroupSizes,b.numberDecimalSeparator,b.numberGroupSeparator);break;case"c":case"C":if(c==-1)c=b.currencyDecimalDigits;a=Math.abs(this).toFixed(c).toString();if(c&&b.currencyDecimalSeparator!="."){var d=a.indexOf(".");a=a.substr(0,d)+b.currencyDecimalSeparator+a.substr(d+1)}a=Number._commaFormat(a,b.currencyGroupSizes,b.currencyDecimalSeparator,b.currencyGroupSeparator);if(this<0)a=String.format(b.currencyNegativePattern,a);else a=String.format(b.currencyPositivePattern,a);break;case"p":case"P":if(c==-1)c=b.percentDecimalDigits;a=(Math.abs(this)*100).toFixed(c).toString();if(c&&b.percentDecimalSeparator!="."){var d=a.indexOf(".");a=a.substr(0,d)+b.percentDecimalSeparator+a.substr(d+1)}a=Number._commaFormat(a,b.percentGroupSizes,b.percentDecimalSeparator,b.percentGroupSeparator);if(this<0)a=String.format(b.percentNegativePattern,a);else a=String.format(b.percentPositivePattern,a)}return a};String.__typeName="String";String.Empty="";String.compare=function(a,b,c){if(c){if(a)a=a.toUpperCase();if(b)b=b.toUpperCase()}a=a||"";b=b||"";return a==b?0:a<b?-1:1};String.prototype.compareTo=function(b,a){return String.compare(this,b,a)};String.concat=function(){return arguments.length===2?arguments[0]+arguments[1]:Array.prototype.join.call(arguments,"")};String.prototype.endsWith=function(a){return!a.length?true:a.length>this.length?false:this.substr(this.length-a.length)==a};String.equals=function(b,c,a){return String.compare(b,c,a)==0};String._format=function(b,c,a){if(!String._formatRE)String._formatRE=/(\{[^\}^\{]+\})/g;return b.replace(String._formatRE,function(h,d){var g=parseInt(d.substr(1)),b=c[g+1];if(ss.isNullOrUndefined(b))return"";if(b.format){var e=null,f=d.indexOf(":");if(f>0)e=d.substring(f+1,d.length-1);return a?b.localeFormat(e):b.format(e)}else return a?b.toLocaleString():b.toString()})};String.format=function(a){return String._format(a,arguments,false)};String.fromChar=function(a,d){for(var c=a,b=1;b<d;b++)c+=a;return c};String.prototype.htmlDecode=function(){var a=document.createElement("div");a.innerHTML=this;return a.textContent||a.innerText};String.prototype.htmlEncode=function(){var a=document.createElement("div");a.appendChild(document.createTextNode(this));return a.innerHTML.replace(/\"/g,"&quot;")};String.prototype.indexOfAny=function(f,a,e){var b=this.length;if(!b)return-1;a=a||0;e=e||b;var d=a+e-1;if(d>=b)d=b-1;for(var c=a;c<=d;c++)if(f.indexOf(this.charAt(c))>=0)return c;return-1};String.prototype.insert=function(a,b){if(!b)return this;if(!a)return b+this;var c=this.substr(0,a),d=this.substr(a);return c+b+d};String.isNullOrEmpty=function(a){return!a||!a.length};String.prototype.lastIndexOfAny=function(f,a,e){var d=this.length;if(!d)return-1;a=a||d-1;e=e||d;var c=a-e+1;if(c<0)c=0;for(var b=a;b>=c;b--)if(f.indexOf(this.charAt(b))>=0)return b;return-1};String.localeFormat=function(a){return String._format(a,arguments,true)};String.prototype.padLeft=function(b,a){if(this.length<b){a=a||" ";return String.fromChar(a,b-this.length)+this}return this};String.prototype.padRight=function(b,a){if(this.length<b){a=a||" ";return this+String.fromChar(a,b-this.length)}return this};String.prototype.remove=function(a,b){return!b||a+b>this.length?this.substr(0,a):this.substr(0,a)+this.substr(a+b)};String.prototype.replaceAll=function(b,a){a=a||"";return this.split(b).join(a)};String.prototype.startsWith=function(a){return!a.length?true:a.length>this.length?false:this.substr(0,a.length)==a};if(!String.prototype.trim)String.prototype.trim=function(){return this.trimEnd().trimStart()};String.prototype.trimEnd=function(){return this.replace(/\s*$/,"")};String.prototype.trimStart=function(){return this.replace(/^\s*/,"")};Array.__typeName="Array";Array.__interfaces=[ss.IEnumerable];Array.prototype.add=function(a){this[this.length]=a};Array.prototype.addRange=function(a){this.push.apply(this,a)};Array.prototype.aggregate=function(b,c,d){for(var e=this.length,a=0;a<e;a++)if(a in this)b=c.call(d,b,this[a],a,this);return b};Array.prototype.clear=function(){this.length=0};Array.prototype.clone=function(){return this.length===1?[this[0]]:Array.apply(null,this)};Array.prototype.contains=function(b){var a=this.indexOf(b);return a>=0};Array.prototype.dequeue=function(){return this.shift()};Array.prototype.enqueue=function(a){this._queue=true;this.push(a)};Array.prototype.peek=function(){if(this.length){var a=this._queue?0:this.length-1;return this[a]}return null};if(!Array.prototype.every)Array.prototype.every=function(b,c){for(var d=this.length,a=0;a<d;a++)if(a in this&&!b.call(c,this[a],a,this))return false;return true};Array.prototype.extract=function(a,b){return!b?this.slice(a):this.slice(a,a+b)};if(!Array.prototype.filter)Array.prototype.filter=function(d,e){for(var f=this.length,b=[],a=0;a<f;a++)if(a in this){var c=this[a];d.call(e,c,a,this)&&b.push(c)}return b};if(!Array.prototype.forEach)Array.prototype.forEach=function(b,c){for(var d=this.length,a=0;a<d;a++)a in this&&b.call(c,this[a],a,this)};Array.prototype.getEnumerator=function(){return new ss.ArrayEnumerator(this)};Array.prototype.groupBy=function(f,g){for(var h=this.length,d=[],e={},b=0;b<h;b++)if(b in this){var c=f.call(g,this[b],b);if(String.isNullOrEmpty(c))continue;var a=e[c];if(!a){a=[];a.key=c;e[c]=a;d.add(a)}a.add(this[b])}return d};Array.prototype.index=function(d,e){for(var f=this.length,b={},a=0;a<f;a++)if(a in this){var c=d.call(e,this[a],a);if(String.isNullOrEmpty(c))continue;b[c]=this[a]}return b};if(!Array.prototype.indexOf)Array.prototype.indexOf=function(d,b){b=b||0;var c=this.length;if(c)for(var a=b;a<c;a++)if(this[a]===d)return a;return-1};Array.prototype.insert=function(a,b){this.splice(a,0,b)};Array.prototype.insertRange=function(c,b){if(c===0)this.unshift.apply(this,b);else for(var a=0;a<b.length;a++)this.splice(c+a,0,b[a])};if(!Array.prototype.map)Array.prototype.map=function(d,e){for(var b=this.length,c=new Array(b),a=0;a<b;a++)if(a in this)c[a]=d.call(e,this[a],a,this);return c};Array.parse=function(a){return eval("("+a+")")};Array.prototype.remove=function(b){var a=this.indexOf(b);if(a>=0){this.splice(a,1);return true}return false};Array.prototype.removeAt=function(a){this.splice(a,1)};Array.prototype.removeRange=function(b,a){return this.splice(b,a)};if(!Array.prototype.some)Array.prototype.some=function(b,c){for(var d=this.length,a=0;a<d;a++)if(a in this&&b.call(c,this[a],a,this))return true;return false};Array.toArray=function(a){return Array.prototype.slice.call(a)};RegExp.__typeName="RegExp";RegExp.parse=function(a){if(a.startsWith("/")){var b=a.lastIndexOf("/");if(b>1){var c=a.substring(1,b),d=a.substr(b+1);return new RegExp(c,d)}}return null};Date.__typeName="Date";Date.empty=null;Date.get_now=function(){return new Date};Date.get_today=function(){var a=new Date;return new Date(a.getFullYear(),a.getMonth(),a.getDate())};Date.isEmpty=function(a){return a===null||a.valueOf()===0};Date.prototype.format=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toString():a=="id"?this.toDateString():a=="it"?this.toTimeString():this._netFormat(a,false)};Date.prototype.localeFormat=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toLocaleString():a=="id"?this.toLocaleDateString():a=="it"?this.toLocaleTimeString():this._netFormat(a,true)};Date.prototype._netFormat=function(d,i){var b=this,c=i?ss.CultureInfo.CurrentCulture.dateFormat:ss.CultureInfo.InvariantCulture.dateFormat;if(d.length==1)switch(d){case"f":d=c.longDatePattern+" "+c.shortTimePattern;break;case"F":d=c.dateTimePattern;break;case"d":d=c.shortDatePattern;break;case"D":d=c.longDatePattern;break;case"t":d=c.shortTimePattern;break;case"T":d=c.longTimePattern;break;case"g":d=c.shortDatePattern+" "+c.shortTimePattern;break;case"G":d=c.shortDatePattern+" "+c.longTimePattern;break;case"R":case"r":c=ss.CultureInfo.InvariantCulture.dateFormat;d=c.gmtDateTimePattern;break;case"u":d=c.universalDateTimePattern;break;case"U":d=c.dateTimePattern;b=new Date(b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate(),b.getUTCHours(),b.getUTCMinutes(),b.getUTCSeconds(),b.getUTCMilliseconds());break;case"s":d=c.sortableDateTimePattern}if(d.charAt(0)=="%")d=d.substr(1);if(!Date._formatRE)Date._formatRE=/'.*?[^\\]'|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;var g=Date._formatRE,h=new ss.StringBuilder;g.lastIndex=0;while(true){var j=g.lastIndex,f=g.exec(d);h.append(d.slice(j,f?f.index:d.length));if(!f)break;var e=f[0],a=e;switch(e){case"dddd":a=c.dayNames[b.getDay()];break;case"ddd":a=c.shortDayNames[b.getDay()];break;case"dd":a=b.getDate().toString().padLeft(2,"0");break;case"d":a=b.getDate();break;case"MMMM":a=c.monthNames[b.getMonth()];break;case"MMM":a=c.shortMonthNames[b.getMonth()];break;case"MM":a=(b.getMonth()+1).toString().padLeft(2,"0");break;case"M":a=b.getMonth()+1;break;case"yyyy":a=b.getFullYear();break;case"yy":a=(b.getFullYear()%100).toString().padLeft(2,"0");break;case"y":a=b.getFullYear()%100;break;case"h":case"hh":a=b.getHours()%12;if(!a)a="12";else if(e=="hh")a=a.toString().padLeft(2,"0");break;case"HH":a=b.getHours().toString().padLeft(2,"0");break;case"H":a=b.getHours();break;case"mm":a=b.getMinutes().toString().padLeft(2,"0");break;case"m":a=b.getMinutes();break;case"ss":a=b.getSeconds().toString().padLeft(2,"0");break;case"s":a=b.getSeconds();break;case"t":case"tt":a=b.getHours()<12?c.amDesignator:c.pmDesignator;if(e=="t")a=a.charAt(0);break;case"fff":a=b.getMilliseconds().toString().padLeft(3,"0");break;case"ff":a=b.getMilliseconds().toString().padLeft(3).substr(0,2);break;case"f":a=b.getMilliseconds().toString().padLeft(3).charAt(0);break;case"z":a=b.getTimezoneOffset()/60;a=(a>=0?"-":"+")+Math.floor(Math.abs(a));break;case"zz":case"zzz":a=b.getTimezoneOffset()/60;a=(a>=0?"-":"+")+Math.floor(Math.abs(a)).toString().padLeft(2,"0");if(e=="zzz")a+=c.timeSeparator+Math.abs(b.getTimezoneOffset()%60).toString().padLeft(2,"0");break;default:if(a.charAt(0)=="'")a=a.substr(1,a.length-2).replace(/\\'/g,"'")}h.append(a)}return h.toString()};Date.parseDate=function(a){return new Date(Date.parse(a))};Error.__typeName="Error";Error.prototype.popStackFrame=function(){if(ss.isNullOrUndefined(this.stack)||ss.isNullOrUndefined(this.fileName)||ss.isNullOrUndefined(this.lineNumber))return;var a=this.stack.split("\n"),c=a[0],e=this.fileName+":"+this.lineNumber;while(!ss.isNullOrUndefined(c)&&c.indexOf(e)===-1){a.shift();c=a[0]}var d=a[1];if(isNullOrUndefined(d))return;var b=d.match(/@(.*):(\d+)$/);if(ss.isNullOrUndefined(b))return;a.shift();this.stack=a.join("\n");this.fileName=b[1];this.lineNumber=parseInt(b[2])};Error.createError=function(e,b,c){var a=new Error(e);if(b)for(var d in b)a[d]=b[d];if(c)a.innerException=c;a.popStackFrame();return a};ss.Debug=window.Debug||function(){};ss.Debug.__typeName="Debug";if(!ss.Debug.writeln)ss.Debug.writeln=function(a){if(window.console){if(window.console.debug){window.console.debug(a);return}else if(window.console.log){window.console.log(a);return}}else if(window.opera&&window.opera.postError){window.opera.postError(a);return}};ss.Debug._fail=function(a){ss.Debug.writeln(a);eval("debugger;")};ss.Debug.assert=function(b,a){if(!b){a="Assert failed: "+a;confirm(a+"\r\n\r\nBreak into debugger?")&&ss.Debug._fail(a)}};ss.Debug.fail=function(a){ss.Debug._fail(a)};window.Type=Function;Type.__typeName="Type";window.__Namespace=function(a){this.__typeName=a};__Namespace.prototype={__namespace:true,getName:function(){return this.__typeName}};Type.registerNamespace=function(e){if(!window.__namespaces)window.__namespaces={};if(!window.__rootNamespaces)window.__rootNamespaces=[];if(window.__namespaces[e])return;for(var c=window,d=e.split("."),a=0;a<d.length;a++){var f=d[a],b=c[f];if(!b){c[f]=b=new __Namespace(d.slice(0,a+1).join("."));a==0&&window.__rootNamespaces.add(b)}c=b}window.__namespaces[e]=c};Type.prototype.registerClass=function(d,c,a){this.prototype.constructor=this;this.__typeName=d;this.__class=true;this.__baseType=c||Object;if(c)this.__basePrototypePending=true;if(a){this.__interfaces=[];for(var b=2;b<arguments.length;b++){a=arguments[b];this.__interfaces.add(a)}}};Type.prototype.registerInterface=function(a){this.__typeName=a;this.__interface=true};Type.prototype.registerEnum=function(c,b){for(var a in this.prototype)this[a]=this.prototype[a];this.__typeName=c;this.__enum=true;if(b)this.__flags=true};Type.prototype.setupBase=function(){if(this.__basePrototypePending){var a=this.__baseType;a.__basePrototypePending&&a.setupBase();for(var b in a.prototype){var c=a.prototype[b];if(!this.prototype[b])this.prototype[b]=c}delete this.__basePrototypePending}};if(!Type.prototype.resolveInheritance)Type.prototype.resolveInheritance=Type.prototype.setupBase;Type.prototype.initializeBase=function(a,b){this.__basePrototypePending&&this.setupBase();if(!b)this.__baseType.apply(a);else this.__baseType.apply(a,b)};Type.prototype.callBaseMethod=function(b,d,c){var a=this.__baseType.prototype[d];return!c?a.apply(b):a.apply(b,c)};Type.prototype.get_baseType=function(){return this.__baseType||null};Type.prototype.get_fullName=function(){return this.__typeName};Type.prototype.get_name=function(){var a=this.__typeName,b=a.lastIndexOf(".");return b>0?a.substr(b+1):a};Type.prototype.getInterfaces=function(){return this.__interfaces};Type.prototype.isInstanceOfType=function(a){if(ss.isNullOrUndefined(a))return false;if(this==Object||a instanceof this)return true;var b=Type.getInstanceType(a);return this.isAssignableFrom(b)};Type.prototype.isAssignableFrom=function(c){if(this==Object||this==c)return true;if(this.__class){var a=c.__baseType;while(a){if(this==a)return true;a=a.__baseType}}else if(this.__interface){var b=c.__interfaces;if(b&&b.contains(this))return true;var a=c.__baseType;while(a){b=a.__interfaces;if(b&&b.contains(this))return true;a=a.__baseType}}return false};Type.isClass=function(a){return a.__class==true};Type.isEnum=function(a){return a.__enum==true};Type.isFlags=function(a){return a.__enum==true&&a.__flags==true};Type.isInterface=function(a){return a.__interface==true};Type.isNamespace=function(a){return a.__namespace==true};Type.canCast=function(a,b){return b.isInstanceOfType(a)};Type.safeCast=function(a,b){return b.isInstanceOfType(a)?a:null};Type.getInstanceType=function(b){var a=null;try{a=b.constructor}catch(c){}if(!a||!a.__typeName)a=Object;return a};Type.getType=function(a){if(!a)return null;if(!Type.__typeCache)Type.__typeCache={};var b=Type.__typeCache[a];if(!b){b=eval(a);Type.__typeCache[a]=b}return b};Type.parse=function(a){return Type.getType(a)};ss.Delegate=function(){};ss.Delegate.registerClass("Delegate");ss.Delegate.empty=function(){};ss.Delegate._contains=function(b,d,c){for(var a=0;a<b.length;a+=2)if(b[a]===d&&b[a+1]===c)return true;return false};ss.Delegate._create=function(a){var b=function(){if(a.length==2)return a[1].apply(a[0],arguments);else{for(var c=a.clone(),b=0;b<c.length;b+=2)ss.Delegate._contains(a,c[b],c[b+1])&&c[b+1].apply(c[b],arguments);return null}};b._targets=a;return b};ss.Delegate.create=function(b,a){return!b?a:ss.Delegate._create([b,a])};ss.Delegate.combine=function(a,b){if(!a)return!b._targets?ss.Delegate.create(null,b):b;if(!b)return!a._targets?ss.Delegate.create(null,a):a;var c=a._targets?a._targets:[null,a],d=b._targets?b._targets:[null,b];return ss.Delegate._create(c.concat(d))};ss.Delegate.remove=function(c,a){if(!c||c===a)return null;if(!a)return c;var b=c._targets,f=null,e;if(a._targets){f=a._targets[0];e=a._targets[1]}else e=a;for(var d=0;d<b.length;d+=2)if(b[d]===f&&b[d+1]===e){if(b.length==2)return null;b.splice(d,2);return ss.Delegate._create(b)}return c};ss.Delegate.createExport=function(b,c,a){a=a||"__"+(new Date).valueOf();window[a]=c?b:function(){try{delete window[a]}catch(c){window[a]=undefined}b.apply(null,arguments)};return a};ss.Delegate.deleteExport=function(a){delete window[a]};ss.Delegate.clearExport=function(a){window[a]=ss.Delegate.empty};ss.CultureInfo=function(c,a,b){this.name=c;this.numberFormat=a;this.dateFormat=b};ss.CultureInfo.registerClass("CultureInfo");ss.CultureInfo.InvariantCulture=new ss.CultureInfo("en-US",{naNSymbol:"NaN",negativeSign:"-",positiveSign:"+",negativeInfinityText:"-Infinity",positiveInfinityText:"Infinity",percentSymbol:"%",percentGroupSizes:[3],percentDecimalDigits:2,percentDecimalSeparator:".",percentGroupSeparator:",",percentPositivePattern:"{0} %",percentNegativePattern:"-{0} %",currencySymbol:"$",currencyGroupSizes:[3],currencyDecimalDigits:2,currencyDecimalSeparator:".",currencyGroupSeparator:",",currencyNegativePattern:"(${0})",currencyPositivePattern:"${0}",numberGroupSizes:[3],numberDecimalDigits:2,numberDecimalSeparator:".",numberGroupSeparator:","},{amDesignator:"AM",pmDesignator:"PM",dateSeparator:"/",timeSeparator:":",gmtDateTimePattern:"ddd, dd MMM yyyy HH:mm:ss 'GMT'",universalDateTimePattern:"yyyy-MM-dd HH:mm:ssZ",sortableDateTimePattern:"yyyy-MM-ddTHH:mm:ss",dateTimePattern:"dddd, MMMM dd, yyyy h:mm:ss tt",longDatePattern:"dddd, MMMM dd, yyyy",shortDatePattern:"M/d/yyyy",longTimePattern:"h:mm:ss tt",shortTimePattern:"h:mm tt",firstDayOfWeek:0,dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],minimizedDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December",""],shortMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]});ss.CultureInfo.CurrentCulture=ss.CultureInfo.InvariantCulture;ss.IEnumerator=function(){};ss.IEnumerator.getEnumerator=function(a){return a?a.getEnumerator?a.getEnumerator():new ss.ArrayEnumerator(a):null};ss.IEnumerator.registerInterface("IEnumerator");ss.IEnumerable=function(){};ss.IEnumerable.registerInterface("IEnumerable");ss.ArrayEnumerator=function(a){this._array=a;this._index=-1;this.current=null};ss.ArrayEnumerator.prototype={moveNext:function(){this._index++;this.current=this._array[this._index];return this._index<this._array.length},reset:function(){this._index=-1;this.current=null}};ss.ArrayEnumerator.registerClass("ArrayEnumerator",null,ss.IEnumerator);ss.IDisposable=function(){};ss.IDisposable.registerInterface("IDisposable");ss.StringBuilder=function(a){this._parts=!ss.isNullOrUndefined(a)?[a]:[];this.isEmpty=this._parts.length==0};ss.StringBuilder.prototype={append:function(a){if(!ss.isNullOrUndefined(a)){this._parts.add(a);this.isEmpty=false}return this},appendLine:function(a){this.append(a);this.append("\r\n");this.isEmpty=false;return this},clear:function(){this._parts=[];this.isEmpty=true},toString:function(a){return this._parts.join(a||"")}};ss.StringBuilder.registerClass("StringBuilder");ss.EventArgs=function(){};ss.EventArgs.registerClass("EventArgs");ss.EventArgs.Empty=new ss.EventArgs;if(!window.XMLHttpRequest)window.XMLHttpRequest=function(){for(var b=["Msxml2.XMLHTTP","Microsoft.XMLHTTP"],a=0;a<b.length;a++)try{return new ActiveXObject(b[a])}catch(d){}return null};ss.parseXml=function(d){try{if(DOMParser){var e=new DOMParser;return e.parseFromString(d,"text/xml")}else for(var c=["Msxml2.DOMDocument.3.0","Msxml2.DOMDocument"],b=0;b<c.length;b++){var a=new ActiveXObject(c[b]);a.async=false;a.loadXML(d);a.setProperty("SelectionLanguage","XPath");return a}}catch(f){}return null};ss.CancelEventArgs=function(){ss.CancelEventArgs.initializeBase(this);this.cancel=false};ss.CancelEventArgs.registerClass("CancelEventArgs",ss.EventArgs);ss.Tuple=function(b,a,c){this.first=b;this.second=a;if(arguments.length==3)this.third=c};ss.Tuple.registerClass("Tuple");ss.Observable=function(a){this._v=a;this._observers=null};ss.Observable.prototype={getValue:function(){this._observers=ss.Observable._captureObservers(this._observers);return this._v},setValue:function(b){if(this._v!==b){this._v=b;var a=this._observers;if(a){this._observers=null;ss.Observable._invalidateObservers(a)}}}};ss.Observable._observerStack=[];ss.Observable._observerRegistration={dispose:function(){ss.Observable._observerStack.pop()}};ss.Observable.registerObserver=function(a){ss.Observable._observerStack.push(a);return ss.Observable._observerRegistration};ss.Observable._captureObservers=function(a){var c=ss.Observable._observerStack,d=c.length;if(d){a=a||[];for(var b=0;b<d;b++){var e=c[b];!a.contains(e)&&a.push(e)}return a}return null};ss.Observable._invalidateObservers=function(b){for(var a=0,c=b.length;a<c;a++)b[a].invalidateObserver()};ss.Observable.registerClass("Observable");ss.ObservableCollection=function(a){this._items=a||[];this._observers=null};ss.ObservableCollection.prototype={get_item:function(a){this._observers=ss.Observable._captureObservers(this._observers);return this._items[a]},set_item:function(a,b){this._items[a]=b;this._updated()},get_length:function(){this._observers=ss.Observable._captureObservers(this._observers);return this._items.length},add:function(a){this._items.push(a);this._updated()},clear:function(){this._items.clear();this._updated()},contains:function(a){return this._items.contains(a)},getEnumerator:function(){this._observers=ss.Observable._captureObservers(this._observers);return this._items.getEnumerator()},indexOf:function(a){return this._items.indexOf(a)},insert:function(a,b){this._items.insert(a,b);this._updated()},remove:function(a){if(this._items.remove(a)){this._updated();return true}return false},removeAt:function(a){this._items.removeAt(a);this._updated()},toArray:function(){return this._items},_updated:function(){var a=this._observers;if(a){this._observers=null;ss.Observable._invalidateObservers(a)}}};ss.ObservableCollection.registerClass("ObservableCollection",null,ss.IEnumerable);ss.IApplication=function(){};ss.IApplication.registerInterface("IApplication");ss.IContainer=function(){};ss.IContainer.registerInterface("IContainer");ss.IObjectFactory=function(){};ss.IObjectFactory.registerInterface("IObjectFactory");ss.IEventManager=function(){};ss.IEventManager.registerInterface("IEventManager");ss.IInitializable=function(){};ss.IInitializable.registerInterface("IInitializable")