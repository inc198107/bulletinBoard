$(document).ready(() => {
    $(".bulletin-card").on("click", ".link-with-rating", function (e) {
        e.preventDefault();
        const findId = $(this).data('find');
        const currAutorName = $(this).data("autor");
        const currBulletinId = $(this).data("id");
        headerIdAdd(currBulletinId);
        getDetails(findId)
        OpenDetailModal();
    });
});

const OpenDetailModal = function () {
    $("#modal__bulletin-detail").modal("show");
};

const headerIdAdd = function (id) {
    $(".modal-title#modal__bulletin-detail-title").text(
        `Bulletin ID: ${id} on board`
    );
};

const activeRatingInit = function (init) {
    $("#modal__bulletin-detail #bulletin-rating").barrating({
        theme: "css-stars",
        initialRating: init
    });
};

const getDetails = (searchId) => {
    $.ajax({
        method: "GET",
        url: `/details?id=${searchId}`
    })
        .done((res) => {
            console.log(res);
            const detailedData = JSON.parse(res);
            let respData = detailedData[0];
            $('.modal-content .media .media-body .mt-0').text(`${ respData.name}`);
            $('.modal-content .media .media-body .created-by').text(`${ respData.authorMail}`);
            $('.modal-content .media .media-body .bulletin-text-content').text(`${ respData.text}`);
            $('.modal-content .media #bulletin-image').attr('src',`${respData.image}`);
            let rating = respData.rating
            activeRatingInit(rating);
        })
}
