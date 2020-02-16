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

const activeRatingInit = function (init, findId) {
    $("#modal__bulletin-detail #bulletin-rating").barrating({
        theme: "css-stars",
        initialRating: init,
        onSelect: function (value, text, event) {
            if (typeof (event) !== 'undefined') {
                let votedRate = $(event.target).data("rating-value");
                console.log('votedRate', votedRate);
                vote(votedRate, findId);
            } else {
                return
            }
        }
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
            $('.modal-content .media .media-body .mt-0').text(`${respData.name}`);
            $('.modal-content .media .media-body .created-by').text(`${respData.authorMail}`);
            $('.modal-content .media .media-body .bulletin-text-content').text(`${respData.text}`);
            $('.modal-content .media #bulletin-image').attr('src', `${respData.image}`);
            let rating = 1;
            if (respData.votesCount > 0) {
                rating = respData.ratingCount / respData.votesCount
            }
            activeRatingInit(rating,searchId);
            if ($('#log-out-btn').length === 0) {
                $("#modal__bulletin-detail #bulletin-rating").barrating('readonly', true);
            }
            else {
                let currentUserMail = $('#log-out-btn').data("user-mail");
                if (currentUserMail === respData.authorMail) {
                    console.log(currentUserMail, respData.authorMail);
                    $("#modal__bulletin-detail #bulletin-rating").barrating('readonly', true);
                }
                else {
                    $("#modal__bulletin-detail #bulletin-rating").barrating('readonly', false);
                }
            }
        })
}

const vote = (rate, searchId) => {
    $.ajax({
        method: "GET",
        url: `/details/vote?id=${searchId}&rate=${rate}`
    })
        .done((res) => {
            const rateData = JSON.parse(res);
            let updatedRate = rateData[0].currRate;
            $("#modal__bulletin-detail #bulletin-rating").barrating('readonly', true);
            $("#modal__bulletin-detail #bulletin-rating").barrating('set', updatedRate || 1);
        })
}
