angular.module('optionsApp')
.controller('ttsServiceChooserController', function($scope) {
	$scope.options = [];
	$scope.onClick = function(clickedOption) {
		$scope.options.forEach(function(option) {option.selected = false;});
		clickedOption.selected = true;
		sendSet("preferredTts", clickedOption.tts);
	}
	chrome.runtime.sendMessage({action: "webReader.getTtsServiceNames"}, function(names) {
		names.forEach(function(name) {$scope.options.push({tts: name, selected: false});});
		$scope.$digest();	//so angular recognizes the change
	});
	getSettings(function(settings) {
		$scope.options.forEach(function(option) {
			option.selected = (option.tts == settings.preferredTts);
		});
		$scope.$digest();	//so angular recognizes the change
	});
})
.controller('speedRangeController', function($scope) {
	$scope.speed = {min: 0.5, max: 4, step: 0.1}
	$scope.$watch('speed.value', function() {
		//range provides updates as strings and not numbers => need to convert
		//https://github.com/angular/angular.js/issues/5892
		$scope.speed.value = parseFloat($scope.speed.value);
		
		//BUG: sendSet is sent every startup
		//if is needed because the initial value is Nan, and setSet gets called because the above conversion
		if($scope.speed.value) sendSet("speed", $scope.speed.value);
	});
	getSettings(function(settings) {
		//string needs to be converted to number - angular otherwise throws numberFormatError
		$scope.speed.value = Number(settings.speed) || 1;
		$scope.$digest();	//so angular recognizes the change
	});
});