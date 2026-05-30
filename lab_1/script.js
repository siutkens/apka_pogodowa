const userName = document.querySelector('input#name');
const email = document.querySelector('input#email');
const pass1 = document.querySelector('input#password1');
const pass2 = document.querySelector('input#password2');
const resetBtn = document.querySelector('input#reset');
const submitBtn = document.querySelector('input#submit');

function showOrHideErrorMessage(input, text) {
    const box = input.parentElement;
    const errMess = box.querySelector('p.err_mess');
    errMess.textContent = text;
}

function checkInputsLength(input, minLength) {
    if (input.value.length < minLength) {
        //console.log(`${input.name} za mało znaków`);
        showOrHideErrorMessage(input, `Pole ${input.previousElementSibling.textContent.toLowerCase().replace('*', "").replace(':', "")} powinno zawierać minimum ${minLength} znaków.`);
    } else {
        //console.log(`${input.name} spełniono wymaganą liczbę znaków`);
        showOrHideErrorMessage(input, "");
    }
}

function checkPasswords() {
    if (pass1.value != pass2.value) {
        //console.log('Hasła są różne');
        showOrHideErrorMessage(pass2, "hasła są różne");
    } else {
        //console.log('Hasła są takie same');
        showOrHideErrorMessage(pass2, "");
    }
}

function checkEmail() {
    const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!(re.test(email.value))) {
        showOrHideErrorMessage(email, `Pole ${email.previousElementSibling.textContent.toLowerCase().replace('*', "").replace(':', "")} jest nieprawidłowe`);
    } else {
        showOrHideErrorMessage(email, "");
    }
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    checkPasswords();
    checkInputsLength(userName, 3);
    checkInputsLength(pass1, 8);
    checkEmail();
})

resetBtn.addEventListener('click', () => {

})