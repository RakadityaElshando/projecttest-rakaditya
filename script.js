var navScroll = 0;
navbar = document.getElementById("navbar-id");
navbarColor = document.getElementById("navbar-id");

// disappear when scrolled
window.addEventListener("scroll", () => {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > navScroll) {
    navbar.style.top = "-100px";
  } else {
    navbar.style.top = "0";
    navbarColor.style.backgroundColor = "rgba(224, 93, 37, 0.8)";
  }
  navScroll = scrollTop;
});

// Pagination
window.onload = function () {
  function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start);
    }
    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    document.getElementById("show-page-total").innerHTML = maxLength;

    if (totalPages <= maxLength) {
      return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      return range(1, maxLength - sideWidth - 1).concat(
        0,
        range(totalPages - sideWidth + 1, totalPages)
      );
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      return range(1, sideWidth).concat(
        0,
        range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
      );
    }

    return range(1, sideWidth).concat(
      0,
      range(page - leftWidth, page + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }

  var getLimitPerPage = function () {
    let result = document.getElementById("page-limit").value;
    document.getElementById("show-page-limit").innerHTML = result;
    return result;
  };

  $(function () {
    var numberOfItems = $(".card-content .card-box").length;
    var limitPerPage = getLimitPerPage();
    console.log(limitPerPage);
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 7; //How many page elements visible in the pagination
    var currentPage;

    function showPage(whichPage) {
      if (whichPage < 1 || whichPage > totalPages) return false;

      currentPage = whichPage;

      $(".card-content .card-box")
        .hide()
        .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
        .show();

      $(document).on("change", "#page-limit", function () {
        limitPerPage = getLimitPerPage();
        totalPages = Math.ceil(numberOfItems / limitPerPage);
        showPage(1);
      });

      $(".pagination li").slice(1, -1).remove();

      getPageList(totalPages, currentPage, paginationSize).forEach((item) => {
        $("<li>")
          .addClass("page-item")
          .addClass(item ? "current-page" : "dots")
          .toggleClass("activee", item === currentPage)
          .append(
            $("<a>")
              .addClass("page-link")
              .attr({ href: "javascript:void(0)" })
              .text(item || "...")
          )
          .insertBefore(".next-page");
      });

      $(".previous-page").toggleClass("disable", currentPage === 1);
      $(".next-page").toggleClass("disable", currentPage === totalPages);
      return true;
    }
    $(".pagination").append(
      $("<li>")
        .addClass("page-item")
        .addClass("previous-page")
        .append(
          $("<a>")
            .addClass("page-link")
            .attr({ href: "javascript:void(0)" })
            .text("Prev")
        ),
      $("<li>")
        .addClass("page-item")
        .addClass("next-page")
        .append(
          $("<a>")
            .addClass("page-link")
            .attr({ href: "javascript:void(0)" })
            .text("Next")
        )
    );
    $(".card-content").show();
    showPage(1);
    $(document).on(
      "click",
      "pagination li.current-page:not(.activee)",
      function () {
        return showPage(+$(this).text());
      }
    );
    $(".next-page").on("click", function () {
      return showPage(currentPage + 1);
    });
    $(".previous-page").on("click", function () {
      return showPage(currentPage - 1);
    });
  });
};
