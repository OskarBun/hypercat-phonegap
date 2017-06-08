//TODO MAKE THIS IN BUILD
// exports.url = "http://192.168.10.101:8001";
// exports.ws_url = "ws://192.168.10.101:8001";
exports.url = "http://192.168.1.99:8001";
exports.ws_url = "ws://192.168.1.99:8001";

var meta_map = {
    'SPES-2': [{
        "val": "Enviromental Sensor",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPES2",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    'SPG-2_G': [{
        "val": "Wet Water Sensor",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPAQ2",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    'SPAQ2_P': [{
        "val": "Dry Water Sensor",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPAQ2_P",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    'SPG-2_F': [{
        "val": "Sphere Gateway",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPG2_F",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    'SPG-2_F_ROOT': [{
        "val": "Root Sphere Gateway",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPG2_BR",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    'SPW-2': [{
        "val": "Wearable Sensor",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPW2",
        "rel": "device_type"
    },
    {
        "val": "", //A-J
        "rel": "person"
    },
    {
        "val": "",
        "rel": "device_description"
    }],
    'current_cost': [{ //Still needs QR Code/Identifier
        "val": "Power Usage Monitor",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "Current Cost Appliance",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "appliance"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    "NUC_VIDEO": [{
        "val": "Motion Detector",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "Intel NUC VIDEO",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    "NUC_HOME": [{
        "val": "Home Gateway",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "Intel NUC HOME",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
    },
    {
        "val": "1",
        "rel": "location_index"
    }],
    "TABLET": [{
        "val": "Tablet",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "TABLET",
        "rel": "device_type"
    },
    {
        "val": "huawei",
        "rel": "manufacturer"
    }],
    "ROUTER": [{
        "val": "Router",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "ROUTER",
        "rel": "device_type"
    },
    {
        "val": "dlink",
        "rel": "manufacturer"
    }]
}

exports.meta_options = {
    "house_location": [
        "bedroom",
        "study",
        "living room",
        "dining room",
        "hall",
        "kitchen",
        "toilet",
        "unknown",
        "staircase",
        "porch"
    ],
    "location_index": ['1','2','3','4','5'],
    "person": ['A','B','C','D','E','F','G','H','I','J'],
    "appliance": [
        "TV",
		"Kettle",
		"Toaster",
		"Microwave",
		"Washing Machine",
		"Fridge",
		"Sandwich maker",
        "Mains"
    ],
    "device_description": [],
    "manufacturer": {
        'ROUTER': [
            'dlink',
            'huawei'
        ]
    }
}

//device_id === 1 HomeGateway
var device_map = function(device_id){
    if(device_id < 1)     return null;
    if(device_id < 2)     return "SPG-2_F_ROOT";
    if(device_id < 64)    return "SPG-2_F";
    if(device_id < 128)   return "SPG-2_G"; //Change to check for 2 at the end
    if(device_id < 192)   return "SPES-2";
    if(device_id < 256)   return "SPW-2";
    return null
}

exports.mac_address_map = function(mac_address){
    if(mac_address === 'HOME') return meta_map['NUC_HOME'];
    if(mac_address === 'VIDEO') return meta_map['NUC_VIDEO'];
    if(mac_address === 'TABLET') return meta_map['TABLET'];
    if(mac_address === 'ROUTER') return meta_map['ROUTER'];
    if(mac_address.length === 5) return meta_map['current_cost'];

    //Split Mac Address
    var code = mac_address.substr(mac_address.length - 6)
    var x = code.match(/(.{2})/g);
    if(x.length != 3) return null;

    //Map to device type
    var device = device_map(parseInt('0x'+x[2]));
    if(!device) return null;
    if(device === "SPG-2_F" && x[2][1] === "2") device = "SPG-2_G"

    return meta_map[device];
}
