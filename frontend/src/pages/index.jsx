import React, { useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { history } from '../App';
import FileTool from './utils-file/FileTool';
import Beijinghua from './feature-beijinghua/beijinghua';
import Repeater from './feature-repeater/Repeater';
import CodeTool from './utils-code/CodeTool';
import SocialPractice from './static-SocialPractice/SocialPractice';
import Blog from './static-Blog/Blog';
import ImageTool from './utils-image/ImageTool';
import EAS from './static-EAS/EAS';
import MarkdownTool from './utils-markdown/MarkdownTool';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const IndexPage = observer(() => {
  // const hotW = new StoreHotWord();
  const { appId } = useParams();
  const classes = useStyles();

  const handleRowClick = useCallback((e) => {
    const appId = e.currentTarget.getAttribute('value');
    history.push('/admin-tool/' + appId);
  });

  const imgStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    root: {
      margin: [[56, 'auto', 0, 'auto']],
    },
    logo: {
      height: '1.5rem',
      marginRight: theme.spacing(1),
      marginTop: -8,
    },
    a: {
      textDecoration: 'none',
      color: '#ffffff',
    },
  }));
  const img_classes = imgStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={img_classes.appBar}>
        <Toolbar>
          <a href="/" className={img_classes.a}>
            <img src="/logo.png" height="24" className={img_classes.logo} /> &nbsp;
            <Typography variant="h5" display="inline">
              Ksyer's website
            </Typography>
          </a>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {[
              { text: '北京话生成器', key: 'beijinghua' },
              { text: '复读机', key: 'repeater' },
            ].map((obj, index) => (
              <ListItem button key={obj.key} value={obj.key} onClick={handleRowClick}>
                <ListItemText primary={obj.text} />
              </ListItem>
            ))}
          </List>
          <Divider />

          <List>
            {[
              { text: '导入文件', key: 'file' },
              { text: '图片显示', key: 'image' },
              { text: '代码暂存', key: 'code' },
              { text: 'Markdown 解析', key: 'markdown' },
            ].map((obj, index) => (
              <ListItem button key={obj.key} value={obj.key} onClick={handleRowClick}>
                <ListItemText primary={obj.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {[
              { text: '社会实践', key: 'shsj' },
              { text: '个人博客', key: 'blog' },
              { text: '员工考勤管理系统', key: 'eas' },
            ].map((obj, index) => (
              <ListItem button key={obj.key} value={obj.key} onClick={handleRowClick}>
                <ListItemText primary={obj.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Typography paragraph>
          {appId === 'beijinghua' && <Beijinghua />}
          {appId === 'repeater' && <Repeater />}
          {appId === 'file' && <FileTool />}
          {appId === 'image' && <ImageTool />}
          {appId === 'code' && <CodeTool />}
          {appId === 'markdown' && <MarkdownTool />}

          {appId === 'shsj' && <SocialPractice />}
          {appId === 'blog' && <Blog />}
          {appId === 'eas' && <EAS />}
        </Typography>
      </main>
    </div>
  );
});
export default IndexPage;
