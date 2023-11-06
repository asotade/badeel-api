const isEmptyObj = (obj) => obj && (Object.keys(obj).length === 0);

const FORBIDDEN_COUNTRIES = ['IL'];

const stringifyParams = (params, parentKey = '') => {
  const keyValuePairs = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      const encodedKey = parentKey
        ? `${parentKey}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);
      if (Array.isArray(value)) {
        value.forEach((element) => {
          if (element !== null && element !== undefined && element !== '') {
            keyValuePairs.push(`${encodedKey}[]=${encodeURIComponent(element)}`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        const nestedParams = stringifyParams(value, encodedKey);
        if (nestedParams !== '') {
          keyValuePairs.push(nestedParams);
        }
      } else {
        keyValuePairs.push(`${encodedKey}=${encodeURIComponent(value)}`);
      }
    }
  });

  return keyValuePairs.join('&');
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const camelize = (str) => str.split('-')
  .map((word, i) => ((i === 0 && word) || capitalize(word))).join('');

const cleanAndCamelizeQuery = (query) => Object.entries(query).reduce(
  (current, [key, value]) => {
    if (!value) return current;
    return { ...current, [camelize(key)]: value };
  },
  {},
);

const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

const makeFilters = (query) => {
  const filter = cleanAndCamelizeQuery(query);

  // const { from, to } = query;
  // if (from && to) {
  //   filter.createdAt = {
  //     $gte: new Date(new Date(from).setHours(0, 0, 0, 0)),
  //     $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
  //   };
  // }

  return filter;
};

const fetchCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  if (response.status !== 200) return [];
  const result = await response.json();

  const countries = result
    .filter((c) => !FORBIDDEN_COUNTRIES.includes(c.cca2))
    .map((c) => ({
      code: c.cca2,
      name: c.name.common,
      flag: c.flag,
    }));
  return countries;
};

const isArrayAllIncluded = (array1, array2) => array2.every((value) => array1.includes(value));

const isArrayAnyIncluded = (array1, array2) => array2.some((value) => array1.includes(value));

module.exports = {
  isEmptyObj,
  fetchCountries,
  stringifyParams,
  cleanAndCamelizeQuery,
  makeFilters,
  isObjectId,
  isArrayAllIncluded,
  isArrayAnyIncluded,
};
