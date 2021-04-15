export function getWeek(){
	let now          = new Date(); 							//當前日期
	let nowDayOfWeek = now.getDay(); 						//今天本周的第幾天
	let nowDay       = now.getDate(); 					    //當前日
	let nowMonth     = now.getMonth(); 					    //當前月
	let nowYear      = now.getFullYear(); 					//當前年
	nowYear += (nowYear < 2000) ? 1900 : 0;
    let formatDate =function (date) {
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();
        if (mymonth < 10) { mymonth = "0" + mymonth; }
        if (myweekday < 10) { myweekday = "0" + myweekday; }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
    //獲得本周的開端日期
    let weekStartDate = formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1));
    //獲得本周的停止日期
    let weekEndDate = formatDate(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek+1)));
    //獲得上周的開端日期
    let LestweekStartDate =formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7+1));
    //獲得上周的停止日期
    let LestweekEndDate =formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1+1));

    return {
        'thisweekStart':   weekStartDate,
        'thisweekEnd':     weekEndDate,
        'lestweekStart':   LestweekStartDate,
        'lestweekEndDate': LestweekEndDate
    };
}
export function getToday(){
    let now = new Date();
    let month = '' + (now.getMonth() + 1);
    let day = '' + now.getDate();
    let year = now.getFullYear();

    if(month.length < 2) { month = '0' + month };
    if(day.length < 2) { day = '0' + day };

    return [year, month, day].join('-');
}

/**
 * 格式化日期 yyyy-mm-dd
 * @param date
 */
export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * 取得 url 參數
 * @param name 參數名
 */
export function getURLParamet(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// Usage:
// query string: ?foo=lorem&bar=&baz
// var foo = getURLParamet('foo'); // "lorem"
// var bar = getURLParamet('bar'); // "" (present with empty value)
// var baz = getURLParamet('baz'); // "" (present with no value)
// var qux = getURLParamet('qux'); // null (absent)