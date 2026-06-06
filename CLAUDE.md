@AGENTS.md

# TenToday Project Instructions

TenToday is a React Native productivity app built around one simple idea:

Big goals become easier when you only have to show up for ten minutes today.

People often want to learn a skill, build a habit, or improve their life, but they get overwhelmed before they even start. Learning guitar, studying French, coding, reading, stretching, applying for jobs, or working out all sound like big commitments.

TenToday removes that pressure.

Instead of asking users to dedicate hours, the app asks one simple question:

Can you give this ten minutes today?

Because it only takes ten minutes.

Users choose a small number of goals they want to improve (up to 5). Each goal has its own daily 10-minute session, streak, and progress history.

The purpose is not to become productive for a week.

The purpose is to build consistency over months.

## Core MVP

1. Users create between 1 and 5 goals.
2. Each goal has its own streak.
3. Each goal has its own daily 10-minute session.
4. Users start a timer for any goal.
5. Users complete the session when the timer finishes.
6. Progress and streaks are tracked separately for each goal.
7. Users receive reminders to complete unfinished goals.

## Product Philosophy

- Keep the experience simple and motivating.
- Avoid feature bloat.
- Reduce decision fatigue.
- Focus on consistency over perfection.
- Encourage action instead of planning.
- Small wins compound into meaningful progress.
- Every screen should make it easier to start.
- Users should spend more time improving themselves than managing the app.

## User Experience Principles

- Users should be able to start a session within seconds.
- The primary action should always be obvious.
- Progress should feel rewarding.
- Streaks should encourage consistency without creating guilt.
- The app should feel supportive, not stressful.
- The experience should be mobile-first.
- Minimize the number of taps required to begin a session.

## Engineering Rules

- Make small, focused changes.
- Do not rewrite unrelated files.
- Ask before adding major dependencies.
- Prefer simple, readable code.
- Explain what changed after each task.
- Run the app and lint after meaningful changes when possible.
- Never commit broken code.
- Keep the MVP lean and focused.
- Challenge features that do not support the core mission.

## MVP Screens

1. Onboarding / Goal Creation
2. Home Dashboard
3. Goal Details
4. Active 10-Minute Session
5. Session Complete Screen
6. Progress & Streak View
7. Settings / Notifications

## Success Metric

The success of TenToday is not measured by the number of features.

The success of TenToday is measured by whether users consistently spend ten minutes per day improving the things they care about.
