
$(document).ready(() => {
    let currAutorName = "";
    let findId = ""

    $(".bulletin-card").on("click", ".link-with-rating", function (e) {
        e.preventDefault();
        findId = $(this).data('find');
        currAutorName = $(this).data("autor");
        const currBulletinId = $(this).data("id");
        headerIdAdd(currBulletinId);
        getDetails(findId);
        OpenDetailModal();
    });

    $("#modal__bulletin-detail").on("show.bs.modal", function (e) {
        const $leaveRevBlock = $(".modal-content span.collapse-review-block");
        const $RatingBlock = $(".modal-content .ratings-block p")
        let currentUserMail = $("#log-out-btn").data("user-mail");
        if (currentUserMail !== currAutorName) {
            $leaveRevBlock.removeClass('hidden');
            $RatingBlock.text("Rate this Bulletin (1 to 5 stars):");
        }
        else if($('#log-out-btn').length === 0 || (currentUserMail === currAutorName)){
            $leaveRevBlock.addClass('hidden');
            $RatingBlock.text("Bulletins Rating:");
        }
    }).on("hide.bs.modal", function (e) {
        currAutorName = '';
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

            const reviewItem = function(text, date){
                return $(`<div class='review' ><span class='date'>${date}</span><p>${text}</p></div>`);
            }

            let respData = detailedData[0];
            $('.modal-content .media .media-body .mt-0').text(`${respData.name}`);
            $('.modal-content .media .media-body .created-by').text(`${respData.authorMail}`);
            $('.modal-content .media .media-body .bulletin-text-content').text(`${respData.text}`);
            $('.modal-content .media #bulletin-image').attr('src', `${respData.image}`);
            if (respData.comments.length > 0 ){
                $("#reviews-block .review").remove();
                $("#reviews-block").removeClass("hidden");
                respData.comments.forEach((item) => {
                    $("#reviews-block").append(reviewItem(item.body, item.date || "no date"));
                })
            }
            else{
                $("#reviews-block").addClass("hidden"); 
                $("#reviews-block .review").remove();
            }
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
        data: JSON.stringify({ review: text }),
    })
        .done((res) => { 
            getDetails(searchId);
        })
        .fail((err) => {
            window.location.reload(true);
        })
}
