function handleSubmit(event) {
    event.preventDefault()

    let link = document.getElementById('link');

    console.log('Link Submitted')

    // check if the link format is valid
    if (Client.chkLink(link.value)) {
        fetch('http://localhost:8081/api', {
            method: 'POST',
            mode: 'cors',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: link.value})
        })
        .then(res => res.json())     //the response body is parsed to JSON. res => res.json() is just like having a callback like:function(res) { return res.json()

        .then(function(res) {

            console.log(res);
            // Generate results
            document.getElementById('results').innerHTML =
            `<strong>Polarity:</strong> ${res.polarity}
            <br> <br> <strong>Subjectivity:</strong> ${res.subjectivity}
            <br> <br> <strong>Polarity Confidence:</strong> ${res.polarity_confidence}
            <br> <br> <strong>Subjectivity Confidence:</strong> ${res.subjectivity_confidence}
            <br> <br> <strong>Text:</strong>
            <br> ${res.text}`;
        })

    // Generate error message if link format is invalid
    } else {
        document.getElementById('results').innerHTML = 'Invalid URL. Please try another valid link.';

    }

}

//export { handleSubmit }
module.exports = handleSubmit;
