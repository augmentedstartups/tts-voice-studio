# 🚀 Deployment Guide

Complete guide for deploying TTS Voice Studio to various platforms.

## Table of Contents
- [Local Development](#local-development)
- [Production Server](#production-server)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Security Considerations](#security-considerations)

---

## Local Development

### Quick Start
```bash
# Setup (first time only)
./setup.sh

# Start backend
cd backend && ./start_server.sh

# Start frontend (new terminal)
cd frontend && npm run dev
```

**URLs:**
- Frontend: http://localhost:8080
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Production Server

### Requirements
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- 16GB RAM minimum (32GB recommended)
- 20GB disk space
- Python 3.10+
- Node.js 18+
- Nginx (for reverse proxy)

### Setup Steps

#### 1. Clone Repository
```bash
cd /opt
git clone <your-repo-url> tts-voice-studio
cd tts-voice-studio
```

#### 2. Run Setup
```bash
chmod +x setup.sh
./setup.sh
```

#### 3. Configure Backend
```bash
# Create production config
cp .env.example .env

# Edit settings
nano .env
```

**Production .env:**
```bash
BACKEND_PORT=8000
BACKEND_HOST=127.0.0.1  # Only local access
LOG_LEVEL=WARNING
ALLOWED_ORIGINS=https://yourdomain.com
```

#### 4. Create Systemd Service

**Backend Service** (`/etc/systemd/system/tts-backend.service`):
```ini
[Unit]
Description=TTS Voice Studio Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/tts-voice-studio/backend
Environment="PATH=/opt/tts-voice-studio/.venv/bin"
ExecStart=/opt/tts-voice-studio/.venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and Start:**
```bash
systemctl daemon-reload
systemctl enable tts-backend
systemctl start tts-backend
systemctl status tts-backend
```

#### 5. Build Frontend
```bash
cd frontend
npm run build
```

This creates `frontend/dist/` with static files.

#### 6. Configure Nginx

**`/etc/nginx/sites-available/tts-voice-studio`:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /opt/tts-voice-studio/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

**Enable Site:**
```bash
ln -s /etc/nginx/sites-available/tts-voice-studio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 7. Setup SSL (Let's Encrypt)
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## Docker Deployment

### Dockerfile (Backend)

**`backend/Dockerfile`:**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
```

### Dockerfile (Frontend)

**`frontend/Dockerfile`:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

**`docker-compose.yml`:**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models:ro
      - backend_cache:/root/.cache
    environment:
      - BACKEND_PORT=8000
      - BACKEND_HOST=0.0.0.0
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend_cache:
```

**Deploy:**
```bash
docker-compose up -d
docker-compose logs -f
```

---

## Cloud Platforms

### AWS

#### Architecture
- **Backend**: EC2 (t3.xlarge or larger)
- **Frontend**: S3 + CloudFront
- **Models**: EFS for shared cache

#### Backend on EC2
```bash
# Launch instance
# AMI: Ubuntu 22.04
# Type: t3.xlarge (16GB RAM)
# Security Group: Allow 8000 (internal)

# SSH and setup
ssh -i key.pem ubuntu@<instance-ip>
git clone <repo>
cd tts-voice-studio
./setup.sh
sudo cp systemd/tts-backend.service /etc/systemd/system/
sudo systemctl enable tts-backend
sudo systemctl start tts-backend
```

#### Frontend on S3 + CloudFront
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket/
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

### Google Cloud Platform

#### Backend on Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT/tts-backend backend/
gcloud run deploy tts-backend \
  --image gcr.io/PROJECT/tts-backend \
  --platform managed \
  --region us-central1 \
  --memory 8Gi \
  --cpu 4
```

#### Frontend on Cloud Storage + CDN
```bash
cd frontend
npm run build
gsutil -m rsync -r dist/ gs://your-bucket/
gcloud compute url-maps invalidate-cdn-cache XXX --path "/*"
```

### Azure

#### Backend on App Service
```bash
az webapp up \
  --name tts-backend \
  --resource-group tts-rg \
  --plan premium \
  --runtime PYTHON:3.10
```

#### Frontend on Static Web Apps
```bash
cd frontend
npm run build
az staticwebapp create \
  --name tts-frontend \
  --resource-group tts-rg \
  --source dist/
```

---

## Security Considerations

### Backend Security

#### 1. Authentication
Add API key authentication:

```python
# backend/middleware/auth.py
from fastapi import Header, HTTPException

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != os.getenv("API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key
```

#### 2. Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/generate")
@limiter.limit("10/minute")
async def generate_audio(...):
    ...
```

#### 3. CORS
Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domain
    allow_credentials=False,  # Disable if no auth
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

### Frontend Security

#### 1. Environment Variables
Never commit API keys. Use `.env`:
```bash
VITE_API_KEY=your_secret_key
```

#### 2. Content Security Policy
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'">
```

### General Security

1. **HTTPS Only** - Use SSL certificates
2. **Firewall** - Restrict ports (only 80/443)
3. **Updates** - Keep dependencies updated
4. **Monitoring** - Log access and errors
5. **Backups** - Regular backups of generated audio

---

## Monitoring

### Backend Logs
```bash
# Systemd
journalctl -u tts-backend -f

# Docker
docker-compose logs -f backend
```

### Health Checks
```bash
# Backend
curl http://localhost:8000/health

# Full system
curl http://localhost:8000/api/models
```

### Performance Monitoring
```python
# Add to backend/main.py
import time
from fastapi import Request

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {process_time:.2f}s")
    return response
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
journalctl -u tts-backend -n 50

# Check port
lsof -i :8000

# Test manually
cd backend
source ../.venv/bin/activate
python main.py
```

### High Memory Usage
- Reduce concurrent requests
- Add request queuing
- Use GPU for inference
- Implement model caching

### Slow Generation
- Enable GPU acceleration
- Use smaller batch sizes
- Implement Redis caching
- Add CDN for static assets

---

## Performance Optimization

### Backend
1. **GPU Acceleration**: Use CUDA for 10x speedup
2. **Model Caching**: Keep models in memory
3. **Request Queue**: Process one at a time
4. **Async Operations**: Use asyncio

### Frontend
1. **Code Splitting**: Lazy load components
2. **Asset Optimization**: Compress images
3. **CDN**: Serve static assets from CDN
4. **Caching**: Implement service worker

---

## Scaling

### Horizontal Scaling
```yaml
# docker-compose.scale.yml
services:
  backend:
    deploy:
      replicas: 3
  
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
```

### Load Balancing
```nginx
upstream backend {
    least_conn;
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

---

## Backup & Recovery

### Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf backup-$DATE.tar.gz \
  models/neutts-air/samples/ \
  backend/config/ \
  backend/temp/audio/
aws s3 cp backup-$DATE.tar.gz s3://backups/
```

### Recovery
```bash
aws s3 cp s3://backups/backup-YYYYMMDD.tar.gz .
tar -xzf backup-YYYYMMDD.tar.gz
```

---

**Need help?** Open an issue or check the [README.md](README.md)

