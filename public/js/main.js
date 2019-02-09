/* eslint-env jquery, browser */
$(document).ready(() => {});

$(".alert").fadeOut(3000);

/*Search Bar*/
$.typeahead({
  input: ".js-typeahead-politicians",
  minLength: 0,
  maxItem: 15,
  order: "asc",
  hint: true,
  searchOnFocus: true,
  mustSelectItem: true,
  group: {
    template: "{{group}}"
  },
  cache: true,
  maxItemPerGroup: 5,
  href: function(item) {
    if (item.group == "Politician") {
      return "/politician/" + item._id;
    } else {
      return (
        item.group.replace(" ", "-") + "/" + item.display.replace(" ", "-")
      );
    }
  },
  dropdownFilter: "All",
  emptyTemplate:
    "no result for {{query}}  <a class='btn btn-primary float-right' href='/addPolitician' role='button'>Add A Polly</a>",
  source: {
    Politician: {
      url: "/searchPoliticians/"
    },
    "Political Party": {
      ajax: {
        type: "GET",
        url: "/searchParties/",
        path: ""
      }
    },
    Electorate: {
      ajax: {
        type: "GET",
        url: "/searchElectorates/",
        path: ""
      }
    }
  }
});
