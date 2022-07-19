/* global document */
import axios from 'axios';
import onChange from 'on-change';
import validate from './validator';
import render from './render';
import parseData from './parser.js';
import update from './update.js';

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
      selectedPost: {},
      readPosts: [],
    },
    error: '',
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path, value) => render(state, elements, path, value));
  const timerForUpdate = () => {
    update(watchedState);
    setTimeout(timerForUpdate, 5000);
  };

  timerForUpdate();

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    state.form.link.website = userLink;
    validate(state.form.link, state.form.uniqueLinks)
      .then(() => {
        watchedState.error = {};
        watchedState.form.valid = true;
        const address = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(userLink)}`;
        axios.get(address)
          .then((response) => {
            watchedState.form.uniqueLinks.push(userLink);
            try {
              const responseDOM = parseData(response.data.contents);
              const { feed, posts } = responseDOM;
              watchedState.feeds.push(feed);
              posts.forEach((post) => watchedState.posts.push(post));
            } catch (error1) {
              watchedState.error = 'default_error';
            }
          })
          .catch(() => {
            watchedState.error = 'network_error';
          })
          .then(() => {
            const postsButtons = elements.postsColumn.querySelectorAll('button');
            const postsTitlesLinks = elements.postsColumn.querySelectorAll('a');
            postsButtons.forEach((postButton) => {
              postButton.addEventListener('click', (el) => {
                const selectedPostId = el.target.dataset.id;
                const selectedPost = state.posts.find((post) => post.id === selectedPostId);
                watchedState.uiState.selectedPost = selectedPost;
                watchedState.uiState.readPosts.push(selectedPost.postLink);
              });
            });
            postsTitlesLinks.forEach((postTitleLink) => {
              postTitleLink.addEventListener('click', (el) => {
                console.log(el.target.getAttribute('href'));
                watchedState.uiState.readPosts.push(el.target.getAttribute('href'));
              });
            });
          });
      })
      .catch((error) => {
        watchedState.error = error.message.key;
        watchedState.form.valid = false;
      });
  });
};

eventHandler();
