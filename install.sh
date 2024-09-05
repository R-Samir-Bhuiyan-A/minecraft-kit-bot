#!/bin/bash

# Function to install required packages
install_packages() {
    echo "Installing required packages..."
    sudo apt update
    sudo apt install -y zip unzip curl nginx certbot python3-certbot-nginx
}

# Function to install a specific Node.js version from pre-built binaries
install_node() {
    local version=$1
    local url
    local tarball

    case "$version" in
        20)
            url="https://nodejs.org/dist/v20.17.0/node-v20.17.0-linux-x64.tar.xz"
            tarball="node-v20.17.0-linux-x64.tar.xz"
            ;;
        21)
            url="https://nodejs.org/dist/v21.7.3/node-v21.7.3-linux-x64.tar.xz"
            tarball="node-v21.7.3-linux-x64.tar.xz"
            ;;
        22)
            url="https://nodejs.org/dist/v22.8.0/node-v22.8.0-linux-x64.tar.xz"
            tarball="node-v22.8.0-linux-x64.tar.xz"
            ;;
        *)
            echo "Invalid Node.js version."
            exit 1
            ;;
    esac

    echo "Downloading Node.js version $version..."
    curl -L -o "/tmp/$tarball" "$url"

    echo "Extracting Node.js..."
    sudo tar -C /usr/local --strip-components=1 -xJf "/tmp/$tarball"

    # Verify the installation
    echo "Verifying Node.js version:"
     -v
    echo "Verifying npm version:"
    /usr/local/bin/npm -v
}

# Ensure the script is run as root
if [ "$(id -u)" -ne "0" ]; then
    echo "This script must be run as root. Exiting."
    exit 1
fi

# Install required packages
install_packages

# Prompt user to skip Node.js installation
echo "Do you want to skip Node.js installation? (yes/no):"
read -r skip_node_install

if [ "$skip_node_install" != "yes" ]; then
    # Prompt user for Node.js version
    echo "Choose the Node.js version to install (20, 21, or 22):"
    read -r node_version

    # Install the chosen Node.js version
    install_node "$node_version"
fi

# Create the directory /etc/mdb if it does not exist
echo "Creating /etc/mdb directory..."
sudo mkdir -p /etc/mdb/

# Download and unzip the MDB.zip file
echo "Downloading MDB.zip..."
curl -L -o /tmp/MDB.zip https://github.com/R-Samir-Bhuiyan-A/minecraft-kit-bot/releases/download/mdb2.0/MDB.zip

echo "Unzipping MDB.zip to /etc/mdb..."
sudo unzip /tmp/MDB.zip -d /etc/mdb/ || { echo "Unzip failed. Ensure unzip is installed."; exit 1; }

# Prompt user for .env file values
echo "Enter IP (default: 6b6t.org):"
read -r ip
ip=${ip:-6b6t.org}

echo "Enter PORT (default: 25565):"
read -r port
port=${port:-25565}

echo "Enter BOTNAME (default: changeme_mdb):"
read -r botname
botname=${botname:-changeme_mdb}

echo "Enter PASSWORD (default: changeme_mdb):"
read -r password
password=${password:-changeme_mdb}

echo "Enter VERSION (default: 1.17):"
read -r version
version=${version:-1.17}

echo "Enter SERVER_PORT (default: 8081):"
read -r server_port
server_port=${server_port:-8081}

echo "Enter WS_PORT (default: 3000):"
read -r ws_port
ws_port=${ws_port:-3000}

echo "Enter UI USERNAME (default: admin):"
read -r ui_username
ui_username=${ui_username:-admin}

echo "Enter UI PASSWORD (default: password):"
read -r botname
ui_password=${ui_password:-password}

# Update .env file
echo "Updating .env file..."
env_file="/etc/mdb/.env"
sudo tee "$env_file" > /dev/null <<EOL
IP=$ip
PORT=$port
BOTNAME=$botname
PASSWORD=$password
VERSION=$version
SERVER_PORT=$server_port
WS_PORT=$ws_port
UI_USER=$ui_username
UI_PASSWORD=$ui_password
EOL

# Make everything executable and set permissions
echo "Setting permissions..."
sudo chmod -R +x /etc/mdb/
sudo chown -R root:root /etc/mdb/

# Create the systemd service files
node_path="/usr/local/bin/node"
service_file_mdbr="/etc/systemd/system/mdbr.service"
service_file_mdb="/etc/systemd/system/mdb.service"

# mdbr.service file
sudo tee "$service_file_mdbr" > /dev/null <<EOL
[Unit]
Description=Mineflayer delivery bot api demon
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/etc/mdb/
ExecStart=${node_path} /etc/mdb/api.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# mdb.service file
sudo tee "$service_file_mdb" > /dev/null <<EOL
[Unit]
Description=Mineflayer delivery bot panel
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/etc/mdb/
ExecStart=${node_path} /etc/mdb/server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# Configure nginx
echo "Enter domain name (leave blank for no SSL):"
read -r domain

if [ -z "$domain" ]; then
    domain="localhost"
fi

nginx_conf="/etc/nginx/sites-available/mdb.conf"
if [ "$domain" != "localhost" ]; then
    echo "Configuring nginx with SSL for domain: $domain"
    sudo tee "$nginx_conf" > /dev/null <<EOL
# Redirect HTTPS to HTTP
server {
    listen 443 ssl;
    server_name $domain;

    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;

    # Add any additional SSL configurations here
    
    location / {
        return 301 http://\$host\$request_uri;
    }
}

# Serve HTTP requests
server {
    listen 80;
    server_name $domain;

    location / {
        proxy_pass http://localhost:${server_port};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

    # Install SSL certificates using Certbot
    echo "Installing SSL certificates..."
    sudo certbot --nginx -d "$domain"
else
    echo "Configuring nginx without SSL for localhost"
    sudo tee "$nginx_conf" > /dev/null <<EOL
server {
    listen 80;
    server_name $domain;

    location / {
        proxy_pass http://localhost:${server_port};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL
fi

# Enable the new nginx configuration and restart nginx
sudo ln -s /etc/nginx/sites-available/mdb.conf /etc/nginx/sites-enabled/
echo "Restarting nginx..."
sudo systemctl restart nginx

sudo cd /etc/mdb/
sudo npm install


# Reload systemd and start the new services
sudo systemctl daemon-reload
sudo systemctl start mdbr
sudo systemctl enable mdbr
sudo systemctl start mdb
sudo systemctl enable mdb

echo "Setup completed successfully."
