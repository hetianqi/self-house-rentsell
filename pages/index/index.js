//index.js

// 地图上下文
let mapCtx;

Page({
  data: {
    location: {},
    scale: 16
  },  
  onReady() {
    wx.getLocation({
      success: location => {
        console.log(location)
        this.setData({ location });
      }
    });
    mapCtx = wx.createMapContext('map');
  },
  // 地图放大
  zoomIn() {
    if (this.data.scale >= 18) return;
    this.setData({ scale: this.data.scale + 1 });
  },
  // 地图缩小
  zoomOut() {
    if (this.data.scale <= 5) return;
    this.setData({ scale: this.data.scale - 1 });
  },
  onRegionChange(...args) {
    console.log(args);
  }
})
