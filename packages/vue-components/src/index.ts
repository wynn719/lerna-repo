import { VueConstructor } from 'vue';
import component from './component.vue';

let installed = false;

// Declare install function executed by Vue.use()
export function install(Vue: { component: (arg0: string, arg1: VueConstructor<component>) => void; }) {
  if (installed) return;

  installed = true;
  Vue.component(component.name, component);
}

// Create module definition for Vue.use()
const plugin = {
	install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// To allow use as module (npm/webpack/etc.) export component
export default component;
