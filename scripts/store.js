'use strict'

// eslint-disable-next-line no-unused-vars
const store = (function(){
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

  const toggleCheckedFilter = function() {
    this.hideCheckedBookmarks = !this.hideCheckedBookmarks;
  };

  const setBookmarkIsEditing = function(id, isEditing) {
    const bookmark = this.findById(id);
    bookmark.editing = isEditing;
  };

  const setSearchTerm = function(term) {
    this.searchTerm = term;
  };

  return {
    bookmarks: [],
    error: null,
    hideCheckedBookmarks: false,
    searchTerm: '',

    addBookmark,
    setError,
    findById,
    findAndDelete,
    findAndUpdate,
    toggleCheckedFilter,
    setSearchTerm,
    setBookmarkIsEditing,
  };
  
}());
