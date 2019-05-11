'use strict';

/* global store, api, $ */

// eslint-disable-next-line no-unused-vars

const render = (function(){

  function generateBookmarkString(bookmarkList) {
    const bookmarks = bookmarkList.map(function(bookmark) {
      if (bookmark.rating >= store.minimumRating) {
        return generateBookmarkElement(bookmark);
      }
    });
    return bookmarks.join('');
  }

  function addNewBookmarkForm() {
    if (store.addNewBookmark) {
      return `
      <div id="add-bookmark">
        <h2>Add a Bookmark:</h2>
        <p><label for="bookmark-list-title">Title</label>
        <input type="text" name="bookmark-list-title" class="js-bookmark-list-title" placeholder="Google" required></p>
        <p><label for="bookmark-list-url">URL</label>
        <input type="url" name="bookmark-list-url" class="js-bookmark-list-url" placeholder="http://google.com" required></p>
        <p><textarea rows="4" cols="50" name="bookmark-list-desc" class="js-bookmark-list-desc" placeholder="Enter description here... (optional)"></textarea></p>
        Select Rating:
        <input type="radio" name="js-bookmark-list-rating" value="1" required>1</input>
        <input type="radio" name="js-bookmark-list-rating" value="2">2</input>
        <input type="radio" name="js-bookmark-list-rating" value="3">3</input>
        <input type="radio" name="js-bookmark-list-rating" value="4">4</input>
        <input type="radio" name="js-bookmark-list-rating" value="5">5</input>
        <p><button type="submit">Submit</button></p>
      </div>`;
    } else {
      return `
      <button class="js-add-bookmark">
        <span class="button-label">Add Bookmark</span>
      </button>`;
    }
  }

  function generateBookmarkElement(bookmark) {
    let bookmarkHTML = `<a href="${bookmark.url}" target="_blank" alt="${bookmark.desc}"><span class="bookmark-title">${bookmark.title}</span></a>`;`<a href="${bookmark.url}" target="_blank" alt="${bookmark.desc}"><span class="bookmark-title">${bookmark.title}</span></a>`;

    if (bookmark.expanded) {
      bookmarkHTML = `
        <a href="${bookmark.url}" target="_blank" alt="${bookmark.desc}"><span class="bookmark-title">${bookmark.title}</span></a>
        <div class="bookmark-description"><br>
          ${bookmark.desc}
        </div><br>
        <div class="bookmark-controls">
        <button class="bookmark-visit js-bookmark-visit">
          <span class="button-label">Visit Site</span>
        </button>
        <button class="bookmark-edit js-bookmark-edit">
          <span class="button-label">Edit</span>
        </button>
        <button class="bookmark-delete js-bookmark-delete">
          <span class="button-label">Delete</span>
        </button><br>`;
    }
    let bookmarkRatingStars = '';
    if (!bookmark.desc) { bookmark.desc = ''; }
    if (bookmark.editing) {
      bookmarkHTML = 
        `<div class="bookmark-edit-controls">
          <form class="js-edit-bookmark">
            <input class="js-bookmark-edit-title" type="text" value="${bookmark.title}" required/>
            <input type="url" name="bookmark-edit-url" class="js-bookmark-edit-url" value="${bookmark.url}" required></input>
            <p><textarea rows="4" cols="50" name="bookmark-edit-desc" class="js-bookmark-edit-desc">${bookmark.desc}</textarea></p>`;
      for (let i=1;i < 6;i++) {
        if ( bookmark.rating === i ) {
          bookmarkHTML += `<input type="radio" name="js-bookmark-edit-rating" value="${i}" checked="checked">${i}</input>`;
        } else {
          bookmarkHTML += `<input type="radio" name="js-bookmark-edit-rating" value="${i}">${i}</input>`;
        }
      }
      bookmarkHTML += 
        `<button class="bookmark-edit-submit js-bookmark-edit-submit">
            <span class="button-label">Submit</span>
            </button>
          </form>
        </div>`;
    } else {
      bookmarkRatingStars = '<div class="rating-stars">';
      for (let i=0; i < parseInt(bookmark.rating, 10); i++) {
        bookmarkRatingStars += '★';
      }
      for (let i=0; i < 5 - parseInt(bookmark.rating, 10); i++) {
        bookmarkRatingStars += '☆';
      }
      bookmarkRatingStars += '</div>';
    }

    return `
      <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        ${bookmarkHTML} ${bookmarkRatingStars}
        </div>
      </li>`;
  }

  function renderError() {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
  }

  function render() {
    renderError();

    $('#js-add-bookmark-form').html(addNewBookmarkForm());

    // Filter bookmark list if store prop is true by bookmark.checked === false
    let bookmarks = [ ...store.bookmarks ];

    // render the bookmark list in the DOM
    console.log('`render` ran');
    const bookmarkListString = generateBookmarkString(bookmarks);

    // insert that HTML into the DOM
    $('.js-bookmark-list').html(bookmarkListString);
  }

  function generateError(message) {
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  return {
    render,
    renderError
  };
}());