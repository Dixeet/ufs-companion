import 'vuetify/styles';
import '~/assets/styles/main.scss';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#3499f3',
          secondary: '#424242',
          tertiary: '#84bfef',
          accent: '#FF4081',
          background: '#121212',
          surface: '#212121',
          'surface-bright': '#474747',
          'surface-variant': '#a3a3a3',
          'on-surface-variant': '#424242',
          'primary-darken-1': '#3700B3',
          'secondary-darken-1': '#03DAC5',
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
        variables: {
          'border-color': '#FFFFFF',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.7,
          'disabled-opacity': 0.5,
          'idle-opacity': 0.1,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.16,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#343434',
          'theme-on-code': '#CCCCCC',
        },
      },
    },
  },
});
