import './catalogue.css!';
import tmpl from './catalogue.html!text';
import Vue from 'vue/dist/vue.js';
import config from 'app/config';

import details from 'app/components/details/details'

export default Vue.extend({
    template: tmpl,
    data(){
        return {
            cat: null,
            showing: null,
            del_check: false
        }
    },
    methods: {
        getCata(){
            Vue.http.get(config.url+'/cat').then((result) => {
                this.cat = result.body;
            });
        },
        show(href){
            this.del_check = false;
            if(this.showing === href) this.showing = null;
            else this.showing = href;
        },
        describe(item){
            var ret = item['i-object-metadata'].find(x=>x.rel==="urn:X-tsbiot:rels:hasDescription:en").val,
                extra = this.mac(item) === 'mac' ? item['i-object-metadata'].find(x=>x.rel==="house_location") : item['i-object-metadata'].find(x=>x.rel==="appliance");
            if(extra){
                ret +=  " (" + extra.val + ")";
            }
            return ret;
        },
        mac(item){
            if( item['i-object-metadata'].find(x=>x.rel==="urn:X-tsbiot:rels:hasDescription:en" && x.val === "Power Usage Monitor") )
                return "UID";
            return "mac";
        },
        update(item){
            this.$router.push({name:'details', params: { code: item.href.replace("/", "")}});
        },
        del(item){
            if(!this.del_check) this.del_check = true
            else
            Vue.http.delete(config.url+'/cat?href='+encodeURIComponent(item.href), {
                "href": item.href
            }).then(()=>{
                this.getCata()
                this.del_check = false
            }, (err)=>{
                console.error(err);
                this.del_check = false
            });
        }
    },
    mounted(){
        this.getCata()
    },
    components: {
        "iot-details": details
    }
});
