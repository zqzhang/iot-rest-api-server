# iot-rest-api-server
## Description
This project provides node.js based REST API server accoring to the  OIC (Open Interconnect) core specification. 

The project is experimental at the moment and APIs provided are work in progress and subject to changes.

## Usage

Start the API server (default port is 8000)

```node index.js```

## API End Points

/api/system

/api/apps

/api/install

/api/oic

## API documentation

The REST APIs are documented in the /doc folder using the [RAML](http://raml.org/) modeling language. You also need the ```raml2html```node module to produce the documentation:

```npm install -g raml2html```

The API documentation can be generated 

```raml2html doc/name-of-the-raml-file > api.html```

For example

 ```raml2html doc/oic.wk.res.raml > oic-res.html```

The ```.html``` file can be then opened by a browser. The ```.html```file contains the full documentation of the REST API including all the REST methods (GET, POST, DELETE, etc) supported, query parameters (like ?id=foo) and the JSON formats in each API.

## Test UI
The root (```/```) contains a simple UI which allows the user to use the REST APIs directly from the device. 

## Examples

The following examples assumes your IoT OS enabled device runs on IP address: 192.168.0.1

Open the test UI from your browser:

http://192.168.0.1:8000/

Get the system status:

http://192.168.0.1:8000/api/system

Discover all the OIC enabled devices on the local network:

http://192.168.0.1:8000/api/oic/res

See the more detailed API documentation in the chapter above.

## Tips

If you are running Chrome and want to see the JSON objects in nicely formated way, install the JSONView extension.

Another great tool for REST API development and testing is Postman, another Chrome extension.
