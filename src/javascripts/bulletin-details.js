$(document).ready(() => {
    let currAutorName = "";
    let findId = ""
    $(".bulletin-card").on("click", ".link-with-rating", function (e) {
        e.preventDefault();
        findId = $(this).data('find');
        currAutorName = $(this).data("autor");
        const currBulletinId = $(this).data("id");
        headerIdAdd(currBulletinId);
        getDetails(findId)
        OpenDetailModal();
    });

    $("#modal__bulletin-detail").on("show.bs.modal", function (e) {
        let currentUserMail = $("#log-out-btn").data("user-mail");
        const $leaveRevBlock = $("#modal__bulletin-detail span.collapse-review-block");
        const $ratingBlock = $("#modal__bulletin-detail .ratings-block");
        if (currAutorName === currentUserMail) {
            $leaveRevBlock.removeClass('hidden');
            $ratingBlock.removeClass('hidden');
        }
    }).on("click", "span.collapse-review-block", function (e) {
        $("form.leave-review-block").collapse('toggle');
    }).on("click", ".bulletin__leave-review-btn", function (e) {
       const reviewText = $("form.leave-review-block .leave-review-input").val();
       console.log(reviewText);
       leaveReviewAction(reviewText, findId);
    })

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
            activeRatingInit(rating, searchId);
            if ($('#log-out-btn').length === 0) {
                $("#modal__bulletin-detail #bulletin-rating").barrating('readonly', true);
            }
            else {
                let currentUserMail = $("#log-out-btn").data("user-mail");
                if (currentUserMail === respData.authorMail) {
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

const leaveReviewAction = (text, searchId) => {
    $.ajax({
        method: "PATCH",
        url: `/details/review/${searchId}`,
        contentType: 'application/json',
        async: true,
        processData: false,
        cache: false,
        data: JSON.stringify({review: text}),
    })
        .done((res) => {
            const data = JSON.parse(res);
            console.log(data)
        })
        .fail((err) => {
            //window.location.reload(true);
            console.log(err.status)
        })
}
