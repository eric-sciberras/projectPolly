/* eslint-env jquery, browser */
$(document).ready(() => {

});

$.typeahead({
  input: '.js-typeahead-politicians',
  order: "desc",
  minLength: 3,
  display: ["name"],
  href:"/{{_id}}",
 //dynamic: true,
  //delay: 500,
  hint: true,
  emptyTemplate: "no result for {{query}}",
  source: {
    remote: {
      url: '/search/',
    }
  },
});