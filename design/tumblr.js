var client_id = "api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
var happy_url = "http://api.tumblr.com/v2/tagged?tag=happy&api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
var random_happy = Math.round(math.random() * 2207);
var gloomy_url = "http://api.tumblr.com/v2/tagged?tag=gloomy&api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4"

var moods = {
	happy:{
		url: "http://api.tumblr.com/v2/tagged?tag=happy&api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",
		total: 200000,
	}
}

var showPhoto = function (response) {
	console.log(response.photos.items[index]);

var mood = "happy";

$.ajax({
  url: moods[mood].url,
  data: {
  	client_id: ""
  	limit: 1,
  	offset: Math.round(Math.random() * moods.happy.total)
  } 
  success: showRandomPhoto,
});





});

});