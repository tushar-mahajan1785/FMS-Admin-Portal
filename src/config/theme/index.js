import { createTheme } from "@mui/material/styles";

const mode = 'light' // "dark" for dark mode
const whiteColor = '#FFF'
const lightColor = '#2F2B3D'
const darkColor = '#D0D4F1'
const darkPaperBgColor = '#2F3349'
const mainColor = mode === 'light' ? lightColor : darkColor


const theme = createTheme({
  palette: {
    mode: mode,
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C',
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072'
    },
    secondary: {
      light: '#B2B4B8',
      main: '#A8AAAE',
      dark: '#949699'
    },
    background: {
      default: "#f2f2f2",
      light: "#ffffff",
      dark: "#121212",
    },
    text: {
      primary: "#101828",
      secondary: "#535862",
      disabled: "#FDFDFD"
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC'
    },
    common: {
      black: '#000',
      white: '#fff'
    },
    grey: {
      25: "#FDFDFD",
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E9EAEB",
      300: "#D5D7DA",
      400: "#A4A7AE",
      500: "#717680",
      secondary: "#535862",
      650: '#767676',
      700: "#414651",
      800: "#252B37",
      primary: "#101828"
    },
    primary: {
      25: "#FCFAFF",
      50: "#F9F5FF",
      100: "#F4EBFF",
      200: "#E9D7FE",
      300: "#D6BBFB",
      400: "#B692F6",
      500: "#9E77ED",
      600: "#7F56D9",
      700: "#6941C6",
      800: "#53389E",
      900: "#42307D"
    },
    success: {
      25: "#F6FEF9",
      50: "#ECFDF3",
      100: "#D1FADF",
      200: "#A6F4C5",
      300: "#6CE9A6",
      400: "#32D583",
      500: "#12B76A",
      600: "#039855",
      700: "#027A48",
      800: "#05603A",
      900: "#054F31"
    },
    warning: {
      25: "#FFFCE5",
      50: "#FFFAEB",
      100: "#FEF0C7",
      200: "#FEDF89",
      300: "#FEC84B",
      400: "#FDB022",
      500: "#F79009",
      600: "#DC6803",
      700: "#B54708",
      800: "#93370D",
      900: "#7A2E0E"
    },
    error: {
      25: "#FFFBFA",
      50: "#FEF3F2",
      100: "#FEE4E2",
      200: "#FECDCA",
      300: "#FDA29B",
      400: "#F97066",
      500: "#F04438",
      600: "#D92D20",
      700: "#B42318",
      800: "#912018",
      900: "#7A271A"
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.06)`,
      selectedOpacity: 0.06,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "Avenir",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;
