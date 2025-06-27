const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getSuffix(day) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export function getFormattedDateTime(date) {
  const day = date.getDate();
  const suffix = getSuffix(day);
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}${suffix} ${month} ${year} ${hours}:${minutes}`;
}

export function htmlSpecialChars(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function deletePost(id) {
  let localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  localPosts = localPosts.filter(post => post.id !== id);
  if (localPosts.length === 0) {
    localStorage.removeItem('posts');
  } else {
    localStorage.setItem('posts', JSON.stringify(localPosts));
  }
}

export function reply(form) {
  const newReply = {
    postid: parseInt(form.postID.value, 10),
    username: localStorage.getItem('username'),
    reply: form.replyText.value.trim(),
    date: new Date().toISOString()
  };

  let localReplies = JSON.parse(localStorage.getItem('replies')) || [];
  localReplies.push(newReply);
  localStorage.setItem('replies', JSON.stringify(localReplies));
  form.replyText.value = '';

  $('.toast-body').text('Reply saved!');
  $('.toast').toast('show');
}

export function updatePost(form) {
  const postID = parseInt(form.postID.value, 10);
  const updatedText = form.question.value.trim();

  let localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  let postIndex = localPosts.findIndex(p => p.id === postID);

  if (postIndex === -1) {
    console.error(`Post with id ${postID} not found.`);
    $('.toast-body').text('Something went wrong.');
    $('.toast').toast('show');
    return;
  }

  localPosts[postIndex].post = updatedText;
  localPosts[postIndex].date = new Date().toISOString();

  localStorage.setItem('posts', JSON.stringify(localPosts));
  window.location.href = `post.html?id=${postID}`;
}

export function checkField(field) {

}
