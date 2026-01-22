/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#10B981",
                "primary-dark": "#059669",
                "primary-light": "#34D399",
                accent: "#3B82F6",
                "accent-dark": "#2563EB",
                background: "#F3F4F6",
            },
            fontFamily: {
                "pt-sans": ['"PT Sans"', "sans-serif"],
            },
        },
    },
    plugins: [],
};
