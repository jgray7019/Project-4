
var movieApp = {};

movieApp.key = '246327ba9832a920781affe527de3db4';

// a function that gets movie info
movieApp.getMovie = function(userBirthday) {
	// console.log(userBirthday);
	var dateArray = userBirthday.split('-');	
	var startMonth = +dateArray[1];
	var endMonth = +dateArray[1] + 1;
	var startYear = +dateArray[0];
	var endYear = +dateArray[0];
	if (startMonth === 12) {
		endYear = startYear + 1;
		endMonth = 1;
	}
	// make 1st ajax request to get movie
	movieApp.getMovies = $.ajax({	
		url: 'https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=false&include_video=false&with_original_language=en',
		method: 'GET',
		dataType: 'json',
		data: {
			api_key: movieApp.key,
			format: 'json',
			primary_release_year: startYear,
			sort_by: 'revenue.desc',
			'release_date.lte': `${endYear}-${endMonth}`,
			'release_date.gte': `${startYear}-${startMonth}`,
			'primary_release_date.lte': `${endYear}-${endMonth}`,
			'primary_release_date.gte': `${startYear}-${startMonth}`
		}
	 })
	// second ajax request to get movie video 
	movieApp.getMovieVideo = function(movieID){
		$.ajax({
			url: `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`,
			method: 'GET',
			dataType: 'json',
			data: {
				api_key: movieApp.key,
				format: 'json',
			}
		}).then(function(res) {
			console.log(res);

			var youtubeID = res.results[0];
			console.log(youtubeID);

			movieApp.displayMovieVideo(youtubeID);
		});
	}

	// get the 1st movie from the results
	$.when(movieApp.getMovies)
		.then(function(res){
			// console.log(res);

			var movieData = res.results[0];
			console.log(res.results);

			movieApp.displayMovie(movieData);

			// store the movie ID so we can pass it into our video ajax request
			var movieID = res.results[0].id;
			movieApp.getMovieVideo(movieID);
		});
}

// // a function that displays the movie
movieApp.displayMovie = function(movieData) {
	console.log(movieData);

	$('.results').empty();
	// create an h2 for our title
	var titleEl = $('<h2>').text(movieData.original_title);

	// create p for our artist name
	var plotEl = $('<p>').text(movieData.overview);

	// for images, append the url with ${movieData.imgpath} inside of it
	var imageEl = $('<img>').attr('src', `https://image.tmdb.org/t/p/w1280${movieData.poster_path}`);

	// create a new div called .movieContainer, append all elements inside of it
	var movieImage = $('<div>').addClass('movieImage').append(imageEl)
	var movieDescription = $('<div>').addClass('movieDescription').append(titleEl, plotEl);

	// 	 append the h2., p onto the page, inside of the .results div
	var movieContainer = $('<div>').addClass('movieContainer').append(movieImage, movieDescription);
	$('.results').append(movieContainer);

	// append a button that will scroll to the video
	$('.movieDescription').append(`<button type='button' class='videoButton'>Wanna see the trailer?</button>`);

	// when the button is clicked, scroll to the videoContainer
	$('button.videoButton').on('click', function(){

	$('html,body').animate({
	     scrollTop: $(".videoContainer").offset().top},
	     'slow');
	});
}


// a function that displays the video
movieApp.displayMovieVideo = function(videoData) {
	console.log(videoData)
	$('.videoContainer').empty();

	var movieEL = `<div class="video"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoData.key}" frameborder="0" allowfullscreen></iframe></div>`;

	$('.videoContainer').append(movieEL);
	
}

//  a function that will handle the user's submission
movieApp.events = function() {
	// start button on header will scroll to birthday submission
	$('button.startButton').on('click', function(e){
		e.preventDefault();

		$('html,body').animate({
		     scrollTop: $(".birthdayContainer").offset().top},
		     'slow');
	});

	// when the user submits their birthday
	$('form').on('submit', function(e){
		e.preventDefault();

		// grab the value of the selected element and store it inside of a variable
		var usersChoice = $('.userBirthday').val();

		movieApp.getMovie(usersChoice)
		// console.log('this is', usersChoice);

	    $('html,body').animate({
	         scrollTop: $(".results").offset().top},
	         'slow');

	});
	// calendar plug in
	$('input[type="text"]').flatpickr();
}

// // a function to initialize our code
movieApp.init = function() {
	movieApp.events();
};	

// document ready that will run our init
$(function(){
	movieApp.init();
});