const navData = $('#nav-script');
const activeInput = navData.data('active');
const activeInputTwo = navData.data('activeTwo');
const home = navData.data('home');

let url = '../includes/navbar.html';
if (activeInputTwo) url='../'+url;
else if (home) url=url.slice(3);
fetch(url)
  .then(response => response.text())
  .then(html => {
    $('body').prepend(html);
  })
  .then(() => {
    if (activeInput) $(`#${activeInput}`).addClass('active'); 
    if (activeInputTwo) $(`#${activeInputTwo}`).addClass('active');

    if (localStorage.getItem("login") === "true") {
      const discussion = document.getElementById('discussion-link');
      const login = document.getElementById('login-logout-section');
      $('#discussion-link').html(` 
      <li class="nav-item dropdown">
        <a id="discussion-nav" class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">Discussion</a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="../Discussion">Latest Posts</a>
          <a class="dropdown-item" href="../Discussion/myposts.html">My Posts</a>
          <a class="dropdown-item" href="../Discussion/createpost.html">Create Post</a>
        </div>
      </li>`);
      $('#login-logout-section').html('<li><a id="account-nav" class="nav-link active" href="../Account/logout.html">Logout</a></li>');
    }
  })
  .then(() => {
    if (activeInputTwo){
      const prefix = '../';
      $('nav a, nav .dropdown-item, nav img, video source').each(function () {
        const href = $(this).attr('href');
        const src = $(this).attr('src');
        if (href) $(this).attr('href', prefix+href);
        if (src) $(this).attr('src', prefix+src);
      });
    } else if (home){
        $('nav a, nav .dropdown-item, nav img, video source').each(function () {
        const href = $(this).attr('href');
        const src = $(this).attr('src');
        if (href) $(this).attr('href', href.slice(3));
        if (src) $(this).attr('src', src.slice(3));
      });
    }
  })
  .catch(error => {
    console.error('Error loading navbar', error);
  });

url = '../includes/footer.html';
if (activeInputTwo) url='../'+url;
else if (home) url=url.slice(3);
fetch(url)
  .then(response => response.text())
  .then(html => {
    $('body').append(html);
  })
  .catch(error => {
    console.error('Error loading footer', error);
  });