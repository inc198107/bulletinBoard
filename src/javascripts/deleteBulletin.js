$(document).ready(function () {
    $(".bulletin-card").on('click', '#delete-bulletin', function (e) {
        e.preventDefault();
        const currEl = $(this)
        const idToDelete = $(this).data('find');
        deleteBulletinAction(idToDelete,currEl)
    })
})

const deleteBulletinAction = function (itemId,elem) {
    $.ajax({
        method: "DELETE",
        url: `/delete?id=${itemId}`,
    })
    .done((textStatus) => {
         elem.parent().parent().parent().remove()
         console.log(textStatus)
    })
    .fail((error) => {
        console.log(error)
    })
}