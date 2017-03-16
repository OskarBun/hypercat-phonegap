import Vue from 'vue/dist/vue.js';
import Resource from 'vue-resource';
import Router from 'vue-router';

import 'normalize.css/normalize.css!';
import 'fontawsome/css/font-awesome.css!';
import 'app/main.css!';

import home from 'app/pages/home/home';
import cost from 'app/pages/current_cost/cost';

import barcode from 'app/components/barcode/barcode';
import catalogue from 'app/components/catalogue/catalogue';
import connect from 'app/components/connect/connect';

Vue.use(Resource);
Vue.use(Router);

//Event Bus
Vue.use({install:function(Vue, options){
    var bus = new Vue();
    Vue.mixin({
        created(){
            this.$bus = bus;
        }
    });
}});

// Vue.http.headers.common['Authorization'] = btoa("goatus:");

Vue.config.devtools = true;

Vue.filter('pretty_meta', function(input){
    if(input === "urn:X-tsbiot:rels:hasDescription:en")
        return 'Description';
    var words = input.split('_'),
        result = "";

    words.forEach((word)=>{
        result += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    });

    return result;
});


var router = new Router({
    routes: [
        {path : '/scan'         , component: barcode},
        {path : '/scan/:code'   , component: barcode, name: 'details'},
        {path : '/catalogue'    , component: catalogue},
        {path : '/current'      , component: cost},
        {path : '/home'         , component: home},
        {path : '*'             , component: connect}
    ]
});

var app = window.app = new Vue({
    el: '.vue',
    router: router,
    data(){
        return {
            loading: true
        }
    },
    methods: {
        back(){
            if(this.$route.path != '/home'){
                router.push('/home');
            }
        }
    },
    mounted(){
        setTimeout(() => {
            this.loading = false;
        }, 500);
        document.addEventListener("deviceready", ()=>{
            document.addEventListener("backbutton", (e)=>{
                if(this.$route.path != '/home'){
                    router.push('/home');
                    e.preventDefault();
                }
            }, true);
        }, false);
    }
});
