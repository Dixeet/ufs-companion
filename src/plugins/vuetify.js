import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import Icons from './vuetify/icons.js';

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...Icons,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#5d4200',
          'primary-variant': '#f5be48',
          secondary: '#53452a',
          'secondary-variant': '#d9c4a0',
          tertiary: '#344d2f',
          'tertiary-variant': '#b2cfa8',
          background: '#1e1b16',
          surface: '#282419',
          'surface-variant': '#372f1c',
          error: '#93000a',
          'error-variant': '#ffb4ab',
          'on-primary': '#ffdea4',
          'on-primary-variant': '#412d00',
          'on-secondary': '#f6e0bb',
          'on-secondary-variant': '#3b2f15',
          'on-tertiary': '#cdebc2',
          'on-tertiary-variant': '#1e361a',
          'on-background': '#e9e1d9',
          'on-surface': '#e9e1d9',
          'on-surface-variant': '#e9e1d9',
          'on-error': '#ffdad6',
          'on-error-variant': '#690005',
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
