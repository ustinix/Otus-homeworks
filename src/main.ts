import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css';
import router from './router/router';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});

const app = createApp(App).use(router);

app.use(vuetify);
app.mount('#app');
