/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
import ElementUI from 'element-ui';
// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
import 'element-ui/lib/theme-chalk/index.css';
require('froala-editor/js/froala_editor.pkgd.min.js');

// Require Froala Editor css files.
import('froala-editor/css/froala_editor.pkgd.min.css');
import('froala-editor/css/froala_style.min.css');


/* Add the ELement UI Library*/
Vue.use(ElementUI);

/* Add the Froala Library*/
Vue.use(VueFroala);

import store from "./store";
const app = new Vue({
    store,
    el: '#app',
});
