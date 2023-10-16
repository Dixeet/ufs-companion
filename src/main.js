import { createApp } from 'vue';
import App from './App.vue';
import vuetify from '~/plugins/vuetify.js';
import consoleVlog from '~/plugins/console-vlog.js';

const app = createApp(App).use(vuetify);

if (import.meta.env.MODE === 'development') {
  app.use(consoleVlog);
}

app.mount('#app');
