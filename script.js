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

    const guestNameValue = rsvpForm.guestName.value.trim();
    const attendanceInput = rsvpForm.querySelector(
        'input[name="attendance"]:checked'
    );

    // Проверка: если имя пустое или не выбран вариант ответа, отправка не идет
    if (!guestNameValue || !attendanceInput) {
        return;
    }

    const data = {
        guestName: guestNameValue,
        attendance: attendanceInput.value
    };

    const submitButton = rsvpForm.querySelector(".rsvp-form__submit");
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Отправка...';
    }

    // Content-Type не задан намеренно: text/plain по умолчанию не вызывает
    // CORS-preflight, который Google Apps Script не обрабатывает.
    // Тело запроса при этом остаётся JSON-строкой.
        fetch(rsvpForm.action, {
        method: "POST",
        mode: "no-cors", // Добавляем этот параметр, чтобы обойти блокировку ответа от Google
        body: JSON.stringify(data)
    })
        .then(function () {
            // В режиме no-cors мы не можем прочитать ответ, 
            // но если запрос дошел без сетевой ошибки, считаем, что всё прошло успешно
            showRsvpMessage("Спасибо за ответ!");
        })
        .catch(function () {
            // Сюда попадем только если интернета совсем нет или сервер недоступен
            showRsvpMessage("Произошла ошибка, попробуйте позже");
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Отправить";
            }
        });
});
