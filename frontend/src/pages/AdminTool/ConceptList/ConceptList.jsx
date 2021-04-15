import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import './ArticleTable.css';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { serverConfig } from '../../../../src/config';

//根据material-ui,调用了表格样式
const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.common.black,
      border: '1px solid #ccc',
      fontSize: 16,
    },
    body: {
      fontSize: 14,
      border: '1px solid #ccc',
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.common.white,
      },
    },
  })
)(TableRow);
//创建ParentComponent调用函数,通过axios拿到后台返回的数据
class ParentComponent extends React.Component {
  state = {
    conceptdata: {
      block_code: [],
      block_name: [],
      related_word: [],
    },
  };
  componentDidMount() {
    const conceptdata = [];
    const _this = this;
    let url = new URL('/api/concept-cloud/', serverConfig.baseUrl);
    console.log(url);
    axios
      .get(url)
      .then(function (response) {
        //循环数组中的related_word,为关键字添加;便于区分
        if (response.data != 'undefined') {
          for (var i = 0; i < response.data.length; i++) {
            var word = response.data[i].related_word;
            var str = '';
            for (var j = 0; j < word.length - 1; j++) {
              str += word[j] + ' ;   ';
            }
            var realtedData = str + word[word.length - 1];
            response.data[i].related_word_handled = realtedData;
          }
        }
        _this.setState({
          conceptdata: response.data,
          isLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
        _this.setState({
          isLoaded: false,
          error: error,
        });
      });
    this.setState({ conceptdata });
  }

  render() {
    if (!this.state.isLoaded) {
      return <div>Loading</div>;
    } else {
      return (
        <div id="app">
          <TableContainer component={Paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Table aria-label="customized table" className="table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        行业代码 <span></span>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        行业名 <span></span>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        关键字 <span></span>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.conceptdata.map((user) => (
                      <StyledTableRow>
                        <StyledTableCell align="center">{user.block_code}</StyledTableCell>
                        <StyledTableCell align="center">{user.block_name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {user.related_word_handled}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </TableContainer>
        </div>
      );
    }
  }
}

export default ParentComponent;
