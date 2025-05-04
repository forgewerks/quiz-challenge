import { QUIZ_API_KEY } from 'astro:env/server';
import { type Questions } from '../types/api';
const apiKey = QUIZ_API_KEY;
export async function getQuizzes() {
    try {
        if (!apiKey) {
            throw new Error('API KEY not found');
        }
        const response = await fetch("https://quizapi.io/api/v1/questions", {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorBody.error || 'Unknown error'}`);
        }
        const questions = await response.json();
        return questions as Questions;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return undefined;
    }
}
export async function getCategories() {
    if (!apiKey) {
        throw new Error('API KEY not found'); 
    }
    const response = await fetch("https://quizapi.io/api/v1/categories", {
        headers: {
            'X-Api-Key': apiKey
        }
    });
    const categories = await response.json();
    return categories;
}