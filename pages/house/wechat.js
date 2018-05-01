// pages/house/wechat.js
Page({
  ws: null, // websocket对象

  data: {
    historyMessages: [],
    message: '',
    scrollIntoId: ''
  },

  /**
   * 生命周期函数--页面加载
   */
  onLoad() {
    let _this = this;

    wx.request({
      url: 'http://192.168.2.103:8000/message',
      success({ data }) {
        _this.setData({ historyMessages: data });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.ws = wx.connectSocket({
      url: 'ws://192.168.2.103:8000',
      method: 'POST',
      data: {
        name: 'heron'
      }
    });

    this.ws.onMessage(this.receiveMessage.bind(this));
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  changeMessage(e) {
    this.setData({ message: e.detail.value });
  },

  // 发送消息
  sendMessage(e) {
    if (!this.data.message) {
      wx.showToast({
        title: '请输入想说的话'
      });
      return;
    }
    let _this = this;
    this.ws.send({
      data: this.data.message,
      success() {
        _this.setData({
          historyMessages: _this.data.historyMessages.concat([{
            type: 2,
            content: _this.data.message
          }]),
          message: '',
          scrollIntoId: 'message_' + (_this.data.historyMessages.length + 1)
        });        
      }
    });
  },

  // 接收消息
  receiveMessage({ data }) {
    this.setData({
      historyMessages: this.data.historyMessages.concat([{
        type: 1,
        content: data
      }]),
      scrollIntoId: 'message_' + (this.data.historyMessages.length + 1)
    });
  }
});