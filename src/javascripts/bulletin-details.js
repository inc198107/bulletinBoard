$(document).ready(() => {
    $(".bulletin-card").on("click", ".link-with-rating", function (e) {
        e.preventDefault();
        const currAutorName = $(this).data("autor");
        const currBulletinId = $(this).data("id");
        headerIdAdd(currBulletinId);
        OpenDetailModal();
        activeRatingInit(3);
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
