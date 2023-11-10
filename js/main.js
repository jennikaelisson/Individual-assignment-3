// There are some cookie handling "warnings" showing up in my browser, 
// probably related to the github link for giphy.gif. I chose to ignore 
// them because they dont affect my website, but I just wanted to state 
// that I am aware of them. Updating the attributes with this code below 
// might work, but I've chosen to not apply it because I don't want to 
// mess with my code.
//Set-Cookie: cookieName=cookieValue; SameSite=None; Secure


// ############### DECLARATIONS ###################

let fetchBtn = document.getElementById('fetch-btn');
let dateChoice = document.getElementById('date-choice');
let dayInput = document.getElementById('day-input');
let earthInput = document.getElementById('earth-input');
let cameraAngle = document.getElementById('camera-angle');
let content = document.getElementById('content');
let earthButtons = document.getElementsByClassName('earth-dates');
let solButtons = document.getElementsByClassName('sol-dates');
let loadingIndicator = document.getElementById('loading-indicator'); 
let soundWaveGif = document.getElementById('wave');
let url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?';


// Add sound when clicking gif
soundWaveGif.addEventListener('click', onLoadPlay)

// ################ FETCH BUTTON #####################

// Only show number or date input depending on whether user chooses sol or earth date
dateChoice.addEventListener('change', function() {
    const selectedOption = dateChoice.value;

    if (selectedOption === 'sol') {
        // Show the Marsian sol day input and hide the Earth date input
        dayInput.style.display = 'block';
        earthInput.style.display = 'none';
    } else if (selectedOption === 'earth') {
        // Show the Earth date input and hide the Marsian sol day input
        dayInput.style.display = 'none';
        earthInput.style.display = 'block';
    }
});

fetchBtn.addEventListener('click', async function() {
    onClickPlay()

    // Check that user has entered a valid date before fetching API
    if (!dayInput.value && !earthInput.value) {
        content.innerHTML = "<h4>Please enter a date before fetching photos!</h4>";
        return;
    }

    content.innerHTML = ''; // Empty content div from previous fetches

     // Show the loading gif before making the fetch request
     loadingIndicator.classList.toggle('hide');

    try {
        // Check whether user has entered a sol or earth date and send sol/earth value and camera angle value into fetch url
        let solValue = dayInput.value;
        let earthDateValue = earthInput.value;
        let solOrEarthParam = dateChoice.value === 'sol' ? `sol=${solValue}` : `earth_date=${earthDateValue}`;

        let response = await fetch(url + `${solOrEarthParam}&camera=${cameraAngle.value}&api_key=DEMO_KEY`);

        handleFetchError(response)

        let photosData = await response.json();
        console.log(photosData);

        showPhotos(photosData)          
    } catch (error) {
        handleError(error);
    }finally {
        // Toggle the loading indicator visibility regardless of success or failure
        loadingIndicator.classList.toggle('hide', true);
    }    
})

// ################# SOL BUTTONS #####################

// Loop through the collection of solButtons and add an event listener to each one
for (const solButton of solButtons) {
    solButton.addEventListener('click', async function() {
        onClickPlay()

        content.innerHTML = ''; // Empty content div from previous fetches

        // Show the loading gif before making the fetch request
        loadingIndicator.classList.toggle('hide');

        try {
            let solValue = solButton.textContent; // Get the sol date from the clicked button and send value into fetch url
            let response = await fetch(url + `sol=${solValue}&api_key=DEMO_KEY`);

            handleFetchError(response)

            let photosData = await response.json();
            console.log(photosData);

            showPhotos(photosData)
        } catch (error) {
            handleError(error);
        } finally {
            // Toggle the loading indicator visibility regardless of success or failure
            loadingIndicator.classList.toggle('hide', true);
        }
        
    });
}

// ################# EARTH BUTTONS ##################

// Loop through the collection of earthButtons and add an event listener to each one
for (const earthButton of earthButtons) {
    earthButton.addEventListener('click', async function() {
        onClickPlay()

        content.innerHTML = ''; // Empty content div from previous fetches

        // Show the loading gif before making the fetch request
        loadingIndicator.classList.toggle('hide');
        try {
            let earthValue = earthButton.textContent; // Get the earth date from the clicked button and send value into fetch url
            let response = await fetch(url + `earth_date=${earthValue}&api_key=DEMO_KEY`);

            handleFetchError(response)

            let photosData = await response.json();
            console.log(photosData);

            showPhotos(photosData)
        } catch (error) {
            handleError(error);
        } finally {
            // Toggle the loading indicator visibility regardless of success or failure
            loadingIndicator.classList.toggle('hide', true);
        }
        
    });
}

// ############### FUNCTIONS ###################

// Function to add audio to soundwave gif
function onLoadPlay() {
    // Audio link gathered from my files on github, if it doesnt work, try src "../audio/brain-damage-148577.mp3"
    let audioOne = new Audio("https://github.com/jennikaelisson/Individual-assignment-3/raw/main/audio/brain-damage-148577.mp3"); 
    audioOne.play();
} 

// Function to add audio while clicking a button
function onClickPlay() {
    // Audio link gathered from my files on github, if it doesnt work, try src "../audio/blaster-2-81267.mp3.mp3"
    let audioTwo = new Audio("https://github.com/jennikaelisson/Individual-assignment-3/raw/main/audio/blaster-2-81267.mp3");
    audioTwo.play();
}

// Function to sort and display data in content div
function showPhotos(photosData) {
    let photoListHTML = "";

        for (const photo of photosData.photos) {
            const photoId = photo.id;
            const photoSol = photo.sol;
            const photoImgSrc = photo.img_src;
            const cameraFullName = photo.camera.full_name;
            const earthDate = photo.earth_date;

            photoListHTML = `<img src=${photoImgSrc} height=400px>
            <ul><li>${cameraFullName}</li><li>Sol date: ${photoSol}</li><li>Earth date: ${earthDate}</li><li>Photo ID: ${photoId}</li></ul>`

            content.innerHTML = photoListHTML;
        }
}

// ################### ERROR HANDLING #################

// Function to handle errors caught after fetching, for example exceeding NASA's daily API limits of 50 calls
function handleFetchError(response) {
    if (!response.ok) {
        if (response.status === 429) {
            throw new Error("API rate limit exceeded. Please try again later.");
        } else {
            const errorMessage = `HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`;
            console.error("Fetch error:", errorMessage);
            throw new Error(errorMessage);
        }
    }
}

// Function to check if the error is related to API rate limit
function isFetchError(error) {
    return error.message.includes("API rate limit exceeded");
}

// Function to handle and display errors
function handleErrorMessage(error) {
    console.error("An error occurred:", error);

    if (isFetchError(error)) {
        content.innerHTML = "Oops, too many requests have been made. Take a trip to Mercury and come back later!";
    } else {
        content.innerHTML = "Oops, there was an internal problem. Take a trip to Jupiter while we try to fix it!";
    }
}

// Function to gather all function for clean code in catch block
function handleError(error) {
    if (isFetchError(error)) {
        // Handle the fetch error, including setting content.innerHTML
        content.innerHTML = "Oops, too many requests have been made. Take a trip to Mercury and come back later!";
    } else {
        // Handle other errors using a general message
        console.error("An error occurred:", error);
        content.innerHTML = "Oops, there was an internal problem. Take a trip to Jupiter while we try to fix it!";
    }
}
