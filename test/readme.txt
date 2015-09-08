Env variables:

API_SERVER_HOST - Hostname/address where API server is running (default: localhost)
API_SERVER_HOST - Port where API server is running (default: 8000)

Examples:

# Resource discovery (/oic/res)
./oic-get "/res"

# Device discovery discovery (/oic/d)
./oic-get "/d"

# Platform discovery (/oic/p)
./oic-get "/p"

# Resource get (/a/light)
./oic-get "/a/light"

# Resource get with query filter (/a/light with power less than 50)
./oic-get "/a/light?power<50"

# Resource observe (/a/light)
./oic-get "/a/light;obs"

# Resource put (/a/light from a file: put-light-values.txt)
./oic-put "/a/light"


