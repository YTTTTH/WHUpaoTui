// pages/order/order.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabList:['全部','我的订单','我的接单','正在悬赏'],
      tabNow:0,
      openid:'',
      orderList:[],//所有的订单列表
      myOrder:[],//查询我的订单列表
      rewardOrder: [],//悬赏订单
      helpOrder: [],//我帮助的订单
      canReceive: false,
      helpTotalNum: 0,
      helpTotalMoeny: 0,
      isLogin:'',
  },

  selectTab(e){
    const{
      id,
    }=e.currentTarget.dataset;
 
    this.setData({
      tabNow:id
    })
    if (id === 0) {
      this.onLoad();
    } else if (id === 1) {
      this.getMyOrder();
    } else if (id === 2) {
      this.getMyHelpOrder();
      this.getHelpTotalNum();
      this.getHelpTotalMoney();  
    } else if (id === 3) {
      this.getRewardOrder();
    }
  },

  getPersonPower() {
    db.collection('orderReceive').where({
      _openid: wx.getStorageSync('openid'),
      state: '通过'
    }).get({
      success: (res) => {
        this.setData({
          canReceive: !!res.data.length  //看是否具有接单员的资格
        })
     
      }
    })
  },


  getMyHelpOrder() {//我的接单

    wx.showLoading({
      title: '加载中',
    })
    db.collection('order').where({
      receivePerson: this.data.openid
    }).orderBy('createTime','desc').get({
      success: (res) => {
        const {
          data
        } = res;
      
        data.forEach(item => {
          item.showInfo = this.formatInfo(item);//可以显示的内容

          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          helpOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  orderReceive(e) {
   const isLogin=!!wx.getStorageSync('userInfo');
    if(isLogin){
      if (this.data.canReceive) {
        wx.showLoading({
          title: '加载中',
        })
        const {
          item
        } = e.currentTarget.dataset;
        const {
          _id
        } = item;
        const receivePersonPhone=wx.getStorageSync('phone');
        db.collection('order').doc(_id).update({
          data: {
            receivePerson: this.data.openid,
            state: '已接单',
            receivePersonPhone:receivePersonPhone,
          },
          success: (res) => {
            if (this.data.tabNow === 0) {
              this.onLoad();
            } else {
              this.getRewardOrder();
            }
            wx.hideLoading();
          },
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '您目前不是接单员, 请前往个人中心申请成为接单员!'
        })
      }
    }else{
      wx.showToast({
        title: '请登录',
        icon:'none',
      })
    }
  },

  toFinish(e) {
    wx.showLoading({
      title: '加载中',
    })
    const {
      item
    } = e.currentTarget.dataset;
    const {
      _id
    } = item;
    db.collection('order').doc(_id).update({
      data: {
        state: '已完成'
      },
      success: (res) => {
        this.getMyOrder();
        wx.hideLoading();
      }
    })
  },

  getRewardOrder() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('order').where({
      state: '待接单'
    }).orderBy('createTime','desc').get({
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          rewardOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  getHelpTotalNum() {
    db.collection('order').where({
      receivePerson: wx.getStorageSync('openid'),
      state: '已完成'
    }).count({
      success: (res) => {
        this.setData({
          helpTotalNum: res.total
        })
        wx.setStorageSync('helpTotalNum', this.data.helpTotalNum)
      }
    })
  },

 
  getHelpTotalMoney() {
    db.collection('order').aggregate().match({
      receivePerson: wx.getStorageSync('openid'),
      state: '已完成',
    }).group({
      _id: null,
      totalNum: db.command.aggregate.sum('$money'),
    }).end({
      success: (res) => {
        this.setData({
          helpTotalMoeny: res.list[0].totalNum
        })
        wx.setStorageSync('helpTotalMoeny', this.data.helpTotalMoeny);
      }
    })
  },


  getMyOrder() {
    wx.showLoading({
      title: '加载中',
    })

    db.collection('order').orderBy('createTime', 'desc').where({
      _openid: this.data.openid //查询openid等于自己id的item
    }).get({
      success: (res) => {
    
        const {
          data
        } = res;
        data.forEach(item => {
          if (item.name === "快递代取" && item.info.expressCode) {
            item.expressCode = item.info.expressCode;
          }
          // if (item.name === "快递代取" && item.info.codeImg) {
          //   item.codeImg = item.info.codeImg;
          // }
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          myOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  formatState(state) {
    if (state === '待接单') {
      return 'top_right';
    } else if (state === '已接单') {
      return 'top_right_help';
    } else if (state === '已完成') {
      return 'top_right_finish';
    }
  },

  formatInfo(orderInfo) {
    const {
      name,
      info,
    } = orderInfo;
    if (name === '快递代取') {
      const {
        business,
        size,
      } = info;
      return `快递类型: ${size} -- 快递商家: ${business}  `;
    } 
     else if (name === '外卖跑腿') {
      const {
        helpContent,
        TakeOutAddress
      } = info;
      return `内容: ${helpContent} -- 取货地点: ${TakeOutAddress}`;
    } else if (name === '租借服务') {
      const {
        leaseItem,
        leaseTime,
        deliveryTime
      } = info;
      return `租借物品: ${leaseItem} -- 租借时长: ${leaseTime} -- 预计交货时间: ${deliveryTime}`;
    } else if (name === '一起玩') {
      const {
        gameName,
        gameTime,
        remark
      } = info;
      return `游玩项目: ${gameName} -- 时间: ${gameTime} -- 备注信息: ${remark}`;
    } 
     else if (name === '帮我去') {
      const {
        helpContent
      } = info;
      return `内容: ${helpContent}`;
    } 
  },

  formatDetailInfo(name,detail_info){
    
    const{
      info,
    }=detail_info
    if(name==='快递代取'){
      const{
        business,
        expressCode,
        remark,
        size,
      }=info
      return `快递类型: ${size} -- 快递商家: ${business} -- 取件码：${expressCode} -- 备注信息：${remark}  `;
    }else if(name==='外卖跑腿'){
      const{
        helpContent,
      }=info
      return `外卖的详细信息和备注：${helpContent}`;
    }else if(name==='租借服务'){
      const {
        leaseItem,
        leaseTime,
        deliveryTime
      } = info;
      return `租借物品: ${leaseItem} -- 租借时长: ${leaseTime} -- 预计交货时间: ${deliveryTime}`;
    }else if(name==='一起玩'){
      const {
        gameName,
        gameTime,
        remark
      } = info;
      return `游玩项目: ${gameName} -- 游戏时间: ${gameTime} -- 备注信息: ${remark}`;
    }else if (name === '帮我去') {
      const {
        helpContent
      } = info;
      return `内容: ${helpContent}`;
    } 

  },

  detailInfo(e){
    
    const status=e.currentTarget.dataset.detail_info.state;
    const name=e.currentTarget.dataset.detail_info.name;
    const detailInfo=this.formatDetailInfo(name,e.currentTarget.dataset.detail_info);
    // const detailInfo=e.currentTarget.dataset.detail_info
    if(status==='已接单'){
      wx.navigateTo({
        url: `../orderDetail/orderDetail?detailInfo=${detailInfo}`,
      })
    }
  },

  toFinish(e) {
    wx.showLoading({
      title: '加载中',
    })
    const {
      item
    } = e.currentTarget.dataset;
    const {
      _id
    } = item;
    db.collection('order').doc(_id).update({
      data: {
        state: '已完成'
      },
      success: (res) => {
        this.getMyOrder();
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getPersonPower();
    db.collection('order').orderBy('createTime','desc').get({
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
        
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        
        });
        this.setData({
          orderList: data,
          openid: wx.getStorageSync('openid'),
          isLogin:!!wx.getStorageSync('userInfo'),
        })
        wx.hideLoading();
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '服务器异常~~~',
        })
        wx.hideLoading();
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
    this.onLoad();
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
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    let {
      orderList,
      myOrder,
      rewardOrder,
      helpOrder,
      tabNow,
      openid
    } = this.data;

    if (tabNow === 0) {
      db.collection('order').skip(orderList.length).get({
        success: (res) => {
          if (res.data.length) {
            res.data.forEach(item => {
              item.info = this.formatInfo(item);
              item.stateColor = this.formatState(item.state);
              orderList.push(item);
            })
            this.setData({
              orderList,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '无更多信息',
            })
          }
          wx.hideLoading();
        },
        fail: (error) => {
          wx.showToast({
            icon: 'none',
            title: '服务器出错...',
          })
          wx.hideLoading();
        }
      })
    } else if (tabNow === 1) {
      db.collection('order').skip(myOrder.length).where({
        _openid: openid
      }).get({
        success: (res) => {
          if (res.data.length) {
            const {
              data
            } = res;
            data.forEach(item => {
              item.info = this.formatInfo(item);
              item.stateColor = this.formatState(item.state);
              myOrder.push(item);
            });
            this.setData({
              myOrder,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '无更多信息',
            })
          }
          wx.hideLoading();
        }
      })
    } else if (tabNow === 2) {
      db.collection('order').skip(helpOrder.length).where({
        receivePerson: this.data.openid,
        state:'已完成'
      }).get({
        success: (res) => {
          if (res.data.length) {
            const {
              data
            } = res;
            data.forEach(item => {
              item.info = this.formatInfo(item);
              item.stateColor = this.formatState(item.state);
              helpOrder.push(item);
            });
            this.setData({
              helpOrder,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '无更多信息',
            })
          }
          wx.hideLoading();
        }
      })
    } else if (tabNow === 3) {
      db.collection('order').skip(rewardOrder.length).where({
        state: '待接单'
      }).get({
        success: (res) => {
          if (res.data.length) {
            const {
              data
            } = res;
            data.forEach(item => {
              item.info = this.formatInfo(item);
              item.stateColor = this.formatState(item.state);
              rewardOrder.push(item);
            });
            this.setData({
              rewardOrder,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '无更多信息',
            })
          }
          wx.hideLoading();
        }
      })
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})