import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { serverConfig } from '../../config';
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

export default function ImageTable(props) {
  const { handleDisplay } = props;
  const initConceptData = [];
  const [conceptData, setConceptData] = useState(initConceptData);

  useEffect(() => {
    let url = new URL('/api/upload_image', serverConfig.baseUrl);
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        setConceptData(data);
      })
      .catch(function (e) {
        console.log('error: ', e);
      });
  }, [1]);

  return (
    <div id="app">
      <Grid container>
        <Grid item>
          <Table aria-label="simple table" className="table" stickyheader size="small">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">
                  文件名 <span></span>
                </StyledTableCell>
                <StyledTableCell align="center">
                  查看 <span></span>
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {Array.from(conceptData).map((user) => (
                <StyledTableRow>
                  <StyledTableCell align="center">{user}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleDisplay(user);
                      }}
                    >
                      查看
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
}
