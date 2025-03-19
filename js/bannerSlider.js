$(function() {
    new Swiper('.banner-slider .swiper-container', {
        speed: 600,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});