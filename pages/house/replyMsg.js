// pages/house/leaveMsg.js

import { request, showLoading, showError, showSuccess } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    leaveMsg: null,
    showSendMsg: false,
    inputSendMsg: '',
    userId: ''
  },

  // 页面加载
  onLoad() {
    app.login()
      .then(({ access_token, userId }) => {
        this.access_token = access_token
        this.setData({ userId })
      })
    this.setData({ leaveMsg: app.globalData.leaveMsg })
  },

  // 获取房源详情
  getHouseDetail() {
    if (!app.globalData.houseId) return
    showLoading('加载中...')
    request({
      url: apiUrl + 'house/Detail',
      data: {
        access_token: this.access_token,
        houseId: app.globalData.houseId
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        if (data.data.leaveMsg) {
          data.data.leaveMsg.createDate = data.data.leaveMsg.createTime.substring(5, 16)
          data.data.leaveMsg.replyMsg.forEach(item => {
            item.createDate = item.createTime.substring(5, 16)
          })
        }
        this.setData({
          leaveMsg: data.data.leaveMsg
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err.message)
      })
  },

  // 留言
  reply() {
    this.setData({ showSendMsg: true, inputSendMsg: '' })
  },

  // 点击空白处取消消息输入框
  cancelSendMsg() {
    this.setData({ showSendMsg: false })
  },

  // 输入消息
  onInputSendMsg(e) {
    this.setData({ inputSendMsg: e.detail.value });
  },

  // 发送消息
  sendMsg() {
    if (!this.data.inputSendMsg) {
      this.setData({ showSendMsg: false })
      return;
    }
    showLoading('回复...')
    request({
      url: apiUrl + 'leaveMsg/reply',
      method: 'POST',
      data: {
        access_token: this.access_token,
        leaveMsgId: this.data.leaveMsg.id,
        content: this.data.inputSendMsg,
        landlordId: this.data.leaveMsg.toId
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        wx.showToast({
          title: '回复成功'
        })
        this.setData({ showSendMsg: false })
        this.getHouseDetail()
      })
      .catch((err) => {
        wx.hideLoading()
        showError(err)
      })
  }
})