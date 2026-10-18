<div align="center">

# GramSplit

### Weight in. Fair prices out.

**A fast, elegant calculator that splits a total price across products based on their weight.**

[![React](https://img.shields.io/badge/React-19-173F34?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-173F34?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-E69A38?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-E69A38?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## What is GramSplit?

GramSplit removes the guesswork from weight-based pricing. Add your products, enter each weight, then provide the order's total weight and price. Every product's share is calculated instantly and proportionally.

It is useful for:

- Splitting the cost of bulk grocery orders
- Pricing products purchased by weight
- Dividing shipping or production costs
- Calculating portions from a mixed wholesale order
- Creating a quick, transparent cost breakdown

## How it works

GramSplit uses one straightforward formula:

```text
Product price = (Product weight ÷ Total weight) × Total price
```

For example, if a **250 g** product belongs to a **1,000 g** order that costs **$40.00**:

```text
(250 ÷ 1,000) × $40.00 = $10.00
```

The result updates automatically whenever a product, weight, total, or currency changes.

## Highlights

| Feature | Description |
| --- | --- |
| Live calculations | See every product price update as you type |
| Flexible product list | Add, rename, and remove products |
| Weight validation | Detect when product weights exceed the entered total |
| Multiple currencies | Display results in USD, EUR, GBP, or CAD |
| Quick total sync | Set the total weight from the sum of all products |
| Saved history | Store calculations locally and revisit them later |
| Restore calculations | Load a previous calculation back into the editor |
| Responsive interface | Designed for mobile, tablet, and desktop |

## Calculation history

Select **Save calculation** after completing a price split. GramSplit stores the full calculation—including products, weights, prices, currency, and save time—in your browser.

From the **History** page, you can:

1. Review the product-level breakdown
2. Restore any saved calculation with **Use again**
3. Delete individual records
4. Clear the complete history

> History is stored in browser `localStorage`. It remains available after a refresh, but it is specific to the current browser and device.

## Built with

- **React 19** for the interface and state management
- **TypeScript** for safe, maintainable application code
- **Tailwind CSS 4** for responsive styling
- **Vite 8** for development and production builds
- **Figma Make** for the application environment

No backend, account, or external database is required.

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) 22
- [pnpm](https://pnpm.io/) 10

The expected versions are documented in [`.mise.toml`](./.mise.toml).

### Install and run

```bash
# Install dependencies
pnpm install

# Start the Vite development server
pnpm dev
```

Open the local URL printed by Vite. Changes in `src/` will update through hot module replacement.

### Production build

```bash
pnpm build
```

The optimized output is generated in `dist/`.

### Preview the production build

```bash
pnpm preview
```

## Project structure

```text
.
├── src/
│   ├── App.tsx        # Calculator, history, and application logic
│   ├── index.css      # Tailwind import and global styles
│   └── main.tsx       # React entrypoint
├── index.html         # Application shell
├── package.json       # Scripts and dependencies
├── vite.config.ts     # Vite, React, Tailwind, and Figma configuration
└── .mise.toml         # Node.js and pnpm versions
```

## Privacy

GramSplit performs every calculation on-device. Saved calculations stay in the browser and are not transmitted to a remote service.

## Design principles

The interface is built around three ideas:

- **Immediate:** results appear without submitting a form
- **Transparent:** the allocation percentage and weight totals remain visible
- **Reusable:** useful calculations can be saved and restored in one click

---

<div align="center">

**Make every gram count.**

</div>
