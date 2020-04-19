window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log("Registration service worker");
        });
})

function submitPostData(url, data) {
    if(!url || !data) {
      throw "submitPostData() Need to pass 2 arguments. Example: submitPostData(url, post_data)";
    }
  
    if(!(typeof url === 'string')) {
      throw "submitPostData() first arguments must be string of url.";
    }
  
    if(!(typeof data === 'object')) {
      throw "submitPostData() second arguments must be object of post data.";
    }
  
    data['sendUrl'] = url;
    navigator.serviceWorker.ready
    .then(sw => {
      data.uxtid = + new Date();
      writeData('sync-post', data)
        .then(() => {
          return sw.sync.register('sync-new-post');
        })
        .then(() => {
          console.log("Post register for sync");
        })
        .catch((err) => { throw err; });
    });
  }