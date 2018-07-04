// pages/house/reserve.js

import { request, showLoading, showWarning, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    date: '',
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: ''
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
      })
    
    let now = new Date()
    let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)
    
    this.setData({
      startDate: {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: startDate.getDate()
      },
      endDate: {
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate()
      }
    })
  },

  // 选择日期
  pickDate(e) {
    this.setData({
      date: e.detail.year + '-' + e.detail.month+ '-' + e.detail.day
    })
  },

  // 选择时间
  pickTime(e) {
    let field = e.currentTarget.dataset.type + 'Time'
    this.setData({ [field]: e.detail.value })
    console.log(field, this.data[field])
  },

  // 确认预约
  submit() {
    if (parseInt(this.data.startTime.replace(':', '')) >= parseInt(this.data.endTime.replace(':', ''))) {
      showWarning('看房结束时间必须大于开始时间')
      return
    }
    showLoading('提交中...')
    request({
      url: apiUrl + 'house/apply',
      method: 'POST',
      data: {
        access_token: this.access_token,
        houseid: app.globalData.houseId,
        starttime: this.data.date + ' ' + this.data.startTime,
        endtime: this.data.date + ' ' + this.data.endTime
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        wx.showModal({
          content: '你的预约信息已发送至房东，\r\n请耐心等待，我们将以短信的方式\r\n通知你的预约情况，\r\n谢谢使用，祝生活愉快！',
          showCancel: false,
          success: () => {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  }
})
