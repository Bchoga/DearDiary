const API_BASE_URL = "https://tunga-diary-api.onrender.com/api/fullstack";

let signInContainer;
let loadingContainer;
let errorContainer;

document.addEventListener("DOMContentLoaded", () => {

    const signInForm = document.querySelector(".signInForm");
    if (signInForm) {
        signInForm.addEventListener("submit", signInHandler);
    }

    signInContainer = document.querySelector('.signin-container');
    loadingContainer = document.querySelector('.loadingContainer');
    errorContainer = document.querySelector('.errorContainer');
});

async function signInHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const signInData = { email, password };

    //Show loading box
    signInContainer.style.display = 'none';
    loadingContainer.style.display = 'block';

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, signInData);
        console.log("response=", response);
        document.cookie = `jwt=${response.data.token}; path=/; max-age=${24 * 60 * 60 * 1000}`;
        window.location.href = '../pages/diary.html';
    }
    catch (error) {
        let errorMsg;
        if (error.response && error.response.status === 401) {
            errorMsg = "You Have Entered a Wrong EMAIL or PASSWORD. Please Check and Try Again!";
        }
        else {
            errorMsg = 'sorry, server not available at the moment, please try again later.';
        }
        //show error box
        let errMsgElement = document.getElementById('errorMsg');
        let tryAgainBtn = document.getElementById('tryAgainBtn');
        errMsgElement.innerText = errorMsg;
        signInContainer.style.display = 'none';
        loadingContainer.style.display = 'none';
        errorContainer.style.display = 'flex';
        //try again btn handler, go back to sign in 
        tryAgainBtn.addEventListener('click', () => {
            signInContainer.style.display = 'block';
            loadingContainer.style.display = 'none';
            errorContainer.style.display = 'none';
        });
    }
}
