module.exports = {
  plugins: ['@vuepress/nprogress','@vuepress/back-to-top'],
  title: 'Ragab',
  description: 'Ragab',
  theme: '@vuepress/theme-blog', // OR shortcut: @vuepress/blog
  themeConfig: {
    modifyBlogPluginOptions(blogPluginOptions) {
      return blogPluginOptions
    },
    search: false,
    nav: [
      {
        text: 'Posts',
        link: '/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/ragoob',
      },

      {
        text: 'Youtube',
        link: 'https://youtu.be/f85XlAjbS5w',
      },

      {
        text: 'About',
        link: '/me/',
      },
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/ragoob',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/@rgbdev',
        },
        {
          type: 'Youtube',
          link: 'https://youtu.be/f85XlAjbS5w',
        },
      ],
      copyright: [
      
        {
          text: 'Copyright © 2021-present Mohamed Ragab',
          link: 'https://ragab.blog',
        },
      ],
    },
  },
}
