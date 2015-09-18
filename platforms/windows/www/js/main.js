// JavaScript Document

var related = (function() {
  	
	// Module variables
	var _initiated = false;
	
	//////////////////////////////////////////////////////////////////////
	// Lab parameters
	//////////////////////////////////////////////////////////////////////
	var _id = null;
	var _username = null;
	var _experiment_id = null;
	var _experiment_name = null;
	var _experiment_time = 0;
	var _startDate = null;
	var _stopDate = null;
	var _slot_time = 0;
    var _tokenInfo = null;
	var _tokenId = null;
	//////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////
	// Objects defining the lab info
	//////////////////////////////////////////////////////////////////////
	var _lab = null; // new Lab(host,port,id);
	// Test if REST service if alive !!!
	var _lab_name = null; // getLabName(lab);
	// Experiment vars and params
	var _experiment_vars = null;
	var _experiment_params = null;
		// Local  modules
	var _local_modules = null;
	// Remote modules
	var _remote_modules = null;
	var _remote_systems = null;
	//////////////////////////////////////////////////////////////////////
	
	var _experiment_vars_in_experiment = null;
	
	//////////////////////////////////////////////////////////////////////
	// Web views
	// Urls array indicating the view
	//////////////////////////////////////////////////////////////////////
	var _web_views = null;
	var _onReceiveDataViewHandlers = [];
	var _views_iframes = [];
	//////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////
	// Status for experiment in the app
	// Defines if the experiment is running
	var _running = false;
	// Sessions openend in lab
	var _sessions_openned = null;
	var _session = null;
	// Session timer
	var _session_start_time;
	var _session_stop_time;
	var _timerSessionId;
	var _timerSessionInterval = 1000;
	var _experiment_sessions = 0;
	//////////////////////////////////////////////////////////////////////
	
	
	//////////////////////////////////////////////////////////////////////
	// graphs
	// Array with items including:
	// chart, names associated to chart, module and system
	//////////////////////////////////////////////////////////////////////
	var _charts = new Array();
	var _interactives_vars_containers = new Array();
	//options for graphs
	var _max_seconds_graphs = 20;
	var _smooth_lines = false; 
	// Last tab index selected
	// First by default
	var _graph_tab_index = 0;
	//////////////////////////////////////////////////////////////////////
	
	
	// Used for control the div showing
	var _showingContainer = 'session_info_content';
	
	
	// Wait for openned connection
	// $("#startstopBtn").attr("disabled", "disabled");
	
	var _onBeforeExit = function(){
		// Check if experiment is running
		if (_running){
			// Stop the experiment
			_stopExp();
		}
		// Close the session
		if (session != null){
			rlab_closeSession(_session);
		}
		// _openExperimentalDataWindow();
		if (_experiment_sessions>0){
			// Stop the session
			// This action close the session also
			_session_stop_time = new Date();
			$('#session_stop_datetime').html(_session_stop_time.toLocaleString());
			return "Session was closed. If you want to see the experimental data, do not go out and press the toolbar button";
		} /*else {
			if (session != null){
				rlab_closeSession(_session);
			}
		}*/
	}
	
	var _onExit = function(){
		
	}
	
    var _loadDataFromLocalStorage = function (){
        var tokenOk = false;
		// try to load the token_id parameter
        if (localStorage.labTokenInfo != null){
			_tokenInfo = JSON.parse(localStorage.labTokenInfo);
            localStorage.removeItem("labTokenInfo");
			// Data from token
			_id = _tokenInfo.systemId;
			_tokenId = _tokenInfo.token;
			_username = _tokenInfo.user;
			_experiment_id = _tokenInfo.experimentId;
			_startDate = parseFloat(_tokenInfo.startDate);
			_stopDate = parseFloat(_tokenInfo.stopDate);
			tokenOk = true;
			// Calculate the slot time in minutes
			_slot_time = (_stopDate - _startDate)/(60*1000);
        } 
		return tokenOk;
    }
    
  	var initApp = function(onTokenError){	
		if (!_initiated){
			// Read token...
			var tokenOk = _loadDataFromLocalStorage();
			if(!tokenOk){
				onTokenError();
				return;
			}
            var lab_info = null;
			
			if (_id != null){
				// port And Id is got from Lab data
				// port = getParameter("lab_port");		
				lab_info = RLAB.SERVICES.SYSTEMS.getSystemInfo(_id);
			}
			
			if (lab_info!=null){
				var _port = lab_info.rest_port;
				var _host = lab_info.IP;
			
				// Create a lab object
				_lab = new Lab(_host,_port,_id);
				
				// Test if REST service if alive !!!
				_lab_name = getLabName(_lab);
				var experimentOk = false;
				if (typeof _lab_name === "undefined"){
					_lab_name = null;
				} else {
					// Check for experiment id !!!
					var experiment_info = RLAB.SERVICES.SYSTEMS.getExperimentInfo(_lab.id,_experiment_id);
					if (experiment_info != null){
						_experiment_name = experiment_info.experiment_name;
						// Get experiment time REST
						_experiment_time = getExperimentTime(_lab,_experiment_name);
						experimentOk = true;
					}
				}
				// Check is being used !!!
				_sessions_openned = RLAB.SERVICES.SESSIONS.getOpenSessionsForSystem(_id);
			}
			 
					
			if ((_lab_name != null) & (experimentOk) & (_sessions_openned==null)){
				
				// Store vars
				_experiment_vars = getVarsFromExperiment(_lab,_experiment_name);
				// Store params
				_experiment_params = getParams(_lab);
				// Store local modules names
				_local_modules = getLocalModulesNames(_lab,_experiment_name);
				// Store remote modules names and system (REST service!!!)
				_remote_modules = getRemoteModulesNames(_lab,_experiment_name);
				_remote_systems = getRemoteModulesSystemsNames(_lab,_experiment_name);
				
				// Fill the information about experiment
				_buildGeneralInformationUI();
				
				_buildMainContent(_startDate, _stopDate);
				
				// Build views
				// Calling the corrresponding REST service
				urls = getWebViewsUrlsFromExperiment(_lab,_experiment_name);
				
				if (urls!=null && $.isArray(urls)){
					_web_views = urls;
					var web_views_names = getWebViewsFromExperiment(_lab,_experiment_name);
					var web_views_descriptions = getWebViewsDescriptionsFromExperiment(_lab,_experiment_name);
					_buildViews(_web_views, web_views_names, web_views_descriptions);
				}
				
				// Build charts interface
				_createCharts(_lab,_experiment_name);
				
				// Build interactives interface
				_buildInteractives(_lab,_experiment_name,_local_modules,_remote_modules,_remote_systems);
				
				// Get the session and start a session
				_session = getSession(_host,_port,_username,_experiment_name,_slot_time,
								  _onDataReceived,_onOpenCallback,
								  _onCloseCallback,_onErrorCallback);
				
				// Start timer function for session
				_timerSessionId = setInterval(_sessionTimerControl, _timerSessionInterval);
				
				// enable start/stop button
				$("#startstopBtn").removeAttr('disabled')
				$("#startstopBtn").on("click",_startstopBtnOnclick);
				
				// Show the first graph by default
				if (_charts != null && _charts.length>0){
					showContainer(_charts[0]['container']);
				}
	
			} else {
				_buildMainContent(new Date().getTime(), new Date().getTime());
				if (_sessions_openned!=null){
					_showErrorMessage("The lab is being used now.<br/><br/>Try later...");
				} else {
					_showErrorMessage("Wrong lab connection parameters !!!.");
				}
			} 
			
			// Remove class loading
			$('#dvLoading').addClass('hide');
			$("#graphs_menu_icon").removeClass('fa-spin');
			$("#vars_menu_icon").removeClass('fa-spin');
			$("#views_menu_icon").removeClass('fa-spin');
			
			// Sidebar 
			$('[data-toggle=offcanvas]').click(function() {
				$('.row-offcanvas').toggleClass('active');
			});
			_initiated = true;
		}
		
    }
	
	
	///////////////////////////////////////////////////////////
	// Private function !!!
	// Set the info data for lab
	///////////////////////////////////////////////////////////
	_buildGeneralInformationUI = function (){
		$('#lab_name_div').html( _lab_name );
		$('#experiment_name_div').html( _experiment_name );
		$('#username_div').html( _username );
 	}
	
	///////////////////////////////////////////////////////////
	// Private function !!!
	// Set the info data for lab
	///////////////////////////////////////////////////////////
	_showErrorMessage = function (html_message){
		$("#error_message").html(html_message);
		$("#error_div").modal();
 	}
	
	_showInfoMessage = function (html_message){
		$("#info_message").html(html_message);
		$("#info_div").modal();
	}
	
	///////////////////////////////////////////////////////////
	// Private function !!!
	// Built the sessioninfo and time related data for lab
	///////////////////////////////////////////////////////////
	_buildMainContent = function (_session_start_time,_session_stop_time){
		// In minutes
		// _session_start_time = new Date();
		_session_startTime = new Date(_session_start_time);
		$('#session_start_datetime').html(_session_startTime.toLocaleString());
		// Add session time to now
		//_session_stop_time = new Date();
		//minutes = _session_start_time.getMinutes() + work_session_time;
		//_session_stop_time.setTime(_session_start_time.getTime() + 60000*work_session_time);
		_session_stopTime = new Date(_session_stop_time);
		$('#session_stop_datetime').html(_session_stopTime.toLocaleString());
		// Remaining time
		var work_session_time = 0;
		var now = new Date().getTime();
		if (_session_stop_time > _session_start_time &&
			now >= _session_start_time && now<=_session_stop_time){
				work_session_time = _session_stop_time - now;
				// To minutes !!!
				work_session_time = work_session_time/(60*1000);
		}
		$('#session_remaining_datetime').html(work_session_time + " minutes");
	}
	
	///////////////////////////////////////////////////////////
	// Private function !!!
	// Built the graphs defined in the lab
	///////////////////////////////////////////////////////////
	_createCharts = function (lab,experiment){
		// Configure chart
		// returns an array with items having the next structure
		// module --> module name
		// system --> system name (local if not remote module are included)
		// names --> Array with variables names
		// colors --> Array with colors values (RGB: #XXXXXX)
		// Get REST function value
		var graphs_info = getGraphsInfo(lab,experiment);
		if (typeof graphs_info === "undefined"){
			graphs_info = null;
		}
		if (graphs_info != null){
			for (var i = 0; i<graphs_info.length; i++){
				var container_name = "chart" + i;
				// Add the link in nav tab
				var ul_ref = $("#graphs_links_container");
				var tab_title = _createGraphTitle((graphs_info[i])['names']);
				/*var li_ref = "<li class='pull-left'><a href='#' onclick=\"showContainer('panel-" + container_name + "'); return false;\"> <i class='fa fa-share'></i> " + 
								tab_title + "</a></li>";*/
				var li_ref = "<h4 class='well well-sm'><span class='glyphicon glyphicon-chevron-right'></span><a class='modal_link' href='#' onclick=\"related.show('panel-" + container_name + "','modal-graphs'); return false;\"> " + 
								tab_title + "</a> <span class='pull-right' data-toggle='tooltip' title='Trend graphic'><i class='fa fa-info'></i></span>";
								
				
				
				ul_ref.append(li_ref);
				// Add a divider to the links
				/*if (i<graphs_info.length-1){
					divider = "<li class='divider'></li>";
				}*/
				
				// Create chart in the document as a row inside objects_container!!!						
				var html_element = '<div class="row clearfix"><div class="col-md-12 column">';
				html_element += '<div id="panel-' + container_name + '" class="panel panel-primary hide">';
				//html_element += '<div id="panel-' + container_name + '" class="panel panel-primary">';
				html_element += '<div class="panel-heading"><h3 class="panel-title">';
				html_element += '<i class="fa fa-bar-chart-o"></i> ' + tab_title;
				html_element += '</h3></div>';
				html_element += '<div class="panel-body">';
				html_element += '<div class="graph_style">'; // Wrapper style for graph
                html_element += '<div id="' + container_name + '" ></div>';
				html_element += '</div>'; // End of wrapper
                html_element += '</div>'; // End of panel body
				html_element += '</div>'; // End of panel-primary
				html_element += '</div></div>'; // End or row
            	
				// Add to carousel
				// Indicator
				
				// Item
				/*var carousel_item = "<div class='item'>";
                carousel_item += "<h2>" + tab_title + "</h2>";
                carousel_item += "<div class='carousel-caption'>";
                carousel_item += "<h3>" + tab_title + "</h3>";
                carousel_item += html_element;
                carousel_item += "</div>"
                carousel_item += "</div>";
				$('#objects_carousel-items').append(carousel_item);*/
				
				$('#objects_container').append(html_element);
				
				// Add chart
				chart = _createChart(container_name,graphs_info[i],_smooth_lines);
				chart_info = new Array();
				chart_info['chart'] = chart;
				chart_info['names'] = (graphs_info[i])['names'];
				chart_info['module'] = (graphs_info[i])['module'];
				chart_info['system'] = (graphs_info[i])['system'];
				chart_info['container'] = "panel-" + container_name;
				_charts.push(chart_info);
				
			}
			$("#graphs_menu_icon").removeClass('fa-spin');
			//$("#graphs_menu_icon_number").html(graphs_info.length);
		} 
	}
	
	// AUXILIAR FUNCTION TO MANAGE CHARTS
	_createGraphTitle = function(names){
		var t = "No title";
		if (names !=null){
			t = "";
			for (i=0; i<names.length; i++){
				t += names[i];
				if (i<names.length-1){
					t+=",";
				}
			}
		}
		return t;
	}
	
	_createChart = function(container_name, graph_info,smooth){
		Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
		if (smooth){
			type_graph = 'spline';
		} else {
			type_graph = 'line';
		}
		var title_graph = graph_info['module'];
		chart = new Highcharts.Chart({
            chart: {
				type: type_graph,
				renderTo: container_name,
                //marginRight: 10,
            },
			reflow: false,
            title: { text: title_graph },
            xAxis: { title: { text: 'Time'}, type: 'linear' },
            yAxis: {  title: { text: 'Values' } }, //, plotLines: createPlotLines(names,colors) },
            exporting: {enabled: true}
        });
		_createSeries(chart, graph_info['names'], graph_info['colors']);
		return chart;
	}// End of createChart!!!
		
	_createSeries = function(chart, names, colors){
		var n = names.length;
		for (index = 0; index < n; ++index) {
    		serie = { name: names[index], animation:false, lineWidth: 1, color: colors[index], marker:{enabled: false}, data:[] };
			// Argument 1: serie options
			// Argument 2: redraw: Boolean
			// Defaults to true. Whether to redraw the chart after the series is added. See the redraw()method below.
			// Argument 3: animation: Mixed
			// Defaults to true. When true, the series' updating will be animated with default animation options. The animation can also be a configuration object with properties durationand easing.
			chart.addSeries(serie, true, false);
		} 
	}
	
	_resetChartsData = function (){
		for (j=0; j<_charts.length; j++){
		   var aChart = (_charts[j])['chart'];
		   if (aChart!=null){
		   		_resetSingleChartData(aChart);
		   }
		}
	}
	
	_resetSingleChartData = function(chart){
		var series = chart.series;
		for (i=0;i<series.length;i++){
			series[i].setData([]);
		}
	}
		
	_updateData = function(chart,series_name, value, time){
		var series = chart.series;
		var n = series.length;
		for (index=0; index<n;++index){
			var serie = series[index];
			if(serie.name==series_name){
				//serie.data.push([time,value]);
				var v = parseFloat(value); 
				// Value to add to the serie, redraw, shift
				var shift = time>_max_seconds_graphs;
				// Last arguument: animation
				serie.addPoint([time,v], false, shift,false);
				//console.log("Associated with. " + serie.yAxis);
				//console.log('Added value to ' + serie.name + ', total:' + serie.data.length);
				break;
			}
		}
	
	}
	
	///////////////////////////////////////////////////////////
	// Private function !!!
	// Built the interactives vars panels, using the module approach
	///////////////////////////////////////////////////////////
	_buildInteractives = function(lab,experiment_name,local_modules,remote_modules,remote_systems){
		var localInteractives = false;
		var remoteInteractives = false;
		var entries_number = 0;
		if (local_modules !=null){
			for (var i=0; i<local_modules.length; i++){
				var module_name = local_modules[i];
				var interactive_variables_module = 
						getLocalInteractiveVariables(lab,experiment_name,module_name);
				if (interactive_variables_module !=null){
					_createInteractiveVarsDiv(module_name,interactive_variables_module,false,null);
					localInteractives = true;
					entries_number ++;
				}
			}
		}
		
		if (remote_modules !=null && remote_systems !=null){
			for (i=0; i<remote_modules.length; i++){
				var module_name = remote_modules[i];
				var system_name = remote_systems[i];
				var interactive_variables_module = 
					getRemoteInteractiveVariables(lab,experiment_name,module_name,system_name);
				if (interactive_variables_module !=null){
					_createInteractiveVarsDiv(module_name,interactive_variables_module,true,system_name);
					remoteInteractives = true;
					entries_number ++;
				}
			}
		}
		$("#vars_menu_icon").removeClass('fa-spin');
		//$("#vars_menu_icon_number").html(entries_number);
	}
	
	_createInteractiveVarsDiv = function (module_name,interactive_variables_module,remote,system_name){
		// Define inner container name 
		var container_name = "interactives-" + module_name;
		
		// Create li entry
		// Replace all blank spaces with -
		container_name = container_name.replace(/ /g, "-");
		// container_name = container_name.split(' ').join('-');
		var ul_ref = $("#variables_links_container");
		//var li_ref = "<li class='pull-left'><a href='#' onclick=\"showContainer('panel-" + container_name + "'); return false;\"> <i class='fa fa-share'></i> " + 
		//						module_name + "</a></li>";
		var li_ref = "<h4 class='well well-sm'>";
		li_ref += "<span class='glyphicon glyphicon-chevron-right'></span>";
		li_ref += "<a class='modal_link' href='#' onclick=\"related.show('panel-" + container_name + "','modal-variables'); return false;\"> ";
		li_ref += module_name + "</a> <span class='pull-right' data-toggle='tooltip' title='Interactive variables for module: " + module_name + "'><i class='fa fa-info'></i></span>";
				
		ul_ref.append(li_ref);
		
		// Create chart in the document as a row inside objects_container!!!						
		var html_element = '<div class="row clearfix"><div class="col-md-12 column">';
		html_element += '<div id="panel-' + container_name + '" class="panel panel-primary hide">';
		//html_element += '<div id="panel-' + container_name + '" class="panel panel-primary">';
		html_element += '<div class="panel-heading"><h3 class="panel-title">';
		html_element += '<i class="fa fa-tasks"></i> Variables for module: ' + module_name;
		if (remote){
			html_element += " (Remote)";
		}
		html_element += '</h3></div>';
		html_element += '<div class="panel-body">';
		html_element += '<div id="' + container_name + '"></div>';
		html_element += '</div>'; // End of panel body
		html_element += '</div>'; // End of panel-primary
		html_element += '</div></div>'; // End or row
            	
		// Item
		/*var carousel_item = "<div class='item'>";
        carousel_item += "<h2>" + module_name + "</h2>";
        carousel_item += "<div class='carousel-caption'>";
        carousel_item += "<h3>" + module_name + "</h3>";
        carousel_item += html_element;
        carousel_item += "</div>"
        carousel_item += "</div>";
		$('#objects_carousel-items').append(carousel_item);*/
				
		$('#objects_container').append(html_element);				
		
		// Fill the div with interactive vars
		if (interactive_variables_module != null){
			var div_tab = $("#"+container_name);
			for (var i=0; i<interactive_variables_module.length; i++){
				var variable_name = interactive_variables_module[i];
				if (!remote){
					myVar = getVarByName(_lab,variable_name,module_name);
				} else {
					myVar = getRemoteVarByName(variable_name,module_name,system_name);
				}
				html_element = related_editors.createEditor(myVar,_interactives_vars_containers)
				div_tab.append(html_element);
				// Add the link to sidebar
				var var_id = _createId(myVar);
				var li_item = "<li class='list-group-item modal_link link_inline' title='" + myVar.description + "'>";
				editorFunction = 'related_editors.createEditorModal("' + var_id + '");return false;';
                li_item = "<div class='text-center' style='display:inline-block;margin-left:5px;margin-right:5px;'>";
				li_item += "<i class='fa fa-pencil-square-o icon-circle-small'></i><br/>"
				li_item += "<a href='#' onclick='" + editorFunction + "'><span class='wrapText'>"  + variable_name + "</span></a>";
                li_item += "</div>";
				li_item += "</li>";
				$('#vars_list').append(li_item);
				
			}
		}
		
	}
	
	///////////////////////////////////////////////////////////
	// Private function !!!
	// Built the views iframes to include webviews defined in the lab
	///////////////////////////////////////////////////////////
	_buildViews = function(web_views_url,web_views_names,web_views_descriptions){
		var entries_number = 0;
 		if (web_views_url!=null){
			var l = web_views_url.length;
			for (i=0; i<l; i++){
				var container_name = "View-"+i;
				var ul_ref = $("#views_links_container");
				//var li_ref = "<li class='pull-left'><a href='#' onclick=\"showContainer('panel-" + container_name + "'); return false;\"> <i class='fa fa-share'></i> " + 
				//				web_views_names[i] + "</a></li>";
				var li_ref = "<h4 class='well well-sm'><span class='glyphicon glyphicon-chevron-right'></span><a class='modal_link' href='#' onclick=\"related.show('panel-" + container_name + "','modal-views'); return false;\"> " + 
								web_views_names[i] + "</a> <span class='pull-right' data-toggle='tooltip' title='" + web_views_descriptions[i] + "'><i class='fa fa-info'></i></span>";
								
				ul_ref.append(li_ref);
				// Add a divider to the links
				/*if (i<l-1){
					divider = "<li class='divider'></li>";
				} */
				
				// var html_element = '<div class="row clearfix"><div class="col-md-12 column">';
				var html_element = '';
				html_element += '<div id="panel-' + container_name + '" class="panel panel-primary hide">';
				//html_element += '<div id="panel-' + container_name + '" class="panel panel-primary">';
				html_element += '<div class="panel-heading"><h3 class="panel-title">';
				html_element += '<i class="fa fa-desktop"></i> ' + web_views_descriptions[i];
				html_element += '</h3></div>';
				html_element += '<div class="panel-body">';
                html_element += '<div class="iframe_general_style" id="iframe-' + container_name + '"></div>';
                html_element += '</div>'; // End of panel body
				html_element += '</div>'; // End of panel-primary
				html_element += '</div></div>'; // End or row
            	
				
				// Item
				/*var carousel_item = "<div class='item'>";
				carousel_item += "<h2>" + web_views_descriptions[i] + "</h2>";
				carousel_item += "<div class='carousel-caption'>";
				carousel_item += "<h3>" + web_views_descriptions[i] + "</h3>";
				carousel_item += html_element;
				carousel_item += "</div>"
				carousel_item += "</div>";
				$('#objects_carousel-items').append(carousel_item);*/
		
				$('#objects_container').append(html_element);
				
				
				// Load html from view
				/*$( "#"+container_name ).load( web_views_url[i], function() {
					$( "#"+container_name).trigger('create');
				});*/
				$( "#iframe-"+container_name ).html('<iframe width="100%" height="100%" src="' + 
					web_views_url[i] + '" id="' + (container_name+"_iframe") + 
					'" onload="_configureFrame(this.id)" seamless sandbox="allow-same-origin allow-scripts allow-top-navigation"></iframe>');
			}
			entries_number = l;
		} 
		$("#views_menu_icon").removeClass('fa-spin');
		//$("#views_menu_icon_number").html(entries_number);
	}
	
	_configureFrame = function(id) {
		var ifrm = document.getElementById(id);
		var doc = ifrm.contentDocument? ifrm.contentDocument: 
			ifrm.contentWindow.document;
		ifrm.style.visibility = 'hidden';
		ifrm.style.height = "10px"; // reset to minimal height ...
		// IE opt. for bing/msn needs a bit added or scrollbar appears
		ifrm.style.height = _getDocHeight( doc ) + 15 + "px";
		ifrm.style.visibility = 'visible';
		// add to array of views iframes
		_views_iframes.push(ifrm);
	}

	_getDocHeight = function(doc) {
		doc = doc || document;
		var body = doc.body, html = doc.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight, 
			html.clientHeight, html.scrollHeight, html.offsetHeight );
		return height;
	}
	
	
	///////////////////////////////////////////////////////////
	// CONTROL EXPERIMENT FUNCTIONS
	///////////////////////////////////////////////////////////
 	_startExp = function(){	
		var ok = initExperiment(_lab, _experiment_name);
		if (ok==true){
			setUserNameRunningExperiment(_lab,_experiment_name,_username);
			// Calling corresponding rest service
			ok = startExperiment(_lab,_experiment_name);
			if(ok==true){
				_resetChartsData();
				_invokeStartEventOnWebViews();
				$("#startstopBtn").text("Stop");
				_running = true;
				$("#startstopBtn").removeClass('btn-success');
				$("#startstopBtn").addClass('btn-danger');
				$("#running_icon").removeClass('hide');
			} else {
				$("#error_div").text("Error starting experiment!!!");
			}
		} else {
			$("#error_div").text("Error initiating experiment!!!");
		}
		
	}
	
	_stopExp = function(){
		var ok = stopExperiment(_lab, _experiment_name);
		if (ok==true){
			_invokeStopEventOnWebViews();
			$("#startstopBtn").text("Start");
			_running = false;
			$("#startstopBtn").removeClass('btn-danger');
			$("#startstopBtn").addClass('btn-success');
			$("#running_icon").addClass('hide');
			// New experiment session
			_experiment_sessions++;
		} else {
			$("#error_div").text("Error stopping experiment!!!");
		}
		
	}
	
	_startstopBtnOnclick = function (event){
		// Depending on state, do start of stop function
		if (_running==true){
			$('#dvLoading').removeClass('hide');
			_stopExp();
			$('#time_progress_bar_style').removeClass('progress-striped');
			$('#dvLoading').addClass('hide');
		} else {
			$('#dvLoading').removeClass('hide');
			_startExp();
			$("#preload").hide();
			// Change progress bar to stripped
			$('#time_progress_bar_style').addClass('progress-striped');
			$('#dvLoading').addClass('hide');
		}
	}
	
	/*
	*********************************************************************************
	
		EVENT FUNCTIONS FOR WEB VIEWS
	*********************************************************************************
	*/
	_invokeStartEventOnWebViews = function (){
		var l = _views_iframes.length;
		for(j=0; j<l;j++){
			try
			{
				_views_iframes[j].contentWindow.onRLABStartExperiment(_experiment_vars,_experiment_params);
			}
			catch (error)
			{
				console.log("Error calling start experiment event --> Function " + 
				_views_iframes[j].contentWindow.onRLABStartExperiment + ": " + error);
			}
		}
	}

	_invokeStopEventOnWebViews = function(){
		var l = _views_iframes.length;
		for(j=0; j<l;j++){
			try
			{
				_views_iframes[j].contentWindow.onRLABStopExperiment(_experiment_vars,_experiment_params);
			}
			catch (error)
			{
				console.log("Error calling stop experiment event --> Function " + 
				_views_iframes[j].contentWindow.onRLABStopExperiment + ": " + error);
			}
		}
	}
	///////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	
	
	///////////////////////////////////////////////////////////
	//	CALLBACKS FOR WEBSOCKET USING IN SESSION
	///////////////////////////////////////////////////////////
	
	// Callback function used to get data received!!!
	_onDataReceived = function(data){
		if (data.command=="data"){
			var dataOnExp = data.data;
			var time = dataOnExp.sealed_time;
			time = time/1000;
			formattedTime = _formatSecondsAsTime(time,null);
			$("#elapsed_time_div").html("<strong>" + formattedTime + "</strong>");
			if (_experiment_time != 0){
				$('#time_progress_bar').width((time/_experiment_time)*100 + "%");
			} else {
				ntime = time%60;
				$('#time_progress_bar').width((ntime/60)*100 + "%");
			}
			// Add to graph
			// Get the array of vars
			var variables = dataOnExp.vars;
			
			_experiment_vars_in_experiment = variables;
			
			// Update the data in graphs, etc..
			for (i=0; i<variables.length;i++){
				single_var = variables[i];
				for (j=0; j<_charts.length; j++){
					var names = (_charts[j])['names'];
					var var_name = single_var.name; 
					var index = $.inArray(var_name, names);
					if (index>=0){
						var chart_to_add = (_charts[j])['chart'];
						_updateData(chart_to_add,var_name, single_var.value, time);
					}
				}
				// Update interactive panels
				var id_to_find = "#" + related.createVarId(single_var);
				for (j=0; j<_interactives_vars_containers.length; j++){
					if (_interactives_vars_containers[j] == id_to_find){
						related_editors.updateEditor(_interactives_vars_containers[j],single_var);
						break;
					}
				}
			}
			try {
				// Redraw charts, only if page of graphs is showing !!!
				for (j=0; j<_charts.length; j++){
					// Only redraw the visible
					if (_showingContainer == (_charts[j])['container']){
						var chart_to_redraw = (_charts[j])['chart'];
						chart_to_redraw.redraw();
					}
				}
			} catch(err){
				console.error(err.message);
			}
			
			// Views
			if (variables.length>0){
				// Call t
				//var l = onReceiveDataViewHandlers.length;
				var l = _views_iframes.length;
				for(j=0; j<l;j++){
					try
					{
						_views_iframes[j].contentWindow.onRLABReceiveData(variables);
					}
					catch (error)
					{
						console.log("Error in Function " + 
							_views_iframes[j].contentWindow.onRLABReceiveData + ": " + error);
					}
				}
			}
			// Check for final of experiment time
			if (_experiment_time>0){
				if (time>=_experiment_time){
					_startstopBtnOnclick(null);
				}
			}
		}
	}
	
	_formatSecondsAsTime = function (secs, format) {
		var hr  = Math.floor(secs / 3600);
		var min = Math.floor((secs - (hr * 3600))/60);
		var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
 
		if (hr < 10)   { hr    = "0" + hr; }
		if (min < 10) { min = "0" + min; }
		if (sec < 10)  { sec  = "0" + sec; }
		if (hr)            { hr   = "00"; }
 
		if (format != null) {
			var formatted_time = format.replace('hh', hr);
			formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
			formatted_time = formatted_time.replace('mm', min);
			formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
			formatted_time = formatted_time.replace('ss', sec);
			formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
			return formatted_time;
		} else {
			return hr + ':' + min + ':' + sec;
		}
	}
	
	_onOpenCallback = function (readyState){
		if (readyState == 1){
			// Do the UI changes !!!
			if (_session.openned){
				// Ready to start the experiment !!!
				$("#startstopBtn").prop("disabled", false);
				$("#messages").html("Ready to start experiment...");
                // Send the token_id if is set...
                if (_tokenId!=null){
                    rlab_sendTokenIdSession(_tokenId);
                }
			}
		} else {
			_showErrorMessage("<p>Problem connecting with websockets.</p><p>The data channel is not avilable, so it's not able to tun the experiment.");
		}
	}
	
	_onCloseCallback = function(data){
		$("#messages").html("Closed connection by lab: " + data.reason);	
		_closeExperimentWindow(data.reason);	
	}
	
	_onErrorCallback = function(error){
		_showErrorMessage("Error with websockets: " + error);
	}
	
	_closeExperimentWindow = function (reason){
		// Check if close event was sent from server or by the end of session
		if ( $('#btn-session').hasClass('btn-danger') ){
			html_msg = "<h2>The session is ended</h2><br/>";
			session = RLAB.SERVICES.SESSIONS.getLastSessionByUser(_lab.id, _username);
			// Get the last session		
			if (session != null){
				url = "http://lab.scc.uned.es/html5/related/experimentaldataapp/index.html?sessionId="+  session.ID;
				html_msg+= "<div class='center'>";
				data_button = "<button id='show-session-" + session.ID + "'  class='btn btn-warning btn-lg active'";
				data_button+= "onclick=\"window.open('"+url+"','data','width=900,height=650');$('#info_div').modal('hide');\" ";
				data_button+= ">";
				data_button+= "View session data";
				data_button+= "</button>";
				html_msg+=data_button;
				html_msg+= "</div>";
				// Add the click function to data button
				$("#div-btn-view-data").removeClass('hide');
				$("#btn-view-data").on('click', function(event){
					window.open(url,"data",'width=900,height=650');
					$('#info_div').modal('hide');
				});
			}
			_showInfoMessage(html_msg);
		} else {
			_showErrorMessage("<p>Closed connection by the remote lab: " + reason + "</p><p>The session is ended.</p>");
		}
	}
	
	_showExperimentalDataButton = function(){
		session = RLAB.SERVICES.SESSIONS.getLastSessionByUser(_lab.id, _username);
		// Get the last session		
		if (session != null){
			url = "http://lab.scc.uned.es/html5/related/experimentaldataapp/index.html?sessionId="+  session.ID;
			var html_msg = "<div class='center'>";
			data_button = "<button id='show-session-" + session.ID + "'  class='btn btn-warning btn-lg active'";
			data_button+= "onclick=\"window.open('"+url+"','data','width=900,height=650');$('#info_div').modal('hide');\" ";
			data_button+= ">";
			data_button+= "View session data";
			data_button+= "</button>";
			html_msg+=data_button;
			html_msg+= "</div>";
			// Add the click function to data button
			$("#div-btn-view-data").removeClass('hide');
			$("#btn-view-data").on('click', function(event){
				window.open(url,"data",'width=900,height=650');
				$('#info_div').modal('hide');
			});
			// Change start and stop data from server?
			_session_start_time = new Date(session.startDate);
			_session_stop_time = new Date(session.stopDate);
			$('#session_stop_datetime').html(_session_stop_time.toLocaleString());
			$('#session_start_datetime').html(_session_start_time.toLocaleString());
		}
		_showInfoMessage(html_msg);
	}
	///////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	
	
	///////////////////////////////////////////////////////////
	//Private function
	// Check session time 
	///////////////////////////////////////////////////////////
	_sessionTimerControl = function(){
		// Session timer
		var now = new Date();
		// remaining time
		t1 = now.getTime();
		t2 = _stopDate;
		ms_remaining = t2-t1;
		if (ms_remaining>0){
			//  Update session_remaining_time
			if (ms_remaining<60000){
				if ($('#session_remaining_datetime').hasClass('label-success')){
					$('#session_remaining_datetime').removeClass('label-success');
					$('#session_remaining_datetime').addClass('label-warning');
					// Do the same withh the session button
					$('#btn-session').removeClass('btn-success');
					$('#btn-session').addClass('btn-warning');
				}
				seconds = parseInt(ms_remaining/1000);
				$('#session_remaining_datetime').html(seconds + " seconds");
			} else{
				minutes = parseInt(ms_remaining/60000);
				seconds = parseInt( (ms_remaining - minutes*60000)/1000);
				$('#session_remaining_datetime').html(minutes + " minutes, " + seconds + " seconds");
			}
			// Remember to user 1 minute, 30 seconds and 10 seconds
			var secondsToFinish = Math.round(ms_remaining/1000);
			if ( (secondsToFinish==60) || (secondsToFinish==30) || (secondsToFinish==15)){
				$('#session_icon').click();
			}
		} else {
			// Session ended
			$('#session_remaining_datetime').removeClass('label-warning');
			$('#session_remaining_datetime').addClass('label-danger');
			$('#session_remaining_datetime').html("Finished");
			// Do the same with button
			$('#btn-session').removeClass('btn-warning');
			$('#btn-session').addClass('btn-danger');
			// Finally stop the session timer
			clearInterval(_timerSessionId);
			// Stop the actual experiment
			if (_running==true){
				_startstopBtnOnclick(null);
			}
			// Disable startStopButton
			$('#startstopBtn').removeClass('btn-success');
			$('#startstopBtn').addClass('btn-error');
			$('#startstopBtn').html('Session ended');
			$('#startstopBtn').attr('disabled','disabled');
			// End session
			rlab_closeSession(session);
			if (_experiment_sessions>0){
				_showExperimentalDataButton();
			}
		}
	}
	
	//////////////////////////////////////////////////////////////////////////
	// AUXILIAR FUNCTION TO CREATE/GET ID FOR VARS
	////////////////////////////////////////////////////////////////////////
	_createId = function (oneVar){
		// Create an unique id based on static data for a variable
		var s = null;
		if (oneVar != null){
			s = "ID-" + stringToHex(oneVar.name);
			s += "-";
			s += stringToHex(oneVar.module);
			if (oneVar.system != null){
				s += "-";
				s += stringToHex(oneVar.system);
			}
		}
		return s;
	}
	
	_getVarFromId = function(id){
		var myVar = null;
		// Separator is "-"
		/// Must be two of them (or three is variable is remote from an external module/system)
		tokens = id.split("-");
		if (tokens != null){
			n = tokens.length;
			if (n==3){
				//Local module
				var name =  hexToString(tokens[1]);
				var module_name =  hexToString(tokens[2]);
				// Inital vars structure is sitore sin _experiment_vars
				myVar = varsFindByKeys(_experiment_vars, ['name','module'],[name,module_name]);
				// get the last value from experiment
				if (_experiment_vars_in_experiment != null){
					dummyVar = varsFindByKeys(_experiment_vars_in_experiment, ['name','module'],[name,module_name]);
					myVar.value = dummyVar.value;
				}
			} else if (n==4){
				// Remote module/system
				var name =  hexToString(tokens[1]);
				var module_name =  hexToString(tokens[2]);
				var system_name =  hexToString(tokens[3]);
				myVar = varsFindByKeys(_experiment_vars, ['name','module','system'],
										[name,module_name,system_name]);
				// get the last value from experiment
				if (_experiment_vars_in_experiment != null){
					dummyVar = varsFindByKeys(_experiment_vars_in_experiment, ['name','module','system'],
										[name,module_name,system_name]);
					myVar.value = dummyVar.value;
				}
			}
		}
		return myVar;
	}
	
	var varsFindByKeys = function (array, keys, values) {
		for (var i = 0; i < array.length; i++) {
			ok = true;
			// Comparing all keys
			for (var j=0; j<keys.length; j++){
				key = keys[j];
				value = values[j];  
				array_value = array[i][key];
				ok = ok && ( array_value == value);
				console.log("Comparing '" + escape(array[i][key]) + "' with '" + escape(value) + "' --> " + ok);
				if (!ok){
					break;
				}
			}
			if (ok){
				return array[i];
			}
		}
		return null;
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//////////////////////////////////////////////////////////////////////////////////////////////////
	function d2h(d) {
		return d.toString(16);
	}
	function h2d (h) {
		return parseInt(h, 16);
	}
	function stringToHex (tmp) {
		var str = '',
			i = 0,
			tmp_len = tmp.length,
			c;
		
		for (; i < tmp_len; i += 1) {
			c = tmp.charCodeAt(i);
			str += d2h(c) + 'H';
		}
		return str;
	}
	
	function hexToString (tmp) {
		var arr = tmp.split('H'),
			str = '',
			i = 0,
			arr_len = arr.length,
			c;
		
		for (; i < arr_len; i += 1) {
			if (arr[i] != ""){
				c = String.fromCharCode( h2d( arr[i] ) );
				str += c;
			}
		}
		
		return str;
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// UTIL FUNCTION TO SELECT A GRAPH CONTAINER OR A VIEW CONTAINER
	///////////////////////////////////////////////////////////////////////////////////////////////////
	showContainer = function (id,modal_div){
		// Hide the actual
		$('#' + _showingContainer ).addClass('hide');
		
		_showingContainer = id;
		// Show new
		$('#' + id ).removeClass('hide');
		
		if (modal_div!=null){
			$('#'+modal_div).modal('hide');
		}
		
		// Check for container type !!! to refresh
		if (_showingContainer.indexOf('chart')>=0){
			// Redraw the chart, the index is the last character
			index = parseInt(_showingContainer.substring(_showingContainer.length-1,_showingContainer.length));
			
			container_width = $('#'+id).width();
			container_height = $('#'+id).height();
			
			(_charts[index])['chart'].setSize(container_width-40,container_height, true);
			// ((charts[index])['chart']).redraw();
		} else if (_showingContainer.indexOf('View')>=0){
			// Change size of iframe !!!
			index = _showingContainer.indexOf("-");
			var view_name = _showingContainer.substr(index+1);
			// Get the height of iframe doc 
			var ifrm = document.getElementById(view_name + "_iframe");
			var doc = ifrm.contentDocument? ifrm.contentDocument:ifrm.contentWindow.document;
			doc = doc || document;
			var body = doc.body, html = doc.documentElement;
			var height = Math.max( body.scrollHeight, body.offsetHeight, 
							html.clientHeight, html.scrollHeight, html.offsetHeight );
			// Set the container height
			$('#' + view_name + "_iframe").height(height);
		}
		// Hide the side nav if it is showing and the options button is swhoing
		if ( $('#collapse-button').is('visible') && ('#sidebar_nav').is(':visible') ) {
			$('#collapse-button').click();
		}
		
	}
	
	/////////////////////////////////////////////////////////////////////////
	// Public function
	// Send the data to the lab for the experiment
	////////////////////////////////////////////////////////////////////////
	sendDataToLab = function(rlab_vars){
		if (rlab_vars != null){
			l = rlab_vars.length;
			for (i=0; i<l; i++){
				setVarByName(_lab,rlab_vars[i],rlab_vars[i].moduleName);
			}
		}
	}
	
	/////////////////////////////////////////////////////////////////////////
	// Public function
	// returns the experiment vars
	////////////////////////////////////////////////////////////////////////
	getLab = function(){
		return _lab;
	}
	
	
	/////////////////////////////////////////////////////////////////////////
	// Public function
	// returns the experiment vars
	////////////////////////////////////////////////////////////////////////
	getExperimentVars = function(){
		return _experiment_vars;
	}
	
	/////////////////////////////////////////////////////////////////////////
	// Public function
	// returns the remote modules included in the experiment
	////////////////////////////////////////////////////////////////////////
	getRemoteModules = function(){
	var _remote_systems = null
		return _remote_modules;
	}
	
	/////////////////////////////////////////////////////////////////////////
	// Public function
	// returns the remote systems related to the remmote modules included in the experiment
	////////////////////////////////////////////////////////////////////////
	getRemoteSystems = function(){
		return _remote_systems;
	}
	
	_isExperimentRunning = function(){
		return _running;
	}
	// Public API
    return {
		// Control app
        init: initApp,
		onExit: _onExit,
		onBeforeExit: _onBeforeExit,
		// Send data
		send: sendDataToLab,
		// Must be declared to be used for HTML elements
		show: showContainer,
		// Get functions used in other scripts/modules
		getLab: getLab,
		getExperimentVars: getExperimentVars,
		getRemoteModules: getRemoteModules,
		getRemoteSystems: getRemoteSystems,
		createVarId: _createId,
		getVarFromId: _getVarFromId,
		isExperimentRunning: _isExperimentRunning,
		showErrorMessage: _showErrorMessage,	
		showInfoMessage: _showInfoMessage 
    };
	
})();
	