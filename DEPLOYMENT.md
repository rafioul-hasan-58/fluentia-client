# 🐳 Fluentia VPS Deployment Guide with Docker

This guide explains how to deploy **Fluentia Client** on your VPS using Docker and Docker Compose.

---

## 1. Prerequisites on Your VPS

Connect to your VPS via SSH and install Docker and Docker Compose (Ubuntu/Debian example):

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Enable and start Docker service
sudo systemctl enable --now docker

# Add your user to the docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
```

---

## 2. Clone the Repository & Configure Environment

```bash
# Clone the repository
git clone https://github.com/rafioul-hasan-58/fluentia-client.git
cd fluentia-client

# Create or verify .env file
cp .env.example .env
nano .env
```

Ensure `.env` contains your backend API URL (or production domain):

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 3. Run with Docker Compose

Build and launch the container in detached mode:

```bash
docker compose up -d --build
```

### Useful Management Commands:

```bash
# View container status
docker compose ps

# View live logs
docker compose logs -f

# Restart application
docker compose restart

# Stop application
docker compose down
```

---

## 4. Setting Up Nginx Reverse Proxy & SSL (Recommended)

To connect your domain (e.g., `app.yourdomain.com`) with free automatic HTTPS via Let's Encrypt:

### Install Nginx & Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Configure Nginx site:
Create `/etc/nginx/sites-available/fluentia`:
```nginx
server {
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable Site and Obtain SSL:
```bash
sudo ln -s /etc/nginx/sites-available/fluentia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Issue free SSL certificate
sudo certbot --nginx -d app.yourdomain.com
```
