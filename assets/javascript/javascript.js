

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
        url: "https://developers.zomato.com/api/v2.1/search?q="+query,
        // 
        beforeSend: function (xhr) {
            xhr.setRequestHeader('user-key',
                '283b679d86b81c25de7209040e9f2b72');},
        method: "GET"
    })
        // Zomato API
        .then(function(ajaxRestaurantResponse) {
           
        display(ajaxRestaurantResponse);
      
          

        });
       function display(ajaxRestaurantResponse){
           
           var s="";
           for(i=0;i<5;i++){
           
           var restName=ajaxRestaurantResponse.restaurants[i].restaurant.name;
           var restAddress=ajaxRestaurantResponse.restaurants[i].restaurant.location.address;
           var restPrice=ajaxRestaurantResponse.restaurants[i].restaurant.average_cost_for_two;
           var restRating=ajaxRestaurantResponse.restaurants[i].restaurant.user_rating.rating_text;
           var RestaurantLink=ajaxRestaurantResponse.restaurants[i].restaurant.url;
           
          s='<div class="displayResturant" onClick="fnLink(this)">';
        
              s+="<p>Restaurant name:"+restName+"</p>";
              s+="<p>Adress:"+restAddress+"</p>";
              s+="<p>Price:"+restPrice+"</p>";
              s+="<p>Rating:"+restRating+"</p>";
             s+="<input type='hidden' id='hiddenRest' value="+RestaurantLink+">";
              s+='</div>';
              $("#recipe-display").append(s);
            }
        
}
   
        function displayIngredient(target="",index,data){
            var newIngredient  = $("<p>");
            newIngredient.text(data);
            $(target).append(newIngredient);

        }

        //Recipe api call
$.ajax({
    url: "https://api.edamam.com/search?q=" + query +"&app_id=4063fe6a&app_key=edd561481c6b54dfe7cf0a48333a3189",
    method: "GET"
})
    // AJAX function 
    .then(function (ajaxRecipeResponse) {
        
        var p1 = $("<p>");
        var a1 = $("<a>");
       

        $("#display-right").append(a1);
        $("#display-right").append(p1);
        
        a1.attr("href", ajaxRecipeResponse.hits[0].recipe.url).text(ajaxRecipeResponse.hits[0].recipe.label);
        p1.text("Calories " + ajaxRecipeResponse.hits[0].recipe.calories);
        
        
        for (var i = 0; i <ajaxRecipeResponse.hits[0].recipe.ingredients.length; i++){




        displayIngredient ("#display-right",i,ajaxRecipeResponse.hits[0].recipe.ingredients[i].text)
        }
    

        
        

       
    });


}
//each time another search value is added this will send the name and url to firebase then post in
//the search-history-display area
database.ref().on("child_added", function (snapshot) {



});
function fnLink(elem){
    
    var Restaurentdirect=$("#hiddenRest").val();
    window.location.href = Restaurentdirect;
}
