
var text = $("#f-left");
text.focus();
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
$(document).keydown(function(event)//回车
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
