declare module 'vuetify/styles' {
  import { VuetifyOptions } from 'vuetify';
  const styles: VuetifyOptions['styles'];
  export default styles;
}
declare module 'vuetify/lib/framework' {
  import { Vuetify } from 'vuetify';
  export default Vuetify;
}

declare module 'vuetify/dist/vuetify.js' {
  import { Vuetify } from 'vuetify';
  export default Vuetify;
}
