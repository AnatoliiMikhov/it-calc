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

    // Обробник події для відправки форми
    ratesForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Запобігаємо стандартній відправці форми

        const submitButton = ratesForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Збереження...';
        submitButton.disabled = true;

        // 1. Збираємо дані з форми у правильну структуру
        const formData = new FormData(ratesForm);
        const newRates = {
            project: {},
            design: {},
            modules: {}
        };

        for (const [key, value] of formData.entries()) {
            if (key.includes('.')) {
                const [category, subKey] = key.split('.');
                newRates[category][subKey] = parseFloat(value);
            } else {
                newRates[key] = parseFloat(value);
            }
        }

        // 2. Отримуємо токен для аутентифікації
        const user = window.netlifyIdentity.currentUser();
        const token = user ? await user.jwt() : null;

        if (!token) {
            alert('Помилка: ви не авторизовані. Будь ласка, оновіть сторінку і увійдіть знову.');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            return;
        }

        // 3. Відправляємо дані на серверну функцію
        try {
            const response = await fetch('/.netlify/functions/updateRates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Дуже важливо для безпеки!
                },
                body: JSON.stringify(newRates)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Помилка сервера');
            }

            const result = await response.json();
            
            
            submitButton.textContent = 'Збережено!';
            setTimeout(() => {
                submitButton.textContent = originalButtonText;
            }, 2000);

        } catch (error) {
            console.error('Failed to update rates:', error);
            alert(`Не вдалося зберегти тарифи: ${error.message}`);
            submitButton.textContent = originalButtonText;
        } finally {
            submitButton.disabled = false;
        }
    });
});