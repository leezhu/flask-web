
//下载文件控制器
var app = angular.module('findPassWordApp',[]);

app.controller('findPassWordContr',function($scope,$http,$location){
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
		setCookie('x-session-x-session-token','',-1);
		location.reload();
		
	};
	
	//找回密码
	$scope.submitFindPassWord = function(){
		//console.log($scope.username);
		if($scope.username != null)
		{			
				$http.post($location.path()+'/watch/queryUser',{'stu_user_name':$scope.username}).then(function(resp){
					//console.log(resp.data);
					
					if(resp.data.data['code'] =='ok')	//说明用户名存在
					{
						$scope.msg="您的申请我们已收到,我们过会将发送一份修改密码邮件到您的邮箱，请注意及时查收邮件(如果一直没有收到邮件，请致电凡纳斯教育)！";
						//发送给后台去发送邮件
						$http.post($location.path()+'/watch/sendMail',{'stu_user_name':$scope.username}).then(function(resp){
							
						});
					}
					else{
						$scope.msg=resp.data.data['msg'];
					}
					$('#alertModal').modal();
				});
		}
	};
	
//导航栏提交
	$scope.searchNavSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info_a));
		window.location.href = "search.html?q="+searchInfo;
		
	};

	//跳转到付费课程页
	$scope.goToBuyCourse = function(courseType){
		courseType = encodeURI(encodeURI(courseType));
		window.location.href = "buyCourse.html?school="+null+"&courseType="+courseType;
	};	
	


});
