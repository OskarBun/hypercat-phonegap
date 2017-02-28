import './cost.css!';
import tmpl from './cost.html!text';
import Vue from 'vue/dist/vue.js';

export default Vue.extend({
    template: tmpl,
    data(){
        return {
            code: "",
            id: null,
            error: false
        }
    },
    methods:{
        set(){
            if(this.code.length != 5) this.error = true;
            else this.$router.push({name:'details', params: { code: this.code}});
        }
    }
});
