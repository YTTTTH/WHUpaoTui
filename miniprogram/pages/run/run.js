import {
  getTimeNow
} from '../../utils/index';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpContent: '',
    TakeOutAddress: '',
    address: '',
    userInfo: {},
    Money: 0,
  },

  submit() {
    if(!wx.getStorageSync('phone')){
      wx.showToast({
        title: '请完善个人信息，联系方式',
        icon:'none',
      })
      return;
    }
    const {
      helpContent, //外卖信息
      TakeOutAddress,//
      address,
      Money,
      userInfo
    } = this.data;
    if (!helpContent || !TakeOutAddress || !address) {
      wx.showToast({
        icon: 'none',
        title: '您填写的信息不全',
      })
      return;
    }
    db.collection('order').add({
      data: {
        // 模块的名字
        name: '外卖跑腿',
        // 当前时间
        time: getTimeNow(),
        // 订单金额
        money: Money,
        // 订单状态
        state: '待接单',
        // 收件地址
        address,
        // 订单信息
        info: {
          // 外卖信息
          helpContent,
          // 取货地点
          TakeOutAddress,
        },
        // 用户信息
        userInfo,
        // 手机号
        phone: wx.getStorageSync('phone'),
        createTime: db.serverDate()
      },
      success: (res) => {
        wx.switchTab({
          url: '../index/index',
        })
        wx.showToast({
          title: '发布成功',
        })
      }
    })
  },

  getMoney(e) {
    this.setData({
      Money: Number(e.detail.value)
    })
  },

  getTakeOutAddress(e) {
    this.setData({
      TakeOutAddress: e.detail.value
    })
  },

  selectAddress() {
    wx.setStorageSync('urlNow', 'run')
    wx.redirectTo({
      url: '../address/address',
    })
  },

  selectTakeOutAddress(){
    wx.navigateTo({
      url: '../takeOutAddress/takeOutAddress?url=run',
    })
  },

  getHelpContent(e) {
    this.setData({
      helpContent: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const{
      TakeOutAddress   //接收来自另一个页面传来的参数
  }=options;
    
    const address = wx.getStorageSync('addressNow');
    const userInfo = wx.getStorageSync('userInfo');
      
    if (address) {
      const {
        build,
      } = address;
      this.setData({
        address: `${build}`,
      })
    }

    if(TakeOutAddress){
      this.setData({
        TakeOutAddress,
      })
    }
    this.setData({
      userInfo,
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