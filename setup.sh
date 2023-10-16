#!/bin/bash
Help()
{
   # Display Help
   echo "Setup script to install and run uwam-fracas in the background & on start-up."
   echo "If required flags aren't provided, script will prompt you to input required details for setup"
   echo
   echo "NOTE: This script was designed for production deployment, on a clean Ubuntu Virtual Machine"
   echo "      and may not work (or break) other setups."
   echo 
   echo "Syntax: setup [-h]"
   echo "options:"
   echo "-h    Print this Help."
}

# Update & install packages needed for setup
set -e
PARENT_DIRECTORY=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
echo "############################"
echo "Starting UWAM-FRACAS Install"
echo "############################"
echo
echo "NOTE: This script was designed to run once for production deployment, on a clean Ubuntu Virtual Machine"
echo
echo "Ensure your domain is already set to the public IP address of this machine"
read -p "Enter the domain name for the app: " DOMAIN
echo
echo An initil admin user "admin@admin.com" will be setup for access
read -s -p "Enter the password for this account: " ADMIN_PASSWORD
echo
echo "Thank you, proceeding with the install"
sleep 2

echo "Installing required progams for setup"
sleep 3
apt update
apt upgrade -y
apt install sed python3.10-venv ca-certificates curl gnupg nginx certbot -y

# install node_js
echo "###################"
echo "Setting up Frontend"
echo "###################"
sleep 3
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
apt update
apt install nodejs -y
corepack enable

# Install frontend dependencies
echo "Installing frontend dependencies"
sleep 2
cd $PARENT_DIRECTORY
cd ../frontend
yarn install
echo
echo "Building Next.js frontend. This could take a while.."
sleep 2
yarn build

# Setting up flask backend environment
echo "##################"
echo "Setting up Backend"
echo "##################"
cd $PARENT_DIRECTORY
sleep 2
if ! test -f ../env/.env; then
    touch ../env/.env
fi
cp ../env/.env ../backend

cd $PARENT_DIRECTORY
cd ../backend
python -m venv venv
source venv/bin/activate
echo "Installing flask dependencies"
pip install -r requirements.txt
export ADMIN_PASSWORD
flask app quickcreate
unset ADMIN_PASSWORD
deactivate

echo "########################################"
echo "Setting up Web server & SSL Certificates"
echo "########################################"
cd $PARENT_DIRECTORY
# Setup nginx
rm /etc/nginx/sites-enabled/default
cp ../setup/fracas-nginx.conf /etc/nginx/sites-enabled/
sed -e "s/<DOMAIN>/$DOMAIN" /etc/nginx/sites-enabled/fracas-nginx.conf
systemctl start nginx.service
systemctl enable nginx.service

echo "Setting up certbot for SSL/HTTPS access w/ autorenew certs"
certbot --nginx --noninteractive --agree-tos --register-unsafely-without-email -d $DOMAIN
(crontab -l 2>/dev/null; echo "0 0 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

echo "Creating systemd services for frontend and backend"
cp ../setup/frontend.service /etc/systemd/system
cp ../setup/backend.service /etc/systemd/system
sed -e "s/<FRACAS_DIRECTORY>/${PWD}" -e "s/<YOUR_USERNAME>/${USER}" -e "s/<YOUR_GROUP>/${USER}" /etc/systemd/system/frontend.service
sed -e "s/<FRACAS_DIRECTORY>/${PWD}" -e "s/<YOUR_USERNAME>/${USER}" -e "s/<YOUR_GROUP>/${USER}" /etc/systemd/system/backend.service

systemctl daemon-reload
systemctl start backend.service
systemctl enable backend.service

systemctl start frontend.service
systemctl enable frontend.service

echo "Creating firewall rules."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force-enable reset

echo "###################"
echo "$DOMAIN IS NOW LIVE"
echo "###################"
echo 
echo "Install completed. App will automatically start on reboot"
echo "Visit $DOMAIN to see if everything is working"
echo "Exiting setup.."
