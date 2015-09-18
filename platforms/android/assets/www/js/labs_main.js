var labListApp = angular.module('labListApp', []);
labListApp.controller("labListAppCtrl", ["$scope", "$window", function($scope,$window){
    
  // Variables
    $scope.user = "N/A";
    $scope.pass = "N/A";
    $scope.labs = null;
    $scope.experiments = null;
    $scope.selected_lab = null;
    $scope.selected_experiment = null;
    $scope.selected_lab_isAlive = false;
    $scope.error = "";
  
    // Load data from localstorage
	if (localStorage.labs_info != null){
		var labs_info = JSON.parse(localStorage.labs_info);
		$scope.user = labs_info.user;
        $scope.pass = labs_info.pass; //Hashed with WS
		$scope.labs = labs_info.labs;
        // Select the first lab in labs
        if (!Array.isArray(labs_info.labs)){
			if (typeof labs_info.labs === "object" && labs_info.labs["xsi:nil"] != "true"){
                // Only one lab
                $scope.labs = [labs_info.labs];   
            } else {
                // No laboratories
                var lab_null = new Object();
                lab_null.name = "No laboratories available...";
                $scope.labs = [lab_null];
            }
        }
        // Fist lab
        $scope.selected_lab = $scope.labs[0];
        // Init experiment
        var exp_null = new Object();
        exp_null.experiment_name = "No experiments seleted...";
        $scope.experiments = [exp_null];
        $scope.selected_experiment = $scope.experiments[0];
	}
    
    $scope.logout = function(){
        // Delete data from login
        if (localStorage.labs_info != null){
            localStorage.removeItem("labs_info");
            $window.location.href = "login_related.html"; 
        }
    }
    // Controller Functions
    $scope.loadExperiments = function(id){
        $scope.experiments = RLAB.SERVICES.SYSTEMS.getExperiments(id);
        if (!Array.isArray($scope.experiments)){
			if (typeof $scope.experiments === "object" && 
				$scope.experiments["xsi:nil"] != "true"
				){
                // Only one experiment
                $scope.experiments = [$scope.experiments];
		    } else {
                // No experiments
                var exp_null = new Object();
                exp_null.experiment_name = "No experiments available...";
                $scope.experiments = [exp_null];
		    }
       }
        $scope.selected_experiment = $scope.experiments[0];
    }

    $scope.checkLabStatus = function(id){
        if (id!=null){
            $scope.selected_lab_isAlive = RLAB.SERVICES.SYSTEMS.STATUS.isAlive(id);
        }
    }
    
    $scope.selectExperiment = function (experiment){
        $scope.selected_experiment = experiment;
        $scope.showModal = false;
    }
    
    $scope.toExperiment = function(lab,experiment){
        // Generate token
        // Slot time? ==> maximun defined in the experiment
        RLAB.SERVICES.TOKENS.generateToken($scope.user, $scope.pass, lab.ID, 
        							experiment.id,experiment.slot_time,
        							$scope.generateTokenCallSuccess, 
        							$scope.generateTokenCallError);
    }

    $scope.generateTokenCallSuccess = function(tokenId){
        if (tokenId != null){
            var _url = "checks.html?token_id="+ tokenId;
			// Check for HTTPs!!!
			if (window.location.protocol == "https:"){
				var pathArray = window.location.pathname.split('/');;
				pathArray[pathArray.length-1] = _url;
				_url = "http://" + window.location.hostname + pathArray.join('/');
			}
            $window.location.href = _url; 
        } else {
            $scope.error = RLAB.SERVICES.TOKENS.getInvocationMessage();
        }
		
    }

    $scope.generateTokenCallError = function(message){
		$scope.error = RLAB.SERVICES.TOKENS.getInvocationMessage();
    }
    
    /*******************************************************************
     * 
     * 
     ******************************************************************/
    $scope.showModal = false;
    $scope.toggleModal = function(lab){
        $scope.showModal = !$scope.showModal;
        if ($scope.showModal){
            // Sethe the selected lab
            $scope.selected_lab = lab;
            // Get status
            $scope.checkLabStatus(lab.ID);
            // Get experiments
            $scope.loadExperiments(lab.ID);
        }
    }
    
}]);

labListApp.directive('modal', function () {
    return {
      template: '<div class="modal fade" id="dlgLabExpSelection" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" aria-label="Close">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
});
