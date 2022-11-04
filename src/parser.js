/* eslint-env browser */

const parseData = (htmlRequest) => {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(htmlRequest, 'application/xml');

  const feedTitle = parsedDOM.querySelector('title').textContent;
  const feedDescription = parsedDOM.querySelector('description').textContent;

  const items = Array.from(parsedDOM.querySelectorAll('item'))
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postDescription = item.querySelector('description').textContent;
      const postLink = item.querySelector('link').textContent;
      const post = {
        postTitle,
        postDescription,
        postLink,
      };
      return post;
    })
    .reverse();

  return {
    feed: {
      feedTitle,
      feedDescription,
    },
    posts: items,
  };
};

export default parseData;
