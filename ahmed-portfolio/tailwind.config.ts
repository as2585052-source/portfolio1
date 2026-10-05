import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#050706', emerald: '#4adea0' }, fontFamily: { sans: ['Arial', 'sans-serif'] } } }, plugins: [] };
export default config;
