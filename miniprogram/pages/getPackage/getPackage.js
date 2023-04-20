// pages/getPackage/getPackage.js
const db = wx.cloud.database();
import {
  getTimeNow
} from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[
      {
        name:'小件',
        tips:'小件',
        money:3,
      },
      {
        name:'中件',
        tips:'中件',
        money:5,
      },
      {
        name:'大件',
        tips:'大件',
        money:8
      },
    ],
    typeNow: 0,
    businessIndex:0,
    businessArray:['菜鸟果果','京东快递'],
    selectBusiness:false,
    money:3, 
    expressCode:'',//取件码文本
    // codeImg:'',//取件码截图存在云端的地址
    reamrk:'',//备注信息
  },

  getExpressCode(e) {
   
    this.setData({
      expressCode: e.detail.value
    })
    
  },

  // getCode() {
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: (res) => {
  //       wx.showLoading({
  //         title: '加载中',
  //       })
  //       const random = Math.floor(Math.random() * 1000);
  //       wx.cloud.uploadFile({
  //         cloudPath: `expressCode/${random}.png`,
  //         filePath: res.tempFilePaths[0],
  //         success: (res) => {
  //           let fileID = res.fileID;
  //           wx.cloud.getTempFileURL({
  //             fileList: [fileID],
  //             success: (res) => {
  //               this.setData({
  //                 codeImg: res.fileList[0].tempFileURL,
  //               })
  //               wx.hideLoading();
  //             }
  //           })

  //         }
  //       })
  //     },
  //   })
  // },

  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },


  bindBusinessChange(e){
    this.setData({
      businessIndex:e.detail.value,
      selectBusiness:true
    })
  },

  selectType(e){
    const id=e.currentTarget.dataset.id
    const tip=e.currentTarget.dataset.tip
  
    this.setData({
      typeNow:id,
      money:this.data.typeList[id].money,
    })
    wx.showToast({
      icon:'none',
      title: tip,
    })
  },

  selectAddress(e){
    wx.setStorageSync('urlNow', 'getPackage')
    wx.redirectTo({
      url: '../address/address?url=getPackage',
    })
  },

  selectBusiness() {
    wx.redirectTo({
      url: '../expressBusiness/expressBusiness?url=getPackage',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      business
    } = options;
    const address = wx.getStorageSync('addressNow');
   
    const userInfo = wx.getStorageSync('userInfo');
    if (address) {
      const {
        build,
      } = address;
     
      this.setData({
        address: `${build}`
      })
      
    }
    if (business) {
      this.setData({
        business,
      })
    }
    this.setData({
      userInfo,
    })
  },

  submit() {
    
    const that = this.data;
    // 判断必填值有没有填
    // 收件地址、快递单家、收件码或者截图
    if(!wx.getStorageSync('phone')){
      wx.showToast({
        title: '请完善个人信息，联系方式',
        icon:'none',
      })
      return;
    }
    if (!that.address || !that.business || !that.expressCode ) {
      wx.showToast({
        icon: 'none',
        title: '您填写的信息不全',
      })
      return;
    }
    db.collection('order').add({
      data: {
        // 模块的名字
        name: '快递代取',
        // 当前时间
        time: getTimeNow(),
        // 订单金额
        money: Number(that.money ),
        // 订单状态
        state: '待接单',
        // 收件地址
        address: that.address,
        // 订单信息
        info: {          
          size: that.typeList[that.typeNow].name,//  快递大小        
          business: that.business,// 快递商家       
          expressCode: that.expressCode,// 取件码  
          remark: that.remark,// 备注         
        },
        // 用户信息
        userInfo: that.userInfo,
        // 用户手机号
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
      },
      fail:(res)=>{
        wx.showToast({
          title: '发布失败',
          icon:'none',
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})