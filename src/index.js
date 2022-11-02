import axios from 'axios';
import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId.js';
import validate from './validator';
import render from './render';
import parseData from './parser.js';
import update from './update.js';
import init from './init.js';
import getAdress from './routes.js';

const eventHandler = () => {
  const elements = {
    form: document.querySelector('form'),
    field: document.querySelector('form input'),
    button: document.querySelector('form button'),
    feedback: document.querySelector('.feedback'),
    feedsColumn: document.querySelector('.feeds'),
    postsColumn: document.querySelector('.posts'),
    modalWindow: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      linkBtn: document.querySelector('.modal-footer a'),
    },
  };

  const state = {
    form: {
      link: {
        website: '',
      },
      uniqueLinks: [],
      valid: '',
    },
    uiState: {
      selectedPostId: null,
      readPosts: new Set(),
    },
    error: '',
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => render(state, elements, path, value));
  update(watchedState);

  const modal = new bootstrap.Modal('#modal'); // eslint-disable-line

  const modalButtonClickListener = (event) => {
    if (event.target.classList.contains('modal-button')) {
      const postId = event.target.dataset.id;
      watchedState.uiState.selectedPostId = postId;
      watchedState.uiState.readPosts.add(postId);
      modal.show();
    }
  };

  const postLinkClickListener = (event) => {
    if (event.target.classList.contains('fw-bold')) {
      const btnElement = event.target.nextElementSibling;
      const postId = btnElement.dataset.id;
      watchedState.uiState.readPosts.add(postId);
    }
  };

  document.addEventListener('click', modalButtonClickListener);
  document.addEventListener('click', postLinkClickListener);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    state.form.link.website = userLink;
    validate(state.form.link, state.form.uniqueLinks)
      .then(() => {
        watchedState.error = {};
        watchedState.form.valid = true;
        axios.get(getAdress(userLink))
          .then((response) => {
            watchedState.form.uniqueLinks.push(userLink);
            try {
              const responseDOM = parseData(response.data.contents);
              const { feed, posts } = responseDOM;
              watchedState.feeds.push(feed);
              posts.forEach((post) => {
                watchedState.posts.push({ id: uniqueId(), ...post });
              });
            } catch (error1) {
              watchedState.error = 'valid_error';
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

init()
  .then(() => {
    eventHandler();
  })
  .catch((err) => {
    console.log(err);
  });
