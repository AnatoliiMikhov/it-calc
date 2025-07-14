document.addEventListener('DOMContentLoaded', () => {
    // --- Отримуємо доступ до елементів DOM ---
    const form = document.getElementById('calc-form');
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');

    // --- Єдина конфігурація з годинами та ставкою ---
    const RATES = {
        // Погодинна ставка в $
        hourlyRate: 30,
        // Оцінка в годинах
        project: {
            landing: 20,
            portfolio: 35,
            corporate: 60,
            ecommerce: 100
        },
        design: {
            template: 15,
            unique: 40
        },
        modules: {
            feedbackForm: 5,
            gallery: 8,
            blog: 25,
            socialMedia: 6,
            basicSeo: 12
        }
    };

    function calculate() {
        // --- 1. Розрахунок загальної кількості годин ---
        let totalHours = 0;

        // Додаємо години за тип проєкту
        const projectType = form.querySelector('input[name="projectType"]:checked').value;
        totalHours += RATES.project[projectType];

        // Додаємо години за тип дизайну
        const designType = form.querySelector('input[name="designType"]:checked').value;
        totalHours += RATES.design[designType];

        // Додаємо години за обрані модулі
        const selectedModules = form.querySelectorAll('input[name="module"]:checked');
        selectedModules.forEach(module => {
            totalHours += RATES.modules[module.value];
        });

        // --- 2. Розрахунок вартості та термінів ---
        const totalCost = totalHours * RATES.hourlyRate;

        // Розраховуємо термін: 40 годин на тиждень
        const maxWeeks = Math.ceil(totalHours / 40);
        const minWeeks = Math.max(1, Math.floor(totalHours / 40));

        // --- 3. Оновлення результатів на сторінці ---
        totalCostElem.textContent = `${totalCost} document.addEventListener('DOMContentLoaded', () => {
    // --- Отримуємо доступ до елементів DOM ---
    const form = document.getElementById('calc-form');
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');

    // --- Єдина конфігурація з годинами та ставкою ---
    const RATES = {
        // Погодинна ставка в $
        hourlyRate: 30,
        // Оцінка в годинах
        project: {
            landing: 20,
            portfolio: 35,
            corporate: 60,
            ecommerce: 100
        },
        design: {
            template: 15,
            unique: 40
        },
        modules: {
            feedbackForm: 5,
            gallery: 8,
            blog: 25,
            socialMedia: 6,
            basicSeo: 12
        }
    };

    function calculate() {
        // --- 1. Розрахунок загальної кількості годин ---
        let totalHours = 0;

        // Додаємо години за тип проєкту
        const projectType = form.querySelector('input[name="projectType"]:checked').value;
        totalHours += RATES.project[projectType];

        // Додаємо години за тип дизайну
        const designType = form.querySelector('input[name="designType"]:checked').value;
        totalHours += RATES.design[designType];

        // Додаємо години за обрані модулі
        const selectedModules = form.querySelectorAll('input[name="module"]:checked');
        selectedModules.forEach(module => {
            totalHours += RATES.modules[module.value];
        });

        // --- 2. Розрахунок вартості та термінів ---
        const totalCost = totalHours * RATES.hourlyRate;

        ;
        
        if (minWeeks === maxWeeks) {
            totalTimelineElem.textContent = `${maxWeeks} тиж.`;
        } else {
            totalTimelineElem.textContent = `${minWeeks}-${maxWeeks} тиж.`;
        }
    }

    // Обробник подій для будь-якої зміни у формі
    form.addEventListener('change', calculate);

    // Початковий розрахунок при завантаженні сторінки
    calculate();
});
