# vael
Vael is a private space for noticing your life as it unfolds.  It does not measure, diagnose, or improve you. It does not tell you what to do next.  Vael exists so that patterns can emerge naturally — through time, through writing, through attention.  Nothing is optimized. Nothing is scored. Nothing is shared.  
# Personal Reflection System — Version 0

This is a private, single-user web system for personal reflection over time.

It does not:
- analyze content
- provide advice
- track mood
- score behavior
- encourage usage

Data is stored locally in an encrypted SQLite database.

## Requirements
- Node.js (LTS)
- HTTPS at deployment
- Environment variables:
  - DB_KEY
  - SESSION_SECRET

## Start
npm install
node server.js

## Data Ownership
You can export all data or permanently delete it at any time.

Deletion is irreversible.
