// link to [public html file](https://dl.dropbox.com/u/35819006/bghackathon/moodswings/soundcloud/index.html)

SC.initialize({
    client_id: 'fb893732ab2c0c18a96178561feeac0b',
    redirect_uri: 'https://dl.dropbox.com/u/35819006/bghackathon/moodswings/soundcloud/index.html'
});

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
    var	bpmRange = 80, bpmQueryRange = 10;
    params.minBPM = 60;

    $('#form').submit(function(e){
	e.preventDefault();
	params.mood = $('#form input[name="mood"]').val();
	$.each(emotion_data, function(ind, obj){
	    if (obj["name"] === params.mood) params.emotion = obj;
	});
	params.maxBPM = params.minBPM + bpmRange *  (typeof params.emotion != 'undefined' ? params.emotion.arousal : .5 );

	bpmQueryRange += (typeof params.emotion != 'undefined' ? (.5 - params.emotion.arousal) : 0) * bpmQueryRange // normalize: more extreme values get larger bpm ranges
	params.minBPM = params.maxBPM - bpmQueryRange;

	getTracks(params);

		$('#mood-dragger').css("top", typeof params.emotion != 'undefined' ?
			       (1 - params.emotion.valence) * gridDims.height :
			      gridDims.height * .25); // TODO figure out this default assumption
	$('#mood-dragger').css("left", typeof params.emotion != 'undefined' ? 
			       (1 - params.emotion.arousal) * gridDims.width :
			      gridDims.width * .5); //TODO this one too
    });

    $('#mood-dragger').css("top", typeof params.emotion != 'undefined' ?
			   (1 - params.emotion.valence) * gridDims.height :
			   gridDims.height * .25); // TODO figure out this default assumption
    $('#mood-dragger').css("left", typeof params.emotion != 'undefined' ? 
			   (1 - params.emotion.arousal) * gridDims.width :
			   gridDims.width * .5); //TODO this one too
    $('#mood-dragger').show();
	
    $('#mood-dragger').draggable();
    $('#mood-dragger').on("dragstop",function(event, ui){
	params.maxBPM = params.minBPM + bpmRange * (ui.position.left/gridDims.width);
	params.minBPM = params.maxBPM - bpmQueryRange;
	getTracks(params);
	console.log(ui.position);
    });

});

getTracks = function(params) {
	// get a bunch of tracks within parameters, stream random track
	SC.get('/tracks', {bpm: {from: params.minBPM, to: params.maxBPM}, tags: params.mood }, function(tracks) { 
	    if (tracks.length === 0) {	 
		SC.get('/tracks', {bpm: {from: params.minBPM, to: params.maxBPM}}, function(newtracks) {
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
