/* eslint-env jquery, browser */
$(document).ready(() => {});

$(".alert").fadeOut(3000);

$.typeahead({
  input: ".js-typeahead-politicians",
  order: "desc",
  minLength: 3,
  display: ["name"],
  href: "/politician/{{shortId}}",
  mustSelectItem: true,
  //dynamic: true,
  //delay: 500,
  hint: true,
  emptyTemplate:
    "no result for {{query}}  <a class='btn btn-primary float-right' href='add/a/politician' role='button'>Add A Polly</a>",
  source: {
    remote: {
      url: "/search/"
    }
  }
});
