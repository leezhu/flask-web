
//学员购买申请管理控制器

var app = angular.module('studentCourseApp',[]);

app.controller('studentCourseController',function($scope,$http,$location){
	

	var table_data;
	$(document).ready(function(){
		
		
		
    $('#tablelist').bootstrapTable({
      url: window.location.origin+"/watch/queryAllBuyInfo",
      search: true,  //是否显示搜索框功能
	  striped: true,
      pagination: true,  //是否分页
      showRefresh: true, //是否显示刷新功能 
      showToggle: true,
      showColumns: true,
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
	
	
	
		
		
		
	//初始化表格内容数据
		/* var table=$('#dataTables-example').DataTable({
			"processing":true,
			"severSide":true,
			"ajax":window.location.origin+'/watch/queryAllBuyInfo',
			"columns":[
				{"data":"buy_id"},
				{"data":"stu_user_name"},
				{"data":"stu_name"},
				{"data":"course_name"},
				{"data":"buy_begin_time"},
				{"data":"buy_end_time"},
				{"data":"authority"},
			]
		}); */
	//添加点击每行的事件，实现权限更改
	/* $('#dataTables-example tbody').on('dblclick','tr',function(){
			 table_data=table.row(this).data();
			 $('#myModal').modal();
		}); */
	});
	
	
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
	//更改课程为可用
	$scope.changeCourseUse = function(){
		var data = $('#tablelist').bootstrapTable('getSelections');	
		if(data ==null)
		{
			console.log("no");
		}else{
			console.log(data);
			$http.post($location.path()+'/watch/changeBuyInfoAuth',{'data':data,'code':'1'}).then(function(resp){
			if (resp.data.data['code']=='ok'){
				alert('修改成功');
			}else{
				alert('修改失败');
			}
			//location.reload();
		////console.log(resp.data.data);
		});
		}
		
	};
	
	//更改课程为不可用
	$scope.changeCourseNoUse = function(){
		//console.log($('#tablelist').bootstrapTable('getSelections'));
		var data = $('#tablelist').bootstrapTable('getSelections');	
		console.log(data);
		if(data ==null)
		{
			console.log("no");
		}else{
			//console.log(data);
			$http.post($location.path()+'/watch/changeBuyInfoAuth',{'data':data,'code':'0'}).then(function(resp){
			alert("修改成功");
			//location.reload();
		////console.log(resp.data.data);
		});
		}
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
