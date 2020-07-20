async function getPlatforms() {
  return [
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'zhihu',
      name: '知乎',
      intro: '谢邀，人在美国，刚下飞机',
      contentType: 'import',
      url: {
        login: 'https://www.zhihu.com/',
        check: 'https://www.zhihu.com',
        editor: 'https://zhuanlan.zhihu.com/write',
      },
      el: {
        title: '.WriteIndex-titleInput > .Input',
        content: '.public-DraftEditor-content',
        publish: ['.PublishPanel-triggerButton', '.PublishPanel-button'],
        importButton: ['#Popover3-toggle', '.Editable-toolbarMenuItem:nth-child(1)'],
        importInput: 'input[accept=".docx,.doc,.markdown,.mdown,.mkdn,.md"]',
        imageButton: [],
        imageInput: 'input[accept="image/jpg,image/jpeg,image/png,image/gif"',
      },
      cookies: {
        domain: '.zhihu.com',
        name: 'z_c0',
      },
    },
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'jianshu',
      name: '简书',
      intro: '创作你的创作',
      contentType: 'publish',
      url: {
        login: 'https://www.jianshu.com/sign_in',
        check: 'https://www.jianshu.com/writer',
        editor: 'https://www.jianshu.com/writer',
      },
      el: {
        title: 'input:not([name="name"])',
        content: '#arthur-editor',
        publish: ['a[data-action="publicize"]'],
        imageButton: ['.fa-picture-o'],
        imageInput: 'input[accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"',
      },
      cookies: {
        domain: '.jianshu.com',
        name: 'web_login_version',
      },
    },
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'juejin',
      name: '掘金',
      intro: '创作你的创作',
      contentType: 'publish',
      tags: 1,
      url: {
        login: 'https://juejin.im/timeline',
        check: 'https://juejin.im/timeline',
        editor: 'https://juejin.im/editor/drafts/new',
      },
      el: {
        title: '.title-input',
        content: '.ace_text-input',
        publish: ['.publish-popup', '.publish-btn'],
      },
      cookies: {
        domain: 'juejin.im',
        name: 'auth',
      },
    },
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'cnblogs',
      name: '博客园',
      intro: '开发者的网上家园',
      contentType: 'publish',
      url: {
        login: 'https://www.cnblogs.com/',
        check: 'https://www.cnblogs.com/',
        editor: 'https://i.cnblogs.com/EditArticles.aspx?opt=1',
      },
      el: {
        title: '.title-input',
        content: '.ace_text-input',
        publish: ['.publish-popup', '.publish-btn'],
      },
      cookies: {
        domain: 'juejin.im',
        name: 'auth',
      },
    },
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'segmentfault',
      name: 'segmentfault',
      intro: '帮助更多的开发者获得成长与成功',
      contentType: 'publish',
      tags: 5,
      url: {
        login: 'https://segmentfault.com/',
        check: 'https://segmentfault.com/',
        editor: 'https://segmentfault.com/write?freshman=1',
      },
      el: {
        title: '#title',
        content: '.CodeMirror',
        publish: ['#submitDiv > button', '#sureSubmitBtn'],
        imageButton: ['.tui-image'],
        imageInput: 'input[accept="image/*"',
      },
      cookies: {
        domain: 'segmentfault.com',
        name: 'io',
      },
    },
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'csdn',
      name: 'csdn',
      intro: 'csdn',
      contentType: 'import',
      url: {
        login: 'https://www.csdn.net/',
        check: 'https://www.csdn.net/',
        editor: 'https://editor.csdn.net/md/?not_checkout=1',
      },
      el: {
        title: '.article-bar__title',
        content: '.editor__inner',
        publish: ['.btn-b-red'],
        imageButton: ['button[data-title="图片 – Ctrl+Shift+G"'],
        imageInput: 'input[accept="image/gif, image/jpeg, image/gif, image/png, image/bmp, image/webp"',
        importButton: [],
        importInput: 'input[accept=".md"]',
      },
      cookies: {
        domain: '.csdn.net',
        name: 'UserToken',
      },
    },
  ];
}

module.exports = {
  getPlatforms,
};
