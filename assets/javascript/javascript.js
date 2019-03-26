
//Ny Times Feed
$.ajax({
    url: "https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=T93gBpi7HbQuDsZB4efsVB1vWF2P51xY",
    method: "GET"
})
    // AJAX function 
    .then(function (ajaxTimesResponse) {
        var p1 = $("<p>");
        var a1 = $("<a>");

        var p2 = $("<p>");
        var a2 = $("<a>");

        var p3 = $("<p>");
        var a3 = $("<a>");

        a1.attr("href", ajaxTimesResponse.results[0].url).text(ajaxTimesResponse.results[0].title);
        p1.text(ajaxTimesResponse.results[0].byline);

        a2.attr("href", ajaxTimesResponse.results[1].url).text(ajaxTimesResponse.results[1].title);
        p2.text(ajaxTimesResponse.results[1].byline);

        a3.attr("href", ajaxTimesResponse.results[2].url).text(ajaxTimesResponse.results[2].title);
        p3.text(ajaxTimesResponse.results[2].byline);

        $("#display-right").append(a1);
        $("#display-right").append(p1);

        $("#display-right").append(a2);
        $("#display-right").append(p2);

        $("#display-right").append(a3);
        $("#display-right").append(p3);
    });
//End Ny Times Feed

//firebase connection

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBQTrz-e57cpa5Kzw_ayDShc64yAWicnzQ",
    authDomain: "team-project-1-248b4.firebaseapp.com",
    databaseURL: "https://team-project-1-248b4.firebaseio.com",
    projectId: "team-project-1-248b4",
    storageBucket: "team-project-1-248b4.appspot.com",
    messagingSenderId: "230125627631"
};
firebase.initializeApp(config);

var database = firebase.database();

function searchRecipe() {
    event.preventDefault();

    //use to capture textbox value to put inside of APi query url

    // also use to save 'query' value into firebase for search history
    var query = $('#search-mini').val().trim();
    $.ajax({
        url: "https://api.edamam.com/search?q="+query+"&app_id=4063fe6a&app_key=edd561481c6b54dfe7cf0a48333a3189",
        method: "GET"
    })
        // AJAX function 
        .then(function (ajaxRecipeResponse) {
            console.log(ajaxRecipeResponse)

            //get recipe api results
            //display results using jquery using #recipe-display

    //   database.ref().push({
    //   query: query,
    //     recipeUrl: recipeUrl,

    });
}
//each time another search value is added this will send the name and url to firebase then post in
//the search-history-display area
database.ref().on("child_added", function (snapshot) {



});