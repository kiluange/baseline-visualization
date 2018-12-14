import {
    MenuBar
} from './js/components/menu.component.js';
import {
    Home
} from './js/components/home.component.js';
import {
    Meta
} from './js/components/metadados.component.js';

const routes = [{
        path: '/inicio',
        component: Home
    },
    {
        path: '/metadados',
        component: Meta
    },
    {
        path: '/dashboard',
        component: Home
    }
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

var app = new Vue({
    router,
    components: {
        MenuBar,
        Home,
        Meta
    }

}).$mount('#app');