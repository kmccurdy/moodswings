// link to [public html file](https://dl.dropbox.com/u/35819006/bghackathon/moodswings/soundcloud/index.html)

SC.initialize({
    client_id: 'fb893732ab2c0c18a96178561feeac0b',
    redirect_uri: 'https://dl.dropbox.com/u/35819006/bghackathon/moodswings/soundcloud/index.html'
});


$.each(emotion_data, function(ind, obj){
    obj.valence /= norm.valence;
    obj.valence = 1 - obj.valence;
    obj.arousal /= norm.arousal;
    obj.arousal = 1 - obj.arousal;
})

$(document).ready(function() {

    var minBPM = 60, bpmRange = 120, bpmQueryRange = 10;
    var emotion, maxBPM;

    $('#form').submit(function(e){
	e.preventDefault();
	var mood = $('#form input[name="mood"]').val();
	$.each(emotion_data, function(ind, obj){
//	    if ()
	    if (obj["name"] === mood) emotion = obj;
	});
	maxBPM = typeof emotion != 'undefined' ? minBPM + bpmRange * emotion.arousal : 105;
	bpmQueryRange += bpmQueryRange * (.5 -  typeof emotion != 'undefined' ? emotion.arousal : 0) // normalize: more extreme values get larger bpm ranges
	minBPM = maxBPM - bpmQueryRange;

	console.log(emotion);

	// get a bunch of tracks within parameters
	SC.get('/tracks', {bpm: {from: minBPM, to: maxBPM}, tags: mood }, function(tracks) { 
	    for (var i = 0; i < tracks.length; i++) {
		$('#player').append('<p>' + tracks[i].title + '</p>');
		console.log(tracks[i].title);
	    }
	});
    });
/*    SC.get('/tracks/293',function(track){
        SC.oEmbed(track.permalink_url, document.getElementById('player'));
    });
*/
});

