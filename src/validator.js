import * as yup from 'yup';
import { setLocale } from 'yup';

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

export default validate;
