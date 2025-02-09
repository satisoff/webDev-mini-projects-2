const BASEURLS = "https://www.themealdb.com/api.php";               //Home Screen
const INGURL = "https://www.themealdb.com/images/ingredients/Sushi%20Rice.png";              //Ingredient Image
const RECURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";             //Receipe
let MEALURL = "Stored inside 'strMealThumb' of the RECURL";
let BLOGURL = "Store inside 'strSource'";
let VIDURL = "Store inside 'strYoutube'";
let FINDURL = "www.themealdb.com/api/json/v1/1/search.php?f=a";

const nothingFound = document.querySelector(".nothing-found");
const resultBox = document.querySelector(".result-box");
const searchBoxFood = document.getElementById("search-box-food");
const searchBtn = document.getElementById("search-btn");
const foodItemTxt = document.querySelector(".item-title-box > h2");
const foodMiscTxt = document.querySelector(".misc-title-box > p");
const foodImgBox = document.querySelector(".item-img-box > img");
const blogTxt = document.querySelector(".blog-link-box > a");
const vidTxt = document.querySelector(".vid-link-box > a");
const ingBoxList = document.querySelector(".ing-box-list");
const ingBoxContainer = document.querySelector(".ingredient-box");
const allIngBox = document.querySelectorAll(".ing-box");
const ingBoxImg = document.querySelector(".ing-img-box > img");
const loaderAnim = document.querySelector(".loader");
const instructionSteps = document.querySelector(".instruction-steps");

async function getResp(url) {
    nothingFound.style.display = "none";
    resultBox.style.display = "flex";
    let response = await fetch(url);
    let data = await response.json();
    if (data.meals) {
    let allItems = data.meals[0];           //Object of all Items
    return allItems;}
    else {
        nothingFound.style.display = "block";
        resultBox.style.display = "none";
    }
}

async function updDet() {
    let newRecUrl = `${RECURL}${searchBoxFood.value}`;
    let allItems = await getResp(newRecUrl);
    if (!allItems) return;
    // Update Food Item
    foodItemTxt.innerText = allItems.strMeal.split(' ')[0];
    // Update Food Category
    foodMiscTxt.innerText = `${allItems.strArea} - ${allItems.strCategory}`;
    // Update Food Image
    foodImgBox.src = allItems.strMealThumb;
    // Update Blog URL
    blogTxt.href = allItems.strSource;
    // Update Vid URL
    vidTxt.href = allItems.strYoutube;
    
    // Ingredients
    // Remove old Ingredients
    ingBoxList.replaceChildren();
    // Create an array to store measure
    let measureArr = [];
    for (let key in allItems) {
        if (key.startsWith("strMeasure")) {
            if (allItems[key] && allItems[key]!=" ") {
                measureArr.push(allItems[key]);
            }
        }
    }
    // Create Ingredient name & measure element
    let countIng = 0;
    for (let key in allItems) {
        if (key.startsWith("strIngredient")) {
            if (allItems[key] && allItems[key]!=" ") {
                let ingName = document.createElement('p');
                ingName.classList.add("ing-name");
                ingName.innerText = allItems[key];

                let ingMeas = document.createElement('p');
                ingMeas.classList.add("ing-measure");
                ingMeas.innerText = measureArr[countIng];

                let tempIngDiv = document.createElement("div");
                tempIngDiv.classList.add('ing-box');
                tempIngDiv.appendChild(ingName);
                tempIngDiv.appendChild(ingMeas);
                countIng++;
                ingBoxList.appendChild(tempIngDiv);
            }
        }
    }
    countIng = countIng*4;      //height for ingredient box
    ingBoxContainer.style.height = `${countIng+2}rem`;

    // Instructions
    // Remove previous instructions
    instructionSteps.replaceChildren();    
    let instructionContent = allItems.strInstructions.split("\r\n");
    for (let words of instructionContent) {
        if (words.length > 10) {
            let newInstr = document.createElement("li");
            newInstr.innerText = words;
            instructionSteps.appendChild(newInstr);
        }
    }
}

async function updIngImg(ingItemName) {
    ingBoxImg.src = `https://www.themealdb.com/images/ingredients/${ingItemName}.png`
}

searchBtn.addEventListener("click", updDet);
searchBoxFood.addEventListener("keydown", (key) => {
    if (key.keyCode === 13) {
        updDet();
    }
})

ingBoxList.addEventListener("mouseover", (event) => {
    if (event.target && event.target.matches("p.ing-name")) {
        updIngImg(event.target.innerText);
    }
})

ingBoxList.addEventListener("click", (event) => {
    if (event.target && event.target.matches("p.ing-name")) {
        window.open(ingBoxImg.src, "_blank");
    }
})

