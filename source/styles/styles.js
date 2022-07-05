import sizes from './sizes';

const pad = sizes.pad;
const pad1 = sizes.pad1;

const align = {
  content_center: {
    justifyContent: 'center',
  },
  content_start: {
    justifyContent: 'flex-start',
  },
  content_end: {
    justifyContent: 'flex-end',
  },
  content_between: {
    justifyContent: 'space-between',
  },
  content_around: {
    justifyContent: 'space-around',
  },
  item_center: {
    alignItems: 'center',
  },
  item_start: {
    alignItems: 'flex-start',
  },
  item_end: {
    alignItems: 'flex-end',
  },
  item_stretch: {
    alignItems: 'stretch',
  },
  self_center: {
    alignSelf: 'center',
  },
  self_start: {
    alignSelf: 'flex-start',
  },
  self_end: {
    alignSelf: 'flex-end',
  },
  self_stretch: {
    alignSelf: 'stretch',
  },
};

const styles = {
  ...align,

  center: {
    ...align.content_center,
    ...align.item_center,
  },
  center_stretch: {
    ...align.content_center,
    ...align.item_stretch,
  },
  center_start: {
    ...align.content_center,
    ...align.item_start,
  },
  center_end: {
    ...align.content_center,
    ...align.item_end,
  },
  start_center: {
    ...align.content_start,
    ...align.item_center,
  },
  start_stretch: {
    ...align.content_start,
    ...align.item_stretch,
  },
  start_start: {
    ...align.content_start,
    ...align.item_start,
  },
  start_end: {
    ...align.center_start,
    ...align.item_end,
  },
  end_center: {
    ...align.content_end,
    ...align.item_center,
  },
  end_stretch: {
    ...align.content_end,
    ...align.item_stretch,
  },
  end_start: {
    ...align.content_end,
    ...align.item_start,
  },
  end_end: {
    ...align.content_end,
    ...align.item_end,
  },
  between_center: {
    ...align.content_between,
    ...align.item_center,
  },
  between_stretch: {
    ...align.content_between,
    ...align.item_stretch,
  },
  between_start: {
    ...align.content_between,
    ...align.item_start,
  },
  between_end: {
    ...align.content_between,
    ...align.item_end,
  },
  around_center: {
    ...align.content_around,
    ...align.item_center,
  },
  around_stretch: {
    ...align.content_around,
    ...align.item_stretch,
  },
  around_start: {
    ...align.content_around,
    ...align.item_start,
  },
  around_end: {
    ...align.content_around,
    ...align.item_end,
  },

  flex_row: {
    flexDirection: 'row',
  },
  flex_col: {
    flexDirection: 'column',
  },
  flex_wrap: {
    flexWrap: 'wrap',
  },

  match_parent: {
    ...align.self_stretch,
    flex: 1,
  },
  absolute_full: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  absolute: {
    position: 'absolute',
  },
  absolute_top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  absolute_bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  bg_transparent: {
    backgroundColor: 'transparent',
  },
  bg_white: {
    backgroundColor: 'white',
  },
  bg_black: {
    backgroundColor: 'black',
  },
  text_white: {
    color: 'white',
  },
  text_black: {
    color: 'black',
  },
  text_center: {
    textAlign: 'center',
  },
  text_left: {
    textAlign: 'left',
  },
  text_right: {
    textAlign: 'right',
  },
  text_justify: {
    textAlign: 'justify',
  },
  text_bold: {
    fontWeight: '700',
  },
  text_normal: {
    fontWeight: '400',
  },
  text_semibold: {
    fontWeight: '600',
  },
  text_light: {
    fontWeight: '200',
  },
  text_medium: {
    fontWeight: '500',
  },
  text_italic: {
    fontStyle: 'italic',
  },
  text_underline: {
    textDecorationLine: 'underline',
  },
  text_midline: {
    textDecorationLine: 'line-through',
  },
  text_doubleline: {
    textDecorationLine: 'underline line-through',
  },
  font_normal: {
    fontFamily: 'Avenir Next',
  },
  font_standard: {
    fontFamily: 'Open Sans',
  },
  font_lato: {
    fontFamily: 'Lato',
  },
  font_avenir: {
    fontFamily: 'Avenir Next',
  },
  font_rocksalt: {
    fontFamily: 'Rock Salt',
  },
  font_poppins: {
    fontFamily: 'Poppins',
  },
  font_mont: {
    fontFamily: 'Montserrat',
  },

  m_status: {
    marginTop: sizes.statusbar,
  },
  p_status: {
    paddingTop: sizes.statusbar,
  },
  m_safeb: {
    marginBottom: sizes.safeb,
  },
  p_safeb: {
    paddingBottom: sizes.safeb,
  },
  m_safeb1: {
    marginBottom: sizes.safeb1,
  },
  p_safeb1: {
    paddingBottom: sizes.safeb1,
  },

  icon_24: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  flex: {
    flex: 1,
  },
  fullwidth: {
    width: '100%',
  },
  hidden: {
    overflow: 'hidden',
  },
};

const tags1 = ['m', 'ml', 'mr', 'mt', 'mb', 'mh', 'mv', 'p', 'pl', 'pr', 'pt', 'pb', 'ph', 'pv'];
const tags2 = ['margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'marginHorizontal', 'marginVertical',
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'paddingHorizontal', 'paddingVertical'];
const tags3 = ['none', 'xls', 'xs', 'sm', 'md', 'lg', 'xlg'];

var i, k;
for (i = 0; i < tags3.length; i += 1) {
  for (k = 0; k < tags1.length; k += 1) {
    const style = {};
    style[tags2[k]] = pad * i;
    styles[`${tags1[k]}_${tags3[i]}`] = style;
  }
}

for (i = 1; i < 13; i += 1) {
  for (k = 0; k < tags1.length; k += 1) {
    const style = {};
    style[tags2[k]] = pad1 * i;
    styles[`${tags1[k]}_${i}x`] = style;
  }
}

styles.f_color = color => ({ color });
styles.f_flex = flex => ({ flex });
styles.f_flexGrow = flexGrow => ({ flexGrow });
styles.f_width = width => ({ width });
styles.f_height = height => ({ height });
styles.f_minWidth = minWidth => ({ minWidth });
styles.f_maxWidth = maxWidth => ({ maxWidth });
styles.f_minHeight = minHeight => ({ minHeight });
styles.f_maxHeight = maxHeight => ({ maxHeight });
styles.f_bg = backgroundColor => ({ backgroundColor });
styles.f_border = borderColor => ({ borderColor });
styles.f_borderRadius = borderRadius => ({ borderRadius });
styles.f_borderWidth = borderWidth => ({ borderWidth });
styles.f_borderBototm = borderBottomColor => ({ borderBottomColor });
styles.f_borderBottomWidth = borderBottomWidth => ({ borderBottomWidth });
styles.f_borderTopWidth = borderTopWidth => ({ borderTopWidth });
styles.f_borderTopRadius = radius => ({ borderTopLeftRadius: radius, borderTopRightRadius: radius });
styles.f_borderRightRadius = radius => ({ borderTopRightRadius: radius, borderBottomRightRadius: radius });
styles.f_borderRight = borderRightColor => ({ borderRightColor });
styles.f_borderLeft = borderLeftColor => ({ borderLeftColor })
styles.f_borderLeftRadius = radius => ({ borderTopLeftRadius: radius, borderBottomLeftRadius: radius });
styles.f_ml = marginLeft => ({ marginLeft });
styles.f_mr = marginRight => ({ marginRight });
styles.f_mb = marginBottom => ({ marginBottom });
styles.f_mt = marginTop => ({ marginTop });
styles.f_mh = marginHorizontal => ({ marginHorizontal });
styles.f_mv = marginVertical => ({ marginVertical });
styles.f_p = padding => ({ padding });
styles.f_ph = paddingHorizontal => ({ paddingHorizontal });
styles.f_pv = paddingVertical => ({ paddingVertical });
styles.f_pt = paddingTop => ({ paddingTop });
styles.f_pl = paddingLeft => ({ paddingLeft });
styles.f_pr = paddingRight => ({ paddingRight });
styles.f_pb = paddingBottom => ({ paddingBottom });
styles.f_top = top => ({ top });
styles.f_bottom = bottom => ({ bottom });
styles.f_left = left => ({ left });
styles.f_right = right => ({ right });
styles.f_opacity = opacity => ({ opacity });
styles.f_position = position => ({ position });
styles.f_zIndex = zIndex => ({ zIndex });
styles.f_transform = transform => ({ transform });
styles.f_fontSize = fontSize => ({ fontSize });

export default styles;
