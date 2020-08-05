// GETTING DOM ELEMENTS

const body = document.querySelector("body");
const main = document.querySelector("main");
// Getting Text Fields
const blogInfoType = document.querySelector("#blogInfo-type");
const blogInfoTopic = document.querySelector("#blogInfo-topic");
const blogInfoAuthor = document.querySelector("#blogInfo-author");
const blogInfoContent = document.querySelector("#blogInfo-content");
const postContainer = document.querySelector(".post-container");

//Getting Button
const blogInfo_submit = document.querySelector(".blogInfo-submit");

//Class which represents a Post Object
function Post(type, topic, author, content) {
  this.type = type;
  this.topic = topic;
  this.author = author;
  this.content = content;
}

//EVENT LISTENERS

blogInfo_submit.addEventListener("click", e => {
  const post = new Post(
    blogInfoType.value,
    blogInfoTopic.value,
    blogInfoAuthor.value,
    blogInfoContent.value
  );
  createPost(post);
});

document.querySelector(".blog-posts").addEventListener("click", e => {
  e.preventDefault();
  deletePost(e.target);
});

//FUNCTIONS

//createPost Function
function createPost(post) {
  if (
    blogInfoType.value === "" ||
    blogInfoType.value === "----"||
    blogInfoTopic.value === "" ||
    blogInfoAuthor.value === "" ||
    blogInfoContent.value === ""
  ) {
    popAlertBox(
      "Failed to create post! Please make sure to fill all fields",
      "error"
    );
  } else {
    const newPost = document.createElement("div");
    newPost.className = "blog-posts-card";

    let postContent = `<span class = "material-icons close-icon">highlight_off</span>
    <div class="card-side">${post.type}</div>
    <div class="card-center">
        <h3>${post.topic}</h3>
    </div>
    <div class="card-side">${post.author}</div>`;

    if (createLocalStorage(post) === true) {
      newPost.innerHTML = postContent;
      postContainer.appendChild(newPost);
      blogInfoAuthor.value = "";
      blogInfoContent.value = "";
      blogInfoTopic.value = "";
      blogInfoType.value = "";

      popAlertBox("Post created successfully.", "success");
    } else {
      popAlertBox(
        `Sorry! Post couldn't be created due to database error`,
        "error"
      );
    }
  }
}
// localStorage.removeItem('blogPosts');

//deletePost Function
function deletePost(target) {
  if (target.className === "material-icons close-icon") {
    let topic = target.nextElementSibling.nextElementSibling;

    let author =
      target.nextElementSibling.nextElementSibling.nextElementSibling;

    if (deleteLocalStorage(topic.innerText, author.innerText)) {
      target.parentElement.remove();

      popAlertBox("Post have been deleted from database", "warning");
    } else {
      popAlertBox("Post cant be deleted from database", "error");
    }
  }
}

// Create alert function (popAlertBox)
function popAlertBox(message, alertType) {
  const alert = document.createElement("div");
  alert.className = "alertBox";
  alert.classList.add(alertType);
  alert.textContent = message;

  body.insertBefore(alert, main);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

//LOCAL STORAGE FUNCTIONS
// Function to add new post to localStorage;
function createLocalStorage(post) {

    let posts = [];

  posts = JSON.parse(localStorage.getItem("blogPosts"));

  if(posts === null){
      posts = []
  }

  console.log(posts);
  
  posts.push(post);
  posts = JSON.stringify(posts);

  try {
    localStorage.setItem("blogPosts", posts);
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
}

// Function to remove posts from local Storage
function deleteLocalStorage(postTopic, postAuthor) {
  let posts = [];

  posts = JSON.parse(localStorage.getItem("blogPosts"));
  console.log(posts);

  posts.forEach(function (post, index) {
    if (post.topic === postTopic && post.author === postAuthor) {
      posts.splice(index, 1);
      console.log("yes");
    }
  });
  posts = JSON.stringify(posts);
  try {
    localStorage.setItem("blogPosts", posts);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

window.addEventListener("load", e => {
  let posts = JSON.parse(localStorage.getItem("blogPosts"));
  console.log(posts);

  if (posts !== null) {
    posts.forEach(function (post) {
      const newPost = document.createElement("div");
      newPost.className = "blog-posts-card";

      let postContent = `<span class = "material-icons close-icon">highlight_off</span>
        <div class="card-side">${post.type}</div>
        <div class="card-center">
            <h3>${post.topic}</h3>
        </div>
        <div class="card-side">${post.author}</div>`;

      newPost.innerHTML = postContent;

      postContainer.appendChild(newPost);
    });
  }
});
