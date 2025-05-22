import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Shorten URL Section ---
    const longUrlInput = document.getElementById('longUrlInput');
    const shortenButton = document.getElementById('shortenButton');
    const shortenedUrlOutput = document.getElementById('shortenedUrlOutput');

    shortenButton.addEventListener('click', async () => {
        const longUrl = longUrlInput.value.trim();
        if (!longUrl) {
            shortenedUrlOutput.textContent = 'Please enter a URL.';
            shortenedUrlOutput.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: longUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                shortenedUrlOutput.textContent = `Short URL: ${data.shortUrl}`;
                shortenedUrlOutput.style.color = 'green';
            } else {
                shortenedUrlOutput.textContent = `Error: ${data.error || 'Something went wrong'}`;
                shortenedUrlOutput.style.color = 'red';
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            shortenedUrlOutput.textContent = 'An error occurred while connecting to the server.';
            shortenedUrlOutput.style.color = 'red';
        }
    });

    // --- Get Stats Section ---
    const statsShortCodeInput = document.getElementById('statsShortCodeInput');
    const getStatsButton = document.getElementById('getStatsButton');
    const statsOutput = document.getElementById('statsOutput');

    getStatsButton.addEventListener('click', async () => {
        const shortCode = statsShortCodeInput.value.trim();
        if (!shortCode) {
            statsOutput.textContent = 'Please enter a short code.';
            statsOutput.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/shorten/${shortCode}/stats`);
            const data = await response.json();

            if (response.ok) {
                statsOutput.textContent = JSON.stringify(data, null, 2);
                statsOutput.style.color = 'black';
            } else {
                statsOutput.textContent = `Error: ${data.error || 'Something went wrong'}`;
                statsOutput.style.color = 'red';
            }
        } catch (error) {
            console.error('Error getting stats:', error);
            statsOutput.textContent = 'An error occurred while connecting to the server.';
            statsOutput.style.color = 'red';
        }
    });
});