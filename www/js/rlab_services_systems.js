var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.SYSTEMS = ( function() {
	
	// Private variables
	var _statusOk = false;
	var _errorMsg = "";

	// Global configuration
	var _soap_config_systemsWS = {
			url: 'https://lab-services.scc.uned.es/services/api/soap/ManageSystemsWS/',
			method: '',
			appendMethodToURL: true, 	
			params: {
			},
			namespaceQualifier: 'systems',                     
			namespaceURL: 'http://systems.ws.related.scc.uned.es',
			success: null,
			error: null,
			async: false,
			wss: {
				username: 'related_developer',
				password: 'L+Fy/dOUQ4pLP5JTY92qEw=='
			}, 
			enableLogging: true   
	}
	
	// -----------------------------------------------------------------
	// GET WS Call status
	// -----------------------------------------------------------------
	function _getLastCallStatus(){
		var info = new Object();
		info.ok = _statusOk;
		info.message = _errorMsg;
		return info;
	}
	
	// -----------------------------------------------------------------
	// GETSystemInfo
	// -----------------------------------------------------------------
	function _getSystemInfo(id){
		var info = null;
		_statusOk = false;
		_errorMsg = "Invoking getSystemInfo()";
		if (id !=null){
			//_soap_config_systemsWS.method = 'getSystemInfo';
			_soap_config_systemsWS.elementName = 'getSystemInfo';
			_soap_config_systemsWS.SOAPAction = "",
			_soap_config_systemsWS.params = {
											 ID: id
										   };
			_soap_config_systemsWS.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to getSystemInfo() was successfull";
				info = soapResponse.toJSON().Body.getSystemInfoResponse.return;
			},
			_soap_config_systemsWS.error = function (soapResponse){
				_errorMsg = "Invocation to getSystemInfo() error...";
			},
			$.soap(_soap_config_systemsWS);			
		} else {
			_errorMsg = "Invocation to getSystemInfo() needs a system ID parameter";
		}
		return info;
	}


	// -----------------------------------------------------------------
	// findSystem
	// -----------------------------------------------------------------
	function _findSystem(name){
		var response = null;
		_statusOk = false;
		_errorMsg = "Invoking findSystem()";
		if (name !=null){
			//_soap_config_systemsWS.method = 'findSystem';
			_soap_config_systemsWS.elementName = 'findSystem';
			_soap_config_systemsWS.SOAPAction = "",
			_soap_config_systemsWS.params = {
											 textToFind: name
										   };
			_soap_config_systemsWS.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to findSystem() was successfull";
				response = soapResponse.toJSON().Body.findSystemResponse.return;
			},
			soap_config_systemsWS.error = function (soapResponse){
				_errorMsg = "Invocation to findSystem() error...";	
			},
			$.soap(_soap_config_systemsWS);
		} else {
			_errorMsg = "Invocation to getSystemInfo() needs a system ID parameter";
		}
		return response;
	}

	// -----------------------------------------------------------------
	// getModules !!!
	// -----------------------------------------------------------------
	function _getModules(ip,labname){
		var response = null;
		_statusOk = false;
		_errorMsg = "Invoking findSystem()";
		if (ip!=null && labname !=null){
			//_soap_config_systemsWS.method = 'getModules';
			_soap_config_systemsWS.elementName = 'getModules';
			_soap_config_systemsWS.SOAPAction = "",
			_soap_config_systemsWS.params = {
											 IP: ip,
											 name: labname
										   };
			_soap_config_systemsWS.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to getModules() was successfull";
				response = soapResponse.toJSON().Body.getModulesResponse.return;
			},
			_soap_config_systemsWS.error = function (soapResponse){
				_errorMsg = "Invocation to getModules() error...";	
			},
			$.soap(_soap_config_systemsWS);
		} else {
			_errorMsg = "Invocation to getModules() needs a system IP && Lab name parameters";
		}
		return response;
	}

	// -----------------------------------------------------------------
	// GETExperimentInfo
	// -----------------------------------------------------------------
	function _getExperimentInfo(id, exp_id){
		var response = null;
		_statusOk = false;
		_errorMsg = "Invoking getExperimentInfo()";
		if (id!=null && exp_id !=null){
			//_soap_config_systemsWS.method = 'getExperimentInfo';
			_soap_config_systemsWS.elementName = 'getExperimentInfo';
			_soap_config_systemsWS.SOAPAction = "",
			_soap_config_systemsWS.params = {
											 systemID: id,
											 experimentID: exp_id
										   };
			_soap_config_systemsWS.success = function (soapResponse){
					_statusOk = true;
					_errorMsg = "Invocation to getExperimentInfo() was successfull";
					response = soapResponse.toJSON().Body.getExperimentInfoResponse.return;
			},
			_soap_config_systemsWS.error = function (soapResponse){
				_errorMsg = "Invocation to getExperimentInfo() error...";	
			}
			$.soap(_soap_config_systemsWS);
		} else {
			_errorMsg = "Invocation to getExperimentInfo() needs a system id && experiment id parameters";
		}
		return response;
	}

	// -----------------------------------------------------------------
	// GETExperiments
	// -----------------------------------------------------------------
	function _getExperiments(id){
		var response = null;
		_statusOk = false;
		_errorMsg = "Invoking getExperiments()";
		if (id!=null){
			//_soap_config_systemsWS.method = 'getExperiments';
			_soap_config_systemsWS.elementName = 'getExperiments';
			_soap_config_systemsWS.SOAPAction = "",
			_soap_config_systemsWS.params = {
											 systemID: id
										   };
			_soap_config_systemsWS.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to getExperiments() was successfull";
				response = soapResponse.toJSON().Body.getExperimentsResponse.return;
			},
			_soap_config_systemsWS.error = function (soapResponse){
				_errorMsg = "Invocation to getExperiments() error...";	
			}
			$.soap(_soap_config_systemsWS);
		} else {
			_errorMsg = "Invocation to getExperiments() needs a system ID parameter";
		}
		return response;
	
	}

	// -----------------------------------------------------------------
	// GETExperimentInfo
	// -----------------------------------------------------------------
	/*function _getExperimentInfo(lab_id,experiment_id){
		experiment_info = null;
		experiments = getExperiments(lab_id);
		// Find the experiment in list
		if (experiments != null){
			// Check for one or array
			if (isArray(experiments)){
				// Find the experiment_name in array
				var l = experiments.length;
				for (i=0;i<l;i++){
					if (experiments[i].id == experiment_id){
						experiment_info = experiments[i];
						break;
					}
				}
			} else {
				// only one experiment !!!
				experiment_info = experiments;
			}
			
		}
		return experiment_info;
	}

	// Utilities
	function _isArray(what) {
		return Object.prototype.toString.call(what) === '[object Array]';
	}*/
	
	// -----------------------------------------------------------------
	// GET All laboratories for user
	// -----------------------------------------------------------------
	function _getAllLaboratoriesForUser(user){
		var response = null;
		_statusOk = false;
		_errorMsg = "Invoking getAllLaboratoriesForUser()";
		if (user!=null){
			//_soap_config_systemsWS.method = 'getAllLaboratoriesForUser';
			_soap_config_systemsWS.elementName = 'getAllLaboratoriesForUser';
			_soap_config_systemsWS.SOAPAction = "",
			_soap_config_systemsWS.params = {
											 user: user
										   };
			_soap_config_systemsWS.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to getAllLaboratoriesForUser() was successfull";
				response = soapResponse.toJSON().Body.getAllLaboratoriesForUserResponse.return;
			},
			_soap_config_systemsWS.error = function (soapResponse){
				_errorMsg = "Invocation to getAllLaboratoriesForUser() error...";	
			}
			$.soap(_soap_config_systemsWS);
		} else {
			_errorMsg = "Invocation to getAllLaboratoriesForUser() needs a user name parameter";
		}
		return response;
	
	}
	
	// PUBLIC API
	return {	
		getLastCallStatus: _getLastCallStatus,
		getSystemInfo : _getSystemInfo,
		findSystem: _findSystem,
		getModules: _getModules,
		getExperiments: _getExperiments,
		getExperimentInfo: _getExperimentInfo,
		getAllLaboratoriesForUser : _getAllLaboratoriesForUser
	};

}()); // End of namespace rlab.services.systems