/* global document */
import onChange from 'on-change';
import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';
import render from './render';

const validate = (fields, uniqueLinks) => {
  const schema = yup.object().shape({
    website: yup.string().url().nullable().notOneOf(uniqueLinks, 'RSS уже существует'),
  });
  return schema.validate(fields, { abortEarly: false });
};

const eventHandler = () => {
  const elements = {
    form: document.querySelector('form'),
    field: document.querySelector('form input'),
    button: document.querySelector('form button'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      link: {
        website: '',
      },
      uniqueLinks: [],
      valid: '',
      error: '',
    },
  };

  const watchedState = onChange(state, (path, value) => render(elements, path, value));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    state.form.link.website = userLink;
    validate(state.form.link, state.form.uniqueLinks)
      .then(() => {
        watchedState.form.error = {};
        watchedState.form.valid = true;
        watchedState.form.uniqueLinks.push(userLink);
      })
      .catch((error) => {
        watchedState.form.error = keyBy(error.inner, 'path');
        watchedState.form.valid = false;
      });
  });
};

eventHandler();
