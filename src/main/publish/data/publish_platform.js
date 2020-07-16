async function getPlatforms() {
  return [
    {
      icon: 'https://i.pinimg.com/originals/97/af/b9/97afb97b6c0e054383cf7df7c6429bc6.jpg',
      id: 'zhihu',
      name: '知乎',
      intro: '谢邀，人在美国，刚下飞机',
      url: {
        login: 'https://www.zhihu.com/',
        check: 'https://www.zhihu.com',
        editor: '',
      },
      el: {
        title: '',
        content: '',
        submit: '',
      },
      cookies: {
        domain: 'www.zhihu.com',
        name: 'SESSIONID',
      },
    },
  ];
}

module.exports = {
  getPlatforms,
};
