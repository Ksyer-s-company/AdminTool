import React, { Component, useRef, useState, useEffect } from 'react';
import axios from 'axios';
// import './ArticleTable.css';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { serverConfig } from '../../../config';
import { Button } from '@material-ui/core';
import FileDeleteDialog from './FileDeleteDialog';

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

export default function FileTable(props) {
  const { handleDownload, handleDelete } = props;
  const initConceptData = [];
  const [uploadConceptData, setUploadConceptData] = useState(initConceptData);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [filename, setFilename] = useState('');

  useEffect(() => {
    let url = new URL('/api/upload_file', serverConfig.baseUrl);
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        setUploadConceptData(data);
      })
      .catch(function (error) {
        console.log('error: ', error);
      });
  }, []);

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
                  下载 <span></span>
                </StyledTableCell>
                <StyledTableCell align="center">
                  删除 <span></span>
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {Array.from(uploadConceptData).map((user) => (
                <StyledTableRow>
                  <StyledTableCell align="center">{user}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleDownload(user);
                      }}
                    >
                      下载
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setFilename(user);
                        setFormDialogOpen(true);
                      }}
                    >
                      删除
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      {formDialogOpen ? (
        <FileDeleteDialog
          handleDelete={handleDelete}
          filename={filename}
          initFormDialogOpen={formDialogOpen}
        />
      ) : (
        ''
      )}
    </div>
  );
}
