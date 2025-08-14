import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css';
import AppButton from './components/AppButton.vue';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});

const app = createApp(App);

app.component('AppButton', AppButton);

app.use(vuetify);
app.mount('#app');
