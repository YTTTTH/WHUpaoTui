// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    url: ''
  },

  selectAddress(e) {
    const {index} = e.currentTarget.dataset;
    const url = wx.getStorageSync('urlNow')
    const address = this.data.address[index];
    wx.setStorageSync('addressNow', address);
    wx.redirectTo({
      url: `../${url}/${url}`,
    })
   
  },

  edit(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.address[index];
    wx.navigateTo({
      url: `../addAddress/addAddress?address=${JSON.stringify(address)}&index=${index}`,//跳转 将address转为字符串  接收时再转为json对象
    })
  },

  delete(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.address;
    address.splice(index, 1);
    wx.setStorageSync('address', address);
    wx.showToast({
      title: '删除成功',
    })
    this.onLoad(); //刷新页面
  },

  addAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const address = wx.getStorageSync('address');
    this.setData({
      address,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      address: wx.getStorageSync('address')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})