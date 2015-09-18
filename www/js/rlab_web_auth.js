var RLAB = RLAB || {};     
RLAB.SERVICES = RLAB.SERVICES || {};

RLAB.SERVICES.AUTH_HTML = ( function() {
	
        var _loginWindow = null;
        var _userInfo = null;
        var _loginURL = "https://lab-services.scc.uned.es/html5/related/webclientv3/login_related.html?action=auth";
        var _onInfoMessageReceived = null;
        
        function _initAuth(onInfoMessageReceived){
            // Declare the listener for "message" event
            window.addEventListener("message", _receiveMessage, false);
            _onInfoMessageReceived = onInfoMessageReceived;
        }
        
        function _receiveMessage(event){
            if (event.origin == "https://lab-services.scc.uned.es"){
                _userInfo = event.data;
                _onInfoMessageReceived(_userInfo);
            }
        }
        
        function _openLoginWindow(onLoginWindowOpenned){
            // Open login window
			var _width = 350;
			var _height = 450;
			var left = (screen.width/2)-(_width/2);
  			var top = (screen.height/2)-(_height/2);
			_loginWindow = window.open(_loginURL,"LoginWindow", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+_width+', height='+_height+', top='+top+', left='+left);
           // _loginWindow = window.open(_loginURL,"LoginWindow", "width=300, height=450");
            onLoginWindowOpenned();
        }
	
	// PUBLIC API
	return {	
		initAuth: _initAuth,
		openLoginWindow : _openLoginWindow
	};

}()); // End of namespace rlab.services.auth_html

