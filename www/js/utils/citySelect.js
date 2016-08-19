// var options = {
//     element: '#test',
//     callback: function(data) {
//         $('#test2').html(data.join(','))
//     },
//     initComplete: function(data) {
//         $('#test2').html(data.join(','))
//     }
// }
// city.init(options);
define(['zepto'], function () {
    var Plugin = {
        init: function (options) {
            this.setting = {
                element: "",
                value: ["广东省", "深圳市", "南山区"],
                callback: "",
                initComplete: "",
                url: ''
            };
            this.setting = $.extend(this.setting, options);
            this.$element = $(this.setting.element);
            var _self = this;
            $.getJSON(this.setting.url, function (re) {
                _self.city_json = re;
                _self.initTpl();
            });
        },
        initTpl: function (url) {
            var $element = this.$element, settings = this.setting, city_json = this.city_json, now_time = +new Date;
            this.province_id = 'province_' + now_time;
            this.city_id = 'city_' + now_time;
            this.area_id = 'area_' + now_time;
            var province_tpl = '';
            for (var i = 0, len = city_json.length; i < len; i++) {
                province_tpl += '<dd data-value="' + city_json[i].n + '" data-index="' + i + '">' + city_json[i].n + '</dd>';
            }
            var tpl = '<style>.ui-scroller{position: relative;height: 155px;width: 100%; min-width: 260px;font-size: 14px;font-weight: normal;padding:5px;display: -webkit-box;-webkit-box-sizing: border-box;}.ui-scroller>div{position:relative;height: 155px;overflow: hidden;-webkit-box-sizing: border-box;box-sizing:border-box;float: none;-webkit-box-flex: 1;width: 0;}.ui-scroller dl{position: absolute;width: 100%;margin: 0;top:30px;}.ui-scroller dd{padding:0;margin:0;overflow: hidden; text-overflow:ellipsis;width:100%;height: 30px;line-height: 30px;text-align:center;    display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;-webkit-box-flex: 1}.ui-scroller{-webkit-mask: -webkit-gradient(linear,0% 20%,0% 100%,from(rgba(222,187,71,1)),to(rgba(36,142,36,0)));}.ui-scroller-mask{-webkit-mask: -webkit-gradient(linear,0% 50%,0% 0%,from(rgba(222,187,71,1)),to(rgba(36,142,36,0)));}.ui-scroller p{position: absolute;top:64px;height:30px;width: 100%;margin: 0;z-index: -1;left:0;}.ui-scroller .ui-dialog-action{margin-top: 10px;}.ui-border-tb {border-top: #e0e0e0 1px solid;border-bottom: #e0e0e0 1px solid;background-image: none;}transition: all 0.1s ease-out; transform: translate3d(0px, -240px, 0px);@media screen and (-webkit-min-device-pixel-ratio: 2) {.ui-border-tb {border: 0;}}@media screen and (-webkit-min-device-pixel-ratio: 2) {.ui-border-tb {background-repeat: repeat-x;-webkit-background-size: 100% 1px;}}@media screen and (-webkit-min-device-pixel-ratio: 2) {.ui-border-tb {background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0.5,transparent),color-stop(0.5,#e0e0e0),to(#e0e0e0)),-webkit-gradient(linear,left top,left bottom,color-stop(0.5,transparent),color-stop(0.5,#e0e0e0),to(#e0e0e0));background-position:top,bottom;}}</style>' +
                '<div style="display: block;width:100%;padding: 20px 0;">' +
                '<div class="ui-scroller-mask">' +
                '<div  class="ui-scroller">' +
                '<div class="js-scroll" data-flag="province">' +
                '<dl style="top:-30px;"  id="' + this.province_id + '">' +
                province_tpl +
                '</dl>' +
                '</div>' +
                '<div class="js-scroll" data-flag="city">' +
                '<dl  id="' + this.city_id + '">' +
                '</dl>' +
                '</div>' +
                '<div class="js-scroll" data-flag="area">' +
                '<dl  id="' + this.area_id + '">' +
                '</dl>' +
                '</div>' +
                '<p class="ui-border-tb"></p>' +
                '</div>' +
                '</div>' +
                '</div>';
            $element.html(tpl);
            this.bindEvent();
            this.set(settings.value);
            if (typeof settings.initComplete == 'function') {
                settings.initComplete(this.get());
            }
        },
        bindEvent: function () {
            var _self = this, settings = _self.setting, city_json = this.city_json, $element = _self.$element, start, end, o_top;
            $element.on('touchstart MSPointerDown pointerdown', '.js-scroll', function (e) {
                o_top = parseInt($(e.currentTarget).find('dl').css('top') || 0);
                start = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
            });
            $element.on('touchmove MSPointerDown pointerdown', '.js-scroll', function (e) {
                end = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                var diff = end - start, top = parseInt($(e.currentTarget).find('dl').css('top') || 0) + diff;
                $(e.currentTarget).find('dl').css('top', top);
                start = end;
                return false;
            });
            $element.on('touchend MSPointerDown pointerdown', '.js-scroll', function (e) {
                end = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                var diff = end - start, target = $(e.currentTarget), flag = target.data('flag'), dl = target.find('dl'), top = parseInt(dl.css('top') || 0) + diff;
                if (top >= 60) {
                    top = 60;
                }
                if (top <= -$(dl).height() + 75) {
                    top = -$(dl).height() + 90;
                }
                var mod = top / 30, mode = Math.round(mod), index = Math.abs(mode) + 2;
                if (mode == 2) {
                    index = 0;
                }
                else if (mode == 1) {
                    index = 1;
                }
                dl.css('top', mode * 30);
                if (o_top != mode * 30) {
                    if (flag == "province") {
                        _self.p_index = index;
                        var city_node = $('#' + _self.city_id), area_node = $('#' + _self.area_id);
                        _self._init_city(index);
                    }
                    else if (flag == "city") {
                        _self._init_area(_self.p_index, index);
                    }
                    if (typeof settings.callback == 'function') {
                        settings.callback(_self.get());
                    }
                }
                return false;
            });
        },
        get: function () {
            var province_node = $('#' + this.province_id), city_node = $('#' + this.city_id), area_node = $('#' + this.area_id), p_index = Math.abs((Number(province_node.css('top').replace('px', '')) - 60) / 30), province = province_node.find('dd[data-index="' + p_index + '"]').data('value');
            if (city_node.parent().css('display') != 'none') {
                var c_index = Math.abs((Number(city_node.css('top').replace('px', '')) - 60) / 30), city = city_node.find('dd[data-index="' + c_index + '"]').data('value');
                if (area_node.parent().css('display') != 'none') {
                    var a_index = Math.abs((Number(area_node.css('top').replace('px', '')) - 60) / 30), area = area_node.find('dd[data-index="' + a_index + '"]').data('value');
                }
            }
            var result = [];
            result[0] = province;
            city ? result[1] = city : '';
            area ? result[2] = area : '';
            return result;
        },
        set: function (data) {
            var province_node = $('#' + this.province_id), city_node = $('#' + this.city_id), area_node = $('#' + this.area_id), p_index = Number(province_node.find('dd[data-value="' + data[0] + '"]').data('index'));
            province_node.css({
                top: -(p_index + 1) * 30 + 90
            });
            this._init_city(p_index);
            this.p_index = p_index;
            if (data[1]) {
                var c_index = Number(city_node.find('dd[data-value="' + data[1] + '"]').data('index'));
                city_node.css({
                    top: -(c_index + 1) * 30 + 90
                });
                this._init_area(p_index, c_index);
                if (data[2]) {
                    var a_index = Number(area_node.find('dd[data-value="' + data[2] + '"]').data('index'));
                    area_node.css({
                        top: -(a_index + 1) * 30 + 90
                    });
                }
            }
        },
        _init_city: function (p_index) {
            var city_node = $('#' + this.city_id), area_node = $('#' + this.area_id), city_json = this.city_json;
            if (city_json[p_index].c) {
                var cities = city_json[p_index].c, city_tpl = '';
                for (var i = 0, len = cities.length; i < len; i++) {
                    city_tpl += '<dd data-value="' + cities[i].n + '" data-index="' + i + '">' + cities[i].n + '</dd>';
                }
                city_node.css('top', 0);
                city_node.html(city_tpl);
                city_node.parent().show();
                this._init_area(p_index, 2);
            }
            else {
                city_node.parent().hide();
                area_node.parent().hide();
            }
        },
        _init_area: function (p_index, c_index) {
            var area_node = $('#' + this.area_id), city_json = this.city_json;
            if (city_json[p_index].c && city_json[p_index].c[c_index].c) {
                var areas = city_json[p_index].c[c_index].c, area_tpl = '';
                for (var i = 0, len = areas.length; i < len; i++) {
                    area_tpl += '<dd data-value="' + areas[i].n + '" data-index="' + i + '">' + areas[i].n + '</dd>';
                }
                if (len >= 4) {
                    area_node.css('top', 0);
                }
                else if (len == 1) {
                    area_node.css('top', 60);
                }
                else {
                    area_node.css('top', 30);
                }
                area_node.html(area_tpl);
                area_node.parent().show();
            }
            else {
                area_node.parent().hide();
            }
        }
    };
    return Plugin;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eVNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL2NpdHlTZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0JBQWtCO0FBQ2xCLHdCQUF3QjtBQUN4QixpQ0FBaUM7QUFDakMsMkNBQTJDO0FBQzNDLFNBQVM7QUFDVCxxQ0FBcUM7QUFDckMsMkNBQTJDO0FBQzNDLFFBQVE7QUFDUixJQUFJO0FBQ0osc0JBQXNCO0FBQ3RCLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBRWQsSUFBSSxNQUFNLEdBQUc7UUFFVCxJQUFJLEVBQUUsVUFBUyxPQUFPO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ1gsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7Z0JBQzVCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFlBQVksRUFBRSxFQUFFO2dCQUNoQixHQUFHLEVBQUMsRUFBRTthQUNULENBQUE7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUVqQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVMsRUFBRTtnQkFDbkMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Z0JBQ3JCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztRQUVQLENBQUM7UUFFRCxPQUFPLEVBQUUsVUFBUyxHQUFHO1lBQ2pCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFR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