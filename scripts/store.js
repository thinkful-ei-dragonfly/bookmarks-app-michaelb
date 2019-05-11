'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function(){
  let addNewBookmark = false;
  let minimumRating = 1;

  const setError = function(error) {
    this.error = error;
  };

  const addBookmark = function(bookmark) {
    bookmark.expanded = false;
    bookmark.editing = false;
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const findAndUpdate = function(id, newData) {
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
  };

  const setBookmarkIsEditing = function(id, isEditing) {
    const bookmark = this.findById(id);
    bookmark.editing = isEditing;
  };

  return {
    addNewBookmark,
    minimumRating,
    bookmarks: [],
    error: null,
    addBookmark,
    setError,
    findById,
    findAndDelete,
    findAndUpdate,
    setBookmarkIsEditing,
  };
  
}());
