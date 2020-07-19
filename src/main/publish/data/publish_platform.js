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
  ];
}

module.exports = {
  getPlatforms,
};
