# Staggering Animation

## Step 1: Add HTML

```html
<a href="#" aria-label="Staggering button" class="btn-animate-chars">
  <div class="btn-animate-chars__bg"></div>
  <span data-button-animate-chars="" class="btn-animate-chars__text">Staggering Button</span>
</a>
```

## Step 2: Add CSS

```css
.btn-animate-chars {
  color: #131313;
  cursor: pointer;
  border-radius: 0.25em;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  max-width: 12em;
  padding: 1em;
  font-size: 1em;
  line-height: 1;
  text-decoration: none;
  display: flex;
  position: relative;
}

.btn-animate-chars__text {
  white-space: nowrap;
  line-height: 1.3;
}

/* Characters */
.btn-animate-chars [data-button-animate-chars] {
  overflow: hidden;
  position: relative;
  display: inline-block;
}

.btn-animate-chars [data-button-animate-chars] span {
  display: inline-block;
  position: relative;
  text-shadow: 0px 1.3em currentColor;
  transform: translateY(0em) rotate(0.001deg);
  transition: transform 0.6s cubic-bezier(0.625, 0.05, 0, 1);
}

.btn-animate-chars:hover [data-button-animate-chars] span {
  transform: translateY(-1.3em) rotate(0.001deg);
}

/* Background */
.btn-animate-chars__bg {
  background-color: #efeeec;
  border-radius: 0.25em;
  position: absolute;
  inset: 0;
  transition: inset 0.6s cubic-bezier(0.625, 0.05, 0, 1);
}

.btn-animate-chars:hover .btn-animate-chars__bg {
  inset: 0.125em;
}
```

## Step 3: Add JavaScript

```javascript
function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

// Initialize Button Character Stagger Animation
document.addEventListener('DOMContentLoaded', () => {
  initButtonCharacterStagger();
});
```

## Implementation

### Stagger Duration

To change the duration between each character, modify the variable in the JavaScript file:

```javascript
offsetIncrement = 0.01 // Time in seconds between each character
```

### GSAP SplitText

This resource uses a custom script to split characters. If your project already includes GSAP's SplitText, you can use that instead.
