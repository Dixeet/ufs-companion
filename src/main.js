import { createApp } from 'vue';
import App from './App.vue';
import '~/assets/styles/main.scss';
import vuetify from '~/plugins/vuetify.js';
import consoleVlog from '~/plugins/console-vlog.js';
import dexie from '~/plugins/dexie.js';

const app = createApp(App).use(vuetify).use(dexie);

if (import.meta.env.MODE === 'development') {
  app.use(consoleVlog);
}

app.mount('#app');
