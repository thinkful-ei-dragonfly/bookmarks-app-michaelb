'use strict'

/* global store, api, $ */

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function(){

  function generateError(message) {
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateBookmarkElement(bookmark) {
    // const checkedClass = bookmark.editing ? 'bookmark__checked' : '';
    // const editBtnStatus = bookmark.editing ? 'disabled' : '';

    // let bookmarkTitle = `<span class="bookmark-title ${checkedClass}">${bookmark.title}</span>`;
    let bookmarkHTML = `<a href="${bookmark.url}" target="_blank" alt="${bookmark.desc}"><span class="bookmark-title">${bookmark.title}</span></a>`;
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
    if (!bookmark.desc) { bookmark.desc = "" }
    if (bookmark.editing) {
      bookmarkHTML = 
        // `
        // <form class="js-edit-bookmark">
        //   <input class="bookmark-title" type="text" value="${bookmark.title}" />
        // </form>
        // <div class="bookmark-edit-controls">
        // <button class="bookmark-edit-submit js-bookmark-edit-submit">
        //   <span class="button-label">Submit</span>
        // </button>`

        `<div class="bookmark-edit-controls">
          <form class="js-edit-bookmark">
            <input class="js-bookmark-edit-title" type="text" value="${bookmark.title}" required/>
            <input type="url" name="bookmark-edit-url" class="js-bookmark-edit-url" value="${bookmark.url}" required></input>
            <p><textarea rows="4" cols="50" name="bookmark-edit-desc" class="js-bookmark-edit-desc">${bookmark.desc}</textarea></p>
            <input type="radio" name="js-bookmark-edit-rating" value="1">1</input>
            <input type="radio" name="js-bookmark-edit-rating" value="2">2</input>
            <input type="radio" name="js-bookmark-edit-rating" value="3">3</input>
            <input type="radio" name="js-bookmark-edit-rating" value="4">4</input>
            <input type="radio" name="js-bookmark-edit-rating" value="5">5</input>
            <button class="bookmark-edit-submit js-bookmark-edit-submit">
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
    // <button class="bookmark-edit js-bookmark-edit ${editBtnStatus}">
    //   <button class="bookmark-edit js-bookmark-edit">
    //   <span class="button-label">Edit</span>
    // </button>

    return `
      <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        ${bookmarkHTML} ${bookmarkRatingStars}
        </div>
      </li>`;
  }

  // <button class="bookmark-bookmark-toggle js-bookmark-toggle">
  //   <span class="button-label">check</span>
  // </button>


  
  function generateBookmarkString(bookmarkList) {
    const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
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

    // Filter bookmark list if store prop is true by bookmark.checked === false
    let bookmarks = [ ...store.bookmarks ];
    if (store.hideCheckedBookmarks) {
      bookmarks = bookmarks.filter(bookmark => !bookmark.checked);
    }
  
    // Filter bookmark list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      bookmarks = bookmarks.filter(bookmark => bookmark.title.includes(store.searchTerm));
    }
  
    // render the bookmark list in the DOM
    console.log('`render` ran');
    const bookmarkListString = generateBookmarkString(bookmarks);
  
    // insert that HTML into the DOM
    $('.js-bookmark-list').html(bookmarkListString);
  }

  function handleNewBookmarkSubmit() {
    $('#js-bookmark-list-form').submit(function (event) {
      event.preventDefault();
      const newBookmarkDesc = $('.js-bookmark-list-desc').val();
      const newBookmarkRating = $('input:radio[name=js-bookmark-list-rating]:checked').val();
      let newBookmarkBody = {};
      newBookmarkBody.title = $('.js-bookmark-list-title').val();
      newBookmarkBody.url = $('.js-bookmark-list-url').val();
      if (newBookmarkDesc) { newBookmarkBody.desc = newBookmarkDesc; }
      if (newBookmarkRating) { newBookmarkBody.rating = newBookmarkRating; }
      $('.js-bookmark-list-title').val('');
      $('.js-bookmark-list-url').val('');
      $('.js-bookmark-list-desc').val('');
      $('input:radio[name=js-bookmark-list-rating]:checked').prop("checked", false);
      api.createBookmark(newBookmarkBody)
        .then((newBookmark) => {
          store.addBookmark(newBookmark);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });
    });
  }
  
  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }
  
  function handleBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-element', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      if (!bookmark.editing) {
        bookmark.expanded = !bookmark.expanded;
        render();
      }
    });
  }
  
  function handleVisitSiteClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-visit', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      window.location.href = bookmark.url;      
    });
  }

  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          renderError();
        }
        );
    });
  }

  function handleEditBookmarkSubmit() {
    $('.js-bookmark-list').on('click', '.js-bookmark-edit-submit', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmarkTitle = $(event.currentTarget.parentElement).find('.js-bookmark-edit-title').val();
      const bookmarkURL = $(event.currentTarget.parentElement).find('.js-bookmark-edit-url').val();
      const bookmarkDesc = $(event.currentTarget.parentElement).find('.js-bookmark-edit-desc').val();
      const bookmarkRating = $(event.currentTarget.parentElement).find('input:radio[name=js-bookmark-edit-rating]:checked').val();
      let updateBookmarkBody = {};
      updateBookmarkBody.title = bookmarkTitle;
      updateBookmarkBody.url = bookmarkURL;
      if (bookmarkDesc) { updateBookmarkBody.desc = bookmarkDesc; }
      if (bookmarkRating) { updateBookmarkBody.rating = bookmarkRating; }
      api.updateBookmark(id, updateBookmarkBody)
        .then(() => {
          store.findAndUpdate(id, updateBookmarkBody);
          store.setBookmarkIsEditing(id, false);
          render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          renderError();
        });
    });
  }

  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }
  
  function handleBookmarkListSearch() {
    $('.js-bookmark-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleBookmarkStartEditing() {
    $('.js-bookmark-list').on('click', '.js-bookmark-edit', event => {
      const id = getBookmarkIdFromElement(event.target);
      store.setBookmarkIsEditing(id, true);
      render();
    });
  }

  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      renderError();
    });
  }
  
  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleBookmarkClicked();
    handleVisitSiteClicked();
    handleDeleteBookmarkClicked();
    handleEditBookmarkSubmit();
    handleToggleFilterClick();
    handleBookmarkListSearch();
    handleBookmarkStartEditing();
    handleCloseError();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
