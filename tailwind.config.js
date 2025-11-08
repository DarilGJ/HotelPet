/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B", // Amber 500
        secondary: "#10B981", // Emerald 500
        "background-light": "#F9FAFB", // Gray 50
        "background-dark": "#1F2937", // Gray 800
        "text-light": "#374151", // Gray 700
        "text-dark": "#F3F4F6", // Gray 100
        "card-light": "#FFFFFF",
        "card-dark": "#374151", // Gray 700
        "border-light": "#E5E7EB", // Gray 200
        "border-dark": "#4B5563", // Gray 600
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [
    // Plugins opcionales - comentados si no están instalados
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
}
