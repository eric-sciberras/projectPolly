/* eslint-env jquery, browser */
$(document).ready(() => {

});

$.typeahead({
  input: '.js-typeahead-politicians',
  order: "desc",
  minLength: 3,
  display: ["name"],
  href:"/politician/{{_id}}",
 //dynamic: true,
  //delay: 500,
  hint: true,
  // emptyTemplate: function () {
  //   return "<p class="lead">Can't find the Politician you are looking for :</p> <button type="button" class="btn btn-primary" href="/add/a/politician">Add a Polly</button>";
  // },
  emptyTemplate: "no result for {{query}}  <a class='btn btn-primary float-right' href='add/a/politician' role='button'>Add A Polly</a>",
  // emptyTemplate: "no result for {{query}}",
  source: {
    remote: {
      url: '/search/',
    }
  },
});