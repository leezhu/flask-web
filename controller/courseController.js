
//学员权限管理控制器

var app = angular.module('courseApp',['ngFileUpload']);

app.controller('courseController',function($scope,$http,$location,Upload){
	
	var table_data;
	 $scope.activities = ['0','1'];
	 $scope.courseType=['01专业课','02数学课','03英语课','04政治课','05免费课'];
	$(document).ready(function(){
	//初始化表格内容数据
		var table=$('#dataTables-example').DataTable({
			"processing":true,
			"severSide":true,
			"ajax":window.location.origin+'/watch/queryAllCourse',
			"columns":[
				{"data":"course_id"},
				{"data":"course_type"},
				{"data":"course_name"},
				{"data":"course_teacher"},
				{"data":"course_price"},
				{"data":"course_status"},
				{"data":"course_build_date"}
			]
		});
	//添加点击每行的事件，实现权限更改
	$('#dataTables-example tbody').on('dblclick','tr',function(){
			 table_data=table.row(this).data();
			 var data = {'course_id':table_data['course_id'].toString()};	//找出这条记录的所有值
			 $http.post($location.path()+'/watch/queryCourse',data).then(function(resp){
				 $scope.data = resp.data.data;
			 });
			 $('#applyModal').modal();
		});
	});
	
	//更新课程信息
	$scope.editFunction = function(){
		console.log($scope.data);
		if($scope.file)//判断如果有效,如果为空直接更新
			var info =$scope.upload($scope.file);
		else
		{
			$http.post($location.path()+'/watch/editCourseWithNoFile',$scope.data).then(function(resp){
				 alert("更新成功");
				 location.reload();
			 });
		}
		console.log($scope.data);
	};
	
		//上传文件和内容
	$scope.upload = function(file){
	
		Upload.upload({
			url:$location.path()+'/watch/editCourseWithFile',
			data:{file:file,'formdata':$scope.data}
		}).then(function(resp){
			
			if(resp.data.data['code'] == 'error'){
				alert("提交失败"+resp.data.data['msg']);
				//location.reload();//刷新当前页面
			}else{
				alert("提交成功");
				location.reload();
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
