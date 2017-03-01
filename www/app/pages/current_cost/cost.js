import './cost.css!';
import tmpl from './cost.html!text';
import Vue from 'vue/dist/vue.js';

export default Vue.extend({
    template: tmpl,
    data(){
        return {
            code: "",
            id: null,
            error: false,
            ws: null,
            items: []
        }
    },
    methods:{
        set(){
            if(this.code.length != 5) this.error = true;
            else this.$router.push({name:'details', params: { code: this.code}});
        },
        start(){
            if(!this.ws){
                this.ws = new WebSocket("ws://localhost:8001")
                this.ws.onopen = ()=>{
                    console.log('WEBSOCKET OPENED');
                }
                this.ws.onmessage = (message)=>{
                    //When Message Recieved, add to list if not there
                    var data =  JSON.parse(message.data);
                    console.log(data);
                    if(!data.uid) console.error("Unexpected Payload");
                    else {
                        if(this.items.indexOf(data.uid) === -1) this.items.push(data.uid);
                    }
                }
                this.ws.onclose = ()=>{
                    this.ws = null;
                }
                return;
            } else if(this.ws.readyState != 1) return
            this.ws.send("foo")
        },
        stop(){
            this.ws.close();
        },
        restart(){
            this.items = []
        },
        add(){
            this.$router.push({name:'details', params: { code: this.items[0]}});
        }
    }
});
