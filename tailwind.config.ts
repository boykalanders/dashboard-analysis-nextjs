import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/*.{js,ts,jsx,tsx}',   // Adjust these paths as needed
    './components/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg_image' : "url('/img/Green-Background-2048x1152.jpg')",
      },
      colors: {
        Gray100: '#FFFFFF',
        Gray200: '#f2f3f3',
        Gray300: '#e5e7e8',
        Gray400: '#e4e4e4',
        Gray500: '#a9adb1',
        Gunmetal: '#26313B',
        Teal100: '#DCF1E8',
        Teal200: '#DBF0E7',
        Teal300: '#BAE1D1',
        Orange100: '#FFE8D8',
        Orange200: '#FFCFAD',
        Olive100: '#B1CB8F',
        Olive200: '#018979',
        OliveHover: '#006B5F',
        Isabeline: '#F6F3F0',
        LightCyan: '#D8EFEF',
        Columbia: '#C9E8FB',
      },
      fontSize: {
        H1CooperTextSize: '40px',
        H2CooperTextSize: '34px',
        H3CooperTextSize: '30px',
        PPoppinsTextSize: '18px',
      },
      fontFamily: {
        'poppins': ['Poppins'],
        'cooper': ['Cooper'],
      },
    },
  },
  plugins: [],
}
export default config
