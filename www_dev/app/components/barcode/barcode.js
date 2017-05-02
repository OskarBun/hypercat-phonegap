import './barcode.css!';
import tmpl from './barcode.html!text';
import Vue from 'vue/dist/vue.js';

import config from 'app/config';

import details from 'app/components/details/details';
import create from 'app/components/create/create';

export default Vue.extend({
    template: tmpl,
    data(){
        return {
            code: null,     //Barcode
            message: null,  //UI Message
            create: false,  //Item not found flag for creation
            error: null,    //UI Error Message
            details: null,   //Item found data
            format: null    //Barcode Format
        }
    },
    methods: {
        scan(){
            if(window.cordova != undefined) {
                window.cordova.plugins.barcodeScanner.scan(
                    (result) => {
                        this.format = result.format;
                        this.code = result.text;
                    },
                    (error) => {
                        console.log('oh dear', error);
                    },
                    {
                        "preferFrontCamera" : false, // iOS and Android
                        "showFlipCameraButton" : true, // iOS and Android
                        "prompt" : "Place a barcode inside the scan area", // supported on Android only
                        "formats" : "CODE_128,QR_CODE" // default: all but PDF_417 and RSS_EXPANDED
                        // "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                    }
                );
            } else {
                this.code = "014_a0e6f80000c1";
                // this.format = "CODE_128"
            }
        },
        get_item(){
            this.$http.get(config.url+'/cat', {
                params: { href: this.code }
            }).then((result) => {
                if(result.body.items.length < 1){
                    this.message = "Item not found in Local Catalogue";
                    this.create = true;
                } else if(result.body.items.length > 1){
                    this.error = "More than one match found in Local Catalogue. Call Tech."
                } else {
                    this.message = "Item found in Local Catalogue";
                    this.details = result.body.items[0];
                }
            }, (error) => {
                if(error.body){
                    this.error = error;
                } else {
                    this.error = "Something Went Wrong";
                }

            });
        },
        update(){
            this.create = true;
        }
    },
    watch: {
        code(newVal, oldVal){
            this.get_item();
        }
    },
    mounted(){
        if(this.$route.params.code)
            this.code = this.$route.params.code
        else
            this.scan();
    },
    components: {
        "iot-details": details,
        "iot-create": create
    }
});
