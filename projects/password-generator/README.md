# Modern Password Generator

> A sleek, client-side password generator with real-time strength evaluation and one-click copy functionality.

## 🔐 About

  SecurePass is a modern, user-friendly password generator built with vanilla HTML, CSS, and JavaScript. It helps users create strong, customizable passwords instantly without any server communication — ensuring complete privacy. The tool features an elegant glassmorphic interface, password strength meter, flexible character options, and a responsive design that works on both desktop and mobile devices. Perfect for learning DOM manipulation, event handling, and the Web Crypto API.

## ✨ Features

- **Customizable Password Length** – Slide from 6 to 32 characters with live preview
- **Character Set Toggles** – Choose from uppercase, lowercase, digits, and symbols
- **Real-time Strength Meter** – Visual feedback with color-coded bars (Weak → Strong)
- **One-Click Copy** – Copy generated password to clipboard with toast notification
- **Smart Generation** – Ensures at least one character from each selected set
- **Responsive Design** – Adapts seamlessly to mobile and desktop screens
- **Secure Randomness** – Uses `crypto.getRandomValues()` for cryptographically strong generation

## 🎯 What You'll Learn

- **CSS Layout Techniques** – Flexbox for centering, glassmorphism effect, and responsive card design
- **DOM Manipulation** – Reading checkbox states, slider values, and updating UI in real time
- **Event Handling** – Listening to range sliders, checkboxes, buttons, and clipboard API
- **Password Strength Algorithm** – Scoring based on length and character variety
- **Web Crypto API** – Using `crypto.getRandomValues()` for secure random generation
- **Form Accessibility** – Proper labeling, ARIA-friendly interactions, and keyboard navigation
- **CSS Transitions & Micro-interactions** – Hover effects, active states, and smooth animations

## 💻 How to Use

1. *Adjust length* – Drag the slider to set desired password length (6–32 characters)
2. *Select character sets* – Check/uncheck boxes for uppercase, lowercase, digits, and symbols
3. *Generate password* – Click the "Generate my password" button (or any change auto-generates)
4. *Copy to clipboard* – Click the "Copy" button next to the password field
5. *Check strength* – Watch the color-coded strength meter update with each new password
6. *Select all* – Click directly on the password field to highlight and manually copy

## 🎨 Customization

### Colors & Theme
Modify the CSS variables in the `style.css` file:

```css
/* Primary gradient (generate button) */
background: linear-gradient(105deg, #7C5CFF 0%, #9A7BFF 100%);

/* Strength bar colors */
WEAK: #FF5E6B
FAIR: #FFB347  
GOOD: #5D9BEC
STRONG: #3CCF91

/* Background gradient */
background: linear-gradient(145deg, #EFF3F8 0%, #E6ECF4 100%);
```

### Password Length Range
Adjust the slider limits in the HTML:

```html
<input type="range" id="lengthSlider" min="6" max="32" value="14">
```

### Symbol Set
Edit the `SYMBOLS` constant in JavaScript to include/exclude special characters:

```js
const SYMBOLS = '!@#$%^&*()_+=-{}[];:,.<>?';
```

### Strength Scoring
Modify the `updateStrengthMeter()` function to change how strength is calculated:

```js
// Current: length >=12 adds 2 points, >=8 adds 1 point
// Variety adds 1 point per character type used
```



## 📁 Project Structure

```text
password-generator/
├── index.html    # Main HTML structure
├── style.css     # Styling and animations
├── script.js     # functionality
└── README.md     # This file
```

## 🚀 Run Locally

Open \`index.html\` in your browser. No installation required!

## 🔒 Security Note

>This generator uses the Web Crypto API `(crypto.getRandomValues())` which provides cryptographically strong random numbers suitable for password generation. All processing happens locally in your browser — no passwords are sent over the network or stored.