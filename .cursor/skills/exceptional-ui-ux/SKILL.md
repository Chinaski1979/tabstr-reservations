---
name: exceptional-ui-ux
description: Designs and implements exceptional, restrained UI/UX for this React app. Use when building or changing pages, layout, styling, components, motion, or visual hierarchy.
---

# Exceptional UI/UX

This is a bar and hospitality product on a dark canvas. Exceptional means clear,
tactile, and calm. It does not mean decorated, and it is not a dashboard.

## Color

Define colors as tokens once. Never scatter hex values across components.

| Role                            | Value                    |
| ------------------------------- | ------------------------ |
| Ink background                  | `#191b1c`                |
| Gold — primary, CTA, selected   | `#deac41`                |
| Terracotta — accent, brand, destructive | `#a7401d`        |
| Text on gold                    | `#191b1c`                |
| Text on dark                    | warm off-white, not `#fff` |

Gold is the action. Terracotta is spice. Ink is the room. Do not use the three
colors in equal amounts — most of a screen is ink, one thing is gold, terracotta
appears rarely.

## Layout and type

- Mobile-first. One centered column.
- Generous whitespace. A screen carries one title, one supporting line, one
  primary action.
- Inter Variable for titles, Geist Variable for UI, numbers, and inputs. No
  third face. Reach for the `serif-display`, `serif-heading`, and `eyebrow`
  utilities instead of restating family or variation settings, and always pair
  one with a `text-*` size. They avoid a `text-` prefix and set no `font-size`
  on purpose: `cn` drops `text-` prefixed custom names as text-color conflicts,
  and a real size class would outrank them anyway.
- Spacing on a 4/8 scale.
- Alignment over ornaments. No sidebar, no charts, no card inside a card inside
  a card.

## Interaction

- Primary button: gold. Secondary: quiet outline. Destructive: terracotta.
- Touch targets at least 44px.
- Focus is always visible.
- Disabled looks disabled and is not clickable.
- Motion: 150–250ms, `opacity` and `transform` only. Prefer no motion over a
  gimmick.
- Empty, loading (skeleton), and error states are first-class screens, not
  afterthoughts.

## Implementation

Use shadcn components with semantic tokens — `bg-background`, `bg-primary`,
`text-primary-foreground`, `text-muted-foreground`, `border-border`,
`bg-destructive`. Map the palette above onto those tokens in the theme layer. Do
not invent a parallel design system alongside it.

```tsx
// Bad: raw hex, no focus, small target, invented tokens
<button className="bg-[#deac41] text-[#191b1c] h-8 px-2 outline-none">
  Reserve
</button>

// Good: semantic tokens, real target size, visible focus
<Button size="lg" className="w-full">
  Reserve
</Button>
```

## Quality bar

- If a screen looks busy, remove something.
- If the next action is unclear, fix hierarchy before adding UI.
- Contrast must hold on the dark background — check gold and terracotta on ink,
  and never place small terracotta text on ink for body copy.
- Verify visually in the browser whenever UI changed. One screenshot is not
  enough: check the mobile width, the primary interaction, and the loading,
  empty, and error states.

## Checklist before finishing a UI change

- [ ] No hex literals in components, only tokens
- [ ] Exactly one primary action per screen
- [ ] Spacing on the 4/8 scale
- [ ] Targets ≥ 44px, focus visible, disabled non-clickable
- [ ] Loading, empty, and error states designed
- [ ] Contrast checked on ink
- [ ] Verified in browser at mobile width, more than one screenshot
