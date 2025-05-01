import { loginUserToApi, sendUserToApi } from '../service.js';
import { isUserLoggedIn } from '../domain.js';


if (isUserLoggedIn()) {
    window.location.href = "/index.html";
}

let signUpAButton = document.getElementById('sign-up-btn');
let logInAButton = document.getElementById('log-in-btn');
let contentScreen = document.querySelector('.content-screen');

let loginForm = document.getElementById('login-form');
let loginUser = document.getElementById("username");
let loginPass = document.getElementById("password");
let loginFieldsErrors = [];
loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    let loginUserVal = loginUser.value.toLowerCase().trim();
    if (!loginUserVal) {
        loginFieldsErrors.push(loginUser);
    }
    let loginPassVal = loginPass.value.trim();
    if (!loginUserVal) {
        loginFieldsErrors.push(loginPass);
    }
    if (loginFieldsErrors.length > 0) {
        loginFieldsErrors.forEach(item => {
            item.classList.add("red-border");
        })
        loginForm.querySelector(".validation-msg").textContent = "There are some errors in your form.";

    } else {
        const loginAttempt = {
            Id: loginUserVal,
            Password: loginPassVal
        };
        const response = await loginUserToApi(loginAttempt);

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("loggedInUser", data.userName);
            alert(`Login Successful!! Welcome ${data.userName}! You'll now be redirected to the dashboard`);
            window.location.href = "/index.html";
        } else {
            const errorData = await response.json();
            loginForm.querySelector(".validation-msg").textContent = errorData.message;
        }

    }
})
loginForm.addEventListener("change", e => {
    e.preventDefault();
    loginFieldsErrors.forEach(item => {
        item.classList.remove("red-border");
    })
    loginForm.querySelector(".validation-msg").textContent = "";
})

let signUpForm = document.getElementById('signup-form');
let signUpUser = document.getElementById("signup-username");
let signUpName = document.getElementById("signup-name");
let signUpPass = document.getElementById("signup-password");
let signUpPassConfirm = document.getElementById("signup-password-confirm");

let signUpFieldsErrors = [];
signUpForm.addEventListener("submit", async e => {
    e.preventDefault();
    let signUpUserVal = signUpUser.value.toLowerCase().trim();
    if (!signUpUserVal) {
        signUpFieldsErrors.push(signUpUser);
    }
    let signUpNameVal = signUpName.value.trim();
    if (!signUpNameVal) {
        signUpFieldsErrors.push(signUpName);
    }
    let signUpPassVal = signUpPass.value.trim();
    if (!signUpPassVal) {
        signUpFieldsErrors.push(signUpPass);
    }
    let signUpPassConfirmVal = signUpPassConfirm.value.trim();
    if (!signUpPassConfirmVal) {
        signUpFieldsErrors.push(signUpPassConfirm);
    }
    if (signUpPassVal != signUpPassConfirmVal) {
        signUpPass.classList.add("red-border");
        signUpPassConfirm.classList.add("red-border");
        signUpForm.querySelector(".validation-msg").textContent = "Passwords don't match";
        signUpFieldsErrors.push(signUpPass, signUpPassConfirm);
        return;
    }
    if (signUpFieldsErrors.length > 0) {
        signUpFieldsErrors.forEach(item => {
            item.classList.add("red-border");
        })
        signUpForm.querySelector(".validation-msg").textContent = "There are some errors in your form.";

    } else {
        const newUser = {
            Id: signUpUserVal,
            Name: signUpNameVal,
            Password: signUpPassVal,
        };
        const response = await sendUserToApi(newUser);

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            localStorage.setItem("loggedInUser", data.name);
            alert("Signup successful! You'll now be redirected to the Dashboard");
            window.location.href = "/index.html";
        } else {
            const errorData = await response.json();
            signUpForm.querySelector(".validation-msg").textContent = errorData.message;
        }

    }
})
signUpForm.addEventListener("change", e => {
    e.preventDefault();
    signUpFieldsErrors.forEach(item => {
        item.classList.remove("red-border");
    })
    signUpForm.querySelector(".validation-msg").textContent = "";
})

signUpAButton.addEventListener("click", e => {
    contentScreen.classList.add("second-slide-active");
})
logInAButton.addEventListener("click", e => {
    contentScreen.classList.remove("second-slide-active");
})

let inputFields = Array.from(document.querySelectorAll("input"));
inputFields.map(item => {
    item.addEventListener("focus", e => {
        const inputGroup = e.target.parentNode;
        if (inputGroup) {
            const label = inputGroup.querySelector("label");
            label.classList.add("active-label");
        }
    })
    item.addEventListener("blur", e => {
        const inputGroup = e.target.parentNode;
        if (inputGroup) {
            const label = inputGroup.querySelector("label");
            if (e.target.value.trim() === "") {
                label.classList.remove("active-label");
            }
        }
    })

})

let eyeIcons = document.querySelectorAll('.eye-icon');
eyeIcons.forEach(item => {
    item.addEventListener('click', e => {
        const inputGroup = e.target.closest(".input-group");
        if (inputGroup) {
            const input = inputGroup.querySelector("input");
            const icon = inputGroup.querySelector("i.fa-regular");
            icon.classList.toggle("fa-eye-slash");
            icon.classList.toggle("fa-eye");
            if (input.getAttribute("type") === "password") {
                input.setAttribute("type", "text");
            } else {
                input.setAttribute("type", "password");
            }
        }
    })
})

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})