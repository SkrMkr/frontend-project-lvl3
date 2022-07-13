/* global document */
import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import render from './render';
import parseData from './parser.js';

setLocale({
  string: {
    url: { key: 'not_url' },
  },
  mixed: {
    notOneOf: { key: 'not_uniq' },
  },
});

const validate = (fields, uniqueLinks) => {
  const schema = yup.object().shape({
    website: yup.string().url().nullable().notOneOf(uniqueLinks),
  });
  return schema.validate(fields, { abortEarly: false });
};

const eventHandler = () => {
  const elements = {
    form: document.querySelector('form'),
    field: document.querySelector('form input'),
    button: document.querySelector('form button'),
    feedback: document.querySelector('.feedback'),
    feedsColumn: document.querySelector('.feeds'),
    postsColumn: document.querySelector('.posts'),
  };

  const state = {
    form: {
      link: {
        website: '',
      },
      uniqueLinks: [],
      valid: '',
    },
    error: '',
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => render(elements, path, value));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    state.form.link.website = userLink;
    validate(state.form.link, state.form.uniqueLinks)
      .then(() => {
        watchedState.error = {};
        watchedState.form.valid = true;
        const address = `https://allorigins.hexlet.app/get?url=${userLink}`;
        axios.get(address)
          .then((response) => {
            watchedState.form.uniqueLinks.push(userLink);
            try {
              const responseDOM = parseData(response.data.contents);
              const feedTitle = responseDOM.getElementsByTagName('title')[0].innerHTML;
              const feedDescription = responseDOM.getElementsByTagName('description')[0].innerHTML;
              const id = uniqueId();
              const feed = {
                feedTitle,
                feedDescription,
                id,
              };
              watchedState.feeds.push(feed);
              const items = responseDOM.getElementsByTagName('item');
              items.forEach((item) => {
                const postTitle = item.getElementsByTagName('title')[0].innerHTML;
                const postDescription = item.getElementsByTagName('description')[0].innerHTML;
                const postLink = item.getElementsByTagName('link')[0].innerHTML;
                const post = {
                  postTitle,
                  postDescription,
                  postLink,
                  feedId: id,
                };
                watchedState.posts.push(post);
              });
            } catch {
              watchedState.error = 'default_error';
            }
          })
          .catch(() => {
            watchedState.error = 'network_error';
          });
      })
      .catch((error) => {
        watchedState.error = error.message.key;
        watchedState.form.valid = false;
      });
  });
};

eventHandler();
