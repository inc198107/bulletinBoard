export default $(document).ready(() => {
    $(".bulletin-card").on("click", "#edit-bulletin", function (e) {
        e.preventDefault();
        const findId = $(this).data('find');
        getDetailsForEdit(findId)
        OpenEditModal();
    })

    $('#modal__edit-bulletin').on("click", "#submit-bulletin", function (e) {
        e.preventDefault();
        const editForm = document.getElementById('edit-bulletin');
        editBulletin(editForm);
    })

    const readUrl = (input) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                $('#modal__edit-bulletin #preview-edit').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    const gtFileExtention = (filename) => {
        return /[^.]+$/.exec(filename);
    }

    $('#modal__edit-bulletin #edit-bulletin-image').on('change', function (e) {
        let ext = gtFileExtention(this.value);
        if ((ext[0] === 'jpg') || (ext[0] === 'jpeg') || (ext[0] === 'png')) {
            readUrl(this)
            $('#image-upload-edit .invalid-feedback').text(' ');
            $('#image-upload-edit .invalid-feedback').hide();
        }
        else {
            $('#image-upload-edit .invalid-feedback').text('Wrong format!');
            $('#image-upload-edit .invalid-feedback').show();
            e.preventDefault();
        }
    })


});

const OpenEditModal = function () {
    $("#modal__edit-bulletin").modal("show");
};

const CloseEditModal = function () {
    $("#modal__edit-bulletin").modal("hide");
}

const getDetailsForEdit = (searchId) => {
    $.ajax({
        method: "GET",
        url: `/details?id=${searchId}`
    })
        .done((res) => {
            const detailedData = JSON.parse(res);
            let respData = detailedData[0];
            $('#edit_bulletin_name').val(`${respData.name}`);
            $('#edit-bulletin_describe').text(`${respData.preview}`);
            $('#edit-bulletin_text').text(`${respData.text}`);
            $('.modal-content .media #preview-edit').attr('src', `${respData.image}`);
            $('#search-for-edit').val(`${searchId}`);
        })
        .fail((error) => {
            alert("Something went wrong, try again");
            console.log(error)
        })
}

const editBulletin = (form) => {
    const formData = new FormData(form)
    $.ajax({
        method: "PATCH",
        url: '/edit-bulletin',
        enctype: 'multipart/form-data',
        async: true,
        processData: false,
        contentType: false,
        cache: false,
        data: formData
    })
        .done((res, textStatus) => {
            console.log(res);
            CloseEditModal();
            window.location.reload(true);
        })
        .fail((error) => {
            alert('something went wrong');
            console.log(error);
        })
}