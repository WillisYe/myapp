document.addEventListener('alpine:init', () => {
    Alpine.data('dayjsDemo', () => ({
        currentLang: 'zh-cn',
        currentTime: '',
        fullDateTime: '',
        formattedDate: '',
        dayOfWeek: '',
        month: '',
        testResults: [],
        originalLang: '',
        languages: [
            // 中文相关语言（排在最前面）
            { value: 'zh-cn', label: 'Chinese (China)', chineseName: '中文', intlCode: 'zh-CN', isUnsupported: false },
            { value: 'zh', label: 'Chinese', chineseName: '中文', intlCode: 'zh-CN', isUnsupported: false },
            { value: 'zh-tw', label: 'Chinese (Taiwan)', chineseName: '中文繁体', intlCode: 'zh-TW', isUnsupported: false },
            { value: 'zh-hk', label: 'Chinese (Hong Kong)', chineseName: '中文香港', intlCode: 'zh-HK', isUnsupported: false },

            // 其他流行语言（按流行度排序）
            { value: 'en', label: 'English', chineseName: '英语', intlCode: 'en-US', isUnsupported: false },
            { value: 'es', label: 'Spanish', chineseName: '西班牙语', intlCode: 'es-ES', isUnsupported: false },
            { value: 'fr', label: 'French', chineseName: '法语', intlCode: 'fr-FR', isUnsupported: false },
            { value: 'de', label: 'German', chineseName: '德语', intlCode: 'de-DE', isUnsupported: false },
            { value: 'ja', label: 'Japanese', chineseName: '日语', intlCode: 'ja-JP', isUnsupported: false },
            { value: 'ko', label: 'Korean', chineseName: '韩语', intlCode: 'ko-KR', isUnsupported: false },
            { value: 'ru', label: 'Russian', chineseName: '俄语', intlCode: 'ru-RU', isUnsupported: false },
            { value: 'pt', label: 'Portuguese', chineseName: '葡萄牙语', intlCode: 'pt-PT', isUnsupported: false },
            { value: 'it', label: 'Italian', chineseName: '意大利语', intlCode: 'it-IT', isUnsupported: false },
            { value: 'ar', label: 'Arabic', chineseName: '阿拉伯语', intlCode: 'ar-EG', isUnsupported: false },
            { value: 'hi', label: 'Hindi', chineseName: '印地语', intlCode: 'hi-IN', isUnsupported: false },
            { value: 'id', label: 'Indonesian', chineseName: '印尼语', intlCode: 'id-ID', isUnsupported: false },
            { value: 'vi', label: 'Vietnamese', chineseName: '越南语', intlCode: 'vi-VN', isUnsupported: false },
            { value: 'th', label: 'Thai', chineseName: '泰语', intlCode: 'th-TH', isUnsupported: false },
            { value: 'tr', label: 'Turkish', chineseName: '土耳其语', intlCode: 'tr-TR', isUnsupported: false },
            { value: 'nl', label: 'Dutch', chineseName: '荷兰语', intlCode: 'nl-NL', isUnsupported: false },
            { value: 'sv', label: 'Swedish', chineseName: '瑞典语', intlCode: 'sv-SE', isUnsupported: false },
            { value: 'pl', label: 'Polish', chineseName: '波兰语', intlCode: 'pl-PL', isUnsupported: false },
            { value: 'he', label: 'Hebrew', chineseName: '希伯来语', intlCode: 'he-IL', isUnsupported: false },
            { value: 'fa', label: 'Persian', chineseName: '波斯语', intlCode: 'fa-IR', isUnsupported: false },

            // 其他语言（按字母顺序）
            { value: 'af', label: 'Afrikaans', chineseName: '南非语', intlCode: 'af-ZA', isUnsupported: false },
            { value: 'am', label: 'Amharic', chineseName: '阿姆哈拉语', intlCode: 'am-ET', isUnsupported: false },
            { value: 'ar-dz', label: 'Arabic (Algeria)', chineseName: '阿拉伯语', intlCode: 'ar-DZ', isUnsupported: false },
            { value: 'ar-iq', label: 'Arabic (Iraq)', chineseName: '阿拉伯语', intlCode: 'ar-IQ', isUnsupported: false },
            { value: 'ar-kw', label: 'Arabic (Kuwait)', chineseName: '阿拉伯语', intlCode: 'ar-KW', isUnsupported: false },
            { value: 'ar-ly', label: 'Arabic (Lybia)', chineseName: '阿拉伯语', intlCode: 'ar-LY', isUnsupported: false },
            { value: 'ar-ma', label: 'Arabic (Morocco)', chineseName: '阿拉伯语', intlCode: 'ar-MA', isUnsupported: false },
            { value: 'ar-sa', label: 'Arabic (Saudi Arabia)', chineseName: '阿拉伯语', intlCode: 'ar-SA', isUnsupported: false },
            { value: 'ar-tn', label: 'Arabic (Tunisia)', chineseName: '阿拉伯语', intlCode: 'ar-TN', isUnsupported: false },
            { value: 'az', label: 'Azerbaijani', chineseName: '阿塞拜疆语', intlCode: 'az-AZ', isUnsupported: false },
            { value: 'be', label: 'Belarusian', chineseName: '白俄罗斯语', intlCode: 'be', isUnsupported: false },
            { value: 'bg', label: 'Bulgarian', chineseName: '保加利亚语', intlCode: 'bg', isUnsupported: false },
            { value: 'bi', label: 'Bislama', chineseName: '比斯拉马语', intlCode: 'bi', isUnsupported: true },
            { value: 'bm', label: 'Bambara', chineseName: '班巴拉语', intlCode: 'bm', isUnsupported: true },
            { value: 'bn', label: 'Bengali', chineseName: '孟加拉语', intlCode: 'bn', isUnsupported: false },
            { value: 'bn-bd', label: 'Bengali (Bangladesh)', chineseName: '孟加拉语', intlCode: 'bn-BD', isUnsupported: false },
            { value: 'bo', label: 'Tibetan', chineseName: '藏语', intlCode: 'bo', isUnsupported: true },
            { value: 'br', label: 'Breton', chineseName: '布列塔尼语', intlCode: 'br', isUnsupported: false },
            { value: 'bs', label: 'Bosnian', chineseName: '波斯尼亚语', intlCode: 'bs', isUnsupported: false },
            { value: 'ca', label: 'Catalan', chineseName: '加泰罗尼亚语', intlCode: 'ca', isUnsupported: false },
            { value: 'cs', label: 'Czech', chineseName: '捷克语', intlCode: 'cs', isUnsupported: false },
            { value: 'cv', label: 'Chuvash', chineseName: '楚瓦什语', intlCode: 'cv', isUnsupported: true },
            { value: 'cy', label: 'Welsh', chineseName: '威尔士语', intlCode: 'cy', isUnsupported: false },
            { value: 'da', label: 'Danish', chineseName: '丹麦语', intlCode: 'da', isUnsupported: false },
            { value: 'de-at', label: 'German (Austria)', chineseName: '德语', intlCode: 'de-AT', isUnsupported: false },
            { value: 'de-ch', label: 'German (Switzerland)', chineseName: '德语', intlCode: 'de-CH', isUnsupported: false },
            { value: 'dv', label: 'Maldivian', chineseName: '马尔代夫语', intlCode: 'dv', isUnsupported: true },
            { value: 'el', label: 'Greek', chineseName: '希腊语', intlCode: 'el', isUnsupported: false },
            { value: 'en-au', label: 'English (Australia)', chineseName: '英语', intlCode: 'en-AU', isUnsupported: false },
            { value: 'en-ca', label: 'English (Canada)', chineseName: '英语', intlCode: 'en-CA', isUnsupported: false },
            { value: 'en-gb', label: 'English (United Kingdom)', chineseName: '英语', intlCode: 'en-GB', isUnsupported: false },
            { value: 'en-ie', label: 'English (Ireland)', chineseName: '英语', intlCode: 'en-IE', isUnsupported: false },
            { value: 'en-il', label: 'English (Israel)', chineseName: '英语', intlCode: 'en-IL', isUnsupported: false },
            { value: 'en-in', label: 'English (India)', chineseName: '英语', intlCode: 'en-IN', isUnsupported: false },
            { value: 'en-nz', label: 'English (New Zealand)', chineseName: '英语', intlCode: 'en-NZ', isUnsupported: false },
            { value: 'en-sg', label: 'English (Singapore)', chineseName: '英语', intlCode: 'en-SG', isUnsupported: false },
            { value: 'en-tt', label: 'English (Trinidad & Tobago)', chineseName: '英语', intlCode: 'en-TT', isUnsupported: false },
            { value: 'eo', label: 'Esperanto', chineseName: '世界语', intlCode: 'eo', isUnsupported: true },
            { value: 'es-do', label: 'Spanish (Dominican Republic)', chineseName: '西班牙语', intlCode: 'es-DO', isUnsupported: false },
            { value: 'es-mx', label: 'Spanish (Mexico)', chineseName: '西班牙语', intlCode: 'es-MX', isUnsupported: false },
            { value: 'es-pr', label: 'Spanish (Puerto Rico)', chineseName: '西班牙语', intlCode: 'es-PR', isUnsupported: false },
            { value: 'es-us', label: 'Spanish (United States)', chineseName: '西班牙语', intlCode: 'es-US', isUnsupported: false },
            { value: 'et', label: 'Estonian', chineseName: '爱沙尼亚语', intlCode: 'et', isUnsupported: false },
            { value: 'eu', label: 'Basque', chineseName: '巴斯克语', intlCode: 'eu', isUnsupported: false },
            { value: 'fi', label: 'Finnish', chineseName: '芬兰语', intlCode: 'fi', isUnsupported: false },
            { value: 'fo', label: 'Faroese', chineseName: '法罗语', intlCode: 'fo', isUnsupported: false },
            { value: 'fr-ca', label: 'French (Canada)', chineseName: '法语', intlCode: 'fr-CA', isUnsupported: false },
            { value: 'fr-ch', label: 'French (Switzerland)', chineseName: '法语', intlCode: 'fr-CH', isUnsupported: false },
            { value: 'fy', label: 'Frisian', chineseName: '弗里斯兰语', intlCode: 'fy', isUnsupported: false },
            { value: 'ga', label: 'Irish or Irish Gaelic', chineseName: '爱尔兰语', intlCode: 'ga', isUnsupported: false },
            { value: 'gd', label: 'Scottish Gaelic', chineseName: '苏格兰盖尔语', intlCode: 'gd', isUnsupported: false },
            { value: 'gl', label: 'Galician', chineseName: '加利西亚语', intlCode: 'gl', isUnsupported: false },
            { value: 'gom-latn', label: 'Konkani Latin script', chineseName: '孔卡尼语', intlCode: 'gom', isUnsupported: true },
            { value: 'gu', label: 'Gujarati', chineseName: '古吉拉特语', intlCode: 'gu', isUnsupported: false },
            { value: 'hr', label: 'Croatian', chineseName: '克罗地亚语', intlCode: 'hr', isUnsupported: false },
            { value: 'ht', label: 'Haitian Creole (Haiti)', chineseName: '海地克里奥尔语', intlCode: 'ht', isUnsupported: false },
            { value: 'hu', label: 'Hungarian', chineseName: '匈牙利语', intlCode: 'hu', isUnsupported: false },
            { value: 'hy-am', label: 'Armenian', chineseName: '亚美尼亚语', intlCode: 'hy', isUnsupported: false },
            { value: 'is', label: 'Icelandic', chineseName: '冰岛语', intlCode: 'is', isUnsupported: false },
            { value: 'it-ch', label: 'Italian (Switzerland)', chineseName: '意大利语', intlCode: 'it-CH', isUnsupported: false },
            { value: 'jv', label: 'Javanese', chineseName: '爪哇语', intlCode: 'jv', isUnsupported: false },
            { value: 'ka', label: 'Georgian', chineseName: '格鲁吉亚语', intlCode: 'ka', isUnsupported: false },
            { value: 'kk', label: 'Kazakh', chineseName: '哈萨克语', intlCode: 'kk', isUnsupported: false },
            { value: 'km', label: 'Cambodian', chineseName: '高棉语', intlCode: 'km', isUnsupported: false },
            { value: 'kn', label: 'Kannada', chineseName: '卡纳达语', intlCode: 'kn', isUnsupported: false },
            { value: 'ku', label: 'Kurdish', chineseName: '库尔德语', intlCode: 'ku', isUnsupported: true },
            { value: 'ky', label: 'Kyrgyz', chineseName: '吉尔吉斯语', intlCode: 'ky', isUnsupported: true },
            { value: 'lb', label: 'Luxembourgish', chineseName: '卢森堡语', intlCode: 'lb', isUnsupported: false },
            { value: 'lo', label: 'Lao', chineseName: '老挝语', intlCode: 'lo', isUnsupported: true },
            { value: 'lt', label: 'Lithuanian', chineseName: '立陶宛语', intlCode: 'lt', isUnsupported: false },
            { value: 'lv', label: 'Latvian', chineseName: '拉脱维亚语', intlCode: 'lv', isUnsupported: false },
            { value: 'me', label: 'Montenegrin', chineseName: '黑山语', intlCode: 'me', isUnsupported: true },
            { value: 'mi', label: 'Maori', chineseName: '毛利语', intlCode: 'mi', isUnsupported: true },
            { value: 'mk', label: 'Macedonian', chineseName: '马其顿语', intlCode: 'mk', isUnsupported: false },
            { value: 'ml', label: 'Malayalam', chineseName: '马拉雅拉姆语', intlCode: 'ml', isUnsupported: false },
            { value: 'mn', label: 'Mongolian', chineseName: '蒙古语', intlCode: 'mn', isUnsupported: true },
            { value: 'mr', label: 'Marathi', chineseName: '马拉地语', intlCode: 'mr', isUnsupported: false },
            { value: 'ms', label: 'Malay', chineseName: '马来语', intlCode: 'ms', isUnsupported: false },
            { value: 'ms-my', label: 'Malay', chineseName: '马来语', intlCode: 'ms-MY', isUnsupported: false },
            { value: 'mt', label: 'Maltese (Malta)', chineseName: '马耳他语', intlCode: 'mt', isUnsupported: false },
            { value: 'my', label: 'Burmese', chineseName: '缅甸语', intlCode: 'my', isUnsupported: true },
            { value: 'nb', label: 'Norwegian Bokmål', chineseName: '挪威语', intlCode: 'nb', isUnsupported: false },
            { value: 'ne', label: 'Nepalese', chineseName: '尼泊尔语', intlCode: 'ne', isUnsupported: false },
            { value: 'nl-be', label: 'Dutch (Belgium)', chineseName: '荷兰语', intlCode: 'nl-BE', isUnsupported: false },
            { value: 'nn', label: 'Nynorsk', chineseName: '新挪威语', intlCode: 'nn', isUnsupported: false },
            { value: 'oc-lnc', label: 'Occitan, lengadocian dialecte', chineseName: '奥克语', intlCode: 'oc', isUnsupported: true },
            { value: 'pa-in', label: 'Punjabi (India)', chineseName: '旁遮普语', intlCode: 'pa', isUnsupported: false },
            { value: 'pt-br', label: 'Portuguese (Brazil)', chineseName: '葡萄牙语', intlCode: 'pt-BR', isUnsupported: false },
            { value: 'rn', label: 'Kirundi', chineseName: '基隆迪语', intlCode: 'rn', isUnsupported: true },
            { value: 'ro', label: 'Romanian', chineseName: '罗马尼亚语', intlCode: 'ro', isUnsupported: false },
            { value: 'rw', label: 'Kinyarwanda (Rwanda)', chineseName: '基尼亚卢旺达语', intlCode: 'rw', isUnsupported: true },
            { value: 'sd', label: 'Sindhi', chineseName: '信德语', intlCode: 'sd', isUnsupported: true },
            { value: 'se', label: 'Northern Sami', chineseName: '北萨米语', intlCode: 'se', isUnsupported: true },
            { value: 'si', label: 'Sinhalese', chineseName: '僧伽罗语', intlCode: 'si', isUnsupported: false },
            { value: 'sk', label: 'Slovak', chineseName: '斯洛伐克语', intlCode: 'sk', isUnsupported: false },
            { value: 'sl', label: 'Slovenian', chineseName: '斯洛文尼亚语', intlCode: 'sl', isUnsupported: false },
            { value: 'sq', label: 'Albanian', chineseName: '阿尔巴尼亚语', intlCode: 'sq', isUnsupported: false },
            { value: 'sr', label: 'Serbian', chineseName: '塞尔维亚语', intlCode: 'sr', isUnsupported: false },
            { value: 'sr-cyrl', label: 'Serbian Cyrillic', chineseName: '塞尔维亚语西里尔文', intlCode: 'sr-Cyrl', isUnsupported: false },
            { value: 'ss', label: 'siSwati', chineseName: '斯瓦蒂语', intlCode: 'ss', isUnsupported: true },
            { value: 'sv-fi', label: 'Finland Swedish', chineseName: '芬兰瑞典语', intlCode: 'sv-FI', isUnsupported: false },
            { value: 'sw', label: 'Swahili', chineseName: '斯瓦希里语', intlCode: 'sw', isUnsupported: false },
            { value: 'ta', label: 'Tamil', chineseName: '泰米尔语', intlCode: 'ta', isUnsupported: false },
            { value: 'te', label: 'Telugu', chineseName: '泰卢固语', intlCode: 'te', isUnsupported: false },
            { value: 'tet', label: 'Tetun Dili (East Timor)', chineseName: '德顿语', intlCode: 'tet', isUnsupported: true },
            { value: 'tg', label: 'Tajik', chineseName: '塔吉克语', intlCode: 'tg', isUnsupported: true },
            { value: 'tk', label: 'Turkmen', chineseName: '土库曼语', intlCode: 'tk', isUnsupported: true },
            { value: 'tl-ph', label: 'Tagalog (Philippines)', chineseName: '他加禄语', intlCode: 'tl', isUnsupported: false },
            { value: 'tlh', label: 'Klingon', chineseName: '克林贡语', intlCode: 'tlh', isUnsupported: true },
            { value: 'tzl', label: 'Talossan', chineseName: '塔洛桑语', intlCode: 'tzl', isUnsupported: true },
            { value: 'tzm', label: 'Central Atlas Tamazight', chineseName: '中阿特拉斯柏柏尔语', intlCode: 'tzm', isUnsupported: true },
            { value: 'tzm-latn', label: 'Central Atlas Tamazight Latin', chineseName: '中阿特拉斯柏柏尔语拉丁字母', intlCode: 'tzm-Latn', isUnsupported: true },
            { value: 'ug-cn', label: 'Uyghur (China)', chineseName: '维吾尔语', intlCode: 'ug', isUnsupported: true },
            { value: 'uk', label: 'Ukrainian', chineseName: '乌克兰语', intlCode: 'uk', isUnsupported: false },
            { value: 'ur', label: 'Urdu', chineseName: '乌尔都语', intlCode: 'ur', isUnsupported: false },
            { value: 'uz', label: 'Uzbek', chineseName: '乌兹别克语', intlCode: 'uz', isUnsupported: false },
            { value: 'uz-latn', label: 'Uzbek Latin', chineseName: '乌兹别克语拉丁字母', intlCode: 'uz-Latn', isUnsupported: false },
            { value: 'x-pseudo', label: 'Pseudo', chineseName: '伪语言', intlCode: 'x-pseudo', isUnsupported: true },
            { value: 'yo', label: 'Yoruba Nigeria', chineseName: '约鲁巴语', intlCode: 'yo', isUnsupported: true }
        ],
        init() {
            // 初始化默认语言
            dayjs.locale(this.currentLang);
            // 自定义中文（简体）配置
            dayjs.locale('zh-cn', {
                name: 'zh-cn',
                weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                ordinal: function(n) {
                    return n + '日';
                }
            });
            // 初始更新
            this.updateDemo();
            // 每秒更新当前时间
            setInterval(() => {
                this.updateCurrentTime();
            }, 1000);
        },
        changeLanguage() {
            dayjs.locale(this.currentLang);
            this.updateDemo();
        },
        updateDemo() {
            const now = dayjs();
            const currentLang = dayjs.locale();
            const intlLang = this.getIntlLangCode(this.currentLang);

            console.log('%c this.currentLang', 'color:red; background:yellow;', this.currentLang)
            console.log('%c currentLang', 'color:red; background:yellow;', currentLang)
            console.log('%c intlLang', 'color:red; background:yellow;', intlLang)

            // 基本日期时间格式化
            this.currentTime = now.format('YYYY-MM-DD HH:mm:ss');

            // 使用 Intl 进行日期格式化
            this.formattedDate = this.formatDateLocalized(now, intlLang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // 使用 Intl 获取星期几
            this.dayOfWeek = this.formatDateLocalized(now, intlLang, {
                weekday: 'long'
            });

            // 使用 Intl 获取月份
            this.month = this.formatDateLocalized(now, intlLang, {
                month: 'long'
            });

            // 高级格式化 - 使用 Intl 进行完整日期时间格式化
            this.fullDateTime = this.formatDateLocalized(now, intlLang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },
        updateCurrentTime() {
            this.currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        },
        formatDateLocalized(date, lang, options) {
            return new Intl.DateTimeFormat(lang, options).format(date.toDate());
        },
        getIntlLangCode(dayjsLang) {
            const lang = this.languages.find(l => l.value === dayjsLang);
            return lang ? lang.intlCode : dayjsLang;
        },
        validateFullDateTime(value) {
            // 验证完整日期时间
            if (!value || typeof value !== 'string') return false;
            // 检查长度是否合理（至少包含年、月、日、时、分信息）
            if (value.length < 10) return false;
            // 检查是否包含时间相关字符（如冒号）
            return value.includes(':') || value.includes(' ');
        },
        validateFormattedDate(value) {
            // 验证格式化日期
            if (!value || typeof value !== 'string') return false;
            // 检查长度是否合理（至少包含年、月、日信息）
            return value.length >= 5;
        },
        validateDayOfWeek(value) {
            // 验证星期几
            if (!value || typeof value !== 'string') return false;
            // 检查长度是否合理（通常星期名称长度在3-10个字符之间）
            return value.length >= 2 && value.length <= 20;
        },
        validateMonth(value) {
            // 验证月份
            if (!value || typeof value !== 'string') return false;
            // 检查长度是否合理（通常月份名称长度在3-10个字符之间）
            return value.length >= 2 && value.length <= 20;
        },
        validateIntlCode(langCode) {
            // 验证intlCode是否能被Intl.DateTimeFormat正确识别
            try {
                // 尝试使用该语言代码创建DateTimeFormat实例
                new Intl.DateTimeFormat(langCode);
                return true;
            } catch (error) {
                return false;
            }
        },
        testLanguages() {
            // 存储原始语言
            this.originalLang = this.currentLang;
            // 重置测试结果
            this.testResults = [];

            // 先获取中文的格式化结果作为参考
            let chineseFullDateTime = '';
            try {
                this.currentLang = 'zh-cn';
                dayjs.locale('zh-cn');
                this.updateDemo();
                chineseFullDateTime = this.fullDateTime;
            } catch (error) {
                console.error('获取中文参考结果失败:', error);
            }

            // 遍历所有语言
            for (const lang of this.languages) {
                try {
                    // 验证intlCode
                    const isIntlCodeValid = this.validateIntlCode(lang.intlCode);

                    // 切换到当前语言
                    this.currentLang = lang.value;
                    dayjs.locale(this.currentLang);
                    // 更新演示数据
                    this.updateDemo();

                    // 验证格式化结果（currentTime在语言切换时不变，不需要验证）
                    const isFullDateTimeValid = this.validateFullDateTime(this.fullDateTime);
                    const isFormattedDateValid = this.validateFormattedDate(this.formattedDate);
                    const isDayOfWeekValid = this.validateDayOfWeek(this.dayOfWeek);
                    const isMonthValid = this.validateMonth(this.month);

                    // 检测非中文语言是否显示中文结果
                    const isChineseLanguage = lang.value.startsWith('zh');
                    const isShowingChineseResult = !isChineseLanguage && this.fullDateTime === chineseFullDateTime;

                    if (isIntlCodeValid && isFullDateTimeValid && isFormattedDateValid && isDayOfWeekValid && isMonthValid && !isShowingChineseResult) {
                        this.testResults.push({
                            lang: `${lang.label} (${lang.value}) (${lang.chineseName})`,
                            status: 'pass',
                            message: '所有格式化结果正常',
                            fullDateTime: this.fullDateTime
                        });
                    } else {
                        let errorMessage = '格式化失败：';
                        if (!isIntlCodeValid) errorMessage += 'intlCode错误 ';
                        if (isShowingChineseResult) errorMessage += '显示中文结果 ';
                        if (!isFullDateTimeValid) errorMessage += 'fullDateTime ';
                        if (!isFormattedDateValid) errorMessage += 'formattedDate ';
                        if (!isDayOfWeekValid) errorMessage += 'dayOfWeek ';
                        if (!isMonthValid) errorMessage += 'month ';

                        this.testResults.push({
                            lang: `${lang.label} (${lang.value}) (${lang.chineseName})`,
                            status: 'fail',
                            message: errorMessage.trim(),
                            fullDateTime: this.fullDateTime
                        });
                    }
                } catch (error) {
                    this.testResults.push({
                        lang: `${lang.label} (${lang.value}) (${lang.chineseName})`,
                        status: 'fail',
                        message: `错误：${error.message}`,
                        fullDateTime: this.fullDateTime
                    });
                }
            }

            // 排序：失败的结果放在前面
            this.testResults.sort((a, b) => {
                if (a.status === 'fail' && b.status === 'pass') return -1;
                if (a.status === 'pass' && b.status === 'fail') return 1;
                return 0;
            });

            // 恢复原始语言
            this.currentLang = this.originalLang;
            dayjs.locale(this.originalLang);
            this.updateDemo();
        }
    }));
});