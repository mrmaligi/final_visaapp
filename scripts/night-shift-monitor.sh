#!/bin/bash

# Night Shift Progress Monitor
# Logs progress every 30 minutes

LOG_FILE="/home/manik/.openclaw/workspace/final_visaapp/logs/night-shift-$(date +%Y%m%d).log"
mkdir -p $(dirname $LOG_FILE)

echo "========================================" >> $LOG_FILE
echo "Night Shift Check - $(date)" >> $LOG_FILE
echo "========================================" >> $LOG_FILE
echo "" >> $LOG_FILE

echo "1. Git Status:" >> $LOG_FILE
cd /home/manik/.openclaw/workspace/final_visaapp
git log --oneline -5 >> $LOG_FILE 2>&1
echo "" >> $LOG_FILE

echo "2. Recent Commits:" >> $LOG_FILE
git diff --stat HEAD~5 HEAD >> $LOG_FILE 2>&1
echo "" >> $LOG_FILE

echo "3. Application Health:" >> $LOG_FILE
curl -s -o /dev/null -w "Homepage: %{http_code}\n" https://final-visaapp.vercel.app/ >> $LOG_FILE
curl -s -o /dev/null -w "Visas: %{http_code}\n" https://final-visaapp.vercel.app/visas >> $LOG_FILE
curl -s -o /dev/null -w "Auth: %{http_code}\n" https://final-visaapp.vercel.app/auth/signin >> $LOG_FILE
echo "" >> $LOG_FILE

echo "4. Files Modified (Last Hour):" >> $LOG_FILE
find src -name "*.tsx" -o -name "*.ts" | xargs ls -lt | head -10 >> $LOG_FILE 2>&1
echo "" >> $LOG_FILE

echo "5. Pending Tasks (from TODO files):" >> $LOG_FILE
grep -r "TODO\|FIXME\|XXX" src/ 2>/dev/null | wc -l | xargs echo "Open items:" >> $LOG_FILE
echo "" >> $LOG_FILE

echo "========================================" >> $LOG_FILE
echo "" >> $LOG_FILE

# Send summary to Telegram if configured
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  MESSAGE="🌙 Night Shift Update $(date '+%H:%M')\n\nCommits tonight: $(git rev-list --count --since="6 hours ago" HEAD)\nApp status: $(curl -s -o /dev/null -w "%{http_code}" https://final-visaapp.vercel.app/)\n\nWorking through the night to make VisaHelper production-ready!"
  
  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d "chat_id=$TELEGRAM_CHAT_ID" \
    -d "text=$MESSAGE" \
    -d "parse_mode=HTML" > /dev/null 2>&1
fi

echo "✅ Progress logged at $(date)"
