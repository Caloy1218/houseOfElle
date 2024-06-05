
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('show-signup').addEventListener('click', showSignUpForm);
    document.getElementById('show-login').addEventListener('click', showLoginForm);
});

function showSignUpForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

