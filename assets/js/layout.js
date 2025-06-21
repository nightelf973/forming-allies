
fetch('../includes/navbar.html')
.then(response => response.text())
.then(html => {
  document.body.insertAdjacentHTML('afterbegin', html);
})
.then(() => {
  var activeInput = document.getElementById('active-nav-title').value;
  document.getElementById(activeInput).classList.add('active'); 
  var activeInputTwo = document.getElementById('active-nav-title-two')?.value;
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
    login.innerHTML = `<li><a id="account-nav" class='nav-link active' href='../Account/logout.html'>Logout</a></li>`;
  }
})
.catch(error => {
  console.error('Error loading navbar', error);
});
fetch('../includes/footer.html')
.then(response => response.text())
.then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
})
.catch(error => {
  console.error('Error loading footer', error);
});