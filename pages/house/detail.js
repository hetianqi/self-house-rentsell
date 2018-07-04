// pages/house/detail.js

import { request, showLoading, showError, showSuccess } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  validate: '',

  // 页面数据
  data: {
    emptyStr: '',
    currHouseImgIndex: 0,
    resourcesURI: '',
    houseImgs: [],
    house: {},
    houseInfo: {},
    premiseInfo: {},
    unit: {},
    build: {},
    linkMan: {},
    leaveMsg: null,
    applyStatus: null,
    detailCollapsed: false,
    landlordLeaveMsgCollapsed: false,
    leaveMsgCollapsed: false,
    showSendMsg: false,
    inputSendMsg: ''
  },

  // 页面加载
  onLoad(options) {
    app.globalData.houseId = options.houseId
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, validate }) => {
        this.access_token = access_token
        this.validate = validate
        this.getHouseDetail()
      })
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
          resourcesURI: data.data.resourcesURI,
          houseImgs: data.data.houseImg.map(a => {
            a.date = (a.time || '').substring(0, 10)
            return a
          }),
          house: data.data.house,
          houseInfo: data.data.houseInfo,
          premiseInfo: data.data.premises,
          build: data.data.build,
          unit: data.data.unit,
          linkMan: data.data.LinkMan,
          leaveMsg: data.data.leaveMsg,
          applyStatus: data.data.apply
        })
        app.globalData.resourcesURI = data.data.resourcesURI
        app.globalData.houseImgs = data.data.houseImg
      })
      .catch(err => {
        wx.hideLoading()
        showError(err.message)
      })
  },

  // 照片切换
  onHouseImgSwipe(e) {
    this.setData({
      currHouseImgIndex: e.detail.current
    })
  },

  // 显示隐藏某个tab
  toggleExpand(e) {
    let field = e.currentTarget.dataset.field;
    this.setData({ [field]: !this.data[field] });
  },

  // 留言
  leave() {
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
      this.setData({ showLeaveMsg: false })
      return;
    }
    showLoading('留言...')
    request({
      url: apiUrl + 'leaveMsg/leave',
      method: 'POST',
      data: {
        access_token: this.access_token,
        houseId: app.globalData.houseId,
        content: this.data.inputSendMsg,
        landlordId: this.data.house.userId
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
  },

  // 回复消息
  toReplyMsg() {
    app.globalData.leaveMsg = this.data.leaveMsg
    wx.navigateTo({
      url: './replyMsg'
    })
  },

  // 去微聊
  toWechat() {
    wx.navigateTo({
      url: './wechat'
    })
  },
  
  // 申请看房
  toApply() {
    if (this.validate !== '1') {
      wx.navigateTo({
        url: '../auth/verify'
      })
    } else {
      wx.navigateTo({
        url: './reserve'
      })
    }
  }
})
