import Vue from "vue";
import VueRouter from "vue-router";

import auth from '@/router/middleware/auth';
import middlewarePipeline from '@/router/middleware/middlewarePipeline';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: () =>  { return import('@/views/LoginPage.vue') },
        beforeEnter(to, from, next) {
            const isLoggedIn = window.$cookies.get('login')
            console.log('window.cookies: ', window.$cookies.get('POS_AUTH'))
            console.log('window.cookies: ', window.$cookies.get('login'))
            console.log('window.cookies: ', window.$cookies.get('user_id'))
            if (isLoggedIn) {
                next(`/pos`);
            } else {
                // will prevent from going back to login page
                next();
            }
        },
    },
    {
        path: '/pos',
        name: 'pos',
        component: () =>  { return import('@/views/NavBar.vue') },
        meta: {
            middleware: [ auth ]
        },
        children: [
            {
                path: 'inventory',
                name: 'inventory',
                component: () =>  { return import('@/views/InventoryPage/IndexPage.vue') },
                meta: {
                    middleware: [ auth ]
                },
            },
            {
                path: 'cash-register',
                name: 'cash-register',
                component: () =>  { return import('@/views/CashRegisterPage/IndexPage.vue') },
                meta: {
                    middleware: [ auth ]
                },
            }
        ]
    },
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior(to) {
        if (to.hash) {
            return window.scrollTo({
                top: document.querySelector(to.hash).offsetTop,
                behavior: "smooth",
            });
        } else {
            return { x: 0, y: 0 };
        }
    },
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
        const context = { to, from, next };
        return middleware[0]({
            ...context,
            next: middlewarePipeline(context, middleware, 1)
        });
    } else {
        next();
    }
});

export default router;
