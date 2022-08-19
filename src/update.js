import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parseData from './parser.js';

const update = (state) => {
  if (state.form.uniqueLinks.length === 0) {
    setTimeout(() => update(state), 5000);
    return;
  }

  const requests = state.form.uniqueLinks.map((link) => {
    const adress = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
    return axios.get(adress);
  });

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
