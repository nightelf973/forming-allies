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
  const postID = parseInt(form.postID.value, 10);
  const newReply = {
    postid: postID,
    username: localStorage.getItem('username'),
    reply: form.replyText.value.trim(),
    date: new Date().toISOString()
  };

  let localReplies = JSON.parse(localStorage.getItem('replies')) || [];
  localReplies.push(newReply);
  localStorage.setItem('replies', JSON.stringify(localReplies));
  form.replyText.value = '';
  showToastAndRedirect('Reply saved!', `post.html?id=${postID}`);
}

export function createPost(form) {
  let localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  let postID = 5;
  if (localPosts.length > 0){
  const highID = Math.max(...localPosts.map(post => post.id));
    postID = highID+1;
  }
  const newPost = {
    id: postID,
    post: form.postText.value.trim(),
    date: new Date().toISOString(),
    username: localStorage.getItem('username')
  };
  localPosts.push(newPost);
  localStorage.setItem('posts', JSON.stringify(localPosts));
  showToastAndRedirect('Post created!', `post.html?id=${postID}`);
}

export function updatePost(form) {
  const postID = parseInt(form.postID.value, 10);
  const updatedText = form.question.value.trim();

  let localPosts = JSON.parse(localStorage.getItem('posts')) || [];
  const postIndex = localPosts.findIndex(p => p.id === postID);

  if (postIndex === -1) {
    showToastAndRedirect(`Post with id ${postID} not found.`, 'index.html');
    return;
  }

  localPosts[postIndex].post = updatedText;
  localPosts[postIndex].date = new Date().toISOString();

  localStorage.setItem('posts', JSON.stringify(localPosts));
  showToastAndRedirect('Post updated!', `post.html?id=${postID}`);
}

export function checkField(field) {
  const val = field.val();
  const pattern = field.data('regex');
  const regex = new RegExp(pattern);
  if (val.length==0) {
    fieldInvalid(field,field.data('fieldname')+' cannot be blank.');
  }
  else if (regex && !regex.test(val)){
    fieldInvalid(field, field.data('fieldname')+' is not valid.'+'<br>'+field.data('invalid'));
  } else {
    fieldValid(field);
    return true;
  }
  return false;
}

export function checkAnswer(answer, correctanswer, id, info){
  let message = $('#message' + id); // jQuery selector
  let msg;
  let className ='incorrect';
  if (answer == correctanswer) {
    msg = `<br> Well done! The percentage was ${correctanswer}%<br><br>${info}`;
    className='correct';
  } else if (answer < correctanswer + 10 && answer > correctanswer - 10) {
    className='almost';
    msg = `<br> Close! The actual percentage was ${correctanswer}%<br><br>${info}`;
  } else {
    msg = `<br> Unlucky! The actual percentage was ${correctanswer}%<br><br>${info}`;
  }
  message.html(msg).attr('class',className);
}

function fieldInvalid(field, error){
  const container = field.parent();
  container.removeClass('valid');
  container.addClass('invalid');
  const small = container.find('.info');
  small.html(error);
}

function fieldValid(field){
  const container = field.parent();
  container.removeClass('invalid');
  container.addClass('valid');
  const small = container.find('.info');
  small.html('');
}

function showToastAndRedirect(message, redirectUrl) {
  $('.toast-body').text(message);
  $('.toast').toast('show');
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 3000);
}