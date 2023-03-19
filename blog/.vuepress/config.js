module.exports = {
  title: 'Mohamed Ragab',
  description: 'Mohamed Ragab',
  theme: '@vuepress/theme-blog', // OR shortcut: @vuepress/blog
  themeConfig: {
    modifyBlogPluginOptions(blogPluginOptions) {
      return blogPluginOptions
    },
    nav: [
      {
        text: 'Posts',
        link: '/',
      },
      {
        text: 'Projects',
        link: 'https://github.com/ragoob',
      },

      {
        text: 'Devops course',
        link: 'https://youtu.be/f85XlAjbS5w',
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
          type: 'medium',
          link: 'https://regoo707.medium.com/',
        },
      ],
      copyright: [
      
        {
          text: 'Copyright © 2018-present Mohamed Ragab',
          link: 'https://ragab.blog',
        },
      ],
    },
  },
}
