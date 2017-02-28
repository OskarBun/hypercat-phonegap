exports.cat_url = "http://localhost:8001/cat";
// exports.cat_url = "http://192.168.1.99:8001/cat";

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
    }],
    'SPG-2_G': [{
        "val": "Water Sensor",
        "rel": "urn:X-tsbiot:rels:hasDescription:en"
    },
    {
        "val": "SPG2_F",
        "rel": "device_type"
    },
    {
        "val": "",
        "rel": "house_location"
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
    }]
}

exports.meta_options = {
    "user_defined_location": [
        "basement",
        "bathroom",
        "bedroom",
        "dining area",
        "entering the home",
        "leaving the home",
        "garage",
        "hallway",
        "kitchen",
        "living room",
        "loft/attic",
        "office",
        "out of view",
        "outside",
        "study room",
        "toilet",
        "unknown"
    ],
    "house_location": [
        "basement",
        "bathroom",
        "bedroom",
        "dining area",
        "entering the home",
        "leaving the home",
        "garage",
        "hallway",
        "kitchen",
        "living room",
        "loft/attic",
        "office",
        "out of view",
        "outside",
        "study room",
        "toilet",
        "unknown"
    ],
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
    "device_description": []
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
    if(mac_address.length === 5) return meta_map['current_cost'];

    //Split Mac Address
    var a = mac_address.match(/.{2}/g);
    var x = a.slice(Math.max(a.length - 3, 1));
    if(x.length != 3) return null;

    //Map to device type
    var device = device_map(parseInt('0x'+x[2]));
    if(!device) return null;

    return meta_map[device];
}