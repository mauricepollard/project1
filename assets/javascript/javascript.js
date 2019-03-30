var restName = '';
var restAddress = '';
var restPrice = 0;
var restRating = '';
var RestaurantLink = '';
var searchNumber = 0;
var recipeDisplayID;
var restaurantDisplayId;
var restaurantDirect = "";

let lat;
let long;

navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    console.log(lat)
    console.log(long)
})

$("#search-button").on("click", searchRecipe)
function createNewCardDeck() {
    searchNumber++
    var cardDeck = $("<div>").attr("class", "row card-deck mb-4")
    var newCard1 = $("<div>").attr("class", "card border-primary mx-2 mb-3").attr("style", "max-width: 100%;")
    var cardHeader1 = $("<div>").attr("class", "card-header").text("Recipe")
    var cardBody1 = $("<div>").attr("class", "card-body text-primary").attr("id", "recipe-display" + searchNumber)
    newCard1.append(cardHeader1, cardBody1)

    var newCard2 = $("<div>").attr("class", "card border-primary mx-2 mb-3").attr("style", "max-width: 100%;")
    var cardHeader2 = $("<div>").attr("class", "card-header").text("Restaurant")
    var cardBody2 = $("<div>").attr("class", "card-body text-primary").attr("id", "restaurant-display" + searchNumber)
    newCard2.append(cardHeader2, cardBody2)

    cardDeck.append(newCard1, newCard2)
    $("#main-container").prepend(cardDeck)
}
function searchRecipe() {
    event.preventDefault();

    //use to capture textbox value to put inside of APi query url

    // also use to save 'query' value into firebase for search history

    var query = $('#search-mini').val().trim();
    if (query === "") {
        return;
    }

    // $("#search-button").on("click", createNewCardDeck)
    createNewCardDeck()



    // restaurant API call
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?q=" + query + "&lat=" + lat + "&lon=" + long + "&radius=30000",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                '283b679d86b81c25de7209040e9f2b72');
        },
        method: "GET"
    })
        .then(function (ajaxRestaurantResponse) {

            display(ajaxRestaurantResponse);
        })
        .catch(function (error) {
        })
    // restaurant info display
    function display(ajaxRestaurantResponse) {

        console.log(ajaxRestaurantResponse)

        var s = "";
        for (i = 0; i < 5; i++) {

            restName = ajaxRestaurantResponse.restaurants[i].restaurant.name;
            restAddress = ajaxRestaurantResponse.restaurants[i].restaurant.location.address;
            restPrice = ajaxRestaurantResponse.restaurants[i].restaurant.average_cost_for_two;
            restRating = ajaxRestaurantResponse.restaurants[i].restaurant.user_rating.rating_text;
            RestaurantLink = ajaxRestaurantResponse.restaurants[i].restaurant.url;

            s = `<div class="displayRestaurant p-2"  data-restName="${restName}" data-restLink="${RestaurantLink}" onClick="fnLink(this)">`;

            s += "<h5>Restaurant name: " + restName + "</h5>";
            s += "<p class='py-1 m-0'>Address: " + restAddress + "</p>";
            s += "<p class='py-1 m-0'>Price: " + restPrice + "</p>";
            s += "<p class='py-1 m-0'>Rating: " + restRating + "</p>";
            s += "<input type='hidden' id='hiddenRest' value=" + RestaurantLink + ">";
            s += '</div>';

            restaurantDisplayId = "#restaurant-display" + searchNumber
            console.log(restaurantDisplayId)
            $(restaurantDisplayId).append(s);
            // if (i === 0) {
            //     console.log("error" + restName);
            //     database.ref().push({
            //         restName: restName,
            //         RestaurantLink: RestaurantLink
            //     });
            // }
        }

    }

    //Recipe api call
    $.ajax({
        url: "https://api.edamam.com/search?q=" + query + "&app_id=4063fe6a&app_key=edd561481c6b54dfe7cf0a48333a3189",
        method: "GET"
    })
        // AJAX function 
        .then(function (ajaxRecipeResponse) {

            console.log(ajaxRecipeResponse)

            var a1 = $("<a>");
            a1.attr("data-recipeName", ajaxRecipeResponse.hits[0].recipe.label)
            var img1 = $("<img>")
            var p1 = $("<p>");
            var ingredientUl = $("<ul>").attr("class", "list-group list-group-flush")

            a1.attr("href", ajaxRecipeResponse.hits[0].recipe.url).html("<h5>" + ajaxRecipeResponse.hits[0].recipe.label + "</h5>");
            a1.attr("target", "_blank")
            p1.text("Calories " + parseInt(ajaxRecipeResponse.hits[0].recipe.calories));
            img1.attr("src", ajaxRecipeResponse.hits[0].recipe.image)

            a1.attr("class", "card-title displayRecipe")
            p1.attr("class", "card-text")
            img1.attr("class", "card-img-top")

            recipeDisplayID = "#recipe-display" + searchNumber
            console.log(recipeDisplayID)

            $(recipeDisplayID).append(a1);
            $(recipeDisplayID).append(p1);
            $(recipeDisplayID).append(img1);
            $(recipeDisplayID).append(ingredientUl);

            for (var i = 0; i < ajaxRecipeResponse.hits[0].recipe.ingredients.length; i++) {

                displayIngredient(ingredientUl, i, ajaxRecipeResponse.hits[0].recipe.ingredients[i].text)
            }
        });

    function displayIngredient(target = "", index, data) {
        var newIngredient = $("<li>").attr("class", "list-group-item px-0");
        newIngredient.text(data);
        $(target).append(newIngredient);

    }
    $("input:text").val("");
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBEPjx4MSjK1qr0fZZhuOPt7KNtjLYhKIM",
    authDomain: "teamproject1-f7bea.firebaseapp.com",
    databaseURL: "https://teamproject1-f7bea.firebaseio.com",
    projectId: "teamproject1-f7bea",
    storageBucket: "teamproject1-f7bea.appspot.com",
    messagingSenderId: "598129366805"
};
firebase.initializeApp(config);

var database = firebase.database();

//each time another search value is added this will send the name and url to firebase then post in
//the search-history-display area
database.ref().orderByChild("timeAdded").limitToLast(5).on("child_added", function (snapshot) {
    var fbType = snapshot.val().type
    var fbRestLink = snapshot.val().restLink
    var fbRestName = snapshot.val().restName
    var aTag = $("<a>").attr("target", "_blank").attr("class", "searchHistory");
    var fbRecipeName = snapshot.val().recipeName
    var fbRecipeLink = snapshot.val().recipeLink

    if (fbType === "Restaurant") {
        aTag.attr("href", fbRestLink).text("Restaurant: " + fbRestName);
    }

    if (fbType === "Recipe") {
        aTag.attr("href", fbRecipeLink).text("Recipe: " + fbRecipeName);
    }


    $("#history-display").append(aTag);
    $("#history-display").append("<br>");


});
function fnLink(elem) {

    restaurantDirect = $("#hiddenRest").val();
    window.open(restaurantDirect, "_blank")

    // var aHistory = $("<a>");
    // aHistory.attr("href", restaurantDirect).html("<h5>" + query + "</h5>");
    // aHistory.attr("target", "_blank")

    // $("#history-display").append(aHistory);
}

$(document).on("click", ".displayRestaurant", function () {
    var clickedRestName = $(this).attr("data-restName")
    var clickedRestLink = $(this).attr("data-restLink")

    database.ref().push({
        timeAdded: firebase.database.ServerValue.TIMESTAMP,
        type: "Restaurant",
        restName: clickedRestName,
        restLink: clickedRestLink,
        recipeName: "",
        recipeLink: ""
    });
})

$(document).on("click", ".displayRecipe", function () {
    var clickedRecipeName = $(this).attr("data-recipeName")
    var clickedRecipeLink = $(this).attr("href")

    database.ref().push({
        timeAdded: firebase.database.ServerValue.TIMESTAMP,
        type: "Recipe",
        restName: "",
        restLink: "",
        recipeName: clickedRecipeName,
        recipeLink: clickedRecipeLink
    });
})
