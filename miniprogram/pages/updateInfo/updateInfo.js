
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      phone: '',
      qqNum:'',
  },

  saveChange() {
      wx.setStorageSync('userInfo', this.data.userInfo);//存入缓存
      wx.setStorageSync('phone', this.data.phone);
      wx.setStorageSync('QQ', this.data.qqNum);
      wx.showToast({
        title: '修改成功',
      })
      wx.switchTab({
        url: '../my/my',
      })
  },

  updateAddress() {
    wx.setStorageSync('urlNow', 'updateInfo')
      wx.navigateTo({
        url: '../address/address?',
      })
  },

  // updatePhone(e) {
  //     wx.cloud.callFunction({
  //         name: 'getUserPhone',
  //         data: {
  //             cloudID: e.detail.cloudID,
  //         },
  //         success: (res) => {
  //             this.setData({
  //                 phone: res.result.list[0].data.phoneNumber,
  //             })
  //         }
  //     })
  // },

  updateNickName(e) {
     let userInfo = this.data.userInfo;
     userInfo.nickName = e.detail.value;
     this.setData({
         userInfo,
     })
  },

  updatePhone(e){
    
    const phone=e.detail.value;
    this.setData({
      phone,
  })
  },

  updateQQ(e){
    const qqNum=e.detail.value;
    this.setData({
      qqNum,
    })
  },

  updateAvatar() {  //更新头像函数
      let userInfo = this.data.userInfo;
      wx.chooseImage({   //从系统中选图片
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          wx.showLoading({
            title: '加载中',
          })
          const random = Math.floor(Math.random() * 1000);
          wx.cloud.uploadFile({  //上传文件到云存储
              cloudPath: `avatar/${this.data.userInfo.nickName}-${random}.png`,
              filePath: res.tempFilePaths[0],
              success: (res) => {
                  let fileID = res.fileID;  //新头像url
                  userInfo.avatarUrl = fileID;
                  this.setData({
                      userInfo,
                  })
                  wx.hideLoading()
              }
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载·
   */
  onLoad: function (options) {
      const userInfo = wx.getStorageSync('userInfo');
      const phone = wx.getStorageSync('phone');
      const qqNum=wx.getStorageSync('QQ');
      this.setData({
          userInfo,
          phone,
          qqNum,
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
    this.onLoad();
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
