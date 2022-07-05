import Meteor from 'react-native-meteor'

export const toggleVideoLike = (videoId) => {
  Meteor.call("toggle.video.like", {videoId}, (error, result) => {
    console.log("error : ", error);
  });
};

