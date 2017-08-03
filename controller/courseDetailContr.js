
//课程展示控制器
var app = angular.module('courseDetailApp',[]);

app.controller('courseDetailController',function($scope,$http,$location){
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
	console.log(username);
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
	
	//跳转到付费课程页
	$scope.goToBuyCourse = function(courseType){
		courseType = encodeURI(encodeURI(courseType));
		window.location.href = "buyCourse.html?school="+null+"&courseType="+courseType;
	};
	//导航栏提交
	$scope.searchNavSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info_a));
		window.location.href = "search.html?q="+searchInfo;
		
	};
	//从url中获取值
	function getQueryString(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	var courseId=getQueryString("courseId");
	
	var courseName;
	var vedio_id;
	
	console.log("wo de ");
	$http.post(window.location.origin+'/watch/queryCourse',{'course_id':courseId}).then(function(resp){
			console.log(resp.data);	
			$scope.course = resp.data.data;
			if($scope.course['course_type']=='05免费课')
				$scope.days='永久免费';
			else
				$scope.days='365天';
			courseName = resp.data.data['course_name'];

		//查找课程的视频章节目录
		function deleteSuffix(input){
			var temp;
			temp=input.replace('.mp4','');
			return temp;
		}

			function obj(eve){  
					this.html = eve.vedio_name;  
					this.get = function(){  
						return	"<li class='period lesson-item lesson-item-4480' data-id='4480' data-num='1' ><a><i class='es-icon es-icon-undone status-icon'></i><span class='title'>"+deleteSuffix(eve.vedio_name)+"</span></a></li>"
				}
			}
			
			function collapse(i,msg){				
				
					return "<div class='panel panel-default'>\
								<div class='panel-heading' role='tab' id='collapse"+i+"'>\
								  <h4 class='panel-title'>\
									<a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#"+i+"' aria-expanded='true' aria-controls='"+i+"'>\
									  <ins>第 "+i+" 章</ins> "+msg+"\
									</a>\
								  </h4>\
								</div>\
								<div id='"+i+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='collapse"+i+"'>\
								  <div class='panel-body'>\
										<ul class='period-list' id='course-item-list"+i+"'>\
										</ul>\
								  </div>\
								</div>\
							  </div>"
				
			}
			
	
		$http.post(window.location.origin+'/watch/queryCoursedVedio',{'course_name':courseName}).then(function(resp){
	
				console.log(resp.data);
				vedio_id = resp.data.data[0]['vedio_id'];
				var chapter_data = resp.data.data;
				var sort_data= resp.data.data;
				var myArray = new Array();
				/* sort_data.sort(function(a,b){
            return a.vedio_chapter_name-b.vedio_chapter_name}); */
			
			
			var m=1;
				//var ele = document.getElementById('course-item-list');
			var col_ele = document.getElementById('accordion');
			for(var i = 0;i<sort_data.length;i++){  
					if(parseInt(sort_data[i].vedio_course_chapter) >m){					
						m=parseInt(sort_data[i].vedio_course_chapter);
					}
				}
			for(var j=1;j<=m;j++){
				for(var i=0;i<chapter_data.length;i++)
				{
					if(parseInt(chapter_data[i].vedio_course_chapter) ==j){					
							myArray[j]=chapter_data[i];
							/* if(myArray[i].vedio_chapter_name==null)
								myArray[i].vedio_chapter_name=''; */
							break;
						}
				}
			}
			//console.log(myArray);
			for(var i = 1;i<=m;i++){  
					
						//ele.innerHTML+="<li style='font-size:20px'>第 "+m+" 章</li>";
						col_ele.innerHTML+=collapse(i,myArray[i].vedio_chapter_name);
					
				}  				
				 
				
				m=1;
				for(var i = 0;i<chapter_data.length;i++){  
					
						var ele = document.getElementById('course-item-list'+parseInt(chapter_data[i].vedio_course_chapter));
						var new_obj = new obj(chapter_data[i]);
						ele.innerHTML += new_obj.get();
  
				}  
		
		});

	});	
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

		$http.post(window.location.origin+'/watch/login',data).then(function(resp){
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
	
	//申请课程按钮
	$scope.applyCourse = function(){
		var course_id = courseId;
		
		//判断是否存在用户名cookie，如果不存在就需要登录按钮，如果有进行下一步
		var username=getCookie('stu_user_name');
		//console.log(username);
		if(username==null)
		{
				$scope.msg="您还未登录，请先登录";
				$('#alertModal').modal();
				$('#myModal').modal('show');
		}else{
			
			//判断课程是否是免费课，如果是免费课就不需要弹出购买申请框
			$http.post(window.location.origin+'/watch/queryCourse',{'course_id':course_id}).then(function(resp){
				var course_data = resp.data.data;
				if(course_data['course_type'] != "05免费课"){
					
					var buyInfoBean = {};
						buyInfoBean['stu_user_name'] = username;
						buyInfoBean['course_id'] = course_id;
						$http.post(window.location.origin+'/watch/queryBuyInfo',buyInfoBean).then(function(resp){
						//console.log(resp.data);	
						var data = resp.data.data;
						if(data['code']=='ok'){
							//已购买，申请通过，并未过期，跳转到播放页面,查询课程视频第一个
							
							window.location.href = "newVedioPlay.html?courseId="+courseId+'&'+"vedioId="+vedio_id;		
					
						}else{
							//未购买，或者已过期，需要弹出框申请，
							if(data['msg'] == "过期"){
								$scope.msg="您购买的课程已超过一年期限，请重新购买";
								$('#alertModal').modal();
								$('#buyModal').modal('show');	//弹出购买框
							}else if(data['msg'] == "待授权")
							{
								$scope.msg="您申请的课程管理员还未授权，请耐心等待，如果问题请致电凡纳斯教育";
								$('#alertModal').modal();
							}else if(data['msg'] == "未通过")	
							{
								$scope.msg="您申请的课程未通过授权，可能存在的问题是您未购买此课程或者填写的姓名不符，如果问题请致电凡纳斯教育";
								$('#alertModal').modal();
							}else if(data['msg'] == "未购买")
							{
								$scope.msg="您还未购买此课程,如果线下已经购买，请申请该课程，等待管理员审核"
								
								
								//查询基本信息
								$http.post(window.location.origin+'/watch/queryApplyStudent',buyInfoBean).then(function(resp){
									$scope.apply_name = resp.data.data['stu_name'];
									$scope.apply_school=resp.data.data['stu_school'];
									$scope.apply_phone=resp.data.data['stu_phone'];
								});
								$('#applyModal').modal();
								alert("www");
								//$('#alertModal').modal();
							}
								
						}
							
					});
				}else{	//是免费课的情况下直接跳转
					
					window.location.href = "newVedioPlay.html?courseId="+courseId+'&'+"vedioId="+vedio_id;	
				}
			});
			
			
		}
		
		
		
	};
	
	//购买框函数
	$scope.buyFunction = function(){
		var data={};
		data['stu_name'] = $scope.apply_name;
		data['stu_phone']	=$scope.apply_phone;
		data['stu_school']	=$scope.apply_school;
		data['course_name']	=courseName;
		data['stu_user_name'] = getCookie('stu_user_name');
		data['course_id'] = courseId;
		
		if(data['stu_name'] !=null && data['stu_phone'] !=null && data['stu_school']!=null)
		//console.log(data);
		{
			$http.post(window.location.origin+'/watch/saveBuyInfo',data).then(function(resp){
					$scope.msg="申请成功，请耐心等待管理员审核";
					//console.log(resp.data);
					$('#applyModal').modal('hide');
					$('#alertModal').modal();
				
			});
		}
	};
	
});

//去掉后缀的过滤器
app.filter('suffix',['$sce',function($sce){
	return function(input){
			var temp;
			temp=input.replace('.mp4','');
			return temp;
		}
	
}]);
