// netlify/functions/getRates.js
const { db } = require('./utils/firebase');

exports.handler = async function(event, context) {
    try {
        const docRef = db.collection('config').doc('rates');
        const doc = await docRef.get();

        if (!doc.exists) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Rates document not found' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(doc.data())
        };
    } catch (error) {
        console.error("Error fetching rates:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch rates' }) };
    }
};