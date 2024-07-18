/**
 * 分享信息设置
 */

// 除分享到朋友圏的配置
var share_config = {
	title	: '战“疫”日记·广东篇',										// 分享标题
	desc	: '走进奋战在战“疫”一线人员的工作日常，倾听他们内心的声音。',							// 分享描述
	link	: signpackage.url,											// 分享链接，不要动
	imgUrl	: 'https://zt.ycwb.com.cn/2020/zyrjgdp/images/p1.png',	// 分享图标
	type	: 'link',													// 分享类型：music、video或link，不填默认为link
	dataUrl	: '',														// 如果type是music或video，则要提供数据链接，默认为空
	success	: function(){	// 用户确认分享后执行的回调函数
		// ...
	},
	cancel	: function(){	// 用户取消分享后执行的回调函数
		// ...
	},
	fail	: function(res){
		// alert(JSON.stringify(res));
	}
};

// 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
var share_config_onMenuShareTimeline = {
	title	: '战“疫”日记·广东篇',										// 分享标题
	desc	: '走进奋战在战“疫”一线人员的工作日常，倾听他们内心的声音。',							// 分享描述
	link	: signpackage.url,											// 分享链接，不要动
	imgUrl	: 'https://zt.ycwb.com.cn/2020/zyrjgdp/images/p1.png',	// 分享图标
	type	: 'link',													// 分享类型：music、video或link，不填默认为link
	dataUrl	: '',														// 如果type是music或video，则要提供数据链接，默认为空
	success	: function(){	// 用户确认分享后执行的回调函数
	},
	cancel	: function(){	// 用户取消分享后执行的回调函数
		// alert('>>_<<失落ing');
	},
	fail	: function(res){
		// alert(JSON.stringify(res));
	}
};





/*******************************************************************************
 * 以下为JSSDK接口代码
 * 一般情况无需修改
 *******************************************************************************/

wx.config({
	// debug	: true,						// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	appId		: signpackage.appId,		// 必填，公众号的唯一标识
	timestamp	: signpackage.timestamp,	// 必填，生成签名的时间戳
	nonceStr	: signpackage.nonceStr,		// 必填，生成签名的随机串
	signature	: signpackage.signature,	// 必填，签名，见附录1
	jsApiList	: [							// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'startRecord', 'stopRecord',
		'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice',
		'chooseImage','previewImage','uploadImage','downloadImage','translateVoice','getNetworkType','openLocation',
		'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem',
		'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard',
		'chooseCard', 'openCard'
	]
});

wx.ready(function(){
	// 验证OK，在这里调用 API

	// alert(JSON.stringify(share_config));

	// 判断当前客户端版本是否支持指定JS接口
	wx.checkJsApi({
		jsApiList: ['chooseImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
		success: function(res) {
			// 以键值对的形式返回，可用的api值true，不可用为false
			// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}

			// 拍照或从手机相册中选图接口
			/*wx.chooseImage({
				success: function (res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				}
			});*/

			// 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
			wx.onMenuShareTimeline(share_config_onMenuShareTimeline);

			// 获取“分享给朋友”按钮点击状态及自定义分享内容接口
			wx.onMenuShareAppMessage(share_config);

			// 获取“分享到QQ”按钮点击状态及自定义分享内容接口
			wx.onMenuShareQQ(share_config);

			// 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
			wx.onMenuShareWeibo(share_config);

		}
	});
	// END ready
});

wx.error(function(res){
	// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	// alert('出错了：'+JSON.stringify(res));
	// END error
});