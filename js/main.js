document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('calc-form');
    // Нижній блок результатів
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');
    // Верхній блок результатів
    const topTotalCostElem = document.getElementById('top-total-cost');
    const topTotalTimelineElem = document.getElementById('top-total-timeline');

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
    let currentSelections = {};
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        currentSelections[radio.name] = radio.value;
    });

    // --- Helper Functions ---
    function animateValue(start, end, duration, onFrame) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            onFrame(currentValue);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // --- Main Calculation and UI Update Function ---
    function handleFormChange(event) {
        const target = event ? event.target : null;

        // --- 1. Розрахунок загальної вартості ---
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

        // Анімація загальних результатів (для обох блоків)
        animateValue(previousCost, totalCost, 500, (val) => {
            const roundedVal = Math.round(val);
            totalCostElem.textContent = `${roundedVal} $`;
            topTotalCostElem.textContent = `${roundedVal} $`;
        });
        animateValue(previousTotalHours, totalHours, 500, (val) => {
            const maxWeeks = Math.ceil(val / 40);
            const minWeeks = Math.max(1, Math.floor(val / 40));
            const timelineText = minWeeks >= maxWeeks ? `${maxWeeks} тиж.` : `${minWeeks}-${maxWeeks} тиж.`;
            totalTimelineElem.textContent = timelineText;
            topTotalTimelineElem.textContent = timelineText;
        });

        previousCost = totalCost;
        previousTotalHours = totalHours;

        // --- 2. Оновлення індивідуальних індикаторів ціни ---
        if (target && target.tagName === 'INPUT') {
            const span = target.closest('.option').querySelector('.price-change');
            if (!span) return;

            if (activeTimers[target.id]) clearTimeout(activeTimers[target.id]);

            if (target.type === 'checkbox') {
                const hours = RATES.modules[target.value] || 0;
                const price = hours * RATES.hourlyRate;
                
                if (target.checked) {
                    span.textContent = `+${Math.round(price)} $`;
                    span.classList.remove('negative');
                    span.classList.add('positive', 'show');
                } else {
                    span.textContent = `-${Math.round(price)} $`;
                    span.classList.remove('positive');
                    span.classList.add('negative', 'show');
                    
                    activeTimers[target.id] = setTimeout(() => {
                        span.classList.remove('show');
                    }, 3000);
                }
            } else if (target.type === 'radio') {
                const groupName = target.name;
                const previousValue = currentSelections[groupName];
                
                if (target.value !== previousValue) {
                    const ratesKey = groupName.replace('Type', '');
                    const previousHours = RATES[ratesKey][previousValue] || 0;
                    const newHours = RATES[ratesKey][target.value] || 0;
                    const priceChange = (newHours - previousHours) * RATES.hourlyRate;
                    
                    span.textContent = `${priceChange >= 0 ? '+' : ''}${Math.round(priceChange)} $`;
                    span.classList.remove('positive', 'negative');
                    span.classList.add(priceChange >= 0 ? 'positive' : 'negative', 'show');
                    
                    currentSelections[groupName] = target.value;

                    activeTimers[target.id] = setTimeout(() => {
                        span.classList.remove('show');
                    }, 3000);
                }
            }
        }
    }

    // --- Event Listeners ---
    form.addEventListener('change', handleFormChange);

    // Початковий розрахунок
    handleFormChange();
});