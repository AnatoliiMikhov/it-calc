document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('calc-form');
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');

    // --- Configuration ---
    const RATES = {
        hourlyRate: 30,
        project: { landing: 20, portfolio: 35, corporate: 60, ecommerce: 100 },
        design: { template: 15, unique: 40 },
        modules: { feedbackForm: 5, gallery: 8, blog: 25, socialMedia: 6, basicSeo: 12 }
    };

    // --- State Variables ---
    let previousCost = 0;
    let previousTotalHours = 0;
    let activeTimers = {};
    
    // Зберігаємо поточний вибір радіокнопок
    let currentSelections = {};
    form.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.checked) {
            currentSelections[radio.name] = radio.value;
        }
    });


    // --- Helper Functions ---
    function animateValue(start, end, duration, onFrame) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            onFrame(currentValue);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function showPriceChange(element, price) {
        const span = element.closest('.option').querySelector('.price-change');
        if (!span) return;

        if (activeTimers[element.id]) {
            clearTimeout(activeTimers[element.id]);
        }
        
        const isPositive = price >= 0;
        span.textContent = `${isPositive ? '+' : ''}${Math.round(price)} $`;
        span.classList.remove('positive', 'negative');

        if (price !== 0) {
            span.classList.add(isPositive ? 'positive' : 'negative', 'show');
        }

        activeTimers[element.id] = setTimeout(() => {
            span.classList.remove('show');
        }, 1500);
    }

    // --- Main Calculation Function ---
    function calculate() {
        let totalHours = 0;
        const projectType = form.querySelector('input[name="projectType"]:checked').value;
        totalHours += RATES.project[projectType];
        const designType = form.querySelector('input[name="designType"]:checked').value;
        totalHours += RATES.design[designType];
        const selectedModules = form.querySelectorAll('input[name="module"]:checked');
        selectedModules.forEach(module => {
            totalHours += RATES.modules[module.value];
        });

        const totalCost = totalHours * RATES.hourlyRate;

        animateValue(previousCost, totalCost, 500, (currentValue) => {
            totalCostElem.textContent = `${Math.round(currentValue)} $`;
        });

        animateValue(previousTotalHours, totalHours, 500, (currentHours) => {
            const maxWeeks = Math.ceil(currentHours / 40);
            const minWeeks = Math.max(1, Math.floor(currentHours / 40));
            if (minWeeks >= maxWeeks) {
                totalTimelineElem.textContent = `${maxWeeks} тиж.`;
            } else {
                totalTimelineElem.textContent = `${minWeeks}-${maxWeeks} тиж.`;
            }
        });

        previousCost = totalCost;
        previousTotalHours = totalHours;
    }

    // --- Event Listeners ---
    form.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName !== 'INPUT') return;

        const value = target.value;
        let priceChange = 0;

        if (target.type === 'checkbox') {
            const hours = RATES.modules[value] || 0;
            priceChange = hours * RATES.hourlyRate;
            if (!target.checked) {
                priceChange = -priceChange;
            }
            showPriceChange(target, priceChange);

        } else if (target.type === 'radio') {
            const groupName = target.name;
            const previousValue = currentSelections[groupName];

            if (value !== previousValue) {
                const ratesKey = groupName.replace('Type', ''); // 'projectType' -> 'project'
                
                const previousHours = RATES[ratesKey][previousValue] || 0;
                const newHours = RATES[ratesKey][value] || 0;
                
                priceChange = (newHours - previousHours) * RATES.hourlyRate;
                
                currentSelections[groupName] = value; // Оновлюємо вибір
                showPriceChange(target, priceChange);
            }
        }
    });
    
    form.addEventListener('change', calculate);

    calculate();
});