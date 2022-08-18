import i18n from 'i18next';
import ru from './locales/ru.js';

const init = () => new Promise((resolve, reject) => {
  i18n
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    })
    .then(() => {
      resolve();
    })
    .catch(() => {
      reject();
    });
});

export default init;
