/* eslint-env jquery, browser */
$(document).ready(() => {});

$(".alert").fadeOut(3000);

$.typeahead({
  input: ".js-typeahead-politicians",
  order: "desc",
  display: ["name"],
  href: "/politician/{{_id}}",
  mustSelectItem: true,
  //generateOnLoad: true,
  minLength: 0,
  searchOnFocus: true,
  hint: true,
  emptyTemplate:
    "no result for {{query}}  <a class='btn btn-primary float-right' href='/addPolitician' role='button'>Add A Polly</a>",
  source: {
    remote: {
      url: "/search/"
    }
  }
});
