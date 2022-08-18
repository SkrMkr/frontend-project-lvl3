import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parseData from './parser.js';

const updateFeeds = (state) => {
  if (state.form.uniqueLinks.length !== 0) {
    state.form.uniqueLinks.forEach((link) => {
      const adress = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
      axios.get(adress)
        .then((response) => {
          const responseDOM = parseData(response.data.contents);
          responseDOM.posts.forEach((post) => {
            const postsLinks = state.posts.map((loadedPost) => loadedPost.postLink);
            if (!postsLinks.includes(post.postLink)) {
              post.id = uniqueId();
              state.posts.push(post);
            }
          });
        });
    });
  }
};

const update = (state) => {
  setInterval(() => updateFeeds(state), 5000);
};

export default update;
