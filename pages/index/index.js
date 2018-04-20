// 首页

import { apiUrl } from '../../libs/config.js';

// 地图上下文
let mapCtx;

Page({
  data: {
    location: {},
    scale: 16, // map组件bug?传递给map组件的scale值比mapCtx.getScale返回的值大2
    markers: []
  },  
  onReady() {
    wx.getLocation({
      success: location => {
        console.log(location);
        this.setData({ location });
      }
    });
    mapCtx = wx.createMapContext('map');
    this.getMapData();
  },
  // 获取房源数据
  getMapData() {
    let _this = this;
    _this.getScale()
    .then(() => {
      wx.request({
        url: apiUrl + '/house/areas',
        method: 'GET',
        data: {
          scale: _this.data.scale
        },
        success({ data }) {
          _this.setData({
            markers: (data.data || []).map(item => ({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              width: 0,
              height: 0,
              iconPath: '../../images/marker.png',
              label: {
                content: item.name + `${item.count}(套)`,
                x: -40,
                y: -25,
                bgColor: '#f75001',
                color: '#fff',
                borderRadius: 100,
                padding: 3
              }
            }))
          });
          console.log(data.data);
        }
      });
    });
  },
  onRegionChange(e) {
    console.log(e)
  },
  // 地图放大
  zoomIn() {
    this.getScale()
      .then(() => {
        if (this.data.scale >= 18) return;
        this.setData({ scale: this.data.scale + 1 });
      });
  },
  // 地图缩小
  zoomOut() {
    this.getScale()
    .then(() => {
      if (this.data.scale <= 3) return;
      this.setData({ scale: this.data.scale - 1 });
    });
  },
  // 由于微信没有提供map缩放事件，点击放大/缩小按钮前先主动获取一下缩放级别
  getScale() {
    var _this = this;
    return new Promise((resolve, reject) => {
      mapCtx.getScale({
        success({ scale }) {
          _this.data.scale = scale;
          resolve();
        },
        fail() {
          resolve();
        }
      });
    });
  },
  // 获取我的当前位置
  locate() {
    wx.getLocation({
      success: location => {
        this.setData({ location });
      }
    });
  },
  // 跳转到我的申请页
  gotoMyApplications() {
    wx.navigateTo({
      url: '../house/apply'
    });
  },
  // 扫码进入
  scanCode() {
    wx.scanCode({
      scanType: ['qrCode'],
      success({ result }) {
        wx.showLoading({
          title: '获取房源数据...',
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateTo({
            url: '../house/detail?id=1'
          });
        }, 1000);
      },
      fail() {
        wx.showLoading({
          title: '获取房源数据...',
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateTo({
            url: '../house/detail?id=1'
          });
        }, 1000);
      }
    });
  }
});