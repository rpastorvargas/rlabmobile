
var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.SESSIONS = ( function() {
	
	// Private variables
	var _statusOk = false;
	var _errorMsg = "";

	// Global configuration
	var _soap_config = {
			url: 'https://lab-services.scc.uned.es/services/api/soap/SessionsWS/',
			method: '',
			appendMethodToURL: true, 	
			params: {
			},
			namespaceQualifier: 'sessions',                     
			namespaceURL: 'http://sessions.ws.related.scc.uned.es',
			success: null,
			error: null,
			async: false, 
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
	function _getOpenSessionsForSystem(id){
		var info = null;
		_statusOk = false;
		_errorMsg = "Invoking getOpenSessionsForSystem()";
		if (id !=null){
			//_soap_config_systemsWS.method = 'getOpenSessionsForSystem';
			_soap_config.elementName = 'getOpenSessionsForSystem';
			_soap_config.SOAPAction = "",
			_soap_config.params = {
								     systemID: id
								  };
			_soap_config.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to getOpenSessionsForSystem() was successfull";
				object = soapResponse.toJSON().Body.getOpenSessionsForSystemResponse.return;
				if ( object!=null && ( !(typeof object.ID =="undefined") || (object.ID != null) )){
					info = object;
				}
			},
			_soap_config.error = function (soapResponse){
				_errorMsg = "Invocation to getOpenSessionsForSystem() error...";
			},
			$.soap(_soap_config);			
		} else {
			_errorMsg = "Invocation to getOpenSessionsForSystem() needs a system ID parameter";
		}
		return info;
	}
	
	// -----------------------------------------------------------------
	// GETLastSessionByUser
	// -----------------------------------------------------------------
	function _getLastSessionByUser(id, user){
		var info = null;
		_statusOk = false;
		_errorMsg = "Invoking getLastSessionByUser()";
		if (id !=null && user!=null){
			//_soap_config_systemsWS.method = 'getLastSessionByUser';
			_soap_config.elementName = 'getLastSessionByUser';
			_soap_config.SOAPAction = "",
			_soap_config.params = {
								     systemID: id,
									 user: user
								  };
			_soap_config.success = function (soapResponse){
				_statusOk = true;
				_errorMsg = "Invocation to getLastSessionByUser() was successfull";
				object = soapResponse.toJSON().Body.getOpenSessionsForSystemResponse.return;
				if ( object!=null && ( !(typeof object.ID =="undefined") || (object.ID != null) )){
					info = object;
				}
			},
			_soap_config.error = function (soapResponse){
				_errorMsg = "Invocation to getLastSessionByUser() error...";
			},
			$.soap(_soap_config);			
		} else {
			_errorMsg = "Invocation to getLastSessionByUser() needs system ID and user name parameters";
		}
		return info;
	}
	
    // PUBLIC API
	return {	
		getLastCallStatus: _getLastCallStatus,
		getOpenSessionsForSystem : _getOpenSessionsForSystem,
		getLastSessionByUser : _getLastSessionByUser
	};

}()); // End of namespace rlab.services.sessions
