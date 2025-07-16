document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('calc-form');
    const totalCostElem = document.getElementById('total-cost');
    const totalTimelineElem = document.getElementById('total-timeline');
    const topTotalCostElem = document.getElementById('top-total-cost');
    const topTotalTimelineElem = document.getElementById('top-total-timeline');
    const orderBtn = document.getElementById('order-btn');
    
    // Theme Elements
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Modal Elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const callRequestCheckbox = document.getElementById('call-request');
    const phoneGroup = document.getElementById('phone-group');
    
    // Modal Form Hidden Fields
    const hiddenCostInput = document.querySelector('form[name="contact"] input[name="calculated-cost"]');
    const hiddenTimelineInput = document.querySelector('form[name="contact"] input[name="calculated-timeline"]');
    const hiddenOptionsInput = document.querySelector('form[name="contact"] input[name="selected-options"]');


    // --- Theme Switcher Logic ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    };

    themeToggle.addEventListener('change', () => {
        const selectedTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


    // --- Calculator Logic ---
    const RATES = {
        hourlyRate: 30,
        project: { landing: 20, portfolio: 35, corporate: 60, ecommerce: 100 },
        design: { template: 15, unique: 40 },
        modules: { feedbackForm: 5, gallery: 8, blog: 25, socialMedia: 6, basicSeo: 12 }
    };

    let previousCost = 0;
    let previousTotalHours = 0;
    let activeTimers = {};
    let currentSelections = {};
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        currentSelections[radio.name] = radio.value;
    });

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
    
    function handleFormChange(event) {
        const target = event ? event.target : null;

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
                    span.classList.remove('positive');
                    span.classList.remove('negative');
                    span.classList.add(priceChange >= 0 ? 'positive' : 'negative', 'show');
                    
                    currentSelections[groupName] = target.value;

                    activeTimers[target.id] = setTimeout(() => {
                        span.classList.remove('show');
                    }, 3000);
                }
            }
        }
    }

    form.addEventListener('change', handleFormChange);

    // --- Modal Logic ---
    function openModal() {
        // 1. Get current calculator data
        const cost = totalCostElem.textContent;
        const timeline = totalTimelineElem.textContent;
        
        let options = [];
        form.querySelectorAll('input:checked').forEach(input => {
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label) {
                // Очищуємо SVG іконку з тексту
                const labelClone = label.cloneNode(true);
                const svg = labelClone.querySelector('svg');
                if (svg) {
                    svg.remove();
                }
                options.push(labelClone.textContent.trim());
            }
        });

        // 2. Populate hidden fields
        hiddenCostInput.value = cost;
        hiddenTimelineInput.value = timeline;
        hiddenOptionsInput.value = options.join(', ');

        // 3. Show modal
        modalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
    }

    orderBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    callRequestCheckbox.addEventListener('change', () => {
        phoneGroup.classList.toggle('hidden', !callRequestCheckbox.checked);
    });

    // Initial calculation
    handleFormChange();
});