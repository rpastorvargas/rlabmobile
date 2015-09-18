var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.TOKENS = ( function() {
    
            // Invocation result
            // Integer code;
            // String message;
            // boolean isOk;
            // Object result; Depends on the invocation
    
            // Private variables for module
            var _soap_config = {
                url: 'https://lab-services.scc.uned.es/services/api/soap/TokensWS/',
                method: '',
                appendMethodToURL: true, 
                params: {
                },
                namespaceQualifier: 'token',                     
                namespaceURL: 'http://token.ws.related.scc.uned.es',
				success: null,
                error: null,
                async: false, 
                enableLogging: true   
            }
            var _statusOk = false;
            var _message = "No invocation is done."; 
            var _token = null; 
        
            // Get functions
            function _getInvocationStatus(){
                return _statusOk;
            }
            
            function _getInvocationMessage(){
                return _message;
            }
            // private functions
            function decodeToken(soapResponse){
                var jsonObject = soapResponse.toJSON().Body.getTokenInfoResponse.return;
                var tokenData = null;
                _message = jsonObject.message;
                if (jsonObject.ok=="true"){
                    // valid token
                    tokenData = jsonObject.result;
                }  else {
                    _statusOk = false;
                }
                return tokenData;
            }
    
            function _getTokenInfo(tokenId){
                _statusOk = false;
                _message = "getTokenInfo() is being invoked...";
                _token = null;
                if (tokenId!=null){
                    //_soap_config.method = 'getTokenInfo';
					_soap_config.elementName = 'getTokenInfo';
					_soap_config.SOAPAction = "",
                    _soap_config.params = {
                                           tokenId: tokenId
                                         };
                    _soap_config.success = function (soapResponse){
                        _statusOk = true;
                        _message = "getTokenInfo() sucessfully invoked.";
                        _token = decodeToken(soapResponse);
                    },
                    _soap_config.error = function (soapResponse){
                        _message = "getTokenInfo() wrong invocation.";
                    },
                    
                    // Sinchronous Call
                    $.soap(_soap_config);
                }
                return _token;
            } // End of private function _getTokenInfo 
            
            // private functions
            function decodeTokenInfo(soapResponse){
                var jsonObject = soapResponse.toJSON().Body.generateTokenResponse.return;
                var tokenData = null;
                _message = jsonObject.message;
                if (jsonObject.ok=="true"){
                    // valid invocation
                    tokenData = jsonObject.result;
                }  else {
                    _statusOk = false;
                }
                return tokenData;
            }
    
            function _generateToken(login,hashedPassword,systemId,experimentId,slot_time,
                                    successFunction, errorFunction){
                _statusOk = false;
                _message = "getTokenInfo() is being invoked...";
                var _tokenInfo = null;
                if (login!=null && hashedPassword!=null && systemId!=null && experimentId!=null && slot_time!=null){
                    //_soap_config.method = 'generateToken';
					_soap_config.elementName = 'generateToken';
					_soap_config.SOAPAction = "",
                    _soap_config.params = {
                        login: login,
                        hashedPassword: hashedPassword,
                        systemId: systemId,
                        experimentId: experimentId,
                        totalTimeInMinutes: slot_time
                    };
                    _soap_config.success = function (soapResponse){
                        _statusOk = true;
                        _message = "generateToken() sucessfully invoked.";
                        _tokenInfo = decodeTokenInfo(soapResponse);
                        if (successFunction != null){
                            successFunction(_tokenInfo);
                        }
                    },
                    _soap_config.error = function (soapResponse){
                        _message = "generateToken() wrong invocation.";
                        if (errorFunction != null){
                           errorFunction(_message); 
                        }
                    },
                    
                    // Sinchronous Call
                    $.soap(_soap_config);
                }
            } // End of private function _generateToken
    
            
            // PUBLIC API
            return {
                getInvocationStatus: _getInvocationStatus,
                getInvocationMessage: _getInvocationMessage,
                getTokenInfo: _getTokenInfo,
                generateToken: _generateToken
            };
              
}()); // End of namespace rlab.services.token


// Class tokens
