import './details.css!';
import tmpl from './details.html!text';
import Vue from 'vue/dist/vue.js';

import create from 'app/components/create/create';

export default Vue.extend({
    template: tmpl,
    props: ['item', 'mac'],
    data(){
        return {
        }
    },
    computed: {
        meta(){
            if(this.item) return this.item['i-object-metadata'];
            return [];
        },
        // location(){
        //     var ret = ""
        //     this.meta.forEach((meta)=>{
        //         if(meta.rel === "house_location")
        //             ret = meta.val;
        //     });
        //     return ret;
        // }
        hrefs(){
            if(this.mac === 'UID') return 'UID';
            else return 'Mac Address';
        }
    },
    filters: {
        no_slash(input){
            return input.replace("/", "");
        }
    }
});
