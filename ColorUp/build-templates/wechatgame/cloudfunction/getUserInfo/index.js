// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    var record = await cloud.database().collection('highestScore').doc(event.userInfo.openId).get();
    event.userInfo.highestScore = record.data.score;
  } catch(error) {
    event.userInfo.highestScore = 0;
    console.error(error);
  }

  return event.userInfo;

}