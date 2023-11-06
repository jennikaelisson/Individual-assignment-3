let fetchBtn = document.getElementById('fetch-btn');
let dateChoice = document.getElementById('date-choice');
let dayInput = document.getElementById('day-input');
let earthInput = document.getElementById('earth-input');
let cameraAngle = document.getElementById('camera-angle');
let content = document.getElementById('content');


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
    try {
        let solValue = dayInput.value;
        let earthDateValue = earthInput.value;
        let solOrEarthParam = dateChoice.value === 'sol' ? `sol=${solValue}` : `earth_date=${earthDateValue}`;
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?${solOrEarthParam}&camera=${cameraAngle.value}&api_key=DEMO_KEY`;

        let response = await fetch(url);

        console.log(url)
        if (!response.ok) {
            throw new Error(`HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`);
        }
        // let response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?${dateChoice.value}${dayInput.value}&${cameraAngle.value}&api_key=DEMO_KEY`)
        // if (!response.ok) {
        //     throw new Error(`HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`);
        // }

        let photosData = await response.json();
        console.log(photosData);

        content.innerHTML = "";
        for (const photo of photosData.photos) {
            const photoId = photo.id;
            const photoSol = photo.sol;
            const photoImgSrc = photo.img_src;
            const cameraFullName = photo.camera.full_name;
            const earthDate = photo.earth_date;
          
            // console.log(`Photo ID: ${photoId}`);
            // console.log(`Sol: ${photoSol}`);
            // console.log(`Image Source: ${photoImgSrc}`);
            // console.log(`Camera Full Name: ${cameraFullName}`);
            // console.log(`Earth Date: ${earthDate}`);

            content.innerHTML = `<img src=${photoImgSrc} height=400px>
            <ul><li>${cameraFullName}</li><li>Sol date: ${photoSol}</li><li>Earth date: ${earthDate}</li><li>Photo ID: ${photoId}</li>`
        }
          
    } catch (error) {
        console.log(error);
        content.innerHTML = "Oops, there was an internal problem. We have just dispatched a group of monkeys to fix the problem for you :)";
    }
})
