//这是后台管理中新增学员信息控制器

var app = angular.module("addStudentApp",[]);
app.controller('addStudentController',function($scope,$http,$location){

//获取cookie
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		  return unescape(arr[2]); 
    else 
         return null; 
  } 
  var token = getCookie('token');
  //console.log(token);
	//初始化课程选择，这个需要读取数据库内容,编号对应
	$scope.names=["专业课","数学","英语"];
	//提交表单
	$scope.processForm = function(){
		var postdata={};
		postdata['stu_user_name']=$scope.studentId;
		postdata['stu_name']=$scope.studentName;
		postdata['stu_phone']=$scope.phoneNumber;
		postdata['stu_fee_date']=$scope.feedate;
		postdata['stu_course_name']=$scope.selectCourse;
		postdata['stu_course_id']="01";

		//$http({methods:'post',url:$location.path()+"/watch/saveStudent",data:postdata,headers:{'x-session-token':token}}).then(function(resp){
		$http.post(url:$location.path()+"/watch/saveStudent",postdata).then(function(resp){
			var respdata=resp.data.data;
			if(respdata['code']=="ok"){
				alert("提交成功");
				document.getElementById("form1").reset();
			}else{
				alert("提交失败");
			}

		////console.log(resp.data);
	});
	////console.log(postdata);	
	//alert(postdata);
	};


});
