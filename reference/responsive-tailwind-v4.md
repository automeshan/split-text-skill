# Responsive Text Documentation

> Scaling System by [Osmo](https://osmo.supply/)

## Step 1: Add HTML

Add the scaling system CSS to your project.

## Step 2: Add CSS

```css
/* ------------------------- Scaling System by Osmo [https://osmo.supply/] ------------------------- */

/* Desktop */
:root {
  --size-unit: 16; /* body font-size in design - no px */
  --size-container-ideal: 1440; /* screen-size in design - no px */
  --size-container-min: 992px;
  --size-container-max: 1920px;
  --size-container: clamp(
    var(--size-container-min),
    100vw,
    var(--size-container-max)
  );
  --size-font: calc(
    var(--size-container) / (var(--size-container-ideal) / var(--size-unit))
  );
}

/* Tablet */
@media screen and (max-width: 991px) {
  :root {
    --size-container-ideal: 834; /* screen-size in design - no px */
    --size-container-min: 768px;
    --size-container-max: 991px;
  }
}

/* Mobile Portrait */
@media screen and (max-width: 479px) {
  :root {
    --size-container-ideal: 390; /* screen-size in design - no px */
    --size-container-min: 320px;
    --size-container-max: 479px;
  }
}
```

## Implementation

### Body Font Size

To make the scaling system work, add the `var(--size-font)` variable to the font-size of the `<body>`:

```css
body {
  font-size: var(--size-font);
}
```

### Container Width

When using a container, add the `var(--size-container)` variable to the max-width:

```css
.container {
  max-width: var(--size-container);
}

.container.medium {
  max-width: calc(var(--size-container) * 0.85);
}

.container.small {
  max-width: calc(var(--size-container) * 0.7);
}
```

## Configuration

### Ideal Container Size

On the `--size-container-ideal` variable, add the size of your design in Figma (no `px` behind the value).

### Max Container Size

On each viewport you can define a `--size-container-max` for the scaling system. Scaling will stop after that value is reached.
