/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js","./src/**/*.{css,scss}",'./node_modules/xtendui/src/*.mjs'],
    theme: {
        extend: {
            fontFamily: {
                bookkGothic: ["부크크고딕"],
                bookkGothicBold: ["부크크고딕bold"],
                bookkMyungjo: ["부크크명조"],
                bookkMyungjoBold: ["부크크명조bold"],
            },
        },
    },
    plugins: [],
    plugins: [require("kutty")],
    presets: [
        require('tailwindcss/defaultConfig'), require('xtendui/tailwind.preset'),
      ],
};
