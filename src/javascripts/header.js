export default $('document').ready(() => {
    if ($('#fixed-header')) {
        $('#fixed-header').scrollToFixed();
        $('#fixed-header').on('click', '#log-out-btn', function (e) {
            let currentUser = $(this).data('user-mail');
            $(location).attr('href', `logout?&currentUser=${currentUser}`);
        })
    }

    $('#modal__sign-up').on('click', '#register-submit', function (e) {
        let email = $('#new-user-email').val();
        let pwd = $('#new-user-password').val();
        let pwdConf = $('#new-user-pswd-confirm').val();
        if (validateEmail(email) && (pwd === pwdConf)) {
            $('#new-user').submit();
            $('#new-user-password, #new-user-pswd-confirm, #new-user-email').removeClass('errored');
            $('#modal__sign-up').modal("hide");
        }
        else{
            if(!validateEmail(email)){
                $('#new-user-email').addClass('errored');
            }
            if(pwd !== pwdConf){
                $('#new-user-password, #new-user-pswd-confirm').addClass('errored');
            }
        }

    })

    $('#modal__sign-in').on('click', '#log-in-btn', function (e) {
        let email = $('#user-email').val();
        let pwd = $('#user-password').val();
        if (validateEmail(email) && (pwd)) {
            $('#user_log-in').submit();
            $('#user-password, #user-email').removeClass('errored');
            $('#modal__sign-in').modal("hide");
        }
        else{
            if(!validateEmail(email)){
                $('#user-email').addClass('errored');
            }
            if(!pwd){
                $('#user-password').addClass('errored');
            }
        }

    })
})

function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)) {
        return true
    }
    return false
}