import axios from 'axios';
import parseData from './parser.js';

const update = (state) => {
  if (state.form.uniqueLinks.length !== 0) {
    state.form.uniqueLinks.forEach((link) => {
      const adress = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
      axios.get(adress)
        .then((response) => {
          const responseDOM = parseData(response.data.contents);
          responseDOM.posts.forEach((post) => {
            const postsLinks = state.posts.map((loadedPost) => loadedPost.postLink);
            if (!postsLinks.includes(post.postLink)) {
              state.posts.push(post);
            }
          });
        });
    });
  }
};

export default update;
