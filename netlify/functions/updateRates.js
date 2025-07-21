// netlify/functions/updateRates.js

// Це наша друга, захищена серверна функція.
// Вона буде приймати нові тарифи і зберігати їх.

exports.handler = async function(event, context) {
    // 1. Перевірка безпеки: чи є користувач адміністратором?
    const { user } = context.clientContext;

    // Користувач авторизований, якщо:
    // - він залогінений в локальному середовищі (process.env.CONTEXT === 'dev')
    // - АБО він має роль 'admin' (для реального сайту).
    // Оператор (?.) захищає від помилок, якщо app_metadata або roles відсутні.
    const isAuthorized = (process.env.CONTEXT === 'dev' && user) || (user?.app_metadata?.roles?.includes('admin'));

    if (!isAuthorized) {
        return {
            statusCode: 401, // 401 Unauthorized - Неавторизований доступ
            body: JSON.stringify({ error: 'Доступ дозволено тільки для адміністраторів.' })
        };
    }

    // 2. Отримуємо нові дані з тіла запиту
    const newRates = JSON.parse(event.body);

    // 3. Робимо щось з даними (поки що просто виводимо в консоль)
    // На цьому місці в майбутньому буде код для збереження в базу даних.
    console.log('Отримано нові тарифи від адміністратора:', newRates);

    // 4. Повертаємо успішну відповідь
    try {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ message: 'Тарифи успішно оновлено!', receivedData: newRates })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Сталася помилка при оновленні тарифів.' })
        };
    }
};