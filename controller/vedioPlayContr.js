




//视频播放控制器
var app = angular.module('myApp',[]);

app.controller('myCtr',function($scope,$http,$location,$sce,$compile){
	 ////console.log("conme2");
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
	////console.log(username);
	if(username!=null)
	{

			$scope.name = username;
			////console.log($scope.name);
	}
	//注销登录，使得cookie为空
	$scope.exit = function(){
		setCookie('stu_user_name','',-1);
		setCookie('x-session-token','',-1);
		window.location.href="newIndex.html";
		
	};
	
	//从url中获取参数值
	function getQueryString(name)
	{
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	
	//导航栏提交
	$scope.searchNavSubmit = function(){
		
		var searchInfo = encodeURI(encodeURI($scope.info_a));
		window.location.href = "search.html?q="+searchInfo;
		
	};
	//获取课程id,
	var courseId=getQueryString("courseId");
	var vedio_id = getQueryString("vedioId");

	
	//跳转到付费课程页
	$scope.goToBuyCourse = function(courseType){
		
		courseType = encodeURI(encodeURI(courseType));
		window.location.href = "buyCourse.html?school="+null+"&courseType="+courseType;
	};
	
	//实现分页,//通过课程id查到课程内所有视频信息，由于视频表没有存课程id，需要从课程名称来查
	var totalData;
	data={};
	data['course_id']=courseId;
	var dataBean={};
	dataBean['vedio_id'] = vedio_id;
	$http.post($location.path()+'/watch/queryVedio',dataBean).then(function(resp){

				$scope.vedios=resp.data.data;
				$scope.vedio_name = $scope.vedios['vedio_name'];
				//$scope.vedio_path=$scope.vedios['vedio_path'];
				document.getElementById("my-video_html5_api").src=$scope.vedios['vedio_path'];
				document.getElementById("myVedio").src=$scope.vedios['vedio_path'];
				var title="第"+$scope.vedios['vedio_name'][0]+"章—"+$scope.vedios['vedio_name'];
				$("#vedio_name").text( deleteSuffix(title));
				//查找课程的视频章节目录
				console.log(resp.data);
			


	}); 
	$scope.videoUrl = function(url){  
       return $sce .trustAsResourceUrl(url);  
   }; 
   
   function deleteSuffix(input){
				var temp;
				temp=input.replace('.mp4','');
				return temp;
			}
	//查到课程信息
	$http.post($location.path()+'/watch/queryCourse',{'course_id':courseId}).then(function(resp){
				$scope.course=resp.data.data;
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
	 //$scope.vedio_path="uploads/2017/01_professional_course/2017hunandaxuegongshangguanlikaoyanzhuanyekecheng/1/1.2xingweiguanli.mp4";
	$http.post($location.path()+'/watch/queryCoursedIdVedio',data).then(function(response){
		
		//数据源
		

			function obj(eve){  
					this.html = eve.vedio_name; 
					this.html = eve.vedio_path;
					this.get = function(){  
						return	"<li class='period lesson-item lesson-item-4480 ' data-id='4480' data-num='1' ><a href='' onclick=goToVedio(\'"+eve.vedio_path+"\',\'"+eve.vedio_name+"\',\'"+eve.vedio_course_chapter+"\')><i class='es-icon es-icon-undone status-icon'></i><span class='title active'>"+deleteSuffix(eve.vedio_name)+"</span></a></li>"
				}
			}
			
			var chapter_data = response.data.data;
				var m=1;
				var ele = document.getElementById('course-item-list');
				
				//获取章节
				for(var i = 0;i<chapter_data.length;i++){ 
					console.log(chapter_data[i].vedio_course_chapter);
					if( chapter_data[i].vedio_course_chapter.length >2)	//如果是章节是中文，那么不会超过三位数的章节
					{
						m=0;
						break;
					}	
					if(parseInt(chapter_data[i].vedio_course_chapter) >m){					
						m=parseInt(chapter_data[i].vedio_course_chapter);
					}
				}
				console.log(m);
				for(var i=1;i<=m;i++)
				{
					ele.innerHTML+="<li style='font-size:16px' id=li"+i+">第 "+i+" 章</li>";	
				}
				
				for(var i = 0;i<chapter_data.length;i++){  
					
						/* var ele = document.getElementById('li'+parseInt(chapter_data[i].vedio_course_chapter));
						var new_obj = new obj(chapter_data[i]);
						ele.innerHTML += new_obj.get(); */
						
						var new_obj = new obj(chapter_data[i]);
						var html = angular.element(new_obj.get());
						var template = $compile(html)($scope);
						if(m==0)
						{
							angular.element('#course-item-list').append(template);
						}else{
							angular.element('#li'+parseInt(chapter_data[i].vedio_course_chapter)).append(template);
						}

					 
					  
				} 
								
				
/* 				 for(var i = 0;i<chapter_data.length;i++){  
					if(chapter_data[i].vedio_course_chapter ==m){
						ele.innerHTML+="<li style='font-size:16px' id="++">第 "+m+" 章</li>";					
						m++;
						i--;
					}else{
						var new_obj = new obj(chapter_data[i]);
						var html = angular.element(new_obj.get());
						var template = $compile(html)($scope);
				
						angular.element('#course-item-list').append(template);
					}
					  
					 
					  
				}  */ 
            $scope.data = response.data.data;
			////console.log($scope.data);
			 $scope.vedioNames=response.data;
			 totalData = response.data.data;
			 ////console.log("这是分页数据");
			////console.log($scope.vedioNames);
			 //通过id查课程
			
			////console.log(totalData[0]);
			// ////console.log($scope.vedioNames.data[num]);
			 
			// $scope.path=$scope.vedioNames.data[num]['vedio_path'];
			// ////console.log($scope.path);
            //分页总数
            $scope.pageSize = 7;
            $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //分页数
            $scope.newPages = $scope.pages > 7 ? 7 : $scope.pages;
            $scope.pageList = [];
            $scope.selPage = 1;
            //设置表格数据源(分页)
            $scope.setData = function () {
                $scope.vedioNames = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//通过当前页数筛选出表格当前显示数据
            }
            $scope.vedioNames = $scope.data.slice(0, $scope.pageSize);
            //分页要repeat的数组
            for (var i = 0; i < $scope.newPages; i++) {
                $scope.pageList.push(i + 1);
            }
            //打印当前选中页索引
            $scope.selectPage = function (page) {
                //不能小于1大于最大
                if (page < 1 || page > $scope.pages) return;
                //最多显示分页数5
                if (page > 2) {
                    //因为只显示5个页数，大于2页开始分页转换
                    var newpageList = [];
                    for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
                        newpageList.push(i + 1);
                    }
                    $scope.pageList = newpageList;
                }
                $scope.selPage = page;
                $scope.setData();
                $scope.isActivePage(page);
                ////console.log("选择的页：" + page);
            };
            //设置当前选中页样式
            $scope.isActivePage = function (page) {
                return $scope.selPage == page;
            };
            //上一页
            $scope.Previous = function () {
                $scope.selectPage($scope.selPage - 1);
            }
            //下一页
            $scope.Next = function () {
                $scope.selectPage($scope.selPage + 1);
            };
        });
		
		
		//跳转到课程详细页面
	$scope.classDetail = function(courseId){
	     window.location.href = "courseDetail.html?courseId="+courseId;
	 };
	
		goToVedio = function(vedio_path,vedio_name,vedio_chapter_name){
				//$scope.vedio_path = vedio_path;
				document.getElementById("my-video_html5_api").src = vedio_path;
				document.getElementById("myVedio").src =vedio_path;
				var title="第"+vedio_chapter_name+"章—"+vedio_name;
				console.log(title);
				$("#vedio_name").text(deleteSuffix(title));
				
				var myPlayer = videojs('my-video');
				videojs("my-video").ready(function(){
					var myPlayer = this;
					
					myPlayer.play();
				});
			
		};
});

//去掉后缀的过滤器
app.filter('suffix',function(){
	return function(input){
			var temp;
			temp=input.replace('.mp4','');
			return temp;
		}
	
});
	
	
		
