$(function() {
    $('.top-menu-dropdown').on('mouseenter', function() {
        $(this).siblings('.top-menu-dropdown').find('.top-menu-submenu').hide();
        $(this).siblings('.top-menu-dropdown').removeClass('expanded');
        $(this).find('.top-menu-submenu').show();
        $(this).addClass('expanded');
    });
    $(window).on('click', function() {
        $('.top-menu-submenu').hide();
        $('.top-menu-dropdown').removeClass('expanded');
    });
    $('.top-menu-dropdown').on('click', function(event){
        event.stopPropagation();
    });
});
