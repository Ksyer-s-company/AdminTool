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
export const StyledTableCell = withStyles((theme: Theme) =>
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

export const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.common.white,
      },
    },
  })
)(TableRow);
//创建TrData调用函数进行传值
class TrData extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.brokers);
    console.log(props.wechats);
  }
  render() {
    return this.props.brokers.map((user, i) => {
      return (
        <tr key={user.name} className="text-center">
          <td>{user.author}</td>
          <td>{user.all}</td>
          <td>{user.today}</td>
          <td>{user.week}</td>
          <td>{user.month}</td>
        </tr>
      );
    });
  }
}
//创建ParentComponent调用函数,通过axios拿到后台返回的数据
class ParentComponent extends React.Component {
  state = {
    brokers: [],
    wechats: [],
    sort: {
      column: null,
      direction: 'desc',
    },
  };

  componentDidMount() {
    const brokers = [];
    const wechats = [];
    const _this = this;

    let url = new URL('/api/a-article/', serverConfig.baseUrl);
    axios
      .get(url)
      .then(function (response) {
        _this.setState({
          brokers: response.data.brokers,
          wechats: response.data.wechats,
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
    this.setState({ brokers });
    this.setState({ wechats });
  }
  onSort = (column, type) => (e) => {
    /**
     * 按照点击的表格和列进行排序
     * 并刷新显示
     *
     * @param {String} column 列名 today/ week/ month
     * @param {String} type 表格区分 brokers / wechats
     */
    const direction = this.state.sort.column
      ? this.state.sort.direction === 'asc'
        ? 'desc'
        : 'asc'
      : 'desc';
    if (type == 'brokers') {
      //brokers的表格通过循环排序
      const sortedBrokerData = this.state.brokers.sort((a, b) => {
        if (column === 'author') {
          const nameA = a.author.toUpperCase(); // ignore upper and lowercase
          const nameB = b.author.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        } else {
          if (column == 'today') {
            return a.today - b.today;
          } else if (column == 'week') {
            return a.week - b.week;
          } else if (column == 'month') {
            return a.month - b.month;
          }
          return a.all - b.all;
        }
      });
      if (direction === 'desc') {
        sortedBrokerData.reverse();
      }
      this.setState({
        brokers: sortedBrokerData,
        sort: {
          column,
          direction,
        },
      });
    }
    //wechats表格的循环排序
    else if (type == 'wechats') {
      const sortedWechatDate = this.state.wechats.sort((a, b) => {
        if (column === 'author') {
          const nameA = a.author.toUpperCase(); // ignore upper and lowercase
          const nameB = b.author.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        } else {
          if (column == 'today') {
            return a.today - b.today;
          } else if (column == 'week') {
            return a.week - b.week;
          } else if (column == 'month') {
            return a.month - b.month;
          }
          return a.all - b.all;
        }
      });
      if (direction === 'desc') {
        sortedWechatDate.reverse();
      }
      this.setState({
        wechats: sortedWechatDate,
        sort: {
          column,
          direction,
        },
      });
    }
  };
  //调用类名sort-direction在控制台显示asc和desc
  setArrow = (column) => {
    let className = 'sort-direction';
    if (this.state.sort.column === column) {
      className += this.state.sort.direction === 'asc' ? ' asc' : ' desc';
    }
    console.log(className);
    return className;
  };
  render() {
    if (!this.state.isLoaded) {
      return <div>Loading</div>;
    } else {
      return (
        //通过material-ui创建表格样式,实现点击事件，进行排序列表
        <div id="app">
          <TableContainer component={Paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Table aria-label="customized table" className="table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center" onClick={this.onSort('author', 'brokers')}>
                        作者 <span className={this.setArrow('author')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('today', 'brokers')}>
                        当天 <span className={this.setArrow('today')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('week', 'brokers')}>
                        本周 <span className={this.setArrow('week')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('month', 'brokers')}>
                        本月 <span className={this.setArrow('month')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('all', 'brokers')}>
                        总计 <span className={this.setArrow('all')}></span>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.brokers.map((user, index) => (
                      <StyledTableRow key={index}>
                        {/* <StyledTableCell component="th" scope="row">
                                        {user.name}
                                    </StyledTableCell> */}
                        <StyledTableCell align="center">{user.author}</StyledTableCell>
                        <StyledTableCell align="center">{user.today}</StyledTableCell>
                        <StyledTableCell align="center">{user.week}</StyledTableCell>
                        <StyledTableCell align="center">{user.month}</StyledTableCell>
                        <StyledTableCell align="center">{user.all}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Table aria-label="customized table" className="tables">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center" onClick={this.onSort('author', 'wechats')}>
                        作者<span className={this.setArrow('author')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('today', 'wechats')}>
                        当天 <span className={this.setArrow('today')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('week', 'wechats')}>
                        本周 <span className={this.setArrow('week')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('month', 'wechats')}>
                        本月<span className={this.setArrow('month')}></span>
                      </StyledTableCell>
                      <StyledTableCell align="center" onClick={this.onSort('all', 'wechats')}>
                        总计<span className={this.setArrow('all')}></span>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.wechats.map((user, index) => (
                      <StyledTableRow key={index}>
                        {/* <StyledTableCell component="th" scope="row">
                                        {user.name}
                                    </StyledTableCell> */}
                        <StyledTableCell align="center">{user.author}</StyledTableCell>
                        <StyledTableCell align="center">{user.today}</StyledTableCell>
                        <StyledTableCell align="center">{user.week}</StyledTableCell>
                        <StyledTableCell align="center">{user.month}</StyledTableCell>
                        <StyledTableCell align="center">{user.all}</StyledTableCell>
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
// ReactDOM.render(<ParentComponent />, document.getElementById('root'));
export default ParentComponent;
