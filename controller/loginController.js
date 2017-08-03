//登录控制器

var app = angular.module('loginApp',[]);

app.controller('loginController',function($scope,$http,$location){
	function setCookie(name,value,Days) 
	{ 
	    var exp = new Date(); 
		exp.setTime(exp.getTime() + Days*24*60*60*1000); 
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 

				
	$scope.submit = function(){
		
		username = $scope.username;
		if(username !='financeclass')
			alert('您不是管理员帐号，请勿登录！');
		else{
		var data={'username':$scope.username,'password':$scope.password};
		$http.post($location.path()+'/watch/login',data).then(function(resp){
			//console.log(resp.data);
		//console.log(resp.data['code']);
		if(resp.data['code'] == 'ok')
		{
			setCookie('x-session-admin-token',resp.data['data'],0.25);
			window.location.href = 'adminIndex.html';
		}else{
			//console.log(resp.data['msg']);
			alert("用户名或密码错误！");
		}
		});
		}
	};
});
