/* global document */
import onChange from 'on-change';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import keyBy from 'lodash/keyBy.js';
import render from './render';

const validate = (fields, uniqueLinks) => {
  const schema = yup.object().shape({
    website: yup.string().url().nullable().notOneOf(uniqueLinks, 'RSS уже существует'),
  });
  schema.validate(fields, { abortEarly: false })
    .then(() => {
      const withoutError = {};
      return withoutError;
    })
    .catch((e) => {
      const error = keyBy(e.inner, 'path');
      return error;
    });
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
    const objectAfterValidation = validate(state.form.link, state.form.uniqueLinks);
    console.log(objectAfterValidation);
    watchedState.form.error = objectAfterValidation;
    watchedState.form.valid = isEmpty(objectAfterValidation);
    if (isEmpty(objectAfterValidation)) {
      watchedState.form.uniqueLinks.push(userLink);
    }
  });
};

eventHandler();
