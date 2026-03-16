## h5海外版 dayjs 插件 API 列表
| 插件名称 | 提供的 API | API 功能描述 | 项目使用情况 |
| --- | --- | --- | --- |
| isSameOrAfter | isSameOrAfter(date, unit?) | 判断日期是否与指定日期相同或在其之后 | ✅ 已使用（在 CalendarPopup.vue 中用于判断日期是否在去程日期之后） |
| isSameOrBefore | isSameOrBefore(date, unit?) | 判断日期是否与指定日期相同或在其之前 | ✅ 已使用（在 CalendarPopup.vue 中用于判断日期是否在返程日期之前） |
| customParseFormat | dayjs(date, format) | 支持使用自定义格式解析日期字符串 | ❌ 未发现直接使用 |
| isToday | isToday() | 判断日期是否为今天 | ❌ 未发现直接使用（项目中使用 isSame 方法替代） |
| isBetween | isBetween(date1, date2, unit?, inclusivity?) | 判断日期是否在两个指定日期之间 | ❌ 未发现直接使用 |
| calendar | calendar(referenceDate?, formats?) | 返回相对时间描述（如"今天"、"明天"等） | ❌ 未发现直接使用（项目使用自定义日历组件） |

## ICN海外版 dayjs 插件 API 列表
| 插件名称 | 提供的 API | API 功能描述 | 项目使用情况 |
| --- | --- | --- | --- |
| isSameOrBefore | isSameOrBefore(date, unit?) | 判断日期是否等于或早于另一个日期 | ✅ 已使用（在 TimeSelectItem2.vue 中用于判断日期范围） |
| isSameOrAfter | isSameOrAfter(date, unit?) | 判断日期是否等于或晚于另一个日期 | ✅ 已使用（在 TimeSelectItem2.vue 中用于判断日期范围） |
| isBetween | isBetween(date1, date2, unit?, inclusivity?) | 判断日期是否在两个日期之间 | ✅ 已使用（在 TimeSelectItem2.vue 和 util.js 中用于判断日期范围） |
| relativeTime | fromNow(), from(), toNow(), to() | 提供相对时间计算（如 "3小时前"、"2天后" 等） | ❌ 未发现直接使用 |
| duration | duration() | 处理时间间隔计算 | ✅ 已使用（在 FlightDetail.vue 中计算航班行程时间） |

## Intl.DateTimeFormat 支持的语言代码基于 BCP 47 标准
 IANA 语言子标签注册表 （BCP 47 标准的官方注册表）： https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry