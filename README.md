# Mensa Münster 🍽️

An ultra-clean, ad-free menu app for the seven student canteens in Münster.
Built with **Expo (React Native)**, **TypeScript**, and **NativeWind** (Tailwind).
Data comes directly from the public **[OpenMensa API v2](https://docs.openmensa.org/api/v2/)** — no backend, no tracking, no ads.

## Features

- **All 7 Münster canteens** — Am Ring, Aasee, Bispinghof, Da Vinci, Oeconomicum, Denkpause, Kath. Hochschule.
- **Clean menu cards grouped by category** (Hauptkomponenten, Beilagen, …) in a Material-inspired layout.
- **Student prices only**, formatted in euros (`3,10 €`).
- **Smart diet badges** — `vegan` / `vegetarisch` notes become green tags and allergens are summarised in a compact line. Empty and noisy notes are filtered out.
- **Day picker** showing the canteen's upcoming serving days.

## Getting started

```bash
pnpm install
pnpm start        # then press i / a, or scan the QR code with Expo Go
```

Other scripts: `pnpm ios`, `pnpm android`, `pnpm web`.

## Project structure

```
src/
  constants/canteens.ts     # the 7 Münster canteens (pinned OpenMensa IDs)
  services/openmensa.ts      # typed OpenMensa API v2 client (days + meals)
  hooks/useCanteenMenu.ts    # loads days + meals, handles loading/error/retry
  utils/
    notes.ts                 # parses `notes[]` → diet badges / eco / allergens
    menu.ts                  # groups meals by category
    format.ts                # German date & price formatting
  components/                # Badge, MealCard, CategorySection, selectors, StateView
  screens/MenuScreen.tsx     # main screen
```

## How the data is fetched

The app only ever calls two OpenMensa endpoints:

- `GET /canteens/{id}/days` — which days have a published menu.
- `GET /canteens/{id}/days/{date}/meals` — the meals for the selected day.

The canteen IDs are pinned in `src/constants/canteens.ts`, so the app never
downloads the full global canteen list.
