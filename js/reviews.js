$(function() {
    new Swiper('.reviews .swiper-container', {
        speed: 600,
        parallax: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});