# Mensa Münster 🍽️

An ultra-clean, ad-free menu app for the seven student canteens in Münster.
Built with **Expo (React Native)** and **TypeScript**, with a lightweight typed design-token theming system (no styling dependencies).
Data comes directly from the public **[OpenMensa API v2](https://docs.openmensa.org/api/v2/)** — no backend, no tracking, no ads.

## Features

- **All 7 Münster canteens** — Bispinghof, Aasee, Da Vinci, Am Ring, Denkpause, Oeconomicum, Kath. Hochschule.
- **Clean menu cards grouped by category** (Hauptkomponenten, Beilagen, …) in a Material-inspired layout.
- **Serving hours in the header** — the day's "Ausgabezeiten" (incl. a "Ferien" hint when the lecture-free schedule applies).
- **Day picker** showing the canteen's upcoming serving days, with today's chip marked **Heute**.
- **Smart diet badges** — `vegan` / `vegetarisch` notes become green tags and allergens are summarised in a compact line. Empty and noisy notes are filtered out.
- **Settings sheet** with:
  - **Appearance** — System / Light / Dark theme.
  - **Price category** — Studierende or Gäste, formatted in euros (`3,10 €`); the choice is persisted.

## Getting started

```bash
pnpm install
pnpm start        # then press i / a, or scan the QR code with Expo Go
```

Other scripts: `pnpm ios`, `pnpm android`, `pnpm web`.

## Project structure

```
src/
  constants/canteens.ts      # the 7 Münster canteens (pinned IDs + serving hours)
  services/openmensa.ts      # typed OpenMensa API v2 client (days + meals)
  hooks/useCanteenMenu.ts    # loads days + meals, handles loading/error/retry
  settings/priceCategory.tsx # price-tier preference (Studierende/Gäste), persisted
  theme/                     # typed design tokens + ThemeProvider (light/dark/system)
  utils/
    notes.ts                 # parses `notes[]` → diet badges / eco / allergens
    menu.ts                  # groups meals by category
    format.ts                # German date & price formatting
  components/                # FoodTagBadge, MealCard, CategorySection, selectors, StateView
  screens/
    MenuScreen.tsx           # main screen (header, selectors, menu list)
    SettingsScreen.tsx       # appearance + price-category settings sheet
```

## How the data is fetched

The app only ever calls two OpenMensa endpoints:

- `GET /canteens/{id}/days` — which days have a published menu.
- `GET /canteens/{id}/days/{date}/meals` — the meals for the selected day.

The canteen IDs are pinned in `src/constants/canteens.ts`, so the app never
downloads the full global canteen list. Serving hours aren't exposed by
OpenMensa either, so they're maintained by hand in the same file from the
Studierendenwerk Münster "Ausgabezeiten".
