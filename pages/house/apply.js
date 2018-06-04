// pages/mp-applications/index.js

import { request, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    activeIndex: 'rent',
    list: [],
    stateMap: {
      0: '未授权',
      1: '拒绝授权',
      2: '已授权'
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    app.login()
      .then((token) => {
        this.data.token = token
        this.getList()
      })
  },

  // tab切换
  onTabChange(e) {
    this.setData({ activeIndex: e.detail.index });
    this.getList();
  },

  getList() {
    wx.showLoading({
      title: '加载中...',
    })
    request({
      url: apiUrl + 'house/records',
      data: {
        access_token: this.data.token,
        houseType: this.data.activeIndex
      }
    })
      .then((data) => {
        wx.hideLoading()
        if (data.code !== '200') {
          showError(data.msg)
          return
        }
        resolve(data.data)
      })
  },

  // 房源跳转
  jump(e) {
    let item = e.currentTarget.dataset.item;

    if (item.state !== 2) return;
    Math.random() >= 0.5 ? wx.navigateTo({
      url: '../deposit/pay?houseId=' + item.id
    }) : wx.navigateTo({
      url: '../house/self-house?houseId=' + item.id
    });
  }
});