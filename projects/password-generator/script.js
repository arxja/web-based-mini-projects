// DOM elements
const passwordInput = document.getElementById("passwordInput");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const uppercaseChk = document.getElementById("uppercase");
const lowercaseChk = document.getElementById("lowercase");
const numbersChk = document.getElementById("numbers");
const symbolsChk = document.getElementById("symbols");
const generateBtn = document.getElementById("generateBtn");
const copyButton = document.getElementById("copyButton");
const copyToast = document.getElementById("copyToast");
const strengthBars = document.querySelectorAll(".strength-bar");
const strengthLabel = document.getElementById("strengthLabel");

// character pools
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+=-{}[];:,.<>?";

// helper: get active character set
function getCharacterSet() {
  let charset = "";
  if (uppercaseChk.checked) charset += UPPER;
  if (lowercaseChk.checked) charset += LOWER;
  if (numbersChk.checked) charset += DIGITS;
  if (symbolsChk.checked) charset += SYMBOLS;
  return charset;
}

// ensure at least one checkbox is active
function enforceAtLeastOneCheckbox() {
  const anyChecked =
    uppercaseChk.checked ||
    lowercaseChk.checked ||
    numbersChk.checked ||
    symbolsChk.checked;
  if (!anyChecked) {
    // fallback: enable lowercase to keep generator alive
    lowercaseChk.checked = true;
    return true;
  }
  return anyChecked;
}

// generate random password based on settings
function generatePassword() {
  enforceAtLeastOneCheckbox();
  const length = parseInt(lengthSlider.value, 10);
  let charset = getCharacterSet();
  if (charset.length === 0) {
    // safety, but enforce already covers
    charset = LOWER;
    lowercaseChk.checked = true;
  }

  let password = "";
  // cryptographically friendly randomization (enough for UI generator)
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    const randomIndex = array[i] % charset.length;
    password += charset[randomIndex];
  }

  // Additional: ensure at least one character from each selected category (optional robustness)
  // but not necessary for UX due to randomness, but improves validity for strict users
  password = ensureAtLeastOneFromEachGroupIfNeeded(password, length);
  return password;
}

// Bonus: guarantee that the generated password includes at least one char from each active group
// to avoid edge case all lowercase etc. (just improves perceived quality)
function ensureAtLeastOneFromEachGroupIfNeeded(password, desiredLength) {
  const neededGroups = [];
  if (uppercaseChk.checked) neededGroups.push(UPPER);
  if (lowercaseChk.checked) neededGroups.push(LOWER);
  if (numbersChk.checked) neededGroups.push(DIGITS);
  if (symbolsChk.checked) neededGroups.push(SYMBOLS);

  if (neededGroups.length === 0) return password;

  let hasAll = true;
  for (const group of neededGroups) {
    let hasChar = false;
    for (let ch of password) {
      if (group.includes(ch)) {
        hasChar = true;
        break;
      }
    }
    if (!hasChar) hasAll = false;
  }

  if (hasAll) return password;

  // rebuild with guaranteed insertion
  let newPass = password.split("");
  for (let i = 0; i < neededGroups.length; i++) {
    const group = neededGroups[i];
    let missing = true;
    for (let ch of newPass) {
      if (group.includes(ch)) {
        missing = false;
        break;
      }
    }
    if (missing && group.length > 0) {
      const randomChar = group[Math.floor(Math.random() * group.length)];
      const replacePos = i % newPass.length;
      newPass[replacePos] = randomChar;
    }
  }
  if (newPass.length !== desiredLength) {
    // adjust length if mismatch after replace (edge)
    while (newPass.length > desiredLength) newPass.pop();
    while (newPass.length < desiredLength) {
      const charsetFull = neededGroups.join("");
      newPass.push(charsetFull[Math.floor(Math.random() * charsetFull.length)]);
    }
  }
  return newPass.join("");
}

// evaluate password strength based on composition & length
function updateStrengthMeter(password) {
  let score = 0;
  const len = password.length;

  // length contribution
  if (len >= 12) score += 2;
  else if (len >= 8) score += 1;

  let hasUpper = /[A-Z]/.test(password);
  let hasLower = /[a-z]/.test(password);
  let hasDigit = /\d/.test(password);
  let hasSymbol = /[^A-Za-z0-9]/.test(password);

  const variety = [hasUpper, hasLower, hasDigit, hasSymbol].filter(
    Boolean,
  ).length;
  score += variety; // max+4

  let strength = "WEAK";
  let activeBars = 1;
  if (score <= 2) {
    strength = "WEAK";
    activeBars = 1;
  } else if (score <= 4) {
    strength = "FAIR";
    activeBars = 2;
  } else if (score <= 6) {
    strength = "GOOD";
    activeBars = 3;
  } else {
    strength = "STRONG";
    activeBars = 4;
  }
  // show final label
  strengthLabel.textContent = strength;

  // update bars (reset style)
  for (let i = 0; i < strengthBars.length; i++) {
    if (i < activeBars) {
      strengthBars[i].style.background = getBarColor(i, strength);
    } else {
      strengthBars[i].style.background = "#E2E8F0";
    }
  }
}

function getBarColor(index, strength) {
  if (strength === "WEAK") return "#FF5E6B";
  if (strength === "FAIR") return "#FFB347";
  if (strength === "GOOD") return "#5D9BEC";
  return "#3CCF91"; // STRONG
}

// render generated password to UI
function refreshPassword() {
  const newPwd = generatePassword();
  passwordInput.value = newPwd;
  updateStrengthMeter(newPwd);
  return newPwd;
}

// initial load and event binding
function init() {
  // show first password
  refreshPassword();

  // generate button action
  generateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    refreshPassword();
  });

  // length slider live update text
  lengthSlider.addEventListener("input", (e) => {
    lengthValue.textContent = e.target.value;
    // optional: auto refresh password for live preview? but we let manual generate for better UX
    // but we will auto-generate on slider? Many expect instant? Let's auto-refresh for smoothness!
    refreshPassword();
  });

  // any checkbox change triggers new password (instant feedback)
  const checkboxes = [uppercaseChk, lowercaseChk, numbersChk, symbolsChk];
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      enforceAtLeastOneCheckbox();
      refreshPassword();
    });
  });

  // copy to clipboard logic
  copyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const pwd = passwordInput.value;
    if (!pwd) return;
    try {
      await navigator.clipboard.writeText(pwd);
      // show toast feedback
      copyToast.style.opacity = "1";
      copyToast.style.transform = "translateY(0px)";
      setTimeout(() => {
        copyToast.style.opacity = "0";
      }, 1800);
    } catch (err) {
      // fallback for older browsers
      passwordInput.select();
      document.execCommand("copy");
      copyToast.style.opacity = "1";
      setTimeout(() => {
        copyToast.style.opacity = "0";
      }, 1500);
    }
  });

  // optional: clicking password field selects all for convenience
  passwordInput.addEventListener("click", () => {
    passwordInput.select();
  });
}

init()