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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import LiteText from '../components/LiteText';
import LiteInput from '../components/LiteInput';
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
      const { user: { userGuid }, kbGuid, noteGuid } = this.props;
      const platforms = await this.handler.publishGetWebPlatforms(userGuid, kbGuid, noteGuid);
      console.log(platforms);
      this.setState({ platforms });
    },
    setCookie: async ({ id: platformId }) => {
      await window.wizApi.userManager.publishSetCookie(platformId);
    },
    publish: async (userGui, kbGuid, noteGuid, platform) => {
      if (platform.status === 1) {
        return;
      }
      await this.handler.save(userGui, kbGuid, noteGuid, platform, 'publish');
    },
    draft: async (userGui, kbGuid, noteGuid, platform) => {
      if (platform.status > 0) {
        return;
      }
      await this.handler.save(userGui, kbGuid, noteGuid, platform, 'draft');
    },
    save: async (userGuid, kbGuid, noteGuid, platform, operation) => {
      this.setState({
        userGuid, kbGuid, noteGuid, platform,
      });
      if (!platform.logged) {
        await this.handler.setCookie(platform);
        return;
      }
      if (operation === 'publish' && platform.tags && this.state.tags.length === 0) {
        this.handler.showInputTagsDialog();
        return;
      }
      const tags = this.state.tags;
      await window.wizApi.userManager.publishNote(
        userGuid, kbGuid, noteGuid, [platform.id], { tags, operation },
      );
      this.setState({ tags: [] });
    },
    publishGetWebPlatforms: async (userGuid, kbGuid, noteGuid) => {
      const initialData = await window.wizApi.userManager.publishGetWebPlatforms(
        userGuid, kbGuid, noteGuid,
      );
      return initialData;
    },
    getLoggedText: ({ logged }) => (logged ? '已登录' : '未登录'),
    getStatusText: ({ status }) => {
      let text;
      if (status === -1) {
        text = '错误';
      } else if (status === 1) {
        text = '已发布';
      } else if (status === 2) {
        text = '已存草稿';
      } else {
        text = '未发布';
      }
      return text;
    },
    getStatusTip: ({ message }) => message,
    showInputTagsDialog: () => {
      this.setState({ openDialog: true });
    },
    handleTagChange: (e) => {
      const tags = e.target.value.split(',');
      this.setState({ tags });
    },
    confirmTagInput: async () => {
      this.setState({ openDialog: false });
      const {
        userGuid, kbGuid, noteGuid, platform,
      } = this.state;
      await this.handler.save(userGuid, kbGuid, noteGuid, platform);
    },
    preview: async (previewUrl) => {
      await window.wizApi.userManager.previewArticle(previewUrl);
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      platforms: [],
      tags: [],
      openDialog: false,
      userGuid: null,
      kbGuid: null,
      noteGuid: null,
      platform: null,
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
    const {
      platforms, openDialog, tags, platform,
    } = this.state;
    //
    return (
      <div>

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
              {platforms.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="center">图标</TableCell>
                  <TableCell align="center">{item.id}</TableCell>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.intro}</TableCell>
                  <TableCell align="center">
                    <div className={classes.multi}>
                      <LiteText
                        className={classNames(item.logged ? classes.enable : classes.disable)}
                      >
                        {this.handler.getLoggedText(item)}
                      </LiteText>
                      <LiteText
                        title={this.handler.getStatusTip(item)}
                        className={classNames(item.published ? classes.enable : classes.disable)}
                      >
                        {this.handler.getStatusText(item)}
                      </LiteText>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className={classes.multi}>
                      <Button onClick={() => { this.handler.setCookie(item); }}>
                        Cookie
                      </Button>
                      <Button
                        onClick={() => {
                          this.handler.publish(user.userGuid, kbGuid, noteGuid, item);
                        }}
                      >
                        发布
                      </Button>
                      <Button
                        onClick={() => {
                          this.handler.draft(user.userGuid, kbGuid, noteGuid, item);
                        }}
                      >
                        草稿
                      </Button>

                      <Button
                        disabled={!item.preview}
                        onClick={() => {
                          this.handler.preview(item.preview);
                        }}
                      >
                        预览
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={openDialog}
        >
          <DialogContent>
            <LiteInput
              placeholder={`最多输入${platform ? platform.tags : 1}标签，用逗号分隔`}
              value={tags.join(',')}
              onChange={this.handler.handleTagChange}
            />
            <Button onClick={this.handler.confirmTagInput}>确定</Button>
          </DialogContent>
        </Dialog>
      </div>
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
