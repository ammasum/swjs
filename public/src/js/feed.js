const postContainer = document.querySelector('#dynamic_post');

function addPost(post) {
  const colEle = document.createElement('div');
  colEle.className = "col-12";
  const header = document.createElement('h2');
  header.textContent = post.name;
  colEle.appendChild(header);
  const header2 = document.createElement('h4');
  header2.textContent = post.title;
  colEle.appendChild(header2);
  postContainer.appendChild(colEle);
}

const form = document.querySelector('form');

form.addEventListener('submit', event => {
  event.preventDefault();
  console.log("Form submited");
  form.submit();
});

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

submitPostData('http://localhost:8080/createPost', { name: 'Masum', title: 'Ask to AM'});

const postUrl = 'http://localhost:8080/post';
fetch(postUrl)
  .then(response => {
    return response.json();
  })
  .then(posts => {
    posts.forEach(post => {
      addPost(post);
    });
  });