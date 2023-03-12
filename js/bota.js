	/*           */
	
		var flag=0;
		var speed=500;
		$('#option-f').on('click', function() {
			history.go(+1);
	});
		$('#option-b').on('click', function() {
			history.go(-1);
	});
		$('#option-r').on('click', function() {
			/*history.go(-0);*/
			if($('#rp-content').is(':hidden')){ //visible
				$('#rp-show').hide(speed);
				$('#rp-content').show(speed);
				$('#rip-content1').hide(speed);
				$('#rip-content3').hide(speed);	
			}else{
				$('#rp-content').hide(speed);
				$('#rp-show').show(speed);
				$('#rip-content3').hide(speed);
			};
			
	});
		$('#hug-show').on('click', function() {
			if($('#hug-content').is(':hidden')){ //visible
				$('#hug-log').hide(speed);
				$('#hug-content').show(speed);
			}else{
				$('#hug-log').show(speed);
				$('#hug-content').hide(speed);
		};
	});
		$('#hug-log').on('click', function() {
			if($('#hug-content').is(':hidden')){ //visible
				$('#hug-log').hide(speed);
				$('#hug-content').show(speed);
			}else{
				$('#hug-log').show(speed);
				$('#hug-content').hide(speed);
		};
	});
		$('#text-show').on('click', function() {
			if($('#text-content').is(':hidden') && $('#text-content1').is(':hidden')){
				$('#text-content').show();
				$('#text-content1').show();
			}else{
				$('#text-content').hide();
				$('#text-content1').hide();
			};
	});
		$('#logo-show').on('click', function() {
			if($('#rip-content3').is(':visible')){
				$('#rip-content3').hide(speed);
			}else{
				$('#rip-content3').show();
			};
	});
		$('#list-show').on('click', function() {
		$('#list-show').hide(speed);
		$('#list-content').show(speed);
		$('#rip-content3').hide(speed);
	});
		$('#title-show').on('click', function() {
		$('#list-content').hide(speed);
		$('#list-show').show(speed);
		$('#rip-content3').show(speed);
	});
		$('#rp-show').on('click', function() {
		$('#rp-show').hide(speed);
		$('#rp-content').show(speed);
		$('#rip-content').show();
		$('#rip-content0').show();
		$('#rip-content1').hide();
	});
		$('#rp-show1').on('click', function()
			{
			flag++;
			if(flag%2){
			$('#rip-content0').hide();
			$('#rip-content1').show();
			$('#rip-content').hide();
			}else{
			$('#rip-content0').show();
			$('#rip-content1').hide();
			$('#rip-content').show();
			};
		});
		$("#rip-show").click(function()
			{
			flag++;
			if(flag%2){
			$('#rip-content').hide();
			$('#rip-content0').show();
			$('#rip-content1').show();
			}else{
			$('#rip-content0').hide();
			$('#rip-content1').hide();
			$('#rip-content').show();
			};
			
		});
		$("#rip-content1").click(function() {
			$('#rip-content').show();
			$('#rip-content1').hide();
		});
		$("#rip-content2").click(function() {
			$('#rip-content').hide();
			$('#rip-content1').show();
		});
		
		$('#timeline-show').on('click', function() {
		$('#timeline-show').hide();
		$('#timeline-show1').show();
		$(document).ready(function() {
				createStoryJS({
					type: 'timeline',
					width: '100%',
					height: '85%',
					source: './data/InterImmTimelineJSONP.jsonp',
					hash_bookmark: true,
					lang: 'zh-cn',
					start_zoom_adjust: '1',
					embed_id: 'timeline-embed'
				});
			});
		$('#timeline-embed').show();
	});
		$('#timeline-show1').on('click', function() {
		$('#timeline-show1').hide();
		$('#timeline-embed').hide();
		$('#timeline-show2').show();
	});
		$('#timeline-show2').on('click', function() {
		$('#timeline-show2').hide();
		$('#timeline-embed').show();
		$('#timeline-show1').show();
	});
	// function nodisplay() {
	// document.getElementById('timeline-embed').style.visibility = "visible";
	// document.getElementById('timeline-embed').style.display = "none";
	// };
	// setTimeout(nodisplay,1000);


var text = $("#f-left");
//text.focus();
function action() 
{
	if(text.val()==null||text.val()=="")
	{
		text.focus();
		return;
	}

	//显示发送文本
	$(".b-body").append("<div class='mWord'><span></span><p>" + text.val() + "</p></div>");
	$(".b-body").scrollTop(10000000);//滚动条
	
	//定义一个变量
	var args= {
			type : "get",
			url:"https://api.ownthink.com/bot",
			data : {"appid" : "0726c981870b7ee1656bb8cdf32be1a7", "spoken" : text.val()},
			success : function(redata)//回调函数
			{
				var my_data = $.parseJSON(redata)

				var array= [my_data.data.info.text];

				if(my_data.data.info.hasOwnProperty("heuristic"))
				{
					for (var i=0; i < my_data.data.info.heuristic.length; i++)
					{
						array.push(my_data.data.info.heuristic[i]);
					}
				} 

				for (var i=0; i < array.length; i++)
				{
					// 启发式   console.log(array[i]);
					var result = array[i];
					$(".b-body").append("<div class='rotWord'><span></span> <p id='member'>" + result + "</p></div>");
					$(".b-body").scrollTop(10000000);
				}

				//解析json数据，然后再请求语音的。。。
				var result = array[0]
				result = result.replace(/\s+/g, ","); //如果有空格，用，代替
				var url = 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=qianranfa&speed=0.8&volume=100&audioType=wav&text='+result;
				var obj = $("<audio src="+url+" autoplay></audio>");
				$("body").remove("audio");
				$("body").append(obj);
			}
		}
	
	ajax(args);
	//初始化
	text.val("");
	text.focus();
	
};

$("#btn").click(function()//鼠标点击
{
	action();
});
$("#f-left").keydown(function(event)//回车
{
	if(event.keyCode==13)
	{
		action();
	}
});

//alert("我是一个消息框！")
//封装ajax，处理的是jsonp数据
function ajax(mJson)
{
	var type=mJson.type||'get';
	var url=mJson.url;
	var data=mJson.data;
	var success=mJson.success;
	var error=mJson.error;
	var dataStr='';
	
	//console.log(data);

	//请求数据封装
	if(data)
	{
		var arr = Object.keys(data);//获取key，数组以便获取长度
		var len = arr.length;
		var i = 0;
		
		for (var key in data)
		{
			dataStr+=key+'='+data[key];
	
			if (++i<len)
			{
				dataStr+='&';
			}
		}
		
		if(type.toLowerCase()=='get')
		{
			url+='?'+dataStr;
		}
		
		// dataStr+=new Date().getTime();//设计时需要发送时间。。。
		// if(type.toLowerCase()=='get')
		// {
			// url+='?'+dataStr;
		// }
	}
	
	//console.log(url);
	
	var xhr=new XMLHttpRequest();
	xhr.open(type,url,true);
	xhr.setRequestHeader('content-type' , 'application/x-www-form-urlencoded');
	xhr.send(null);

	xhr.onreadystatechange=function()
	{
		if(xhr.readyState==4)
		{
			if(xhr.status>=200&&xhr.status<300)
			{
				success&&success(xhr.responseText);
			}
			else
			{
				error&&error(xhr.status);
			}
		}
	}
}		
