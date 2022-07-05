const logo = require('./images/richTV.png');
const threePv2Logo = require('./images/threePv2Logo.png');
const threePHeaderLogo = require('./images/3p-header-logo.png');

const baseSize = 8;
const textBaseSize =  baseSize / 2;
const spacingBaseSize = baseSize;

export const colors = { // Move this on seperate file
  core: {
    primary: "#153552",
    secondary: "#ffffff",
    tertiary: "#ff3200",
  },
  accent: {
    primary: "#f05a20",
    secondary: "#3c3e43",
    tertiary: "#000000",
  },
  border: {
    primary: "#2e2e31",
    secondary: "#7b7a7d",
    tertiary: "#a5a5a6",
  },
  text: {
    primary: "#ffffff",
    secondary: "#153552",
    tertiary: "#3f3f3f",
  },
  input: {
    primary: "#ffffff",
    secondary: "#8495a3",
    tertiary: "#a5a5a6",
  },
  placeholder: {
    primary: "#a2a8b4",
  },
  buttons: {
    primary: "#ffffff",
    secondary: "#153552",
    tertiary: "#212124",
  },
  actions: {
    success: "#88c459",
    error: "#f05a20",
    warning: "#f89546",
  },
  icon: {
    primary: "#ffffff",
    secondary: "#808080",
  },
};

export const sizes = {
  baseSize,
  textBaseSize,
  spacingBaseSize,
  button: baseSize * 7,
  button2: baseSize * 5,
  buttonCircle: baseSize * 6,
  input: baseSize * 7,
  input2: baseSize * 5,
  borderRadius: baseSize,
  borderRadius2: baseSize * 5,
  header: baseSize * 13,
};

export const spacing = {
  xxs: sizes.spacingBaseSize / 2,
  xs: sizes.spacingBaseSize,
  sm: sizes.spacingBaseSize * 2,
  md: sizes.spacingBaseSize * 3,
  lg: sizes.spacingBaseSize * 4,
  xl: sizes.spacingBaseSize * 5,
  xxl: sizes.spacingBaseSize * 6,
  xxxl: sizes.spacingBaseSize * 7,
};

const DARK_COLOR_1 = "#212124";
const DARK_COLOR_2 = "#55e184";
const DARK_COLOR_3 = "#7949FF";
const DARK_COLOR_4 = "#DDE4F9";
const DARK_COLOR_5 = "#888888";
const DARK_COLOR_6 = "#0FF14E";
const DARK_COLOR_7 = "#2f3237";
const DANGER = "#f85342";

const DIMGRAY = "#676770";
const MANGOTANGO = '#FF7D34';

export const darkTheme = {
  MODE: 'dark',
  LOGO: logo,
  HEADER_LOGO: threePHeaderLogo,
  STATUS_BAR_STYLE: "light-content",
  BORDER_RADIUS: 10,
  // Sections
  BACKGROUND_COLOR: DARK_COLOR_1,
  BORDER_COLOR: DARK_COLOR_5,
  // Header
  HEADER_BACKGROUND_COLOR: DARK_COLOR_7,
  HEADER_TEXT_COLOR: DARK_COLOR_4,
  HEADER_ICON_COLOR: DARK_COLOR_4,
  HEADER_BORDER_COLOR: DARK_COLOR_7,
  // Text
  TEXT_COLOR_1: DARK_COLOR_4,
  TEXT_COLOR_2: DARK_COLOR_5,
  TEXT_COLOR_3: DARK_COLOR_2,
  TEXT_COLOR_4: DARK_COLOR_6,
  TEXT_COLOR_5: DARK_COLOR_3,
  LINK_COLOR: DARK_COLOR_6,
  HEADER_COLOR: DARK_COLOR_4,
  DESCRIPTION_COLOR: DARK_COLOR_5,
  ERROR_TEXT: MANGOTANGO,
  // Icons
  ICON_COLOR_1: DARK_COLOR_4,
  ICON_COLOR_2: DARK_COLOR_5,
  ICON_COLOR_3: DARK_COLOR_3,
  // Buttons
  BUTTON_COLOR_1: DARK_COLOR_2,
  BUTTON_COLOR_2: DARK_COLOR_3,
  BUTTON_COLOR_3: DARK_COLOR_4,
  BUTTON_COLOR_4: DARK_COLOR_5,
  BUTTON_BORDER_COLOR: DARK_COLOR_1,
  BUTTON_TEXT_COLOR: DARK_COLOR_4,
  BUTTON_TEXT_COLOR_2: DARK_COLOR_3,
  BUTTON_HEIGHT: 48,
  BUTTON_BORDER_RADIUS: 8,
  // Inputs
  INPUT_COLOR_1: DARK_COLOR_1,
  INPUT_COLOR_2: DARK_COLOR_5,
  INPUT_BORDER_COLOR: DARK_COLOR_5,
  ACTIVE_INPUT_BORDER_COLOR: DARK_COLOR_2,
  INPUT_TEXT_COLOR_1: "white",
  INPUT_TEXT_COLOR_2: DARK_COLOR_5,
  INPUT_PLACEHOLDER_COLOR_1: DARK_COLOR_5,
  INPUT_PLACEHOLDER_COLOR_2: DARK_COLOR_5,
  INPUT_BORDER_RADIUS: 10,
  INPUT_HEIGHT: 46,
  // Accordion
  ACCORDION: DARK_COLOR_7,
  // Colors
  DARK_COLOR_1,
  DARK_COLOR_2,
  DARK_COLOR_3,
  DARK_COLOR_4,
  DARK_COLOR_5,
  DARK_COLOR_7,
  DANGER,
  colors,
  sizes,
  spacing,
};


// export const darkTheme = {
//   mode: 'dark',
//   PRIMARY_BACKGROUND_COLOR: MAIN_DARK_1,
//   PRIMARY_TEXT_COLOR: DARK_TEXT_COLOR,
//   SECONDARY_TEXT_COLOR: MAIN_DARK_3,
//   PRIMARY_BUTTON_COLOR: MAIN_DARK_2,
//   PRIMARY_BUTTON_TEXT_COLOR: DARK_TEXT_COLOR,
//   INPUT_COLOR: INPUT_COLOR,
//   INPUT_TEXT_COLOR: MAIN_DARK_2,
//   SECONDARY_COLOR: MAIN_DARK_3,
//   DRAWER_COLOR: MAIN_DARK_2,
//   DRAWER_TEXT_COLOR: DARK_TEXT_COLOR,
//   LOGOUT_TEXT_COLOR: MAIN_DARK_3,
//   ICON_COLOR: DARK_ICON_COLOR,
//   logo,
//   STATUS_BAR_STYLE: "light-content",
// };

export const lightTheme = {
  mode: 'light',
  PRIMARY_BACKGROUND_COLOR: "#ffffff",
  PRIMARY_TEXT_COLOR: "#212121",
  PRIMARY_BUTTON_COLOR: "#8022d9",
  PRIMARY_BUTTON_TEXT_COLOR: "#ffffff",
  STATUS_BAR_STYLE: "default",
  logo
};
// const Block = styled.View`
//   height: 100px;
// 	color: #fff;
// 	background: red;
// 	${p => p.secondary && css`
//      height: 150px;
//      color: palevioletred
//   `};
// 	${p => p.primary && css`
//      background: yellow;
//      color: palevioletred
//   `};
// `;
