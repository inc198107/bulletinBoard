export default $('document').ready(() => {
    const readUrl = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                $('#modal__create-bulletin #preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    const gtFileExtention = (filename) => {
        return /[^.]+$/.exec(filename);
    }

    $('#modal__create-bulletin #new-bulletin-image').on('change', function (e) {
        let ext = gtFileExtention(this.value);
        if ((ext[0] === 'jpg') || (ext[0] === 'jpeg') || (ext[0] === 'png')) {
            readUrl(this)
            $('#image-upload .invalid-feedback').text(' ');
            $('#image-upload .invalid-feedback').hide();
        }
        else {
            $('#image-upload .invalid-feedback').text('Wrong format!');
            $('#image-upload .invalid-feedback').show();
            e.preventDefault();
        }
    })

    $('#modal__create-bulletin').on('click', '#submit-bulletin', function (e) {
        $('#new-bulletin').submit();
    })
}) 