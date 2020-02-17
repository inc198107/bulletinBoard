export default $('document').ready(() => {
    let fixGap = $('.header').height();
    if ($('#fixed_filters').length > 0) {
        $('#fixed_filters').scrollToFixed({ marginTop: fixGap + 24 });
    }
    let location = window.location.href.split('/');
    let loc = location[location.length - 1].replace("-", '')
    let links = $('.list-group.list-group-flush a');
    links.each(function (elem) {
        let val = $(this).text().toLowerCase().replace(" ", '');
        if (val === 'all') {
            val = ''
        }
        if (val === loc) {
            $(this).addClass('active');
        }
    })
})