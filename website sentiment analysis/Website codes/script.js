const image = document.getElementById("dynamicImage");

function showImage() {
    image.style.visibility = "hidden";
}

window.onload = showImage;

function updateImageBasedOnResult() {
    image.style.visibility = "visible";

    let resultText = document.getElementById("output").innerText;
    let imageElement = document.getElementById("dynamicImage");

    if (resultText === "Positive") {
        imageElement.src = "happy.png";
    } else if (resultText === "Negative") {
        imageElement.src = "angry.png";
    } else {
        imageElement.src = "neutral.png";
    }
}

function predictSentiment() {
    const review = document.getElementById('textInput').value;
    const resultDiv = document.getElementById('output');

    if (!review.trim()) {
        resultDiv.textContent = "Please enter a review.";
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
}
