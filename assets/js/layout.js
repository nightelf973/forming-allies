const navData = document.getElementById('nav-script');
const activeInput = navData.dataset.active;
const activeInputTwo = navData.dataset.activeTwo;
let url = '../includes/navbar.html';
if (activeInputTwo) url='../'+url;
fetch(url)
.then(response => response.text())
.then(html => {
  document.body.insertAdjacentHTML('afterbegin', html);
})
.then(() => {
  if (activeInput) document.getElementById(activeInput).classList.add('active'); 
  if (activeInputTwo) document.getElementById(activeInputTwo).classList.add('active'); 
  if (localStorage.getItem("login") === "true") {
    const discussion = document.getElementById('discussion-link');
    const login = document.getElementById('login-logout-section');
    discussion.innerHTML = `
    <li class="nav-item dropdown">
      <a id="discussion-nav" class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">Discussion</a>
      <div class="dropdown-menu">
        <a class="dropdown-item" href="../Discussion">Latest Posts</a>
        <a class="dropdown-item" href="../Discussion/myposts.html">My Posts</a>
        <a class="dropdown-item" href="../Discussion/createpost.html">Create Post</a>
      </div>
    </li>`;
    login.innerHTML = '<li><a id="account-nav" class="nav-link active" href="../Account/logout.html">Logout</a></li>';
  }
})
.then(() => {
  if (activeInputTwo){
    const prefix = '../';
    document.querySelectorAll('nav a, nav .dropdown-item, nav img, video source').forEach(el => {
      const href = el.getAttribute('href');
      if (href) el.setAttribute('href', prefix+href);
      const src = el.getAttribute('src');
      if (src) el.setAttribute('src', prefix+src);
    });
  }
})
.catch(error => {
  console.error('Error loading navbar', error);
});
url = '../includes/footer.html';
if (activeInputTwo) url='../'+url;
fetch(url)
.then(response => response.text())
.then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
})
.catch(error => {
  console.error('Error loading footer', error);
});