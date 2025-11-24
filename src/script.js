// ...existing code...
// Новий логічний файл калькулятора — два поля: введення (input) і результат (output).
// Реалізовано +, -, *, /, валідацію і заокруглення до сотих.

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');

let previous = null;
let operation = null;

// Перевірка коректності введеного числа
function isValidNumber(str) {
    if (typeof str !== 'string') return false;
    const s = str.trim();
    if (s === '') return false;
    // дозволяє: 123, -123, 0.5, .5, -0.5
    return /^-?(?:\d+|\d*\.\d+)$/.test(s);
}

function normalizeInput() {
    // повертає рядок без зайвих нулів, або пустий рядок
    return (inputEl.value || '').trim();
}

function showError(msg) {
    outputEl.textContent = msg;
}

// Оновлення виводу введення (не результату)
function updateInputDisplay(val) {
    inputEl.value = val;
}

// Додавання цифри/крапки в поле вводу через кнопки
function appendNumber(n) {
    const cur = normalizeInput();
    if (n === '.' && cur.includes('.')) return;
    // уникаємо множинних провідних нулів
    if (cur === '0' && n !== '.') {
        updateInputDisplay(n);
        return;
    }
    updateInputDisplay(cur + n);
}

// Встановити операцію (+ - * /)
function setOperation(op) {
    const cur = normalizeInput();
    // якщо немає поточного числа — помилка
    if (!isValidNumber(cur) && previous === null) {
        showError('Введіть число перед операцією');
        return;
    }
    // якщо є попереднє число і є поточне — обчислити попереднє
    if (previous !== null && isValidNumber(cur)) {
        const res = computeValue(previous, cur, operation);
        if (res === null) return; // помилка вже показана
        previous = String(res);
        outputEl.textContent = previous;
    } else if (isValidNumber(cur)) {
        previous = cur;
    }
    operation = op;
    updateInputDisplay(''); // підготовка для вводу другого числа
    // очистити повідомлення про помилку
    // (залишимо результат видимим, якщо він був)
}

// Очистити обидва поля
function clearDisplay() {
    previous = null;
    operation = null;
    updateInputDisplay('');
    outputEl.textContent = '';
}

// Обчислити результат — викликається при натисканні "="
function calculateResult() {
    const cur = normalizeInput();
    if (previous === null || !operation) {
        showError('Не вибрано операцію або перше число');
        return;
    }
    if (!isValidNumber(cur)) {
        showError('Введені некоректні дані для другого числа');
        return;
    }
    const res = computeValue(previous, cur, operation);
    if (res === null) return;
    // показати результат у полі результатів
    outputEl.textContent = String(res);
    // після обчислення можна зробити результат попереднім для подальших операцій
    previous = String(res);
    operation = null;
    updateInputDisplay('');
}

// Виконання математичної дії з валідацією
function computeValue(aStr, bStr, op) {
    if (!isValidNumber(aStr) || !isValidNumber(bStr)) {
        showError('Введені некоректні числа');
        return null;
    }
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);
    let raw;
    switch (op) {
        case '+': raw = a + b; break;
        case '-': raw = a - b; break;
        case '*': raw = a * b; break;
        case '/':
            if (b === 0) {
                showError('Помилка: ділення на нуль');
                return null;
            }
            raw = a / b;
            break;
        default:
            showError('Невідома операція');
            return null;
    }
    // Якщо результат не ціле число — заокруглити до сотих
    if (!Number.isInteger(raw)) {
        return roundToTwo(raw);
    }
    return raw;
}

function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Експортуємо функції для onclick у HTML
window.appendNumber = appendNumber;
window.setOperation = setOperation;
window.clearDisplay = clearDisplay;
window.calculateResult = calculateResult;

// Підтримка клавіатури: цифри, крапка, операції, Enter, Esc
window.addEventListener('keydown', (e) => {
    if (/^[0-9]$/.test(e.key)) {
        appendNumber(e.key);
        return;
    }
    if (e.key === '.') {
        appendNumber('.');
        return;
    }
    if (['+', '-', '*', '/'].includes(e.key)) {
        setOperation(e.key);
        return;
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        calculateResult();
        return;
    }
    if (e.key === 'Escape') {
        clearDisplay();
        return;
    }
});

// Ініціалізація
updateInputDisplay('');
outputEl.textContent = '';
// ...existing code...