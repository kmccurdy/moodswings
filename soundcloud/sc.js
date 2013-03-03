// link to [public html file](https://dl.dropbox.com/u/35819006/bghackathon/moodswings/soundcloud/index.html)

SC.initialize({
    client_id: 'fb893732ab2c0c18a96178561feeac0b',
    redirect_uri: 'https://dl.dropbox.com/u/35819006/bghackathon/moodswings/soundcloud/index.html'
});

var tumblr_client_id = "api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";

// normalize emotion dimensions
$.each(emotion_data, function(ind, obj){
    obj.valence /= norm.valence;
    obj.valence = 1 - obj.valence;
    obj.arousal /= norm.arousal;
    obj.arousal = 1 - obj.arousal;
})

var emoCoords, gridDims;
    var params = {};

$(document).ready(function() {

    $('#mood-dragger').hide();
    gridDims = {height: $('#mood-grid').height(), width: $('#mood-grid').width() };
    $('#mood-grid').css({
//	"left": $('#form input[name="mood"]').offset().left + ($('#form input[name="mood"]').width() - $('#mood-grid').width())
    })
    $('#mood-dragger').css({
	"display": "inline"
    })
    $('#mood-dragger').removeClass("f-left");
    var	bpmRange = 80, bpmQueryRange = 10;
    params.minBPM = 60;

    // make voronoi vertices for emotion space
/*    var vor = d3.geom.voronoi(emotion_data.map(function(d){
	return [(1 - d.arousal) * gridDims.width, (1 - d.valence) * gridDims.height]
    }));
    var polygon_grid = $.each
    console.log(vor);
*/
    // on form submit, update mood grid, get soundcloud tracks
    $('#form').submit(function(e){
	e.preventDefault();
	params.mood = $('#form input[name="mood"]').val();

	$.each(emotion_data, function(ind, obj){
	    if (obj["name"] === params.mood) params.emotion = obj;
	});

	if (typeof params.emotion != 'undefined') {
	    if (params.emotion.name != params.mood) {delete params.emotion};
	}

	params.maxBPM = params.minBPM + bpmRange *  (typeof params.emotion != 'undefined' ? params.emotion.arousal : .5 );

	bpmQueryRange += (typeof params.emotion != 'undefined' ? (.5 - params.emotion.arousal) : 0) * bpmQueryRange // normalize: more extreme values get larger bpm ranges
	params.minBPM = params.maxBPM - bpmQueryRange;

	getTracks(params);
	getPics(params);

	$('#mood-dragger').css("top", typeof params.emotion != 'undefined' ?
			       (1 - params.emotion.arousal) * gridDims.height :
			      gridDims.height * .25); // TODO figure out this default assumption
	$('#mood-dragger').css("left", typeof params.emotion != 'undefined' ? 
			       (.5 - params.emotion.valence) * gridDims.width :
			      gridDims.width * .5); //TODO this one too
//	$('#mood-dragger').text(params.mood);
    });

    $('#mood-dragger').css("top", typeof params.emotion != 'undefined' ?
			   (1 - params.emotion.arousal) * gridDims.height :
			   gridDims.height * .5); // TODO figure out this default assumption
    $('#mood-dragger').css("left", typeof params.emotion != 'undefined' ? 
			   (.5 - params.emotion.valence) * gridDims.width :
			   gridDims.width * -.25); //TODO this one too
    $('#mood-dragger').show();
	
    $('#mood-dragger').draggable();
    $('#mood-dragger').on("dragstop",function(event, ui){
	console.log(ui.position);
	var newCoords = ui.position;
	
	
	
	params.maxBPM = params.minBPM + bpmRange * (newCoords.top/gridDims.height);
	params.minBPM = params.maxBPM - bpmQueryRange;
	getTracks(params);
	getPics(params);
    });

});

getTracks = function(params) {
	// get a bunch of tracks within parameters, stream random track
	SC.get('/tracks', {bpm: {from: params.minBPM, to: params.maxBPM}, tags: params.mood }, function(tracks) { 
	    if (tracks.length === 0) {	 
		SC.get('/tracks', {bpm: {from: params.minBPM, to: params.maxBPM}, q: params.mood}, function(newtracks) {
		    var sel = Math.floor(Math.random() * newtracks.length);
		     SC.oEmbed(newtracks[sel].permalink_url, document.getElementById('player'));
/*		    var trackIDs = [];
		    $.each(newtracks, function(ind, tr) {trackIDs.push(tr.id);})
			inspect["trackIDs"] = trackIDs;  */
		    //console.log(newtracks[sel].bpm);
		});
	    } else {
		var sel = Math.floor(Math.random() * tracks.length);
		SC.oEmbed(tracks[sel].permalink_url, document.getElementById('player'));
		//console.log(tracks[sel].bpm);
	    }	 
	});
}

getPics = function(params) {
    $.ajax(
	'http://api.tumblr.com/v2/tagged?tag=' + params.mood + '&' + tumblr_client_id,
	{
	    dataType: 'jsonp',
	    success: function (data) { 
		do { params.pic = getRandomPic(data) }
		while (typeof params.pic == 'undefined'); 
		$('body').css({'background-image': 'url(' + params.pic + ')',
			       'background-repeat': 'no-repeat',
			       'background-size' : '100%, 100%' }) // $('body').width() +',' +  $('body').height()
		return(params);
	    },
	    limit: 100,
	}
    );
}

getRandomPic = function(data) {
    var posts = data.response;
    var sel = Math.floor(Math.random() * posts.length);
    var randomPhotos = posts[sel].photos;
    if (typeof randomPhotos != 'undefined') {
	var photo_sel = Math.floor(Math.random() * randomPhotos.length);
	return (randomPhotos[photo_sel].original_size.url);
    } else {
	getRandomPic(data);
    }
}

