import './connect.css!';
import tmpl from './connect.html!text';
import Vue from 'vue/dist/vue.js';
import config from 'app/config';

export default Vue.extend({
    template: tmpl,
    data(){
        return {
            trying: true,
            attempts: 0,
            error: null
        }
    },
    methods: {
        connect(){
            Vue.http.get(config.url+'/cat').then((result) => {
                this.trying = false;
                setTimeout(() => {
                    this.$router.push("home");
                }, 1000);
            }, (err) => {
                this.attempts += 1;
                this.error = err
                setTimeout(() => {
                    this.connect();
                }, 5000);
            });
        }
    },
    mounted(){
        this.connect();
    }
});
