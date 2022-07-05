import Meteor from 'react-native-meteor';

export const addVideoComment = (data) => {
  return new Promise(resolve => {
    Meteor.call('add.video.comment', data, (err, res) => {
      if (err) {
        resolve(err)
      } else {
        resolve(res)
      }
    });
  });
};

export const deleteComment = (data) => {
  return new Promise(resolve => {
    Meteor.call('delete.video.comment', data, (err, res) => {
      if (err) {
        resolve(err)
      } else {
        resolve(res)
      }
    });
  });
};
