//index.js

// 地图上下文
let mapCtx;

Page({
  data: {
    location: {},
    scale: 16 // map组件bug?传递给map组件的scale值比mapCtx.getScale返回的值大2
  },  
  onReady() {
    wx.getLocation({
      success: location => {
        this.setData({ location });
      }
    });
    mapCtx = wx.createMapContext('map');
    setTimeout(() => {
      mapCtx.getScale({
        success(...args) {
          console.log(args);
        },
        fail(...args) {
          console.log(args);
        }
      });
    }, 1000);
  },
  // 搜索
  search(e) {
    console.log(e.detail.value);
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
  // 跳转到我的申请页
  gotoMyApplications() {
    wx.navigateTo({
      url: 'pages/mp-applications/index'
    });
  },
  // 扫码进入
  scanCode() {
    
  }
});