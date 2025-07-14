document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calc-form');
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');

    // --- Базові ціни та терміни ---
    const basePrices = {
        landing: 500,
        portfolio: 800,
        corporate: 1500,
        ecommerce: 2500,
    };

    const baseTimelines = {
        landing: 1, // в тижнях
        portfolio: 2,
        corporate: 4,
        ecommerce: 6,
    };

    const designPrices = {
        template: 0,
        unique: 1000,
    };

    const designTimelines = {
        template: 0,
        unique: 2,
    };

    const modulePrices = {
        feedbackForm: 100,
        gallery: 250,
        blog: 400,
        socialMedia: 150,
        basicSeo: 200,
    };

    const moduleTimelines = {
        feedbackForm: 0.5,
        gallery: 1,
        blog: 1.5,
        socialMedia: 0.5,
        basicSeo: 1,
    };

    function calculate() {
        // 1. Тип проєкту
        const projectType = form.querySelector('input[name="projectType"]:checked').value;
        let currentCost = basePrices[projectType];
        let currentTimeline = baseTimelines[projectType];

        // 2. Дизайн
        const designType = form.querySelector('input[name="designType"]:checked').value;
        currentCost += designPrices[designType];
        currentTimeline += designTimelines[designType];

        // 3. Додаткові модулі
        const selectedModules = form.querySelectorAll('input[name="module"]:checked');
        selectedModules.forEach(module => {
            currentCost += modulePrices[module.value];
            currentTimeline += moduleTimelines[module.value];
        });

        // Оновлення результатів на сторінці
        totalCostElem.textContent = `${currentCost} $`;
        totalTimelineElem.textContent = `${currentTimeline} тижнів`;
    }

    // Обробник подій для будь-якої зміни у формі
    form.addEventListener('change', calculate);

    // Початковий розрахунок при завантаженні сторінки
    calculate();
});