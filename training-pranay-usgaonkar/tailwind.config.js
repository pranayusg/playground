module.exports = {
    content: ['./app/**/*.{ts,tsx,jsx,js}'],
    theme: {
        colors: {
            abyss: '#030811',
            midnight: '#0b1d41',
            'midnight-700': '#0b1d41b3',
            horizon: '#99ccee',
            'horizon-200': '#99ccee33',
            'horizon-700': '#99cceeb3',
            field: '#86c443',
            'field-700': '#86c443b3',
            pearl: '#e3e3e3',
            cloud: '#f6f6f8',
            white: '#fff',
            blue: '#2e79b8',
            'blue-400': '#112c4a',
            'blue-500': '#d5eafb',
            red: '#e60026',
            'green-400': '#84cb08',
            'red-150': '#e6002626',
            gray: '#303030',
            'gray-100': '#a8a8a8',
            'gray-150': '#f2f2f2',
            'gray-200': '#e5e5e5',
            'gray-250': '#bdbdbd',
            'gray-700': '#777',
            transparent: 'transparent',
            black: '#000',
        },
        fontFamily: {
            montserrat: "'Montserrat', sans-serif",
        },
        fontSize: {
            sm: '12px',
            tiny: '14px',
            base: '16px',
            md: '18px',
            '2md': '20px',
            lg: '22px',
            '2lg': '24px',
            xl: '26px',
            '2xl': '27px',
            '3xl': '30px',
            '4xl': '38px',
            '5xl': '40px',
            '6xl': '44px',
            '7xl': '55px',
            '8xl': '60px',
        },
        container: {
            center: true,
            padding: '20px',
        },
        extend: {
            screens: {
                sm: '576px', // => @media (min-width: 576px) { ... }
                lg: '992px', // => @media (min-width: 992px) { ... }
                xl: '1200px', // => @media (min-width: 1200px) { ... }
                '2xl': '1420px', // => @media (min-width: 1420px) { ... }
            },
            spacing: {
                7: '7px',
                15: '15px',
                '30': '30px',
                50: '50px',
                56: '56px',
                'calc-full-56': 'calc(100% - 56px)',
            },
            width: {
                30: '30px',
                42: '42px',
                160: '160px',
                200: '200px',
            },
            minWidth: {},
            maxWidth: {
                72: '72px',
                300: '300px',
                407: '407px',
                486: '486px',
            },
            height: {
                42: '42px',
                74: '74px',
                296: '296px',
            },
            padding: {
                13: '13px',
                16: '16px',
                17: '17px',
                30: '30px',
                38: '38px',
                40: '40px',
            },
            margin: {
                20: '20px',
                24: '24px',
                30: '30px',
            },
            borderWidth: {
                3: '3px',
            },
            borderRadius: {
                4: '4px',
                10: '10px',
                30: '30px',
                100: '100px',
            },
            backgroundImage: {
              'arrow-right': "url('/images/style-images/icon-arrow-right.png')",
              'arrow-down': "url('/images/style-images/icon-arrow-down.png')",
              'angle-down': "url('/images/style-images/icon-angle-down.png')",
              'angle-left': "url('/images/style-images/icon-angle-left.png')",
              'logo': "url('/images/content-images/logo.svg')",
              'r-logo': "url('/images/style-images/icon-logo.svg')",
              'r-white-logo': "url('/images/style-images/r-white-logo.svg')",
              'play-button-blue': 'url(/images/style-images/icon-play-button-blue.svg)',
              'arrow-down-green': "url('/images/style-images/icon-arrow-down-green.svg')",
              'logo-alt': "url('/images/content-images/logo-alt.svg')",
              'arrow-down-white': "url('/images/style-images/icon-arrow-down-white.png')",
              'icon-play': "url('/images/style-images/icon-play.svg')",
              'avatar': "url('/images/style-images/avatar-icon.png')"
            },
            backgroundPosition: {
              'right-16': 'right 16px center',
            },
            transitionDuration: {
              '250': '250ms',
            },
            translate: {
              '3': '3px',
              '15': '15px',
              '18': '18px',
            },
            zIndex: {
              '1': '1',
              '12': '12',
            },
            content: {
              'list': 'url("/images/style-images/icon-arrow-up.png")',
              'checked-list': 'url("/images/style-images/icon-check-mark.svg")',
            },
            opacity: {
              '99': '.99',
            },
            letterSpacing: {
              '0.02': '0.02em'
            },
        },
    },
    plugins: [],
};
