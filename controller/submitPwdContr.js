
//下载文件控制器
var app = angular.module('submitPwdApp',[]);

app.controller('submitPwdContr',function($scope,$http,$location){
	

	//注销登录，使得cookie为空
	$scope.exit = function(){
		setCookie('stu_user_name','',-1);
		setCookie('x-session-x-session-token','',-1);
		location.reload();
		
	};
	
	//从url中获取值
	function getQueryString(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	var code=getQueryString("code");
	var username = getQueryString("username");
	
	$http.post($location.path()+'/watch/checkMailCode',{'mail_code':code}).then(function(resp){
		if(resp.data.data['code']!='ok')
		{
			$('#infoModal').modal();
		}
	});
	//提交新密码
	$scope.submitPwd = function(){
		//console.log($scope.username);
		if($scope.new_pwd != null && $scope.conf_pwd !=null)
		{		
			var new_pwd = $scope.new_pwd;
			var conf_pwd = $scope.conf_pwd;
			if(new_pwd != conf_pwd)
			{
				$scope.msg="两次输入密码不一致";
				$('#alertModal').modal();
			}
			else if(new_pwd.length <6)
			{
				$scope.msg="密码长度至少6位";
				$('#alertModal').modal();
			}
			else{
				$http.post($location.path()+'/watch/changeNewPwd',{'stu_user_name':username,'stu_pwd':new_pwd}).then(function(resp){
					//console.log(resp.data);	
					$scope.msg="密码修改成功，请转到主页登录";						
					$('#alertModal').modal();
				});
			}
		}
	};
	
//导航栏提交
	$scope.searchNavSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info_a));
		window.location.href = "search.html?q="+searchInfo;
		
	};

	

});
