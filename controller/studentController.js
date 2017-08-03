
//学员管理控制器

var app = angular.module('studentApp',[]);

app.controller('studentController',function($scope,$http,$location){

	var table_data;
	$(document).ready(function(){
	//初始化表格内容数据
		var table=$('#dataTables-example').DataTable({
			"processing":true,
			"severSide":true,
			"ajax":window.location.origin+'/watch/queryAllStudent',
			"columns":[
				{"data":"stu_id"},
				{"data":"stu_user_name"},
				{"data":"stu_name"},
				{"data":"stu_phone"},
				{"data":"stu_school"},
				{"data":"stu_time"},
			]
		});
	//添加点击每行的事件，实现密码重置
	$('#dataTables-example tbody').on('dblclick','tr',function(){
			 table_data=table.row(this).data();
			 $scope.username_modal = table_data['stu_name'];
			 $scope.course_modal = table_data['stu_course_name'];
			 $('#myModal').modal();
		});
	});
	
	//删除学生信息函数
	/* $scope.deleteStudent = function(){
		var data ={'stu_id':table_data['stu_id'].toString()}	
		$http.post($location.path()+'/watch/deleteStudent',data).then(function(resp){
			alert("删除成功");
			location.reload();
			//console.log(resp.data.data);
	});
	}; */

	//重置密码
	$scope.initalPwd = function(){
		var data = {'stu_user_name':table_data['stu_user_name'].toString()}
		$http.post($location.path()+'/watch/initalPwd',data).then(function(resp){
		alert("重置密码成功");
		location.reload();
				
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