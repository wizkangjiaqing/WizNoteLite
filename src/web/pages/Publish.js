import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LiteText from '../components/LiteText';
//


const style = (theme) => ({
  table: {
    minWidth: 650,
  },
  multi: {
    display: 'flex',
  },
  enable: {
    color: 'blue',
  },
  disable: {
    color: 'gray',
  },
});

class Publish extends React.Component {
  handler = {
    initWebPlatforms: async () => {
      window.wizApi.userManager.on('publishPlatformChange', this.handler.handlePlatformChange);
      const { user: { userGuid }, kbGuid, noteGuid } = this.props;
      const platforms = await this.handler.publishGetWebPlatforms(userGuid, kbGuid, noteGuid);
      this.setState({ platforms });
    },
    setCookie: async ({ id: platformId }) => {
      await window.wizApi.userManager.publishSetCookie(platformId);
    },
    publish: async (userGuid, kbGuid, noteGuid, platform) => {
      if (platform.status) {
        return;
      }
      if (!platform.logged) {
        return;
      }
      await window.wizApi.userManager.publish(userGuid, kbGuid, noteGuid, [platform.id]);
    },
    publishGetWebPlatforms: async (userGuid, kbGuid, noteGuid) => {
      const initialData = await window.wizApi.userManager.publishGetWebPlatforms(userGuid, kbGuid, noteGuid);
      return initialData;
    },
    getLoggedText: ({ logged }) => (logged ? '已登录' : '未登录'),
    getStatusText: ({ status }) => {
      let text;
      if (status === -1) {
        text = '错误';
      } else if (status === 1) {
        text = '已发布';
      } else {
        text = '未发布';
      }
      return text;
    },
    getStatusTip: ({ message }) => message,
  };

  constructor(props) {
    super(props);
    this.state = {
      platforms: [],
    };
  }

  async componentDidMount() {
    window.wizApi.userManager.on('publishPlatformChange', this.handler.initWebPlatforms);
    await this.handler.initWebPlatforms();
  }

  componentWillUnmount() {
    window.wizApi.userManager.off('publishPlatformChange', this.handler.initWebPlatforms);
  }

  render() {
    const {
      classes, intl, user, kbGuid, noteGuid,
    } = this.props;
    const { platforms } = this.state;
    //
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">图标</TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">名称</TableCell>
              <TableCell align="center">描述</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {platforms.map((platform) => (
              <TableRow key={platform.id}>
                <TableCell align="center">图标</TableCell>
                <TableCell align="center">{platform.id}</TableCell>
                <TableCell align="center">{platform.name}</TableCell>
                <TableCell align="center">{platform.intro}</TableCell>
                <TableCell align="center">
                  <div className={classes.multi}>
                    <LiteText className={classNames(platform.logged ? classes.enable : classes.disable)}>
                      {this.handler.getLoggedText(platform)}
                    </LiteText>
                    <LiteText title={this.handler.getStatusTip(platform)} className={classNames(platform.published ? classes.enable : classes.disable)}>
                      {this.handler.getStatusText(platform)}
                    </LiteText>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div className={classes.multi}>
                    <LiteText onClick={() => { this.handler.setCookie(platform); }} className={classNames(classes.enable)}>
                      Cookie
                    </LiteText>
                    <LiteText onClick={() => { this.handler.publish(user.userGuid, kbGuid, noteGuid, platform); }} title="点击发布" className={classNames(classes.enable)}>
                      {this.handler.getStatusText(platform.status)}
                    </LiteText>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

Publish.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  kbGuid: PropTypes.string,
  noteGuid: PropTypes.string.isRequired,
};

Publish.defaultProps = {
  kbGuid: null,
};

export default withStyles(style)(injectIntl(Publish));
