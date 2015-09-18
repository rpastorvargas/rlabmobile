
var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};
RLAB.SERVICES.SYSTEMS = RLAB.SERVICES.SYSTEMS || {};

RLAB.SERVICES.SYSTEMS.STATUS = ( function() {
    
	var _serviceURL = 'https://lab-services.scc.uned.es/services/api/soap/WatchDogSignalWS/';
    
	// Check for Web environment with https
	//if (window.location.protocol == 'https:'){
	//	_serviceURL = 'https://lab.scc.uned.es:8443/axis2/services/WatchDogSignalWS/';
	//}
	// Private variables
	// Global configuration
	var _soap_config = {
			url: _serviceURL,
			method: '',
			appendMethodToURL: true, 	
			params: {
			},
			namespaceQualifier: 'watchdog',                     
			namespaceURL: 'http://watchdog.ws.related.scc.uned.es',
			success: null,
			error: null,
			async: false, 
			enableLogging: true   
	}
    
    // Private methods
	function _isAlive(id){
		var _isAlive = false;
		if (id !=null){
			// Configure SOAP call
			//_soap_config.method = 'isAlive';
			_soap_config.elementName = 'isAlive';
			_soap_config.SOAPAction = "",
			_soap_config.params = {
                systemID: id
			};
			_soap_config.success = function (soapResponse){
				var _txt = soapResponse.toJSON().Body.isAliveResponse.return;
	            _isAlive = (_txt == "true");
                
			},
			_soap_config.error = function (soapResponse){
                // Nothing to do..
                // false is the default value
			},
			$.soap(_soap_config);			
		} 
        return _isAlive;
	}
    
    // PUBLIC API
	return {	
		isAlive: _isAlive
	};
    
}()); // End of namespace rlab.services.systems.status
