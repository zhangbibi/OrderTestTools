var request = (function($) {
	var request={};
	function callApi(data, callback, type,options){
		if(!options.hiddenLoading){
			var html = ['<div id="loading_mask" style="position: fixed;z-index: 1;width: 100%;height: 100%;top: 0;left: 0;background: rgba(255, 255, 255, 0);"><div>',
							'<div id="loading_dialog" class="loading_box" style="height: 115px;padding-top: 25px;position: fixed;z-index: 13;width: 150px;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background-color: rgba(84, 83, 83, 0.72);text-align: center;border-radius: 5px;overflow: hidden;">',
			            		'<img src="../image/loading.gif" /><span style="display: block;font-size: 18px;color: #FFFFFF;padding-top: 20px;">加载中...</span></div>'
			].join('');
			removeLoading();
			$(document.body).append(html);	
		}
		if(options.async == undefined) options.async = true;
		if(!options.dataType) options.dataType = 'json';
		data=data||{};
		var requestData={
			url:options.url,
			type:type,
			async:options.async,
            contentType: "application/json;charset=utf-8",
			dataType:options.dataType,
			data:JSON.stringify(data),
			timeout:300000,
			success:function(data){
				callback(data);
				removeLoading();
			},
			complete:function(XMLHttpRequest, textStatus){
				removeLoading();
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				removeLoading();
				if(textStatus == 'timeout') {
					 alert('网络繁忙，请稍后重试');
					 return false;
				}		   
			}
		};
		$.ajax(requestData);
	}
	function removeLoading(){
		$("#loading_mask").remove();
		$("#loading_dialog").remove();
	}
	request.post = function(data, callback,options){
		callApi(data, callback, "post",options);
	}
	request.get = function(data, callback,options){
		callApi(data, callback, "get",options);
	}
	return request;
})(jQuery);