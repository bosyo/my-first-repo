import Meteor from 'react-native-meteor'
import projectApi from "../../project";

const videosAPI = {};

videosAPI.call = function (...args) {
  const arrArgs = [].slice.call(args)
  const method = args[0]
  return new Promise((resolve, reject) => {
    try {
      arrArgs.push((err, res) => {
        if (err) {
          console.log(`${method} failed - 1. error: `, err)
          reject(err)
        } else {
          console.log(`${method} success. result: `, res)
          resolve(res)
        }
      })

      // console.log(`request ${method}, args: `, args)
      Meteor.call.apply(null, arrArgs)
    } catch (err) {
      console.log(`${method} failed - 2. error: `, err)
      try {
        reject(err)
      } catch (err1) {
        console.log(`${method} failed - 3. error: `, err1)
      }
    }
  })
}

videosAPI.getAWSCredentials = async function () {
  const response = await this.call('get.aws.credentials');
  return response
};

videosAPI.addVideo = async function (params) {
  const response = await this.call('add.video', params);
  return response
};

videosAPI.deleteVideo = async function (params) {
  const response = await this.call('delete.video', params);
  return response
};

videosAPI.updateUploadVidStatus = async function (params) {
  const response = await this.call('update.video.upload.status', params);
  return response
};


export default videosAPI
