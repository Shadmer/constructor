$(function() {
    $('.rubricator__toggle').on('click', function (e) {
        let content = $(this).attr('data-content');
        $('.rubricator__content').hide();
        $(content).show();
    });
});