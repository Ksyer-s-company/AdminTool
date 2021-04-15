const nodeHeight = 60;
const nodeWidth = 160;
const verticalGap = nodeHeight + 30;
const horizontalGap = nodeWidth + 10;

export const palette = {
  primary: {
    light: '#4791db',
    main: '#1976d2',
    dark: '#114293',
  },
  secondary: {
    light: '#e33371',
    main: '#dc004e',
    dark: '#9a0036',
  },
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
  },
  warning: {
    lignt: '#ffb74d',
    main: '#ff9800',
    dark: '#f57c00',
  },
  info: {
    light: '#64b5f6',
    main: '#2196f3',
    dark: '#1976d2',
  },
  success: {
    light: '#81c784',
    main: '#4caf50',
    dark: '#388e3c',
  },
};

export const layoutConfig = {
  horizontalGap,
  nodeHeight,
  nodeWidth,
  palette,
  verticalGap,
};

export default layoutConfig;
