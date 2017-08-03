
//学员权限管理控制器

var app = angular.module('manageDocApp',[]);

app.controller('manageDocController',function($scope,$http,$location){
	
	var table_data;
		$(document).ready(function(){	
		$('#tablelist').bootstrapTable({
		  url: window.location.origin+"/watch/queryAllDoc",
		  search: true,  //是否显示搜索框功能
		  striped: true,
		  pagination: true,  //是否分页
		  showRefresh: true, //是否显示刷新功能 
		  showToggle: true,
		  showColumns: true,
		  pageSize: 15,
		  pageList: [15, 30],
		  iconSize: 'outline',
		  onDblClickCell: function (field, value,row,td) {
           //alert(row['vedio_name']);
					
					$http.post($location.path()+'/watch/queryDoc',{'doc_id':row['doc_id']}).then(function(resp){
						 $scope.data=resp.data.data;
						   //console.log($scope.data);
							$('#docModal').modal();
							});
			},
		  
		 // toolbar: '#exampleTableEventsToolbar', 可以在table上方显示的一条工具栏，
		  icons: {
			refresh: 'glyphicon-repeat',
			toggle: 'glyphicon-list-alt',
			columns: 'glyphicon-list'
		  }
		});

	});
	
	//修改文件名
	$scope.editFunction = function(){
		$http.post($location.path()+'/watch/editDoc',$scope.data).then(function(resp){
				 alert("更新成功");
				 $('#docModal').modal('hide');
				 //location.reload();
			 });
	}
	//删除文件
	$scope.deleteDoc = function(){

		var data = $('#tablelist').bootstrapTable('getSelections');		
		//console.log(data);
		$http.post($location.path()+'/watch/deleteDoc',{'data':data}).then(function(resp){
			if (resp.data.data['code']=='ok'){
				alert('删除成功');
				//location.reload();
			}else{
				alert('删除失败，出错了！！！');
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
				////console.log(resp.data);
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
