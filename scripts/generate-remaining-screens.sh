#!/bin/bash
# Run this script when Stitch API quota resets

export STITCH_API_KEY="AQ.Ab8RN6LAvXucyYnlCXN8EtPNTtKoHOqhCNa92BdSH2YVDuXhdw"
PROJECT_ID="15348568488048061051"

echo "=== GENERATING REMAINING SCREENS ==="

screens=(
  "Processing Time Tracker:Visa processing time tracker page with community data table showing submitted processing times. Search bar filter dropdowns statistics cards showing total entries 5432 and average processing time 8.5 months. Data table with columns for visa name subclass lodgement date decision date processing time outcome. Professional blue white design."
  "My Visas List:User's visa applications page with filter tabs All In Progress Completed, visa cards showing visa name subclass progress percentage bar documents count status badges action buttons. Dashboard layout blue accents."
  "Documents Management:Document management page with upload button filter bar by visa and category, document list with file icons category badges shared status, view download delete actions. File management interface blue white design."
  "Checkout Success:Checkout success page centered card with animated checkmark, order details visa name amount paid, next steps list, return to dashboard link. Success state design blue white."
)

for screen in "${screens[@]}"; do
  name=$(echo "$screen" | cut -d: -f1)
  prompt=$(echo "$screen" | cut -d: -f2-)
  echo "Generating: $name"
  python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
    "$PROJECT_ID" "$prompt" --device desktop
  sleep 5
done

echo "=== COMPLETE ==="
