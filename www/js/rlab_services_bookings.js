var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.BOOKINGS = ( function() {
    
            // Invocation result
            // Integer code;
            // String message;
            // boolean isOk;
            // Object result; Depends on the invocation
    
            // Private variables for module
            var _soap_config = {
                url: 'https://lab-services.scc.uned.es/services/api/soap/BookingWS/',
                method: '',
                appendMethodToURL: true, 
                params: {
                },
                namespaceQualifier: 'booking',                     
                namespaceURL: 'http://booking.ws.related.scc.uned.es',
				success: null,
                error: null,
                async: false, 
                enableLogging: true   
            }
            var _statusOk = false;
            var _message = "No invocation is done."; 
            var _booking = null; 
        
            // Get functions
            function _getInvocationStatus(){
                return _statusOk;
            }
            
            function _getInvocationMessage(){
                return _message;
            }
    
            // private functions
            function _getUserCurrentBooking(user, lab_id, experiment_name){
                _statusOk = false;
                _message = "getUserCurrentBooking() is being invoked...";
                _booking = null;
                _soap_config.elementName = 'getUserCurrentBooking';
				_soap_config.SOAPAction = "";
                _soap_config.params = {
                    booking: user,
                    sys_id: lab_id,
                    experimentName: experiment_name
                };
                _soap_config.success = function (soapResponse){
                    _statusOk = true;
                    _message = "getUserCurrentBooking() sucessfully invoked.";
                    // @return booking data find or nul (error/not find)
                    _booking = soapResponse.toJSON().Body.getUserCurrentBookingResponse.return;
                };
                _soap_config.error = function (soapResponse){
                    _message = "getUserCurrentBooking() wrong invocation.";
                };
                    
                // Sinchronous Call
                $.soap(_soap_config);
                
                return _booking;
            }
            
            // PUBLIC API
            return {
                getUserCurrentBooking: _getUserCurrentBooking
            };
              
}()); // End of namespace rlab.services.bookings

