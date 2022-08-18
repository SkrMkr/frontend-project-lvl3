/* eslint-env browser */

const parseData = (htmlRequest) => {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(htmlRequest, 'application/xml');

  const feedTitle = parsedDOM.querySelector('title').textContent;
  const feedDescription = parsedDOM.querySelector('description').textContent;

  const parsedDOMElements = {
    feed: {
      feedTitle,
      feedDescription,
    },
    posts: [],
  };

  const items = parsedDOM.querySelectorAll('item');
  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    const post = {
      postTitle,
      postDescription,
      postLink,
    };
    parsedDOMElements.posts.unshift(post);
  });

  return parsedDOMElements;
};

export default parseData;
