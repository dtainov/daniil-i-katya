/* ============ Таймер обратного отсчета ============ */

const WEDDING_DATE = new Date("2026-12-12T17:00:00");

const daysEl = document.getElementById("countdown-days");
const hoursEl = document.getElementById("countdown-hours");
const minutesEl = document.getElementById("countdown-minutes");
const secondsEl = document.getElementById("countdown-seconds");

function pad(value) {
    return String(value).padStart(2, "0");
}

function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

/* ============ Форма RSVP ============ */

const rsvpForm = document.getElementById("rsvp-form");

function showRsvpMessage(text) {
    rsvpForm.innerHTML = "";
    const message = document.createElement("p");
    message.className = "rsvp-form__thanks";
    message.textContent = text;
    rsvpForm.appendChild(message);
}

rsvpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const attendanceInput = rsvpForm.querySelector(
        'input[name="attendance"]:checked'
    );

    const data = {
        guestName: rsvpForm.guestName.value,
        attendance: attendanceInput ? attendanceInput.value : ""
    };

    const submitButton = rsvpForm.querySelector(".rsvp-form__submit");
    if (submitButton) {
        submitButton.disabled = true;
    }

    // Content-Type не задан намеренно: text/plain по умолчанию не вызывает
    // CORS-preflight, который Google Apps Script не обрабатывает.
    // Тело запроса при этом остаётся JSON-строкой.
    fetch(rsvpForm.action, {
        method: "POST",
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            showRsvpMessage("Спасибо за ответ!");
        })
        .catch(function () {
            showRsvpMessage("Произошла ошибка, попробуйте позже");
            if (submitButton) {
                submitButton.disabled = false;
            }
        });
});
