import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    padding: [[theme.spacing(1), 0]],
    '& a': {
      textDecoration: 'inherit',
      color: 'inherit',
    },
  },
  root: {
    margin: [[56, 'auto', 0, 'auto']],
  },
  logo: {
    height: '1.5rem',
    marginRight: theme.spacing(1),
    marginTop: -8,
  },
}));

export default useStyles;
