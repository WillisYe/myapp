var preload = null;

// 将需要加载的images目录下的图片加入数组
//document ready
$(function(){
    if (preload != null) { preload.close(); }// If there is an open preload queue, close it.
    var manifest = [
       
        "etwo/1.png",
        "etwo/2.png",
        "etwo/3.png",
        "etwo/4.png",
        "etwo/5.png",
        "etwo/6.png",
    ];
    // 创建一个下载实例
    preload = new createjs.LoadQueue(false, "./images/");

    // Use this instead to use tag loading
    preload.on("complete", handleComplete);//下载完成处理函数
    preload.on("fileload", handleFileLoad);//单个文件下载完成处理函数
    preload.on("progress", handleProgress);//下载过程处理函数
    preload.on("error", handleFileError);//下载出错处理函数
    preload.setMaxConnections(5);//最大下载线程
    preload.loadManifest(manifest);//开始下载

})

function handleComplete(event) {
    //去掉所有监听器
    preload.off("complete", handleComplete);
    preload.off("fileload", handleFileLoad);
    preload.off("progress", handleProgress);
    preload.off("error", handleFileError);

    //延迟0.5秒后loading消失，开始初始化
    $('#loadingContainer').delay(500).queue(function(next){
        $(this).addClass('animated fadeOut hide')
        $('.mask').addClass('animated fadeOut hide')
        $('.hand').removeClass('hide').addClass('zoomIn');
        $("body").show();
        // game.doIndexAni()
        setTimeout(()=>{
            $(this).hide();
        },500)
    });

}

// File complete handler
function handleFileLoad(event) {}

// Overall progress handler
function handleProgress(event) {
    var pencent = parseInt(preload.progress * 100);
    $('.loadingText').html(`${pencent}%`)
}

// An error happened on a file
function handleFileError(event) {
    //alert("preload error");
}
