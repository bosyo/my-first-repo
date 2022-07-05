import { StyleSheet } from 'react-native';
import colors from './colors';
import sizes from './sizes';
import bs from './styles';

const styles = {
  navigation: {
    ...bs.p_status,
    ...bs.bg_white,
    ...bs.flex_row,
    ...bs.start_center,
    height: sizes.statusbar + sizes.em(50),
    borderBottomColor: '#DEE1E8',
    borderBottomWidth: 1,
    zIndex: 1000,
    borderBottomLeftRadius: sizes.em(10),
    borderBottomRightRadius: sizes.em(10),
  },

  navigation_shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: sizes.em(1) },
    shadowOpacity: 0.1,
    shadowRadius: sizes.em(8),
  },

  bottom_shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: sizes.em(-1) },
    shadowOpacity: 0.1,
    shadowRadius: sizes.em(8),
  },
  nav_title: {
    ...bs.ml_4x,
    ...bs.flex,
  },
  nav_right: {
    ...bs.center,
    ...bs.mr_4x,
  },

  btn_blue: {
    ...bs.center,
    backgroundColor: '#29BAAC',
    borderRadius: sizes.em(4),
    height: sizes.em(50),
    shadowColor: 'rgba(48, 181, 168)',
    shadowOffset: { width: 0, height: sizes.em(10) },
    shadowOpacity: 0.3,
    shadowRadius: sizes.em(16),
  },
  btn_blue_disable: {
    opacity: 0.3,
  },

  edit_question: {
    ...bs.ph_2x,
    height: sizes.em(50),
    borderRadius: sizes.em(4),
    backgroundColor: '#fff',
    borderColor: '#DFE2E8',
    borderWidth: 1,
    overflow: 'hidden',
  },
  edit_question_focus: {
    borderColor: '#29BAAC',
  },
  edit_question_required: {
    borderColor: '#ba2929',
  },
  edit_question_currency: {
    ...bs.self_stretch,
    width: sizes.em(45),
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderRightColor: '#DFE2E8',
  },

  quest_section: {
    ...bs.self_stretch,
    borderBottomLeftRadius: sizes.em(10),
    borderBottomRightRadius: sizes.em(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: sizes.em(1) },
    shadowOpacity: 0.1,
    shadowRadius: sizes.em(8),
    backgroundColor: '#fff',
  },

  quest_card: {
    ...bs.self_stretch,
    ...bs.mt_2x,
    ...bs.mh_2x,
    ...bs.ph_3x,
    ...bs.pt_2x,
    ...bs.pb_3x,
    borderRadius: sizes.em(5),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: sizes.em(1) },
    shadowOpacity: 0.1,
    shadowRadius: sizes.em(4),
  },
};

export default styles;
