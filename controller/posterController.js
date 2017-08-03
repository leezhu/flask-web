
//更新海报控制器

var app = angular.module('posterApp',['ngFileUpload']).config(function($httpProvider){
	$httpProvider.defaults.headers.common={'x-session-token':'nnnnnn'}
});

app.controller('posterController',function($scope,$http,$location,Upload){
		var formdata={};

	$scope.submit = function(){
		//data['']=$scope.course;课程路径
		formdata['poster_num']=$scope.poster_num;

		//////////////console.log(formdata);
		if($scope.file)//判断如果有效
			var info =$scope.upload($scope.file);
				
	};

	//上传文件和内容
	$scope.upload = function(file){
	
		Upload.upload({
			url:$location.path()+'/watch/updatePoster',
			data:{file:file,'formdata':formdata}
		}).then(function(resp){
			
			if(resp.data.data['code'] == 'ok'){
				alert("提交成功"+resp.data.data['msg']);
				location.reload();//刷新当前页面
			}else{
				alert("提交失败"+resp.data.data['msg'])
				
			}
		});
	};

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
				//////////////console.log(resp.data);
				if(resp.data.data['code'] == 'ok')
				{
					alert('密码修改成功,请重新登录');
					location.href = window.location.origin+'/login';
				}else{
					alert('原密码错误，请重新输入');
				};
			});
			}
		};


});
