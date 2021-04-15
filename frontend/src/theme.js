import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    h6: {
      fontSize: '1.15rem',
      fontWeight: 400,
      marginTop: 3, // centering fix for Chinese
      marginBottom: -3, // centering fix for Chinese
    },
  },
});

export default theme;
