import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parseData from './parser.js';
import getAdress from './routes.js';

const update = (state) => {
  if (state.form.uniqueLinks.length === 0) {
    setTimeout(() => update(state), 5000);
    return;
  }

  const requests = state.form.uniqueLinks.map((link) => axios.get(getAdress(link))
    .catch(console.error));

  Promise.all(requests).then((responses) => {
    responses.forEach((response) => {
      const responseDOM = parseData(response.data.contents);
      responseDOM.posts.forEach((post) => {
        const postsLinks = state.posts.map((loadedPost) => loadedPost.postLink);
        if (!postsLinks.includes(post.postLink)) {
          state.posts.push({ id: uniqueId(), ...post });
        }
      });
    });

    setTimeout(() => update(state), 5000);
  });
};

export default update;
