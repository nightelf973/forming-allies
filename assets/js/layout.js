const navData = $('#nav-script');
const activeInput = navData.data('active');
const activeInputTwo = navData.data('activeTwo');
const home = navData.data('home');

function resolveUrl(baseUrl) {
  if (activeInputTwo) return '../' + baseUrl;
  if (home) return baseUrl.slice(3);
  return baseUrl;
}

function adjustResourcePaths(prefixOrFn) {
  $('nav a, nav .dropdown-item, nav img, video source').not('.logout').each(function () {
    const $el = $(this);
    const href = $el.attr('href');
    const src = $el.attr('src');
    if (href) $el.attr('href', typeof prefixOrFn === 'function' ? prefixOrFn(href) : prefixOrFn + href);
    if (src) $el.attr('src', typeof prefixOrFn === 'function' ? prefixOrFn(src) : prefixOrFn + src);
  });
}

fetch(resolveUrl('../includes/navbar.html'))
  .then(response => response.text())
  .then(html => {
    $('body').prepend(html);
  })
  .then(() => {
    if (activeInput) $(`#${activeInput}`).addClass('active'); 
    if (activeInputTwo) $(`#${activeInputTwo}`).addClass('active');
    if (localStorage.getItem("login") === "true") {
      const discussion = $('#discussion-link');
      discussion.addClass('dropdown');
      const login = document.getElementById('login-logout-section');
      discussion.html(` 
        <a id="discussion-nav" class="nav-link dropdown-toggle" href="#" data-toggle="dropdown">Discussion</a>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="../Discussion">Latest Posts</a>
          <a class="dropdown-item" href="../Discussion/myposts.html">My Posts</a>
          <a class="dropdown-item" href="../Discussion/createpost.html">Create Post</a>
        </div>`);
      $('#login-logout-section').html('<li><a id="account-nav" class="nav-link active logout" type="button" href="javascript:void(0)">Logout</a></li>');
    }
  })
  .then(() => {
    if (activeInput=='gameher-space-nav') adjustResourcePaths('../');
    else if (home) adjustResourcePaths(str => str.slice(3));
  })
  .catch(error => {
    console.error('Error loading navbar', error);
  });

fetch(resolveUrl('../includes/footer.html'))
  .then(response => response.text())
  .then(html => {
    $('body').append(html);
  })
  .catch(error => {
    console.error('Error loading footer', error);
  });

$(document).on('click', '.logout', function(event) {
  event.preventDefault();
  localStorage.removeItem('login');
  location.reload();
});