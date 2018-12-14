import {
    MenuBar
} from './js/components/menu.component.js';
import {
    Home
} from './js/components/home.component.js';
import {
    Meta
} from './js/components/metadados.component.js';
import {
    Domiciliar
} from './js/components/domiciliar.component.js';
import {
    Individual
} from './js/components/individual.component.js';
import {
    Familiar
} from './js/components/familiar.component.js';

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
    },
    {
        path: '/dashboard/domciliar',
        component: Domiciliar
    },
    {
        path: '/dashboard/familiar',
        component: Familiar
    },
    {
        path: '/dashboard/individual',
        component: Individual
    },
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

var app = new Vue({
    router,
    components: {
        MenuBar,
        Home,
        Meta,
        Domiciliar,
        Familiar,
        Individual
    }

}).$mount('#app');