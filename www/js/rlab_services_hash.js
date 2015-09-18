var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.HASHPASSWORDS = ( function() {
	
	// Global configuration
	var _soap_config = {
			url: 'https://lab-services.scc.uned.es/services/api/soap/HashPasswordWS/',
			// This parameters are configured for the soap method
			method: '',
			appendMethodToURL: true, 	
			params: {
			},
			////////////////////////////////////////////////
			namespaceQualifier: 'passwords',                     
			namespaceURL: 'http://passwords.ws.related.scc.uned.es',
			success: null,
			error: null,
			async: false, 
			enableLogging: true   
	}
	
	// Private methods
	function _getHashedPassword(password){
		var hash_password = null;
		if (password !=null){
			// Configure SOAP call
			//_soap_config.method = 'getHashedPassword';
			_soap_config.elementName = 'getHashedPassword';
			_soap_config.SOAPAction = "",
			_soap_config.params = {
									pass: password
							      };
			_soap_config.success = function (soapResponse){
				hash_password = soapResponse.toJSON().Body.getHashedPasswordResponse.return;
			};
			_soap_config.error = function (soapResponse){
				//Nothing to do
			};	
			$.soap(_soap_config);			
		}
		return hash_password;
	}

	// PUBLIC API
	return {	
		getHashedPassword: _getHashedPassword
	};
}()); // End of namespace rlab.services.HASHPASSWORDS