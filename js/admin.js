// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const authMessage = document.getElementById('auth-message');
    const loadingIndicator = document.getElementById('loading');
    const ratesForm = document.getElementById('rates-form');

    const user = window.netlifyIdentity.currentUser();

    // Функція для заповнення полів форми даними
    const populateForm = (rates) => {
        // Проста функція для встановлення значень у вкладених об'єктах
        const setInputValue = (baseName, dataObject) => {
            for (const key in dataObject) {
                const inputName = `${baseName}.${key}`;
                const inputElement = ratesForm.querySelector(`[name="${inputName}"]`);
                if (inputElement) {
                    inputElement.value = dataObject[key];
                }
            }
        };

        // Встановлюємо значення для простих полів та вкладених об'єктів
        ratesForm.querySelector('[name="hourlyRate"]').value = rates.hourlyRate;
        setInputValue('project', rates.project);
        setInputValue('design', rates.design);
        setInputValue('modules', rates.modules);
    };

    // Функція для завантаження тарифів
    const fetchRates = async () => {
        try {
            const response = await fetch('/.netlify/functions/getRates');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rates = await response.json();
            
            // Заповнюємо форму отриманими даними
            populateForm(rates);

            // Показуємо форму і ховаємо індикатор завантаження
            ratesForm.classList.remove('hidden');
            loadingIndicator.classList.add('hidden');

        } catch (error) {
            console.error('Failed to fetch rates:', error);
            loadingIndicator.textContent = 'Не вдалося завантажити тарифи. Спробуйте оновити сторінку.';
        }
    };

    // Перевіряємо, чи користувач увійшов в систему
    if (user) {
        // Якщо так, ховаємо повідомлення про вхід і показуємо завантаження
        authMessage.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        
        // Завантажуємо тарифи
        fetchRates();
    } else {
        // Якщо ні, залишаємо повідомлення про необхідність увійти
        authMessage.classList.remove('hidden');
        ratesForm.classList.add('hidden');
        loadingIndicator.classList.add('hidden');
    }

    // Додаємо слухача подій, щоб реагувати на вхід/вихід користувача
    window.netlifyIdentity.on('login', () => {
        location.reload(); // Перезавантажуємо сторінку після входу
    });

    window.netlifyIdentity.on('logout', () => {
        location.reload(); // Перезавантажуємо сторінку після виходу
    });
});