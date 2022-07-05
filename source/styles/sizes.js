import { Dimensions, StatusBar } from 'react-native';
// import { handler } from '@redux';
import dim from './dimension';

const pdph = 1.5;

function em(ph, pd = null, floor = true) {
  var res = (dim.is_phone ? ph : (((pd === 0 || pd) ? pd : null) || ph * pdph)) * dim.rate;
  if (floor) res = Math.floor(res);
  return res;
}
function em1(ph, pd = null, floor = true) {
  var res = (dim.is_phone ? ph : (((pd === 0 || pd) ? pd : null) || ph * pdph)) * dim.rate1;
  if (floor) res = Math.floor(res);
  return res;
}

const sizes = {
  ...dim,
  is_portrait: true,
  is_landscape: false,
  em,
  em1,

  screen: {
    width: dim.screenWidth,
    height: dim.screenHeight,
  },

  pad: em(8),
  pad1: em(5),
  statusbar: dim.is_ios ? (dim.is_iphonexx ? 44 : 20) : 0, // eslint-disable-line
  navbar: em(58),
  safeb: dim.is_ios && dim.is_iphonexx ? 34 : 0,
  safeb1: dim.is_ios && dim.is_iphonexx ? 24 : 0,
};

sizes.window = sizes.screen;
sizes.updateWindow = (size) => {
  if (sizes.is_android) size.height -= StatusBar.currentHeight;

  console.log('updateWindow: ', size);
  sizes.window = size;
  sizes.is_portrait = size.width < size.height;
  sizes.is_landscape = size.width > size.height;
  //handler.main.update.size();
}
sizes.updateWindow(Dimensions.get('window'));

Dimensions.addEventListener('change', (size) => {
  if (!sizes.is_ios) return;

  if (size.window) sizes.updateWindow(size.window);
  else sizes.updateWindow(size);
});

export default sizes;
