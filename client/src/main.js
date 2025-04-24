import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vue3GoogleLogin from 'vue3-google-login';
import { Quasar, Notify } from 'quasar';
import quasarIconSet from 'quasar/icon-set/svg-fontawesome-v6';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
axios.defaults.withCredentials = true;

// Import Quasar css
import 'quasar/src/css/index.sass';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: { Notify },
  iconSet: quasarIconSet,
});
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_APP_CLIENT_ID,
});

app.mount('#app');

