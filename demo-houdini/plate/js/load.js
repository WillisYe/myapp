var BASE_FONT_SIZE = 20; // 基准字体大小

;(function(doc, win) {
    var docEl = doc.documentElement
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    var recalc = function() {
        var clientWidth = docEl.clientWidth
        var clientHeight = docEl.clientHeight
        clientWidth = clientWidth < clientHeight ? clientWidth : clientHeight
        clientWidth = clientWidth > 750 ? 750 : clientWidth
        if (!clientWidth) return
        docEl.style.fontSize = clientWidth * BASE_FONT_SIZE / 375 + 'px'
    }
    recalc()
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window);