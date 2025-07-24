// netlify/functions/updateRates.js
const { db } = require('./utils/firebase');

exports.handler = async function(event, context) {
    const { user } = context.clientContext;
    const isAuthorized = (process.env.CONTEXT === 'dev' && user) || (user?.app_metadata?.roles?.includes('admin'));

    if (!isAuthorized) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Доступ дозволено тільки для адміністраторів.' }) };
    }

    try {
        const newRates = JSON.parse(event.body);
        const docRef = db.collection('config').doc('rates');
        
        await docRef.set(newRates);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Тарифи успішно збережено в базі даних!' })
        };
    } catch (error) {
        console.error("Error updating rates:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Не вдалося оновити тарифи в базі даних.' }) };
    }
};