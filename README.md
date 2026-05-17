# DayFlow — Daily Routine Tracker

A mobile habit tracking app built with React Native, Expo, and Supabase.
DayFlow helps you build consistency by tracking your daily routines and
showing your real progress — day by day.

## Features

- ✅ Create, complete, edit, and delete daily routines
- 📅 Per-day completion tracking — past dates show real historical data
- 🔄 Auto daily reset — every morning starts with a clean slate
- 📊 Stats screen with visual progress bars
- 🌙 Dark and light mode
- ☁️ Cloud-synced via Supabase — your data is always saved
- 👤 Profile screen with display name, bio, and daily summary

## Tech Stack

- React Native + Expo
- Jotai (state management)
- Supabase (database)
- React Native SVG
- Expo AV (sound effects)

## Database Schema

### routines
| column | type |
|---|---|
| id | uuid |
| title | text |
| done | bool |
| created_at | timestamptz |

### completions
| column | type |
|---|---|
| id | uuid |
| routine_id | uuid (FK → routines) |
| completed_date | text (YYYY-MM-DD) |
| created_at | timestamptz |

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Add your Supabase credentials to `.env`:
4. Run `npx expo start`