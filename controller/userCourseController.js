




//用户课程中心
var app = angular.module('userCourseApp',[]);

app.controller('userCourseController',function($scope,$http,$location){
	 //console.log("conme2");
	//中文转unicode
		function unicode(value){
        var preStr='＼＼u';
        var cnReg=/[＼u0391-＼uFFE5]/gm;
        if(cnReg.test(value)){
            var ret=value.replace(cnReg,function(str){
                return preStr+str.charCodeAt(0).toString(16)
            });
            return ret
        }else{
            alert('没有找到中文字符串')
        }
    }
	
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

			$scope.name = username;
			//console.log($scope.name);
	}
	else{
		window.location.href="newIndex.html";
		
	}
	//注销登录，使得cookie为空
	$scope.exit = function(){
		setCookie('stu_user_name','',-1);
		setCookie('x-session-token','',-1);
		window.location.href="newIndex.html";
		
	};
	//导航栏提交
	$scope.searchNavSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info_a));
		window.location.href = "search.html?q="+searchInfo;
		
	};
	var stu_user_name = username; 
	
	//查到课程信息
	$http.post(window.location.origin+'/watch/queryUserBuyCourse',{'stu_user_name':stu_user_name}).then(function(resp){
				//console.log(resp.data);
				$scope.courses=resp.data.data;
	}); 
	
	
	
		
	$scope.goToVedio = function(courseId){
			window.location.href = "courseDetail.html?courseId="+courseId;
			
	};
	
	//修改密码
	  $scope.editPwd = function(){
		  
		//console.log("nihao");
		var init_pwd = $scope.init_pwd;
		var new_pwd = $scope.new_pwd;
		conf_pwd = $scope.conf_pwd
		//console.log(init_pwd);
		//console.log(new_pwd);
		//console.log(conf_pwd);
		alert("wo");
		if(new_pwd=='' || conf_pwd=='' || init_pwd=='')
		{
			$scope.msg="密码不能为空！";
			
		}
		else if(new_pwd != conf_pwd){
			$scope.msg='再次输入密码与新密码不一致！';
		
		}
		else if(new_pwd == init_pwd){
			$scope.msg='不能与原密码一致';
			
		}
		else if(new_pwd.length<6){
			$scope.msg='新密码长度必须为6位字符以上';
		}
		else
		{	
			data = {'stu_name':stu_user_name,'stu_password':init_pwd,'new_pwd':new_pwd}

			$http.post(window.location.origin+'/watch/editStudentPwd',data).then(function(resp){
				//console.log(resp.data);
				if(resp.data.data['code'] == 'ok')
				{
					$scope.msg='密码修改成功,请重新登录';
					$('#alertModal').modal();
					setCookie('stu_user_name','',-1);
					setCookie('x-session-token','',-1);
					//window.location.href="newIndex.html";
				}else
				{
					$scope.msg='原密码错误，请重新输入';
				};
				
				});
		}
		$('#alertModal').modal();
	};
});


	
	
		
