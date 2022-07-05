/* global isNaN */
/* eslint no-restricted-globals: ["error", "event"] */

import { findNodeHandle, AsyncStorage } from 'react-native';
// import * as mimetype from 'react-native-mime-types';
// import moment from 'moment';
// import numeral from 'numeral';
import _ from 'lodash';
// import AppConfig from '@app/config';

// const UIManager = require('NativeModules').UIManager;

class g {
}

g.isNull = function (obj) {
  return typeof obj === 'undefined' || obj === null;
};
g.isNotNull = function (obj) {
  return typeof obj !== 'undefined' && obj !== null;
};

g.isEmpty = function (str) {
  if (g.isNull(str) || !str.length) return true;
  return false;
};

g.ifNull = function (obj, ifval) {
  return g.isNull(obj) ? ifval : obj;
};
g.ifEmpty = function (obj, ifval) {
  if (g.isNull(obj) || obj.length === 0) return ifval;
  return `${obj}`;
};
g.ifTrue = function (cond, tval, fval) {
  return cond ? tval : fval;
};
g.isEqual = function (obj1, obj2) {
  if (g.isNull(obj1) && g.isNull(obj2)) return true;
  return obj1 === obj2;
};

g.isString = function (obj) {
  return typeof obj === 'string' || obj instanceof String;
};

g.isEqualFrame = function (f1, f2) {
  return f1 && f2 && f1.x === f2.x && f1.y === f2.y &&
    f1.width === f2.width && f1.height === f2.height;
};

g.formatCount = function (count, unit, pl = 's') {
  return `${count}${unit}${count > 1 ? pl : ''}`;
};

// g.formatCount2 = function (count) {
//   if (!count || count < 100) return `${count || 0}`;
//   if (count < 100 * 1000) return `${numeral(count / 1000).format('0.0')}k`;
//   return `${numeral(count / 10000000).format('0.0')}M`;
// };
//
// g.formatCurrencyDec = function (price, format = '$0,0') {
//   const nprice = numeral(g.floor(price, 0));
//   return nprice.format(format);
// };
// g.formatCurrencyUnd = function (price, format = '00') {
//   var decimals = format.length;
//   const dec = Math.floor(price);
//   const und = (Number(Math.round(price + 'e' + decimals) + 'e-' + decimals) - dec) * 100;
//   return numeral(und).format(format);
// };

g.padZero = function (format, pad) {
  if (g.isNull(pad)) return format;
  let newfmt = g.ifEmpty(format, '');
  for (let i = 0; i < pad || 0; i += 1) {
    newfmt += '0';
  }
  return newfmt;
};

g.parseFloat = (str) => {
  if (g.isEmpty(str)) return 0;
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return num;
};

// g.formatNumber = function (num, format, decimal) {
//   return numeral(num).format(g.padZero(format, decimal));
// };
//
// g.normalizeNumber = function (num, mindecimal = 2, format = '0,0.0000000000') {
//   let str = `${num}`;
//   if (format && format.length) {
//     str = numeral(num).format(format);
//   }
//
//   let point = str.indexOf('.');
//   if (point >= 0) {
//     let lastIndex = str.length - 1;
//     for (let i = lastIndex; i >= point; i -= 1) {
//       if (str.charAt(i) !== '0') {
//         lastIndex = i;
//         break;
//       }
//     }
//     if (lastIndex === point) lastIndex = point - 1;
//     str = str.slice(0, lastIndex + 1);
//   }
//
//   if (mindecimal > 0) {
//     point = str.indexOf('.');
//     if (point < 0 || str.length - point - 1 < mindecimal) {
//       const fmt = g.padZero('0.', mindecimal);
//       return numeral(str).format(fmt);
//     }
//   }
//   return str;
// };

g.round = function (value, place) {
  const pow = Math.pow(10, place || 0); // eslint-disable-line
  const val = Math.round(value * pow) / pow;
  return val.toFixed(place);
};

g.floor = function (value, place) {
  const pow = Math.pow(10, place || 0); // eslint-disable-line
  const val = Math.floor(value * pow) / pow;
  return val.toFixed(place);
};

g.random = function () {
  return Math.floor(Math.random() * 0x7FFFFFFF);
};

g.formatTime = function (secs) {
  let minutes = parseInt(secs / 60, 10);
  const seconds = secs % 60;
  if (minutes >= 60) {
    const hours = parseInt(minutes / 60, 10);
    minutes %= 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

g.formatSeconds = function (secs) {
  const minutes = parseInt(secs / 60, 10);
  if (secs < 60) {
    return `${secs} seconds`;
  } else if (minutes === 1) {
    return '1 minute';
  }
  return `${minutes} minutes`;
};

// g.formatDayTime = function (date) {
//   const secs = g.elapsed(date);
//   if (secs < 3600) {
//     const minutes = secs < 60 ? 1 : parseInt(secs / 60, 10);
//     return `${minutes} minutes ago`;
//   } else if (secs < 3600 * 24) {
//     const hours = parseInt(secs / 3600, 10);
//     return `${hours} hours ago`;
//   }
//   const mdate = moment(date);
//   return `at ${mdate.format('MMM D, YYYY')}`;
// };

// g.fromNow = function (date) {
//   const fromnow = moment(date).fromNow();
//   return fromnow;
// };
//
// g.dateDiffrent = function (date, flag) {
//   const a = moment(date);
//   if (flag === 'expiresIn') {
//     return (30 + a.diff(moment(), 'days'));
//   }
//   return moment().diff(a, 'days');
// };

// g.getContentType = function (file) {
//   return mimetype.lookup(file);
// };

g.getS3Url = function (name, bucket) {
  if (g.isNull(name)) return null;
  if (name.indexOf('://') !== -1) return name;

  return `https://s3-us-west-2.amazonaws.com/${bucket || AppConfig.s3.bucket}/${name}`;
};

g.normalizeFileUrl = function (url) {
  let file = url;
  if (file.substring(0, 6) === 'file:/' && file.substring(0, 7) !== 'file://') {
    file = file.replace(/file:\//i, 'file:///');
  }
  return file;
};

g.fileUrl = function (url) {
  if (!url || !url.length) return null;
  if (url.startsWith('file:///')) return url;
  if (url.startsWith('//')) return `file:${url}`;
  return `file://${url}`;
};

g.getFileName = function (url) {
  return url.split(/(\\|\/)/g).pop().split('?')[0];
};

g.getFileExt = function (url, defext) {
  const name = g.getFileName(url);
  const exts = name.split('.');
  if (exts.length <= 1) return defext;

  return exts.pop().toLowerCase();
};

g.splitName = function (name) {
  const firstName = name.split(' ').slice(0, -1).join(' '); // returns "Paul Steve"
  const lastName = name.split(' ').slice(-1).join(' ');
  return {
    firstName, lastName,
  };
};

g.elapsed = function (date) {
  if (!date || !(date instanceof Date)) return 0;
  const cur = new Date();
  return parseInt((cur.getTime() - date.getTime()) / 1000, 10);
};

// g.age = function (date) {
//   if (!date) return 0;
//   const mnow = moment(new Date());
//   const mdate = moment(date);
//   return mnow.diff(mdate, 'years');
// };

g.getMDFileUrl = function (file: Object) {
  if (!file) return null;
  return file.url || file.Location;
};

g.findMDFile = function (files: Array, type: String = undefined) {
  if (!files) return null;
  if (files.length <= 0) return null;
  if (!type) return files[0];

  return files.find(file => file.type === type);
};

g.findMDFileUrl = function (files: Array, type: String = undefined) {
  const file = g.findMDFile(files, type);
  return g.getMDFileUrl(file);
};

g.date = {};
// g.date.day_of_week = function (date) {
//   const mdate = moment(date || (new Date()));
//   return parseInt(mdate.format('e'), 10);
// };

g.location = {};
g.location.latlng = function (loc) {
  if (!loc) return {};
  if (loc.coordinates && loc.coordinates.length) {
    return { lat: loc.coordinates[1], lng: loc.coordinates[0] };
  }
  if (loc.coords && g.isNotNull(loc.coords.latitude)) {
    return { lat: loc.coords.latitude, lng: loc.coords.longitude };
  }
  if (g.isNotNull(loc.latitude)) {
    return { lat: loc.latitude, lng: loc.longitude };
  }
  return loc;
};
g.location.latlng2 = function (loc) {
  if (!loc) return {};
  const loc2 = g.location.latlng(loc);
  return { latitude: loc2.lat, longitude: loc2.lng };
};
g.location.is_valid_address = function (data) {
  return data.length || (data.data && data.data.results && data.data.results.length) ||
    (data.results && data.results.length);
};
g.location.address_from_google = function (data, type) {
  let place = null;
  if (data.length) place = data;
  else if (data.data && data.data.results && data.data.results.length) place = data.data.results;
  else if (data.results && data.results.length) place = data.results;
  else if (data.result) place = [data.result];
  else return '';

  place = place[0];
  if (!place.address_components) return '';
  const comps = place.address_components;

  let streetNumber, streetAddress, route, neighbor, zip, state, city, country;

  _.each(comps, (comp) => {
    _.each(comp.types || [], (addrType) => {
      if (addrType === 'street_number') streetNumber = comp;
      else if (addrType === 'street_address') streetAddress = comp;
      else if (addrType === 'route') route = comp;
      else if (addrType === 'neighborhood') neighbor = comp;
      else if (addrType === 'locality') city = comp;
      else if (addrType === 'administrative_area_level_1') state = comp;
      else if (addrType === 'country') country = comp;
      else if (addrType === 'postal_code') zip = comp;
    });
  });

  if (type === 'formatted') {
    if (place.formatted_address && place.formatted_address.length) return place.formatted_address;
    type = 'street,city,state,zip,country';
  }

  let addr = '';
  if (!type) type = 'street,state,zip';
  if (type.indexOf('street') >= 0) {
    if (streetNumber && streetAddress) addr = `${streetNumber.long_name} ${streetAddress.long_name}`;
    else if (streetAddress) addr = streetAddress.long_name;
    else if (streetNumber && route) addr = `${streetNumber.long_name} ${route.long_name}`;
    else if (route) addr = route.long_name;
    else if (neighbor) addr = neighbor.long_name;
  }
  if (type.indexOf('city') >= 0) {
    if (city && addr.length) addr = `${addr}, ${city.long_name}`;
    else if (city) addr = city.long_name;
  }
  if (type.indexOf('state') >= 0) {
    if (state && addr.length) addr = `${addr}, ${state.short_name}`;
    else if (state) addr = state.short_name;
  }
  if (type.indexOf('zip') >= 0) {
    if (zip && addr.length) addr = `${addr} ${zip.long_name}`;
    else if (zip) addr = zip.long_name;
  }
  if (type.indexOf('country') >= 0) {
    if (country && addr.length) addr = `${addr}, ${country.long_name}`;
    else if (country) addr = country.long_name;
  }

  return addr;
};

g.deepValue = function (obj, key, defval) {
  if (!obj || g.isEmpty(`${key}`)) return defval;

  const keys = `${key}`.split('.');
  let value = null;
  let nextkey, nextobj = obj;
  for (let i = 0; i < keys.length; i += 1) {
    const newkey = g.isEmpty(nextkey) ? keys[i] : `${nextkey}.${keys[i]}`;
    const newobj = nextobj[newkey];
    if (newobj && i === keys.length - 1) {
      value = newobj;
    } else if (newobj) {
      nextobj = newobj;
      nextkey = null;
    } else {
      nextkey = newkey;
    }
  }
  return g.ifNull(value, defval);
};

g.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};
g.clampMax = function (value, max) {
  return Math.min(value, max);
};
g.clampMin = function (value, min) {
  return Math.max(value, min);
};
g.clampIndex = function (value, array) {
  return g.clamp(value, 0, ((array && array.length) || 1) - 1);
};

g.calcLayout = function (view) {
  return new Promise((resolve) => {
    const handle = findNodeHandle(view);
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      resolve({ x, y, width, height, pageX, pageY });
    });
  });
};

g.fullName = function (name, lastName) {
  const capitalize = (s) => { // Todo: Add to helper
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
  };
  const fname = capitalize(name);
  const lname = capitalize(lastName);
  let fullName = `${fname} ${lname}`;
  return fullName;
};
g.asyncSet = async function (key, value) {
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('AsyncStorage#setItem error: ' + error.message);
    }
};
g.asyncGet = async function (key) {
  return await AsyncStorage.getItem(key)
    .then((result) => {
      if (result) {
        try {
          result = JSON.parse(result);
        } catch (e) {
          console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
        }
      }
      return result;
    });
};
g.asyncRemove = async function (key) {
  return await AsyncStorage.removeItem(key);
};
g.capitalize = function (string) {
  return string.toUpperCase();
};
g.elipsis = function (string, max) {
  let stringWithElipsis = string;
  if (string.length > max) {
    stringWithElipsis = string.substring(0, max - 3) + '...'
  }
  return stringWithElipsis
};
export default g;