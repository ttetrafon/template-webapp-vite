export const routes = {
  'page-one': {
    content: 'page-one',
    title: "Page 1",
    description: "This is page one!",
    path: "/page-one",
    pathType: "WebPage",
    navData: {
      test: "this is some test nav data!"
    }
  },
  'page-two': {
    content: "page-two",
    title: "Page 2",
    description: "This is page two!",
    path: "/page-two",
    pathType: "WebPage",
    navData: {
      test: "this is some test nav data!"
    }
  },
  'tab-one': {
    content: "tab-one",
    title: "Tab 1",
    description: "This is tab one!",
    path: "/tab-one",
    pathType: "WebPage"
  },
  'tab-two': {
    content: "tab-two",
    title: "Tab 2",
    description: "This is tab two!",
    path: "/tab-two",
    pathType: "WebPage"
  },
  '404': {
    content: "page-404",
    title: "404 - Page not found",
    description: "The page you request was not found!",
    path: "/404",
    pathType: "WebPage"
  }
}

export const aliases = {
  '/': '/page-one'
}
