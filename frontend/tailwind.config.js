/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', // Escanea todo tu código dentro de /src
    ],
    theme: {
        extend: {
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                shimmer: 'shimmer 2s infinite',
            },
        },
    },
    plugins: [],
}
