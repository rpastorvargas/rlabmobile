var RLAB = RLAB || {};     
RLAB.UI = RLAB.UI || {};

// Needed files:
// highcharts javascript file
// rlab_library.js --> REST services defined in lab ???
RLAB.UI.GRAPHS = ( function() {
    
    // private variables
    var _charts = new Array();
    var _smooth_lines = true;
    
    // Returns the current charts defined. 
    // Every chart included in the array has many components:
    // chart['chart'] Highchart object (object)
	// chart['names'] names of variables (array)
	// chart['module'] name of module which include the variables names (string)
	// chart['system'] name of system which includes the above module (string)
	// chart['id'] name of div which includes the chart object (string)
    // chart['container'] name of panel parent: panel-chart['id']
    // chart['parent'] name of parent container for chart['container']
    _getCharts = function(){
        return _charts;
    }
    
    // Check for existence of chart with the provided graph_info (names,module,system)
    _isChartDefined = function(graph_info){
        var _is = false;
        for (j=0; j<_charts.length; j++){
		   var chart_info = _charts[j];
           if ( chart_info['names'] == graph_info['names'] &&
              chart_info['module'] == graph_info['module'] &&
		      chart_info['system'] == graph_info['system'] ){
              _is = true;
               break; 
           }
		}        
        return _is;
    }
    
    // Delete the chart with the provided graph_info (names,module,system)
    // Remove the _chart object form _charts array
    // and delete from UI (remove from container)
    // Returns null is none is deleted and otherwise the graph_info 
    _deleteChart = function(graph_info){
        var _chart = null;
        for (j=0; j<_charts.length; j++){
		   var chart_info = _charts[j];
           if ( chart_info['names'] == graph_info['names'] &&
              chart_info['module'] == graph_info['module'] &&
		      chart_info['system'] == graph_info['system'] ){
              // Delete from UI
              $('#' + chart_info['parent']).remove("#" + chart['container']);   
              // Delete from _charts array and returns the removed element
              _chart = _charts.splice(j,1);
              // End the loop
              break; 
           }
		}        
        return _chart;
    }
    
    // Delete the chart with the chart_id provided
    // Remove the _chart object form _charts array
    // and delete from UI (remove from container)
    // Returns null is none is deleted and otherwise the graph_info 
    _deleteChartByChartId = function(chart_id){
        var _chart = null;
        for (j=0; j<_charts.length; j++){
		   var chart_info = _charts[j];
           if ( chart_info['id'] == chart_id ){
              // Delete from UI
              $('#' + chart_info['parent']).remove("#" + chart['container']);   
              // Delete from _charts array and returns the removed element
              _chart = _charts.splice(j,1);
              // End the loop
              break; 
           }
		}        
        return _chart; 
    }
    
    // Create the div (panel+chart) and add to container_name
    // 
    // graph_info is an Object which has four atrributes (names:array, colors:array, module:string, system:string)
    // container name is the id of parent div which will be used as the graph container (without #)
	_createChart = function (graph_info, container_name){
        
        // Create internal_name
        
        // Create title from 'names' data inside grap_info
        var _title = _createGraphTitle(graph_info['names']);
        
        var _chart_id = _generateChartId();
        var _chart_panel = "panel-" + _chart_id;
        // Create chart in the document as a row inside objects_container!!!						
		var html_element = '<div id="' + _chart_panel + '" class="panel panel-primary hide" style="height:100%;">';
		html_element += '<div class="panel-heading"><h3 class="panel-title">';
		html_element += '<i class="fa fa-bar-chart-o"></i> ' + _title;
		html_element += '</h3></div>';
		html_element += '<div class="panel-body">';
		html_element += '<div class="graph_style">'; // Wrapper style for graph
        html_element += '<div id="' + _chart_id + '" ></div>';
		html_element += '</div>'; // End of wrapper
        html_element += '</div>'; // End of panel body
		html_element += '</div>'; // End of panel-primary
        
        $('#' + container_name).append(html_element);
				
		// Create Highchart object an returns it
		chart = _createSimpleChart(_chart_id,graphs_info,_smooth_lines);
		chart_info = new Object();
		chart_info['chart'] = chart;
		chart_info['names'] = graphs_info['names'];
		chart_info['module'] = graphs_info['module'];
		chart_info['system'] = graphs_info['system'];
        chart_info['id'] = _chart_id;
		chart_info['container'] = _chart_panel;
        chart_info['parent'] = container_name;
        
		_charts.push(chart_info); 
	}
	
	// AUXILIAR FUNCTION TO MANAGE CHARTS
    // Create the graph title using the names included in the original graph_info
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
	
    // AUXILIAR FUNCTION TO MANAGE CHARTS
    // Create the graph into container_name, with the grap_info provided
    // smooth (true by default) defines the type of lines (spline or line)
    // Defined as an module atrribute
	_createSimpleChart = function(container_name, graph_info,smooth){
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
            xAxis: { 
                title: { 
                    text: 'Time'
                }, 
                type: 'linear' 
            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                labels: {
                    format: "{value:.2f}"
                },
                title: { 
                    text: 'Values' 
                } 
            }, //, plotLines: createPlotLines(names,colors) },
            exporting: {enabled: false}
        });
		_createSeries(chart, graph_info['names'], graph_info['colors']);
		return chart;
	}// End of createChart!!!
		
    // Create the series in the chart
    // Every serie included is named using the variable name
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
    
    // Global function to update the array of variables got from related laboratory
    // rlab_vars: array
    _updateData = function(rlab_vars){   
        // Update the received data for all graphs
        for (i=0; i<rlab_vars.length;i++){
            single_var = rlab_vars[i];
            for (j=0; j<_charts.length; j++){
                var names = (_charts[j])['names'];
                var var_name = single_var.name; 
                var index = $.inArray(var_name, names);
                if (index>=0){
                    var chart_to_add = (_charts[j])['chart'];
                    // Also draw the point !!!
                    _updateChartData(chart_to_add,var_name, single_var.value, time);
                }
            }
        }
        
    }
    
		
	_updateChartData = function(chart,series_name, value, time){
		var series = chart.series;
		var n = series.length;
		for (index=0; index<n;++index){
			var serie = series[index];
			if(serie.name==series_name){
				//serie.data.push([time,value]);
				var v = parseFloat(value); 
				// Value to add to the serie, redraw, shift
				var shift = time>_max_seconds_graphs;
				// addPoint (Object options, [Boolean redraw], [Boolean shift], [Mixed animation])
				serie.addPoint([time,v], false, shift,false);
				//console.log("Associated with. " + serie.yAxis);
				//console.log('Added value to ' + serie.name + ', total:' + serie.data.length);
				break;
			}
		}
	
	}
    
    /**
   * Creates a string that can be used for dynamic id attributes
   * Example: "id-so7567s1pcpojemi"
   * @returns {string}
   */
    var _generateChartId = function() {
        return 'chart-' + Math.random().toString(36).substr(2, 16);
    };
    
    // PUBLIC API
	return {	
        getCharts: _getCharts,
        isChartDefined: _isChartDefined,
		createChart: _createChart,
        deleteChart: _deleteChart,
        resetChartsData: _resetChartsData,
        updateData: _updateData
	};
    
}()); // End of namespace rlab.ui.graphs
