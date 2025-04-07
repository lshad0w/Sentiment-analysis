const image = document.getElementById("dynamicImage");

function showImage() {
    image.style.visibility = "hidden";
}

window.onload = showImage;

function updateImageBasedOnResult() {


    let resultText = document.getElementById("output");
    let imageElement = document.getElementById("dynamicImage");

    if (resultText === "Positive") {
        image.style.visibility = "visible";
        resultText.style.color = "green";
        imageElement.src = "happy.png";
    } else if (resultText === "Negative") {
        image.style.visibility = "visible";
        resultText.style.color = "red";
        imageElement.src = "angry.png";
    } else if (resultText === "Neutral") {
        image.style.visibility = "visible";
        resultText.style.color = "white";
        imageElement.src = "neutral.jpg"; 
    } else {
        resultText.style.color = "white";

}
}

function predictSentiment() {
    const review = document.getElementById('textInput').value;
    const resultDiv = document.getElementById('output');

    if (!review.trim()) {
        resultDiv.textContent = "Please enter a review.";
        updateImageBasedOnResult();
        return;
    }

    console.log("Review:", review);  

    fetch('http://127.0.0.1:8971/predict', {//insert your api and port here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: review }),
        mode: 'cors' 
    })
    .then(response => {
        console.log('Response:', response); 
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); 
        const sentiment = data.sentiment;
        resultDiv.textContent = `Sentiment: ${sentiment}`;
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.textContent = "Error occurred, please try again later.";
    });
    updateImageBasedOnResult();
}
