// pages/mp-applications/index.js
import { apiUrl } from '../../libs/config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0, // 0：求助，1：求购
    list: [], // 申请列表
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
    
  },

  // tab切换
  onTabChange(e) {
    this.setData({ activeIndex: e.detail.index });
    this.getList();
  },

  getList() {
    let _this = this;
    if (this.data.activeIndex === 1) {
      _this.setData({ list: [] });
      return;
    }
    wx.request({
      url: apiUrl + '/apply/list',
      success({ data }) {
        if (data.errcode) {
          return;
        }
        _this.setData({ list: data.data });
      }
    });
  },

  // 房源跳转
  jump(e) {
    let item = e.currentTarget.dataset.item;

    if (item.state !== 2) return;
    Math.random() >= 0.5 ? wx.navigateTo({
      url: '../deposit/pay?houseId=' + item.id
    }) : wx.navigateTo({
      url: '../self-house/self-house?houseId=' + item.id
    });
  }
});