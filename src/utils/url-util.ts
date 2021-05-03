/**
 * 解析查询字符串
 * @param url
 */
const getSearch = (url: string) => {
  const search = url.includes('?') ? url.substring(url.indexOf('?')) : '';
  // 锚点hash
  if (search.includes('#')) {
    const hashIndex = search.indexOf('#');
    return search.substring(0, hashIndex);
  }
  return search;
};

const transSearch2Query = (search: string) => {
  const query = {};

  search?.split('&').forEach(kv => {

    try {
      const [key, value] = kv.split('=').map(decodeURIComponent);
      key && value && (query[key] = value);
    } catch (e) {
      // do nothing
    }
  });

  return query;
};

const transQuery2Search = (query: object) => {
  const search = Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&');
  return search.length ? `?${search}` : '';
};

export default class UrlUtil {
  // 解析查询参数
  static getQuery = (url: string = window.location.href) => {
    return transSearch2Query(getSearch(url).substring(1));
  };

  static addQuery = (url: string, query: object) => {
    if (!url) return null;
    const [path, search] = url.split('?');
    const newSearch = transQuery2Search({
      ...transSearch2Query(search),
      ...query,
    });
    return `${path}${newSearch}`;
  };

  // 解析url
  static parseUrl = (url: string = window.location.href) => {
    const a = document.createElement('a');
    a.href = url;

    const search = getSearch(url);
    const query = transSearch2Query(search.substring(1));
    let hash = a.hash;

    if (hash.includes('?')) {
      const searchIndex = hash.indexOf('?');
      hash = hash.substring(0, searchIndex);
    }

    const {
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
    } = a;

    return {
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      query,
      search,
    };
  };
}
