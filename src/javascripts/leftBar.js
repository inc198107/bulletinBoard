export default $('document').ready(()=>{
    let fixGap = $('.header').height();
    if($('#fixed_filters')){
        $('#fixed_filters').scrollToFixed({marginTop:fixGap + 24});
    }
})