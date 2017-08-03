
//下载文件控制器
var app = angular.module('docDownloadApp',[]);

app.controller('docDownloadContr',function($scope,$http,$location){
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
	else{	//未登录
		
		$('#myModal').modal();
	}
	//注销登录，使得cookie为空
	$scope.exit = function(){
		setCookie('stu_user_name','',-1);
		setCookie('x-session-x-session-token','',-1);
		location.reload();
		
	};
	
	//获取下载文件信息	
	/* $http.get($location.path()+'/watch/queryDoc').then(function(resp){
		//console.log(resp.data);
		$scope.docs = resp.data.data;
			
	}); */
	
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
				setCookie('x-session-x-session-token',resp.data['data'],0.25);
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
	
		$(document).ready(function(){

				$('#tablelist').bootstrapTable({
				  url: window.location.origin+"/watch/queryAllDoc",
				  search: true,  //是否显示搜索框功能
				  striped: true,
				  pagination: true,  //是否分页
				  //showRefresh: true, //是否显示刷新功能 
				 // showToggle: true,
				 // showColumns: true,
				  pageSize: 15,
				  pageList: [15, 30],
				  iconSize: 'outline',
				 // toolbar: '#exampleTableEventsToolbar', 可以在table上方显示的一条工具栏，
				  icons: {
					refresh: 'glyphicon-repeat',
					toggle: 'glyphicon-list-alt',
					columns: 'glyphicon-list'
				  }
				});

	
	});
	
	/* $scope.countDowload = function(){
		console.log("Yes");
	}; */
	$scope.back2index = function(){
		window.location.href = "newIndex.html";
	};
	


});

//记录下载量
	function countDowload(doc_id){
		console.log(doc_id);
		$.post(window.location.origin+'/watch/countDowload',{'doc_id':doc_id},function(data){
			console.log(data);
		});
	};
