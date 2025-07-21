// netlify/functions/getRates.js

// Це наша перша серверна функція.
// Вона буде повертати поточні тарифи калькулятора.

// Тарифи, які ми поки що жорстко прописуємо тут.
// Пізніше ми будемо брати їх з бази даних.
const RATES = {
    hourlyRate: 30,
    project: { landing: 20, portfolio: 35, corporate: 60, ecommerce: 100 },
    design: { template: 15, unique: 40 },
    modules: { feedbackForm: 5, gallery: 8, blog: 25, socialMedia: 6, basicSeo: 12 }
};

// Основна функція-обробник, яку викликає Netlify.
exports.handler = async function(event, context) {
    try {
        // Повертаємо успішну відповідь (статус 200)
        // і наші тарифи у форматі JSON.
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Дозволяємо доступ з будь-якого домену
            },
            body: JSON.stringify(RATES)
        };
    } catch (error) {
        // Якщо сталася помилка, повертаємо статус 500
        // і повідомлення про помилку.
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch rates' })
        };
    }
};