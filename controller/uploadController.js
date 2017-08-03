
//控制器

var app=angular.module('uploadApp',[]);

app.controller('uploadController',function($scope,$http,$location){
	
//设置cookie
	function setCookie(name,value,Days) 
    {   

	  var exp = new Date(); 
	  exp.setTime(exp.getTime() + Days*24*60*60*1000); 
	  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
	} 
		//注销登录，使得cookie为空
	$scope.exit = function(){
		setCookie('x-session-admin-token','',-1);
		window.location.href="/login";
		
	};
 //修改密码
	  $scope.editPwd = function(){
		init_pwd = $scope.init_pwd;
		new_pwd = $scope.new_pwd;
		conf_pwd = $scope.conf_pwd

		if(new_pwd != conf_pwd)
			alert('再次输入密码与新密码不一致！');
		else if(new_pwd == init_pwd)
			alert('不能与原密码一致');
		else
		{	
			data = {'stu_name':'financeclass','stu_password':init_pwd,'new_pwd':new_pwd}

			$http.post(window.location.origin+'/watch/editPwd',data).then(function(resp){
				//console.log(resp.data);
				if(resp.data.data['code'] == 'ok')
				{
					alert('密码修改成功,请重新登录');
					location.href = window.location.origin+'/login';
				}else
				{
					alert('原密码错误，请重新输入');
				};
				});
		}
	};
});
