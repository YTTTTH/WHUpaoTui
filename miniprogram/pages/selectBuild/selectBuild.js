// pages/selectBuild/selectBuild.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabList: ['信息学部', '桂园', '梅园', '工学部'],
      tabNow: 0,
      building:['14舍','15舍','C3','C4','C7'],
  },

  selectBuild(e) {
      const index = e.currentTarget.dataset.index;
      const that = this.data;
      const build = `${that.tabList[that.tabNow]}-${that.building[index]}`;
      wx.navigateTo({
        url: `../addAddress/addAddress?build=${build}`
      })
  },

  selectTab(e) {
      const id = e.currentTarget.dataset.id;
      this.setData({
          tabNow: id,
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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