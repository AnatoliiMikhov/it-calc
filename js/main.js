document.addEventListener('DOMContentLoaded', () => {
    // --- Отримуємо доступ до елементів DOM ---
    const form = document.getElementById('calc-form');
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');

    // --- Єдина конфігурація з годинами та ставкою ---
    const RATES = {
        hourlyRate: 30,
        project: { landing: 20, portfolio: 35, corporate: 60, ecommerce: 100 },
        design: { template: 15, unique: 40 },
        modules: { feedbackForm: 5, gallery: 8, blog: 25, socialMedia: 6, basicSeo: 12 }
    };

    // --- Змінні для зберігання попередніх значень для анімації ---
    let previousCost = 0;
    let previousTotalHours = 0;

    /**
     * Універсальна функція для анімації числового значення.
     * @param {number} start - Початкове значення.
     * @param {number} end - Кінцеве значення.
     * @param {number} duration - Тривалість анімації в мс.
     * @param {function(number)} onFrame - Функція, що викликається на кожному кадрі з поточним значенням.
     */
    function animateValue(start, end, duration, onFrame) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            
            onFrame(currentValue); // Викликаємо передану функцію з проміжним значенням

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function calculate() {
        // --- 1. Розрахунок загальної кількості годин ---
        let totalHours = 0;
        const projectType = form.querySelector('input[name="projectType"]:checked').value;
        totalHours += RATES.project[projectType];
        const designType = form.querySelector('input[name="designType"]:checked').value;
        totalHours += RATES.design[designType];
        const selectedModules = form.querySelectorAll('input[name="module"]:checked');
        selectedModules.forEach(module => {
            totalHours += RATES.modules[module.value];
        });

        // --- 2. Розрахунок кінцевої вартості ---
        const totalCost = totalHours * RATES.hourlyRate;

        // --- 3. Анімація результатів ---
        
        // Анімуємо вартість
        animateValue(previousCost, totalCost, 500, (currentValue) => {
            totalCostElem.textContent = `${Math.round(currentValue)} $`;
        });

        // Анімуємо термін, анімуючи загальну кількість годин
        animateValue(previousTotalHours, totalHours, 500, (currentHours) => {
            const maxWeeks = Math.ceil(currentHours / 40);
            const minWeeks = Math.max(1, Math.floor(currentHours / 40));

            if (minWeeks >= maxWeeks) {
                totalTimelineElem.textContent = `${maxWeeks} тиж.`;
            } else {
                totalTimelineElem.textContent = `${minWeeks}-${maxWeeks} тиж.`;
            }
        });

        // --- 4. Зберігаємо поточні значення для наступної анімації ---
        previousCost = totalCost;
        previousTotalHours = totalHours;
    }

    // --- Обробник подій ---
    form.addEventListener('change', calculate);

    // Початковий розрахунок
    calculate();
});