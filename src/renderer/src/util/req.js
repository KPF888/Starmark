export async function req(url, option) {
  return new Promise((resolve, reject) => {
    fetch(url, option)
      .then(res => {
        resolve(res.text());
      })
      .catch(e => {
        reject(e)
      })
  })
}
