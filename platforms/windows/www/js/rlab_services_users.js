var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.USERS = ( function() {
	
	// Private variables
	// Global configuration
	var _soap_config = {
			url: 'https://lab-services.scc.uned.es/services/api/soap/ManageUsersWS/',
			method: '',
			appendMethodToURL: true, 	
			params: {
			},
			namespaceQualifier: 'users',                     
			namespaceURL: 'http://users.ws.related.scc.uned.es',
			success: null,
			error: null,
			async: false,
			wss: {
				username: 'related_developer',
				password: 'L+Fy/dOUQ4pLP5JTY92qEw=='
			}, 
			enableLogging: true   
	}
	
	// Private methods
	function _checkUserByLogin(user,pass){
		var info = new Object();
		info.ok = false;
		info.errorMsg = "Invoking checkUserByLogin()";
		if (user !=null && pass!= null){
			// Configure SOAP call
			//_soap_config.method = 'checkUserByLogin';
			_soap_config.elementName = 'checkUserByLogin';
			_soap_config.SOAPAction = "",
			_soap_config.params = {
												login: user,
												hashPassword: pass
											};
			_soap_config.success = function (soapResponse){
				info.ok = eval(soapResponse.toJSON().Body.checkUserByLoginResponse.return.ok);
				info.errorMsg = soapResponse.toJSON().Body.checkUserByLoginResponse.return.message;
			},
			_soap_config.error = function (soapResponse){
                if (typeof soapResponse.toJSON().Body.Fault != "undefined" &&
                    typeof soapResponse.toJSON().Body.Fault == "object"){
                    info.errorMsg = soapResponse.toJSON().Body.Fault.faultstring;
                } else {
                    info.errorMsg = "Invocation to checkUserByLogin() error..."; 
                }		
			},
			$.soap(_soap_config);			
		} else {
			info.errorMsg = "Invocation to getSystemInfo() needs user && pass parameters";
		}
		return info;
	}
	

	/*----------------------------------------------------------------------
	Busqueda de usuarios por login: getUsersByLogin
	------------------------------------------------------------------------*/
	function _getUsersByLogin(login){
		var user = null;
		if (login !=null){
			// Configure SOAP call
			//_soap_config.method = 'getUsersByLogin';
			_soap_config.elementName = 'getUsersByLogin';
			_soap_config.SOAPAction = "",
			_soap_config.params = {
												pattern: login
											};
			_soap_config.success = function (soapResponse){
				user = soapResponse.toJSON().Body.getUsersByLoginResponse.return;
			},
			_soap_config.error = function (soapResponse){
				// Nothing to do
			},
			$.soap(_soap_config);			
		} else {
			info.errorMsg = "Invocation to getUsersByLogin() a login (pattern)parameter";
		}
		return user;
	}
	
	// PUBLIC API
	return {	
		checkUserByLogin: _checkUserByLogin,
		getUsersByLogin : _getUsersByLogin
	};

}()); // End of namespace rlab.services.users