const password = "TrustNo1";
const passwordInput = document.querySelector(".input-password");
const okButton = document.querySelector(".input-ok");
const checkButtons = document.querySelectorAll(".input-check");
const levers = document.querySelectorAll(".input-lever");
const launchButton = document.querySelector('.input-launch');
const rocket = document.querySelector('.rocket');

const setControlPanel = (disable) => {
    passwordInput.disabled = !disable;
    okButton.disabled = !disable;
    checkButtons.forEach(button => {
        button.disabled = disable;
    });
    levers.forEach(lever => {
        lever.disabled = disable;
    });
    launchButton.disabled = true;
};

setControlPanel(true);

okButton.addEventListener('click', (() => {
    if (passwordInput.value === password) {
        setControlPanel(false);
    }
}));

let allChecked = false;
const setLeverAndCheckboxesStatus = () => {
    let shouldSkip = false;
    checkButtons.forEach(button => {
        if (button.checked && !shouldSkip) {
            allChecked = true;
            shouldSkip = false;
        } else {
            allChecked = false;
            shouldSkip = true;
        }
    });
    levers.forEach(lever => {
        if (lever.value == 100 && !shouldSkip) {
            allChecked = true;
            shouldSkip = false;
        } else {
            allChecked = false;
            shouldSkip = true;
        }
    });
    launchButton.disabled = !allChecked;
};

launchButton.addEventListener('click', () => {
    rocket.style.transition = 'all 4s';
    rocket.style.left = '400px';
    rocket.style.bottom = `${innerHeight}px`;
});