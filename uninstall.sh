#!/bin/bash

# Function to remove all installed packages and files
remove_all() {
    echo "Removing all installed packages and files..."

    # Stop services
    sudo systemctl stop mdbr || true
    sudo systemctl stop mdb || true

    # Remove systemd services
    sudo rm -f /etc/systemd/system/mdbr.service
    sudo rm -f /etc/systemd/system/mdb.service

    # Remove Node.js
    sudo rm -rf /usr/local/bin/node
    sudo rm -rf /usr/local/bin/npm
    sudo rm -rf /usr/local/lib/node_modules

    # Remove nginx configuration
    sudo rm -f /etc/nginx/sites-available/mdb.conf
    sudo rm -f /etc/nginx/sites-enabled/mdb.conf

    # Remove MDB files
    sudo rm -rf /etc/mdb/

    # Reload systemd and nginx
    sudo systemctl daemon-reload
    sudo systemctl restart nginx || true

    echo "All components removed."
}

# Function to uninstall Node.js and the panel
uninstall_node_and_panel() {
    echo "Uninstalling Node.js and panel..."

    # Stop services
    sudo systemctl stop mdbr || true
    sudo systemctl stop mdb || true

    # Remove systemd services
    sudo rm -f /etc/systemd/system/mdbr.service
    sudo rm -f /etc/systemd/system/mdb.service

    # Remove Node.js
    sudo rm -rf /usr/local/bin/node
    sudo rm -rf /usr/local/bin/npm
    sudo rm -rf /usr/local/lib/node_modules

    # Remove MDB files
    sudo rm -rf /etc/mdb/

    # Remove nginx configuration (if not using for other purposes)
    sudo rm -f /etc/nginx/sites-available/mdb.conf
    sudo rm -f /etc/nginx/sites-enabled/mdb.conf

    # Reload systemd and nginx
    sudo systemctl daemon-reload
    sudo systemctl restart nginx || true

    echo "Node.js and panel removed."
}

# Function to remove only the panel
uninstall_panel() {
    echo "Removing panel..."

    # Stop services
    sudo systemctl stop mdbr || true
    sudo systemctl stop mdb || true

    # Remove systemd services
    sudo rm -f /etc/systemd/system/mdbr.service
    sudo rm -f /etc/systemd/system/mdb.service

    # Remove MDB files
    sudo rm -rf /etc/mdb/

    # Remove nginx configuration (if not using for other purposes)
    sudo rm -f /etc/nginx/sites-available/mdb.conf
    sudo rm -f /etc/nginx/sites-enabled/mdb.conf

    # Reload systemd and nginx
    sudo systemctl daemon-reload
    sudo systemctl restart nginx || true

    echo "Panel removed."
}

# Main script
echo "Choose an option for uninstallation:"
echo "1. Remove all components (including Node.js, panel, and nginx configuration)"
echo "2. Uninstall Node.js and the panel (keeping nginx configuration)"
echo "3. Remove only the panel (keeping Node.js and nginx configuration)"
read -r option

case $option in
    1)
        remove_all
        ;;
    2)
        uninstall_node_and_panel
        ;;
    3)
        uninstall_panel
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac
