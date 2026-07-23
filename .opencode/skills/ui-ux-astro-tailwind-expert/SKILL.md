---
name: ui-ux-astro-tailwind-expert
description: Ekspert UI/UX Designu, Design Systemów i frontendu w Astro 7 i Tailwind CSS — typografia, semantyczne kolory, Bento Grid, glassmorphism, a11y.
---

# UI/UX Astro & Tailwind Expert

Lider UI/UX Designu i Architekt Frontendowy łączący wyrafinowaną estetykę z inżynieryjną wiedzą Astro 7 i Tailwind CSS. Celem są interfejsy zachwycające wizualnie, intuicyjne (UX, a11y) i osiągające 100/100 Lighthouse.

## Modern UI/UX Design & Design System

### Typografia i Skala Wizualna
- **Hierarchy First** — wyraźny kontrast skal (`text-xs` do `text-6xl`)
- Używaj dopracowanych par fontów (Geist, Inter, Plus Jakarta Sans)
- `tracking-tight` dla nagłówków, `leading-relaxed` dla bloków tekstu

### Semantyczny System Kolorów (Tailwind v4 `@theme`)
- Tokeny zamiast magic values: `bg-background`, `text-foreground`, `bg-card`, `border-border`
- **Depth & Surface Layering**: półprzezroczystości (`bg-muted/50`), szkło (`backdrop-blur-md`), subtelne obramowania (`border border-white/10`)
- **Dark Mode**: głębokie szarości/grafit, odpowiedni kontrast elementów aktywnych/nieaktywnych

### Kompozycja i Layouty
- **Bento Grid Layouts** — asymetryczne CSS Grid dla stron głównych i dashboardów
- **Container Queries** (`@container`) — komponenty dopasowujące się do rodzica
- **Spójna rytmika** — spacing oparty o skalę Tailwind (4/8/12/16/20/24)

## Design Tokens (CSS)

```css
@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.141 0.005 285.823);
  --color-card: oklch(0.967 0.003 264.542);
  --color-border: oklch(0.922 0.003 264.542);
  --color-primary: oklch(0.546 0.245 262.881);
  --color-muted: oklch(0.967 0.003 264.542);
}
```

## CVA Button Pattern

```ts
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 dark:bg-black/20 dark:border-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

## Feature Card Component (.astro)

```astro
---
import { Image } from 'astro:assets';
import { cn } from '@/lib/utils';
import type { ImageMetadata } from 'astro';

interface Props {
  title: string;
  description: string;
  category?: string;
  imageSrc?: ImageMetadata;
  badgeText?: string;
  class?: string;
}

const { title, description, category = "Feature", imageSrc, badgeText, class: className } = Astro.props;
---

<article class={cn(
  "group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-xl hover:shadow-primary/5",
  className
)}>
  <div class="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-3xl" />

  <div class="flex items-center justify-between gap-2 mb-4">
    <span class="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{category}</span>
    {badgeText && (
      <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">{badgeText}</span>
    )}
  </div>

  <div class="space-y-2 mb-6">
    <h3 class="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{title}</h3>
    <p class="text-sm leading-relaxed text-muted-foreground">{description}</p>
  </div>

  {imageSrc && (
    <div class="relative mt-auto overflow-hidden rounded-2xl bg-muted aspect-video">
      <Image src={imageSrc} alt={title} class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
    </div>
  )}

  <div class="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-foreground">
    <slot name="footer" />
  </div>
</article>
```

## Workflow Principles

1. **Elegancja i prostota** — czytelność i czystość nad przesadną dekoracyjność
2. **Accessible by Default** — WCAG AA, `focus-visible:ring`, `aria-label` dla screen-readerów
3. **Performance** — brak ciężkich bibliotek JS do prostych animacji CSS, natywne API przeglądarki
4. **Kompletne komponenty** — gotowe do produkcji, spójny motyw kolorystyczny, Mobile First