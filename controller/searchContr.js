
//搜索控制器
var app = angular.module('searchApp',[]);

app.controller('searchContr',function($scope,$http,$location){
	//$scope.pro_course1_img = "img/finance1.png";	
	
	//设置cookie
	function setCookie(name,value,Days) 
    {   

	  var exp = new Date(); 
	  exp.setTime(exp.getTime() + Days*24*60*60*1000); 
	  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
	} 
	function getCookie(name) 
	{ 
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			 return unescape(arr[2]); 
		else 
			 return null; 
    } 
	
	//判断是否存在用户名cookie，如果不存在就需要登录按钮，如果有就显示出来
	var username=getCookie('stu_user_name');
	//console.log(username);
	if(username!=null)
	{
			$('#loginbtn').hide();
			document.getElementById('loginSuccess').style.display="block";
			$scope.name = username;
	}
	//注销登录，使得cookie为空
	$scope.exit = function(){
		setCookie('stu_user_name','',-1);
		setCookie('x-session-token','',-1);
		location.reload();
		
	};
	
	
	//从url中获取值
	function getQueryString(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	var Q=decodeURI(getQueryString("q"));
	$scope.match=Q;
	
	//console.log($scope.match);
	if(Q=='undefined')
	{
		$scope.number_course=0;
		$scope.number_doc=0;
	}
	
	if(Q=='')	//不为空
	{
		$scope.msg="请输入搜索关键字";
		$('#alertModal').modal();
	}
	else{
		//获取所有查找关键字课程信息
	$http.post($location.path()+'/watch/searchCourse',{'course_name':Q}).then(function(resp){
	//console.log(resp.data);	
	$scope.courses=resp.data.data;	
	$scope.number_course=resp.data.data.length;
	});
	
	//获取所有关键字查找的下载文件
	$http.post($location.path()+'/watch/searchDoc',{'doc_title':Q}).then(function(resp){
		//console.log(resp.data);
		$scope.docs=resp.data.data;
		$scope.number_doc=resp.data.data.length;
	});
		
	}
	
		
		//提交搜索信息
	
	$scope.searchSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info));
		window.location.href = "search.html?q="+searchInfo;
		
	};
	
	//导航栏提交
	$scope.searchNavSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info_a));
		window.location.href = "search.html?q="+searchInfo;
		
	};

		
	$scope.registerSubmit = function(){
			//注册信息
		var stu_user_name = $scope.stu_user_name;
		var stu_pwd=$scope.stu_pwd;
		var stu_pwd_conf = $scope.stu_pwd_conf;
		var stu_phone = $scope.stu_phone;
		var stu_name = $scope.stu_name;
		var stu_school = $scope.stu_school;
	
	/* 	//console.log(stu_pwd.length); */
		if(stu_pwd.length<6|| stu_pwd_conf.length<6 || stu_user_name.length<6){
				$scope.msg="用户名或密码长度小于6";
				$('#alertModal').modal();
		}
		else if(stu_pwd != stu_pwd_conf){
				$scope.msg="两次输入密码不一致";
				$('#alertModal').modal();
		}else if(stu_phone ==null ||stu_name==null || stu_school ==null )
		{
			/* $scope.msg="输入不能为空";
				$('#alertModal').modal(); */
		}
		else{
			
					var data={};
					data['stu_user_name'] = stu_user_name;
					data['stu_name']=stu_name;
					data['stu_pwd'] = stu_pwd;
					data['stu_phone'] = stu_phone;
					data['stu_school'] = stu_school;
					console.log(data);
					$http.post($location.path()+'/watch/registerStudent',data).then(function(resp){
/* 			//console.log(resp.data);	
			//console.log(resp.data.data['code']); */
			if(resp.data.data['code']=="ok"){
				//注册成功应该获取一个x-session-token,将用户名存在cookie当中，刷新的时候不会取消
				var data={};
				data['username'] = stu_user_name;
				data['password'] = stu_pwd;
				
				$http.post($location.path()+'/watch/login',data).then(function(resp){
		/* 				//console.log(resp.data);	 */
						setCookie('x-session-token',resp.data['data'],0.25);
						setCookie('stu_user_name',stu_user_name,0.25);

				});
				$scope.msg="注册成功";
				$('#myModal').modal('hide');
				$('#loginbtn').hide();
			document.getElementById('loginSuccess').style.display="block";
			}
			else
				$scope.msg="用户名已存在";
			$('#alertModal').modal();

			$scope.name = stu_user_name;
			//location.reload();
		});
		}
	


	
	};

	//登录
	$scope.loginSubmit = function(){
				
		var stu_user_name = $scope.stu_user_name;
		var stu_pwd=$scope.stu_pwd;
		var data={};
		data['username'] = stu_user_name;
		data['password'] = stu_pwd;

		$http.post($location.path()+'/watch/login',data).then(function(resp){
			//console.log(resp.data);	
			if(resp.data['code']=="ok"){
				$scope.msg="登入成功";
				setCookie('x-session-token',resp.data['data'],0.25);
				setCookie('stu_user_name',stu_user_name,0.25);
				$('#myModal').modal('hide');
				
				$('#loginbtn').hide();
			document.getElementById('loginSuccess').style.display="block";
				$scope.name = stu_user_name;
			}
			else
				$scope.msg="密码或用户名错误";
			$('#alertModal').modal();
			
			
		
		});

			
	};
	//跳转到课程详细页面
	$scope.classDetail = function(courseId){
		window.location.href = "courseDetail.html?courseId="+courseId;
		
	};
});

app.filter('getKey',['$sce',function($sce){
     return function(content,match) {
			var temp;
			var reg = new　RegExp(match,'g');
            temp=content.replace(reg,'<em>'+match+'</em>');
            return $sce.trustAsHtml(temp);
      }
}])    
