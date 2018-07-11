export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 格式化时间参数
// 参数1： date 日期对象或可转为日期对象的值
// 参数2： format 字符串，格式化形式，年月日用大写Y、M、D代表，时分秒分别用h、m、s代表，毫秒用S代表
export function formatDate(date, format) {
  if (!(date instanceof Date)) {
      date = new Date(date)
  }
  if (isNaN(date.getDate())) {
      return null
  }

  format = format || 'yyyy-MM-dd'

  var o = {
      'M+': date.getMonth() + 1, // 月
      'd+': date.getDate(), // 天 
      'h+': date.getHours() % 12, // 小时，12小时制
      'H+': date.getHours(), // 小时，24小时制 
      'm+': date.getMinutes(), // 分钟
      's+': date.getSeconds(), // 秒钟
      'S': date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(format)) {      //格式化年份
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
  }

  return format
}

export function showLoading(msg) {
  wx.showLoading({
    title: msg,
    mask: true
  })
}

// 显示错误弹出框
export function showError(msg, cb) {
  wx.showModal({
    content: msg !== null ? msg.toString() : '',
    showCancel: false,
    confirmColor: '#ff0000',
    success: cb
  })
}

export function showWarning(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

export function showSuccess(msg, cb) {
  wx.showModal({
    content: msg,
    showCancel: false,
    success: cb
  })
}

// 自定义请求封装
export function request(obj) {
  if (obj.method && obj.method.toUpperCase() === 'POST') {
    obj.header = { 
      ...obj.header,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return new Promise((resolve, reject) => {
    const requestTask = wx.request({
      ...obj,
      success: ({ data, statusCode, header }) => {
        if (statusCode === 200 || statusCode === 304) {
          resolve(data, header)
        } else {
          reject('服务器异常')
        }
      },
      fail: (err) => {
        reject('请求失败')
      }
    })
    setTimeout(() => {
      requestTask.abort()
      reject('请求超时')
    }, obj.timeout || 60000)
  })
}

export function debounce(func, wait, immediate) {
  // immediate默认为false
  let timeout, args, context, timestamp, result

  let later = function () {
    // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
    var last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  };

  return function () {
    context = this
    args = arguments
    timestamp = Date.now()
    // 第一次调用该方法时，且immediate为true，则调用func函数
    let callNow = immediate && !timeout
    // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}