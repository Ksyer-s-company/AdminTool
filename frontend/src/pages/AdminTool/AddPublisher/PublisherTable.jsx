import React, { Component, useRef, useState, useEffect } from 'react';
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
import { serverConfig } from '../../../config';
import { Button } from '@material-ui/core';

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

export default function PublisherTable(props) {
  const { handleUpdate } = props;
  const initConceptData = {
    accountId: [],
    displayName: [],
    id: [],
    createdTime: [],
    updatedTime: [],
    active: [],
    isBroker: [],
  };
  const [conceptData, setConceptData] = useState(initConceptData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const conceptData = initConceptData;
    let url = new URL('/api/alter-wechat-publisher/', serverConfig.baseUrl);
    axios
      .get(url)
      .then(function (response) {
        setConceptData(
          response.data.sort((a, b) => Date.parse(b.updated_time) - Date.parse(a.updated_time))
        );
        setIsLoaded(true);
      })
      .catch(function (error) {
        console.log('error: ', error);
        setIsLoaded(false);
        setError(error);
      });
    setConceptData(conceptData);
  }, []);

  if (!isLoaded) {
    return <div>Loading</div>;
  } else {
    return (
      <div id="app">
        <TableContainer component={Paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid>
                <b>*</b> 注意公众号作者可能会改名，账户迁移后微信号也会改变 公众号id 和 名称需要
                <br />
                <b>*</b> 与实际名称一致，并在连接的手机上关注后，才能正确获取到文章
              </Grid>
              <Table aria-label="customized table" className="table" stickyheader>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      微信号 <span></span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      公众号名称 <span></span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      是否正在使用 <span></span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      是否为券商 <span></span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      创建时间 <span></span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      修改时间 <span></span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      修改 <span></span>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {Array.from(conceptData).map((user) => (
                    <StyledTableRow>
                      <StyledTableCell align="center">{user.account_id}</StyledTableCell>
                      <StyledTableCell align="center">{user.display_name}</StyledTableCell>
                      <StyledTableCell align="center">{user.active ? '是' : '否'}</StyledTableCell>
                      <StyledTableCell align="center">
                        {user.is_broker ? '是' : '否'}
                      </StyledTableCell>
                      <StyledTableCell align="center">{user.created_time}</StyledTableCell>
                      <StyledTableCell align="center">{user.updated_time}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleUpdate(user);
                          }}
                        >
                          修改
                        </Button>
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
