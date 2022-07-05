import Meteor from 'react-native-meteor'

const userAPI = {};

userAPI.call = function (...args) {
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

userAPI.register = async function (country, email, password, role) {
  const response = await this.call('user.register', {country, email, password, role});
  return response
};

export default userAPI
