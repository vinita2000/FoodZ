const headingEl = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const single_mealEl = document.getElementById("single-meal");
const middleEl = document.getElementById("middle");

$("#search-btn").on('click', function(e){
    e.preventDefault();
    $("#single-meal").hide();
    $("#result-heading").show();
    $("#meals").show();
    var searchStr = $("#text-input").val().trim();
    getDishes(searchStr);
});

$("#random").on('click',function(){
    $("#single-meal").show();
    $("#result-heading").hide();
    $("#meals").hide();
    
    getRandomMeal();
});

//validates input
function getDishes(searchStr){
    //clear previous meals
    single_mealEl.innerHTML = '';

    //check for empty string
    if(searchStr === ''){
        alert("Please enter a Dish ");
    }else{
        generateDish(searchStr);
        //clear search text
        $("#text-input").val('');
    }
}

//generate a random meal
function getRandomMeal(){
    //clear previous meal
    headingEl.innerHTML = '';
    mealsEl.innerHTML = '';

    //fetch random meal
    $.ajax({ 
        url: "https://www.themealdb.com/api/json/v1/1/random.php",
        method: "get",
        success(response){
            const meal = response.meals[0];
            addMealToDOM(meal);
        },
        error(xhr){
            alert("could not fetch !");
        }
    });        
}

//generates some dishes and update dom
function generateDish(str){
    $.ajax({ 
        url: "https://www.themealdb.com/api/json/v1/1/search.php?s=" + str,
        method: "get",
        success(response){
            //console.log(response);
            headingEl.innerHTML = `<h2>Results for '${str}'</h2>`

            if(response.meals === null){
                headingEl.innerHTML = `<h2>There are no matching results for '${str}'</h2>`
                //clear previous meals
                mealsEl.innerHTML = '';
                middleEl.innerHTML = '<div class="sorry-img-container"> <img class="sorry" src="images/sorry.png"></div>'
            }
            else{
                middleEl.innerHTML = '';
                mealsEl.innerHTML = response.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" class="meal-img" alt="${meal.strMeal}" id="img-${meal.idMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `)
                .join('');
            }
        },
        error(xhr){
            alert("could not fetch !");
        }
    });
}

//search in response the related item
function getMealById(mealId){
    $.ajax({
        url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
        method: 'get',
        success(response){
            const meal = response.meals[0];
            addMealToDOM(meal);
        },
        error(xhr){
            alert('could not fetch recipe');
        }
    });
}

//add meal recipe to DOM
function addMealToDOM(meal){
    const ingredients = [];
    
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`] != ''){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else{
            break;
        }
    }
    //update DOM
    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" class="meal-img" alt="${meal.strMeal}"/>
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>`: ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>`: ''}
            </div>
            <div class="main">
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map(ing =>`
                        <li>${ing}</li>
                    `).join('')}
                </ul>
                <p>${meal.strInstructions}</p>
                
            </div>
            <button type ="btn" class="go-back-btn" id="go-back-btn">Go to meals</button>
        </div>
    `;
}

//get the clicked dish
$("#meals").on('click','img',function(){
    var idStr = $(this).attr('id').slice(4);
    //console.log(idStr);
    //hide the current meals
    $("#result-heading").hide();
    $("#meals").hide();
    $("#single-meal").show();
    getMealById(idStr);
});

//go back button
$("#inner2").on('click','button',function(e){
    e.preventDefault();

    $("#single-meal").hide();
    $("#result-heading").show();
    $("#meals").show();
});

