var Promise = require('bluebird');

var ReviewsOptions = [
    '“Very stylish, great stay, great staff”',
    '“good hotel awful meals”',
    '“Need more attention to little things”',
    '“Lovely small hotel ideally situated to explore the area.”',
    '“Positive surprise”',
    '“Beautiful suite and resort”'];

module.exports = {
    searchHotels: function (destination) {
        return new Promise(function (resolve) {

            // Filling the hotels results manually just for demo purposes
            var hotels = [];
            //for (var i = 1; i <= 5; i++) {
                hotels.push({
                    name: "店舗管理",
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'http://www.gulfnet.co.jp/csm/img/contents/function/shopmanagement/function01-image01.png'
                });
				
                hotels.push({
                    name:  '勤怠管理',
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'http://www.gulfnet.co.jp/csm/img/contents/function/shopmanagement/function04-image01.png'
                });		
				
                hotels.push({
                    name: '経営管理',
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'http://www.gulfnet.co.jp/csm/img/contents/function/businessmanagement/function02-image01.png'
                });	

                hotels.push({
                    name: "コミュニケーション",
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'http://www.gulfnet.co.jp/csm/img/contents/function/communication/function01-image01.png'
                });

                hotels.push({
                    name: '本部機能',
                    location: destination,
                    rating: Math.ceil(Math.random() * 5),
                    numberOfReviews: Math.floor(Math.random() * 5000) + 1,
                    priceStarting: Math.floor(Math.random() * 450) + 80,
                    image: 'http://www.gulfnet.co.jp/csm/img/contents/function/headquarters/function01-image01.png'
                });				
            //}

            hotels.sort(function (a, b) { return a.priceStarting - b.priceStarting; });

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(hotels); }, 1000);
        });
    },

    searchHotelReviews: function (hotelName) {
        return new Promise(function (resolve) {

            // Filling the review results manually just for demo purposes
            var reviews = [];
            for (var i = 0; i < 5; i++) {
                reviews.push({
                    title: ReviewsOptions[Math.floor(Math.random() * ReviewsOptions.length)],
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris odio magna, sodales vel ligula sit amet, vulputate vehicula velit. Nulla quis consectetur neque, sed commodo metus.',
                    image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif'
                });
            }

            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(reviews); }, 1000);
        });
    }
};