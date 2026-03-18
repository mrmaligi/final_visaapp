# Cron Jobs Configuration for Visa Helper Platform

## Overview
Automated tasks for maintenance, reporting, and data cleanup.

## Schedule

### Daily at 2:00 AM
```bash
# cleanup-sessions
# Generate daily stats
# Backup check
```

### Weekly (Sundays at 3:00 AM)
```bash
# update-tracker-stats
# weekly-report
# cleanup-temp
```

### Monthly (1st at 4:00 AM)
```bash
# monthly-revenue
# update-ratings
# archive-consultations
```

## Implementation

### Option 1: OpenClaw Cron (Recommended)
Use OpenClaw's built-in cron system to spawn agents.

### Option 2: Vercel Cron
For Vercel deployments, use their cron feature.

### Option 3: GitHub Actions
Use scheduled workflows.

## Scripts Location
`/cron/` directory contains all cron scripts.