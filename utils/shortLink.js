const API = "https://api.shrtco.de/v2/shorten?url=";

export const shortLink = (url) => {
  return fetch(API + url)
      .then((res) => res.json())
      .then((data) => {
          let { short_link } = data.result
          return short_link
      });
}