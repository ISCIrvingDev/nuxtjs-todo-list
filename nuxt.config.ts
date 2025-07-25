// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  app: {
    head: {
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      title: "Todo List",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/img/todo-list.ico" },
        { rel: "stylesheet", href: "/css/colors.css" },
        { rel: "stylesheet", href: "/css/bootstrap.min.css" },
        { rel: "stylesheet", href: "/css/fontawesome.all.min.css" },
      ],
      script: [
        { src: "/js/jquery-3.3.1.min.js" },
        { src: "/js/bootstrap.bundle.min.js" },
        { src: "/js/bootstrap.min.js" },
      ],
    },
  },
  css: ["@/assets/css/main.css"],
});
