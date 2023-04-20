Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:['../../images/banner1.jpg','../../images/banner2.jpg','../../images/banner3.jpg'],
    indexConfig:[
      {
        icon:'../../images/kuaididaiqu.png',
        text:'快递代取',
        url:'../getPackage/getPackage'
      },
   
      {
        icon:'../../images/paotui.png',
        text:'外卖跑腿',
        url: '../run/run',
      },
      // {
      //   icon:'../../images/kuaididaiji.png',
      //   text:'快递代寄',
      //   url: '../expressReplace/expressReplace',
      // },
      {
        icon:'../../images/zujie.png',
        text:'租借',
        url: '../lease/lease',
      },
      {
        icon:'../../images/youxi.png',
        text:'一起玩',
        url: '../playGame/playGame',
      },
     
      {
        icon:'../../images/daiti.png',
        text:'帮我去',
        url: '../replaceMe/replaceMe',
      },
      
    ]
  },
  toDetail(e){
    const isLogin=!!wx.getStorageSync('userInfo');
    const url=e.currentTarget.dataset.url;
    if(isLogin){
      wx.navigateTo({
        url:url
      })
    }else{
      wx.showToast({
        title: '请登录',
        icon:'none',
      })
    }

    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid=wx.getStorageSync('openid');

    if(!openid){
      wx.cloud.callFunction({
        name:'getMyOpenID',
        success:(res)=>{
          const{openid}=res.result;
          wx.setStorageSync('openid', openid);
        }
      })
    }
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