// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  
  var db = cloud.database();

  var docId = event.userInfo.openId;
  var record;
  try {
    var result = await db.collection('highestScore').doc(docId).get();
    record = result.data;
  } catch (error) {
  }
  var result = { score : event.score };
  if (record) {
    result.type = 'update';
    result.result = await db.collection('highestScore').doc(docId).update({
      data: { score: event.score, }
    });
  } else {
    result.type = 'add';
    result.result = await db.collection('highestScore').add({
      data: {
        _id: docId,
        score: event.score,
      }
    });
  }
  return result;

}