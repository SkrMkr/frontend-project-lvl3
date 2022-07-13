import DOMParser from 'dom-parser';

const parseData = (htmlRequest) => {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(htmlRequest, 'text/html');
  return parsedDOM;
};

export default parseData;
