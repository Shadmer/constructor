$(function () {
    $('.page-header__hamburger').on('click', function () {
        $('.page-header__main-nav').stop('true', 'true').toggle("fast");
    });

    $(window).resize(function () {
        if ($(window).width() < 780) {
            $('.page-header__main-nav').removeClass('page-header__main-nav--pc');
        } else {
            $('.page-header__main-nav').addClass('page-header__main-nav--pc');
        }
    });

});