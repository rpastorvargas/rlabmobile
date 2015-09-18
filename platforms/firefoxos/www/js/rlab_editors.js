// JavaScript Document

// Functions to build editors for rlab vars

var related_editors = (function() {
	
	var createEditor = function(rlab_var,interactives_vars_containers){
		var p_id = related.createVarId(rlab_var);
		
		var is_modal = false;
		// Add to array, in order to get the 
		interactives_vars_containers.push("#" + p_id);
		if (rlab_var.classname == "java.lang.Boolean"){
			html_element = booleanEditor(rlab_var,p_id,is_modal);
		} else if (rlab_var.classname == "java.lang.Integer"){
			html_element = numberEditor(rlab_var,p_id,"int",is_modal);
		} else if (rlab_var.classname == "java.lang.Float" || rlab_var.classname == "java.lang.Double"){
			html_element = numberEditor(rlab_var,p_id,"real",is_modal);
		} else if (rlab_var.classname == "java.lang.String"){
			html_element = stringEditor(rlab_var,p_id,is_modal);
		} else {
			html_element = defaultEditor(rlab_var,p_id,is_modal);
		}
		return html_element; 
	}
	
	var createEditorModal = function(id){
		rlab_var = related.getVarFromId(id);
		if (related.isExperimentRunning()){			
			var p_id = "modal-" + id;
			var is_modal = true;
			
			if (rlab_var.classname == "java.lang.Boolean"){
				html_element = booleanEditor(rlab_var,p_id,is_modal);
			} else if (rlab_var.classname == "java.lang.Integer"){
				html_element = numberEditor(rlab_var,p_id,"int",is_modal);
			} else if (rlab_var.classname == "java.lang.Float" || rlab_var.classname == "java.lang.Double"){
				html_element = numberEditor(rlab_var,p_id,"real",is_modal);
			} else if (rlab_var.classname == "java.lang.String"){
				html_element = stringEditor(rlab_var,p_id,is_modal);
			} else {
				html_element = defaultEditor(rlab_var,is_modal);
			}
			
			$("#modal-single-variable-body").html(html_element);
			$("#modal-single-variable").modal();
		} else {
			related.showInfoMessage("Variable \"" + rlab_var.name + "\" can not be modified if no experiment is running.");
		}
	}
	
	var defaultEditor = function (rlab_var,p_id,is_modal){
		var html_element = "<div data-role='fieldcontain'>";
		html_element += "<label for='" + p_id + "'>" + rlab_var.name + "</label>";
		html_element += "<input type='text' name='" + p_id +  "' id='" + p_id + "' value='Non editable' disabled/>"
		html_element += "</div>";  
		return html_element;
	}
	
	
	var numberEditor = function (rlab_var,p_id,type,is_modal){
		var onchangefunction = 'related_editors.changeVarValue("#' + p_id + '","' + rlab_var.name + '","' + type + '",' + is_modal + ');return false;';
		// Build an int editor
		html_element = "<div class='panel panel-default'><div class='panel-body'>";
		html_element += "<label class='text-primary' for='" + p_id + "'>" + rlab_var.name + " ( " + rlab_var.maxRange + "," + rlab_var.minRange + " Units: " + 
							rlab_var.units + " )<br/><span class='text-muted'>" + rlab_var.description + "</span></label>";
		html_element += "<div class='input-group'><span class='input-group-btn'>";
		html_element += "<button class='btn btn-default' type='button' onclick='" + onchangefunction + "'";
		html_element += " id='" + (p_id + "-update") + "'>";
		html_element += "<i class='fa fa-check-square fa-2x'></i></button></span>";
		html_element += "<input name='" + p_id + "'  id='" + p_id + 
						 "' type='number' class='form-control' value='" + rlab_var.value + "' ";
		html_element += "min='" + rlab_var.minRange + "' max='" + rlab_var.maxRange + "' ";
		html_element += "step='" + (rlab_var.maxRange-rlab_var.minRange)/100;
		html_element += "' /><br/>";
		html_element += "</div><div id='" + (p_id + "-error") + "'></div>";
		html_element += "</div></div>";
		
		/*$( "#"+(p_id + "-update")).focus(function() {
			console.log( "BUTTON__> Handler for .focus() called." );
		});*/
	
		return html_element;
	}
	
	var stringEditor = function (rlab_var,p_id,is_modal){
		var onchangefunction = 'related_editors.changeVarValue("#' + p_id + '","' + rlab_var.name + '","string",' + is_modal + ');return false;';
		
		html_element = "<div class='panel panel-default'><div class='panel-body'>";
		html_element += "<label class='text-primary' for='" + p_id + "'>" + rlab_var.name + "<br/>";
		html_element += "<span class='text-muted'>" + rlab_var.description + "</span></label>";
		html_element += "<div class='input-group'><span class='input-group-btn'>";
		html_element += "<button class='btn btn-default' type='button' onclick='" + onchangefunction + "'";
		html_element += " id='" + (p_id + "-update") + "'>";
		html_element += "<i class='fa fa-check-square fa-2x'></i></button></span>";
		html_element += "<input name='" + p_id + "'  id='" + p_id + 
						 "' type='text' value='" + rlab_var.value +"'";	
		html_element += "' /><br/>";
		html_element += "</div><div id='" + (p_id + "-error") + "'></div>";
		html_element += "</div></div>";
		
		return html_element;
	}
	
	var booleanEditor = function (rlab_var,p_id,is_modal){
	
		var onchangefunction = "related_editors.changeVarValue(\'#" + p_id + "\',\'" + rlab_var.name + "\',\'boolean\'," + is_modal + ");return false;";	
		var checked = "";
		
		if (typeof rlab_var.value == "boolean"){
			if (rlab_var.value){
				checked = "CHECKED";	
			}
		} else if (typeof rlab_var.value == "string"){
			if (rlab_var.value == "true"){
				checked = "CHECKED";
			}
		}
		
		html_element = "<div class='panel panel-default'><div class='panel-body'>";
		html_element += "<label class='text-primary' for='" + p_id + "'>" + rlab_var.name + "<br/>";
		html_element += "<span class='text-muted'>" + rlab_var.description + "</span></label>";
		html_element += '<input class="pull-left" style="margin-right:20px" type="checkbox" name="' + p_id + '" id="' + p_id + '" onchange="'
						 + onchangefunction + '" ' + checked + '/>';
		html_element += "</div><div id='" + (p_id + "-error") + "'></div>";
		html_element += "</div></div>";
		return html_element;
	}
	
	/*
	* EVENT HANDLER
	*/
	var changeVarValue = function(text_value_container,var_name,type,isModal){
		// experiment_vars is a global variable !!!
		var experiment_vars = related.getExperimentVars();
		var experiment_var = null;
		if (experiment_vars!=null){
			var experiment_var = objectFindByKey(experiment_vars,'name',var_name);
		}
		// Check for running
		if (!related.isExperimentRunning()){
			// Set the old value...
			if (type=="boolean"){
				if (typeof experiment_var.value == "boolean"){
					if (experiment_var.value){
						$(text_value_container).prop("checked",true);	
					} else {
						$(text_value_container).prop("checked",false);
					}
				} else if (typeof experiment_var.value == "string"){
					if (experiment_var.value == "true"){
						$(text_value_container).prop("checked",true);
					} else {
						$(text_value_container).prop("checked",false);
					}
				}
			} else {
				$(text_value_container).val(experiment_var.value);
			}
			related.showInfoMessage("Variable \"" + experiment_var.name + "\" can not be modified if no experiment is running.");
			return false;
		}
		// If it's running...
		if (experiment_vars!=null){
			the_var = clone(experiment_var);
			if (the_var!=null){
				var supportedType = true;
				if (type=="boolean"){
					new_value = $(text_value_container).is(':checked');
					//new_value = $(text_value_container).val();
				} else {
					new_value = $(text_value_container).val();
				}
				if (typeof new_value != "undefined"){
					var ok = false;
					// Now convert to types...
					if (type=="int" || type=="real") {
						if (type == "int"){
							new_value = parseInt(new_value);
						} else if (type=="real"){
							new_value = parseFloat(new_value);
						}				
						ok = validateValue(experiment_var.value, new_value, 
											   experiment_var.maxRange, experiment_var.minRange,
											   text_value_container, text_value_container+"-error");
						if (ok){
							the_var.value = new_value;
						}
					} else if (type=="string"){
						ok = true;
						the_var.value = new_value;
					} else if (type=="boolean"){
						ok = true;
						the_var.value = new_value;
					} else {
						supportedType = false;
					}
					if (supportedType && ok){
						isRemote = false;
						remote_system = null;
						var remote_modules = related.getRemoteModules();
						var remote_systems = related.getRemoteSystems();
						var lab = related.getLab();
						if (remote_modules!= null && remote_modules.length>0){
							// Check for remote module !!!
							module_name = the_var.module;
							// remote_modules is a global variable defined in experiment.html
							index = $.inArray(module_name,remote_modules);
							if (index!=-1){
								remote_system = remote_systems[index];
								isRemote = true;
							}
						}
						if (!isRemote){
							var returned = setVarByName(lab,the_var,the_var.module);
							var new_var = getVarByName(lab,var_name,the_var.module);
						} else {
							var returned = setRemoteVarByName(the_var,the_var.module,remote_system);
							var new_var = getRemoteVarByName(the_var.name,the_var.module,remote_system);
						}
						// String json value
						returned_value = new_var.value;
						// if all ok then report to user
						if (type=="boolean"){
							returned_value = (returned_value == "true");
						} else if (type=="int"){
							returned_value = parseInt(returned_value);
						} else if (type=="real"){
							returned_value = parseFloat(returned_value);
						}
						//console.log("comparing " + returned_value + " with " + the_var.value);
						if ( returned_value == the_var.value ){
							$(text_value_container+"-error").html(
								"<i class='fa fa-check-circle-o'></i><span class='text-success'> Value was sent successfully (" +
								the_var.value + ")<span>");
							// Update experiment_var value
							experiment_var.value = returned_value;
							if (isModal){
								// Find parent of text_value_container
								$("#modal-single-variable").modal('hide');
								// Hide the nav
								$('#collapse-button').click();
							}
						} else{
							$(text_value_container+"-error").html(
								"<i class='fa fa-warning'></i><span class='text-danger'> Value not sended correctly (" + 
								the_var.value + ")<span>");
						}
					}
				}
			}
		}
	}
		
	var validateValue = function (value_org, value_new, max_value, min_value,value_container, e_container){
		var ok = false;
		if (typeof value_new != "undefined"){
			if (value_new <= max_value && value_new >= min_value){
				ok = true;
			}
		}
		if (!ok){
			// Restore the org value
			$(value_container).val(value_org);
			// Print the error 
			$(e_container).html("<i class='fa fa-warning'></i><span class='text-danger'> Value not valid: " + value_new + "<span>");
		} else {
			$(e_container).html("");
		}
		return ok;
	}
	
	var clone = function(o) {
		obj = JSON.parse(JSON.stringify(o));
		return obj; //eval(uneval(o));
	}
		
	var objectFindByKey = function (array, key, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	}
	
	var updateEditorValue = function(container,the_var){
		if (the_var!=null){
			if (the_var.classname=="java.lang.Boolean"){
				actual_value = $(container).is(':checked');
				new_value = the_var.value=="true";
				if (actual_value != new_value){
					if (new_value){
						$(container).attr('checked', true);
					} else {
						$(container).attr('checked', false);
					}
					//$(container+"-error").html("");
				}
			} else {
				if ( !($(container).is(":focus")) && !($(container+"-update").is(":focus")) ){
					$(container).val(the_var.value);
					//$(container+"-error").html("");
				}
			}
		}
	}

	// Public API
    return {
        createEditor: createEditor,
		createEditorModal: createEditorModal,
		updateEditor: updateEditorValue,
		changeVarValue: changeVarValue
    };
	
})();