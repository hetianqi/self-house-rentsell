// 首页

import { apiUrl } from '../../libs/config.js';

// 地图上下文
let mapCtx;

const data = [{
  "id": 1,
  "latitude": 30.56,
  "longitude": 104.06,
  "name": "华林东苑",
  "count": 2
},
{
  "id": 2,
  "latitude": 30.57,
  "longitude": 104.064,
  "name": "华林西苑",
  "count": 8
},
{
  "id": 3,
  "latitude": 30.58,
  "longitude": 104.068,
  "name": "临江苑东区",
  "count": 6
}];

let getMapScaleTimer;

Page({
  data: {
    location: {},
    mapScale: 14,
    markers: [],
    isShowHouses: false
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
    _this.getMapScale()
    .then(() => {
      _this.setData({
        markers: data.map(item => ({
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
            padding: 5
          }
        }))
      });
      console.log(_this.data.markers);
      // wx.request({
      //   url: apiUrl + '/house/areas',
      //   method: 'GET',
      //   data: {
      //     scale: _this.data.scale
      //   },
      //   success({ data }) {
      //     _this.setData({
      //       markers: (data.data || []).map(item => ({
      //         id: item.id,
      //         latitude: item.latitude,
      //         longitude: item.longitude,
      //         width: 0,
      //         height: 0,
      //         iconPath: '../../images/marker.png',
      //         label: {
      //           content: item.name + `${item.count}(套)`,
      //           x: -40,
      //           y: -25,
      //           bgColor: '#f75001',
      //           color: '#fff',
      //           borderRadius: 100,
      //           padding: 3
      //         }
      //       }))
      //     });
      //     console.log(data.data);
      //   }
      // });
    });
  },
  onRegionChange(e) {
    this.setData({ isShowHouses: !this.data.isShowHouses });
    console.log(e);
    this.getMapScale();
  },
  // 地图放大
  zoomIn() {
    this.setData({ mapScale: this.data.mapScale + 1 });
    this.getMapScale();
  },
  // 地图缩小
  zoomOut() {
    this.setData({ mapScale: this.data.mapScale - 1 });
    this.getMapScale();
  },
  // 由于微信没有提供map缩放事件，点击放大/缩小按钮前先主动获取一下缩放级别
  getMapScale() {
    let _this = this;
    return new Promise((resolve, reject) => {
      clearTimeout(getMapScaleTimer);
      getMapScaleTimer = setTimeout(() => {
        mapCtx.getScale({
          success({ scale }) {
            console.log(scale);
            _this.data.mapScale = scale;
            resolve();
          },
          fail() {
            resolve();
          }
        });
      }, 500);      
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
  // 展示房源列表
  showHouses(e) {
    console.log(e);
    this.setData({ isShowHouses: true });
  },
  // 隐藏房源列表
  hideHouses() {
    this.setData({ isShowHouses: false });
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