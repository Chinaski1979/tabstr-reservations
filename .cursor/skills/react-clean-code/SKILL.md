---
name: react-clean-code
description: Writes and refactors React + TypeScript that is clean, maintainable, and reusable. Use when creating or editing React components, hooks, pages, or frontend TypeScript.
---

# React Clean Code

Rules for authoring and refactoring React + TypeScript in this app.

## Components

- Function components only. One component, one job.
- Extract a child when a block has its own state, has its own name, or is used
  twice. Not before.
- UI lives in components. Data fetching and mutations live in hooks or services.
  JSX must not contain API calls, date math, or copy-pasted condition trees.
- Props get explicit TypeScript interfaces. No `any`. Mark a prop optional only
  when it is genuinely optional.
- Prefer composition — `children`, small named slots — over boolean prop forests
  like `isHero && isCompact && showIcon`.
- Name the file after its export: `HomePage.tsx` exports `HomePage`. Hooks are
  `useThing.ts` exporting `useThing`.

```tsx
// Bad: fetch inside JSX-owning component, boolean forest, index key
function Reservations({ isCompact, isHero, showIcon }: any) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch("/api/reservations").then((r) => r.json()).then(setRows);
  }, []);
  return rows.map((r, i) => <Row key={i} {...r} />);
}

// Good: data in a hook, explicit props, stable keys
interface ReservationListProps {
  date: string;
  emptyState?: ReactNode;
}

function ReservationList({ date, emptyState }: ReservationListProps) {
  const { reservations, isLoading, error } = useReservations(date);

  if (isLoading) return <ReservationListSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (reservations.length === 0) return emptyState ?? <EmptyState />;

  return (
    <ul>
      {reservations.map((reservation) => (
        <ReservationRow key={reservation.id} reservation={reservation} />
      ))}
    </ul>
  );
}
```

## State

- Derive values. Do not store anything that can be computed from existing state
  or props during render.
- Use `useEffect` only to synchronize with something outside React (DOM APIs,
  subscriptions, timers, network). Never use it to copy props into state or to
  trigger a derived render.
- Lift state only as far as it must go. No global store until there is real
  shared client state.
- Lists need stable keys from ids. Never use the array index if the list can
  reorder, filter, or receive insertions.

```tsx
// Bad: stored derivation, effect used as a computation
const [total, setTotal] = useState(0);
useEffect(() => setTotal(guests * pricePerGuest), [guests, pricePerGuest]);

// Good
const total = guests * pricePerGuest;
```

## Reuse

- Shared UI goes in `src/components/`. Shared logic goes in `src/hooks/` or
  `src/lib/`.
- A function belongs next to its only caller until a second caller exists. No
  speculative "utils kitchen sink".
- Do not add a library if the platform or an existing helper already does the
  job. Check `package.json` and `src/lib/` before reaching for a dependency.

## Hygiene

- Delete dead code, unused props, and unused exports as you touch a file.
- No comments that narrate the code. Comment only non-obvious *why*.
- Keep modules short. Split a file that does three unrelated things.
- Handle loading, empty, and error at the call site that owns the data — not
  three layers down and not silently.

## Checklist before finishing an edit

- [ ] Every prop typed, no `any`, no unused props
- [ ] No `useEffect` that only computes or copies state
- [ ] Keys are ids, not indexes
- [ ] Fetching is in a hook or service, not in JSX
- [ ] Loading, empty, and error paths exist where data is owned
- [ ] No file left with dead code or narrating comments
