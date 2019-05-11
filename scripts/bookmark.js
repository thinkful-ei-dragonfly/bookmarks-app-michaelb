'use strict';

/* global store, api, render $ */

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function(){
  function handleNewBookmarkClick() {
    $('#js-add-bookmark-form').on('click', '.js-add-bookmark', event => {
      event.preventDefault();
      store.addNewBookmark = true;
      render.render();
    });
  }

  function handleminimumRatingSelect() {
    $('.js-minimumRating').change(function (event) {
      store.minimumRating = $(event.currentTarget).val();
      render.render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#js-add-bookmark-form').submit(function (event) {
      event.preventDefault();
      const newBookmarkDesc = $('.js-bookmark-list-desc').val();
      const newBookmarkRating = parseInt($('input:radio[name=js-bookmark-list-rating]:checked').val());
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
          store.addNewBookmark = false;
          render.render();
          
        })
        .catch((err) => {
          store.setError(err.message);
          render.renderError();
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
        render.render();
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
          render.render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          render.renderError();
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
      const bookmarkRating = parseInt($(event.currentTarget.parentElement).find('input:radio[name=js-bookmark-edit-rating]:checked').val());
      let updateBookmarkBody = {};
      updateBookmarkBody.title = bookmarkTitle;
      updateBookmarkBody.url = bookmarkURL;
      if (bookmarkDesc) { updateBookmarkBody.desc = bookmarkDesc; }
      updateBookmarkBody.rating = bookmarkRating;
      api.updateBookmark(id, updateBookmarkBody)
        .then(() => {
          store.findAndUpdate(id, updateBookmarkBody);
          store.setBookmarkIsEditing(id, false);
          render.render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          render.renderError();
        });
    });
  }

  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render.render();
    });
  }
  
  function handleBookmarkListSearch() {
    $('.js-bookmark-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render.render();
    });
  }

  function handleBookmarkStartEditing() {
    $('.js-bookmark-list').on('click', '.js-bookmark-edit', event => {
      const id = getBookmarkIdFromElement(event.target);
      store.setBookmarkIsEditing(id, true);
      render.render();
    });
  }

  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      render.renderError();
    });
  }
  
  function bindEventListeners() {
    handleminimumRatingSelect();
    handleNewBookmarkClick();
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
    bindEventListeners: bindEventListeners,
  };
}());
