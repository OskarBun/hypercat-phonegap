import './create.css!';
import tmpl from './create.html!text';
import Vue from 'vue/dist/vue.js';

import config from 'app/config';

const env_desc = ['Enviromental Sensor', 'Dry Water Sensor']

export default Vue.extend({
    template: tmpl,
    props: ['code', 'details', 'format'],
    data(){
        return {
            meta: null,
            _select_map: config.meta_options,
            nuc_check: false,
            nuc_value: ""
        }
    },
    computed: {
        title(){
            if(this.details)
                return "Update in Catalogue";
            return "Add to Catalogue";
        },
        submit(){
            if(this.details)
                return "Update"
            return "Add"
        }
    },
    methods: {
        select_map(item){
            if(!this._select_map) this._select_map = config.meta_options

            if(item.rel === "urn:X-tsbiot:rels:hasDescription:en" && env_desc.indexOf(item.val) != -1){
                if(item.val === 'Dry Water Sensor'){
                    this.meta.find(m=>m.rel === "device_type").val = "SPAQ2_P"
                }
                if(item.val === 'Enviromental Sensor'){
                    this.meta.find(m=>m.rel === "device_type").val = "SPES2"
                }
                return env_desc
            }

            return this._select_map[item.rel]
        },
        post(){
            var metadata = this.meta.slice();
            metadata.forEach((pair, i)=>{
                if(pair.val === 'other') {
                    if(pair.other){
                        pair.val = pair.other.toLowerCase();
                        delete pair.other
                    } else {
                        pair.val = ""
                    }

                }
                if(pair.rel === 'location_index'){
                    var loc = metadata.find((p)=>p.rel === 'house_location')
                    if(loc) loc.val += ' '+pair.val;
                    metadata.splice(i, 1);
                }
            });

            console.log(metadata);
            Vue.http.put(config.url+'/cat?href='+encodeURIComponent(this.code), {
                "i-object-metadata": metadata,
                "href": this.code
            }).then(()=>{
                this.$router.push({
                    name: 'details', params: { code: this.code }
                });
                if(this.$parent.get_item) {
                    this.$parent.get_item();
                    this.$parent.create = false;
                }
            }, (err)=>{
                console.error(err);
            });
        },
        set_meta(){
            if(this.details){
                this.meta = this.details['i-object-metadata'].slice();
                var loc = this.meta.find((p)=>p.rel === 'house_location')
                if(loc) {
                    var split = loc.val.split(" "),
                        index = split.pop();
                    loc.val = split.reduce((acc, val)=>acc+" "+val, "")
                    loc.val = loc.val.trim();
                    this.meta.push({
                        "val": index,
                        "rel": "location_index"
                    });
                }

            } else {
                if(this.code.length === 12 && this.nuc_value.length < 1 && this.format === 'CODE_128'){
                    this.nuc_check = true;
                } else {
                    var code = this.code
                    if(this.nuc_value.length > 0) code = this.nuc_value;
                    this.meta = config.mac_address_map(code);
                }
            }
        },
        nuc(value){
            this.nuc_check = false;
            this.nuc_value = value;
            this.set_meta();
        }
    },
    mounted(){
        this.set_meta();
    }
});
