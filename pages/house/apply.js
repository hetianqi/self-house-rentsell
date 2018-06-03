// pages/mp-applications/index.js
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
    // wx.request({
    //   url: apiUrl + '/apply/list',
    //   success({ data }) {
    //     wx.showModal({
    //       content: JSON.stringify(data)
    //     });
    //     if (data.errcode) {
    //       return;
    //     }
    //     _this.setData({ list: data.data });
    //   },
    //   fail(err) {
    //     wx.showModal({
    //       content: JSON.stringify(err)
    //     });
    //   }
    // });
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