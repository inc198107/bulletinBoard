const cardDecorator = (result) => {
    let bulletinsArr = [];
    return bulletinsArr = result.map((item) => {
        let countedRating = 0;
        if (item.votesCount > 0) {
            countedRating = (item.ratingCount / item.votesCount);
        }
        return {
            authorMail: item.authorMail,
            rating: countedRating,
            category: item.category,
            preview: item.preview,
            id: item.id,
            name: item.name,
            image: item.image,
            findId: item.findId
        }
    })
}
module.exports = cardDecorator