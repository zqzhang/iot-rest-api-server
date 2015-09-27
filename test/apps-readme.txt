Env variables:

API_SERVER_HOST - Hostname/address where API server is running (default: localhost)
API_SERVER_HOST - Port where API server is running (default: 8000)
API_REQUEST_METHOD - HTTP method (GET/POST/DELETE/PUT) in the request header (default: GET)

Examples:  /apps

# List all running applications (GET /apps)
./app-launcher GET /

# List single running application (GET /apps/{appId})
./app-launcher GET '/terminal:x'

# Start all installed applications (POST /apps)
./app-launcher POST /

# Start single application (POST /apps/{appId})
./app-launcher POST '/terminal:x'

# Stop all running applications (DELETE /apps)
./app-launcher DELETE /

# Stop single running application (DELETE /apps/{appId})
./app-launcher DELETE '/terminal:x'

# Restart all running applications (POST /apps)
./app-launcher PUT /

# Restart single running application (POST /apps/{appId})
./app-launcher PUT '/terminal:x'


Examples:  /install


# List all installed applications (GET /install)
./app-installer GET /

# List single installed application (GET /install/{appId})
./app-installer GET '/terminal:x'

# Update all installed applications (POST /install)
./app-installer POST /

# Update single application (POST /install/{appId})
./app-installer POST '/terminal:x'

# Uninstall all installed applications (DELETE /install)
./app-installer DELETE /

# Uninstall single installed application (DELETE /install/{appId})
./app-installer DELETE '/terminal:x'

# Reinstall all installed applications (POST /install)
./app-installer PUT /

# Reinstall single installed application (POST /install/{appId})
./app-installer PUT '/terminal:x'
