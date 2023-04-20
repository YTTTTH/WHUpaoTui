// pages/person/person.js
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
        // success代表已经是接单员了, 
        // fail代表曾经申请过但是没通过
        // loading代表目前有正在审核中的
        // null代表从未申请过
        personReceiveState: '',
        admin: false,
        helpTotalNum:0,
        helpTotalMoney:0,
    },

    orderReceiver() {
      if(!!this.data.userInfo){
        wx.navigateTo({
          url: '../orderReceiver/orderReceiver',
        })
      }else{
        wx.showToast({
          title: '请登录',
          icon:'none',
        })
      }
        
    },

    applyOrder() {
      const {
          personReceiveState
      } = this.data;
      const isLogin=!!wx.getStorageSync('userInfo')
      if(isLogin){
        if (personReceiveState === 'success') {
          wx.showModal({
              title: '提示',
              content: '您已经是接单员了, 请勿重复申请!',
              showCancel: false
          })
        } else if (personReceiveState === 'fail') {
          wx.showModal({
              title: '提示',
              content: '您之前提交的申请未通过审核, 但您可以继续申请',
              success: (res) => {
                  const {
                      confirm   //接收  取消或是确定
                  } = res;
                  if (confirm) {
                      wx.navigateTo({
                          url: '../applyOrder/applyOrder',
                      })
                  }
              }
          })
        } else if (personReceiveState === 'loading') {
          wx.showModal({
              title: '提示',
              content: '您之前申请的内容正在审核中, 请耐心等待! ',
              showCancel: false,
          })
        } else if (personReceiveState === 'null') { //第一次申请
            wx.navigateTo({
            url: '../applyOrder/applyOrder',
            })
          }
      }
      else{
        wx.showToast({
          title: '请登录',
          icon:'none',
        })
      }
      
  },


    toAbout() {
        wx.navigateTo({
            url: '../aboutAs/aboutAs',
        })
    },

    getWXCustomer() {
        wx.setClipboardData({
            data: '18331092918',
            success: () => {
                wx.showToast({
                    title: '复制微信成功',
                })
            }
        })
    },

    updateInfo() {
        if (this.data.hasUserInfo) {
            wx.navigateTo({
                url: '../updateInfo/updateInfo',
            })
        }
    },

    getPhoneNumber(e) {
        wx.cloud.callFunction({
            name: 'getUserPhone',
            data: {
                cloudID: e.detail.cloudID,
            },
            success: (res) => {
                console.log(res);
                wx.setStorageSync('phone', res.result.list[0].data.phoneNumber);
            },
            fail: (err) => {
                console.log(err);
            }
        })
    },

    getUserProfile() {
        wx.getUserProfile({
            desc: '获取用户信息',
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
                wx.setStorageSync('userInfo', res.userInfo);
            }
        })
    },

    // 老接口
    getUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    // 判断当前用户是否是管理员
    getAdminPower() {
        db.collection('admin').where({
            adminID: wx.getStorageSync('openid')
        }).get({
            success: (res) => {
                
                this.setData({
                    admin: !!res.data.length
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
        const userInfo = wx.getStorageSync('userInfo');
        const helpTotalNum=wx.getStorageSync('helpTotalNum');
        const helpTotalMoeny=wx.getStorageSync('helpTotalMoeny');
        this.setData({
            hasUserInfo: !!userInfo,
            userInfo: userInfo,
            helpTotalNum:helpTotalNum,
            helpTotalMoney:helpTotalMoeny,

        })
        let personReceiveState = '';
        this.getAdminPower();
        db.collection('orderReceive').where({
            _openid: wx.getStorageSync('openid')
        }).get({
            success: (res) => {
                const {
                    data
                } = res;
                if (data.length) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].state === '通过') {
                            personReceiveState = 'success';
                            break;
                        } else if (data[i].state === '不通过') {
                            personReceiveState = 'fail';
                        } else {
                            personReceiveState = 'loading';
                            break;
                        }
                    }
                } else {
                    personReceiveState = 'null';
                }
                this.setData({
                    personReceiveState,
                })
                
            }
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