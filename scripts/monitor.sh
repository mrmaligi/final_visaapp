#!/bin/bash

# VisaHelper Production Monitoring Cron Job
# Runs every 30 minutes to check application health

LOG_FILE="/home/manik/.openclaw/workspace/final_visaapp/logs/monitor-$(date +%Y-%m-%d).log"
APP_URL="https://final-visaapp.vercel.app"
SUPABASE_URL="https://ysfwurlzkihgezfegfog.supabase.co"

echo "[$(date)] Starting health check..." >> "$LOG_FILE"

# Check if app is responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")

if [ "$HTTP_STATUS" != "200" ]; then
  echo "[$(date)] ❌ ERROR: App returned HTTP $HTTP_STATUS" >> "$LOG_FILE"
  
  # Send alert via Telegram (if configured)
  if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
      -d "chat_id=$TELEGRAM_CHAT_ID" \
      -d "text=🚨 VisaHelper ALERT: App returned HTTP $HTTP_STATUS at $(date)"
  fi
else
  echo "[$(date)] ✅ App is healthy (HTTP 200)" >> "$LOG_FILE"
fi

# Check Supabase connectivity
SUPABASE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/visas?select=id&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDI5NzMsImV4cCI6MjA4OTM3ODk3M30.-36dciAqoJrjThTAR-O5PidU2BMS1R5r39pid7adbxA")

if [ "$SUPABASE_STATUS" != "200" ]; then
  echo "[$(date)] ❌ ERROR: Supabase returned HTTP $SUPABASE_STATUS" >> "$LOG_FILE"
else
  echo "[$(date)] ✅ Supabase is healthy" >> "$LOG_FILE"
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
  echo "[$(date)] ⚠️  WARNING: Disk usage at ${DISK_USAGE}%" >> "$LOG_FILE"
fi

echo "[$(date)] Health check complete." >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
