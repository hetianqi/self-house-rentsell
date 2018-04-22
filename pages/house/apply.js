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
    _this.setData({
      list: [
        {
          "id": 1,
          "icon": "https://image1.ljcdn.com/xf-resblock/3e03508f-be4d-42cb-8a8b-c90cf81f053a.jpg.592x432.jpg",
          "name": "月光诚品",
          "dong": 1,
          "danyuan": 1,
          "hao": 404,
          "state": 0
        },
        {
          "id": 2,
          "icon": "https://image1.ljcdn.com/xf-resblock/3e03508f-be4d-42cb-8a8b-c90cf81f053a.jpg.592x432.jpg",
          "name": "月光诚品",
          "dong": 1,
          "danyuan": 1,
          "hao": 404,
          "state": 1
        },
        {
          "id": 3,
          "icon": "https://image1.ljcdn.com/xf-resblock/3e03508f-be4d-42cb-8a8b-c90cf81f053a.jpg.592x432.jpg",
          "name": "月光诚品",
          "dong": 1,
          "danyuan": 1,
          "hao": 404,
          "state": 2,
          "startTime": "2017.03.24",
          "endTime": "2017.04.14"
        }
      ]
    });
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