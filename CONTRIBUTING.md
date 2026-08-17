# Contributing to SecureSign

Thank you for considering contributing to SecureSign.

SecureSign is a frontend-focused authentication UI project built with vanilla HTML, CSS, and JavaScript. Contributions should preserve the project's goals of **clarity, accessibility, maintainability, responsive design, and security-conscious frontend development**.

---

## 📌 Before You Contribute

Please read:

* `[README.md](README.md)`
* `[SECURITY.md](SECURITY.md)`
* `[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)`

Security vulnerabilities should not be submitted through ordinary public issues.

---

## 🛠️ Development Setup

Clone the repository:

```bash
git clone <repository-url>
cd SecureSign
```

Run the project using a local HTTP server.

For example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You may also use VS Code Live Server or another static development server.

---

## 📁 Project Structure

Keep the project organized around its existing responsibilities:

```text
SecureSign/
├── index.html
├── signup.html
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
│
├── css/
│   └── Styles.css
│
├── js/
│   ├── app.js
│   └── signup.js
│
└── assets/
```

Avoid introducing unnecessary frameworks or dependencies for functionality that can reasonably remain vanilla HTML, CSS, or JavaScript.

---

## 🎯 Contribution Principles

Good contributions should generally be:

* Simple
* Accessible
* Responsive
* Maintainable
* Security-conscious
* Consistent with the existing UI
* Easy to understand
* Tested before submission

Avoid adding complexity without a clear benefit.

---

## 🧑‍💻 Coding Guidelines

### HTML

Prefer semantic HTML.

Use:

```html
<label for="email">Email address</label>
<input id="email" name="email">
```

instead of relying exclusively on placeholders.

Preserve accessible relationships such as:

```text
aria-describedby
aria-invalid
aria-live
role="alert"
role="status"
```

## The existing authentication forms already use these patterns extensively.

### CSS

Prefer:

* Existing design tokens
* Reusable classes
* Responsive layouts
* Clear naming
* Minimal specificity
* Accessible focus states
* Reduced duplication

Avoid:

* Excessive `!important`
* Large duplicated style blocks
* Unnecessary animations
* Fixed layouts that break on mobile
* Poor contrast

---

### JavaScript

Prefer:

* Small focused functions
* Clear naming
* Defensive DOM access
* Event listeners
* Avoiding unnecessary global variables
* Clear error handling
* Accessible status updates

Never treat client-side JavaScript as a trusted security boundary.

---

## ♿ Accessibility Requirements

Accessibility regressions should be avoided.

When adding a UI component, consider:

* Keyboard navigation
* Focus visibility
* Screen-reader announcements
* Labels
* Error messages
* Color contrast
* Reduced motion
* Touch target size
* Logical tab order

Interactive controls should remain usable without a mouse.

---

## 🔐 Security Requirements

Contributors must never intentionally introduce:

* Plaintext password storage
* Hardcoded secrets
* API keys
* Authentication bypasses
* Unsafe HTML injection
* Dangerous `eval()` usage
* Unvalidated trust of user input
* Insecure credential handling

Never commit real credentials to Git.

If you discover a security vulnerability, follow `SECURITY.md` rather than opening a public issue.

---

## 🌐 Browser Compatibility

Changes should be tested in modern:

* Chrome
* Edge
* Firefox
* Safari

At minimum, verify:

* Desktop layout
* Mobile layout
* Keyboard navigation
* Form submission
* Validation errors
* Password visibility controls
* Success/demo states

---

## 🧪 Testing Checklist

Before submitting a pull request:

```text
[ ] HTML loads without errors
[ ] CSS loads correctly
[ ] JavaScript has no console errors
[ ] Login form works
[ ] Signup form works
[ ] Validation works
[ ] Password toggle works
[ ] Password confirmation works
[ ] Error messages are accessible
[ ] Keyboard navigation works
[ ] Mobile layout works
[ ] Desktop layout works
[ ] No secrets were added
[ ] No unnecessary dependencies were added
[ ] README updated if behavior changed
```

---

## 🌿 Branches

Use descriptive branches.

Examples:

```text
feature/password-strength
feature/mobile-auth-layout
fix/signup-validation
fix/password-toggle
docs/security-policy
refactor/form-validation
```

Avoid vague names such as:

```text
test
new
changes
stuff
final
final2
```

---

## 💬 Commit Messages

Use clear, concise commit messages.

Recommended format:

```text
type(scope): description
```

Examples:

```text
feat(auth): add password strength indicator
fix(signup): validate password confirmation
fix(ui): improve mobile authentication layout
docs(security): document frontend security model
refactor(forms): simplify validation handlers
style(auth): improve form spacing
```

Keep commits focused.

Avoid combining unrelated changes into one commit.

---

## 🔀 Pull Requests

A pull request should explain:

### What changed?

Describe the implementation.

### Why?

Explain the problem or motivation.

### Testing

Explain how the change was tested.

Example:

```text
## What changed

Added password strength feedback to the signup form.

## Why

Users previously had no immediate indication of password quality.

## Testing

- Tested Chrome
- Tested Edge
- Tested mobile viewport
- Tested keyboard navigation
- Tested invalid and valid passwords
```

---

## 📝 Documentation

Update documentation when behavior changes.

For example:

* New feature → update `README.md`
* Security-related behavior → review `SECURITY.md`
* Contribution workflow → update `CONTRIBUTING.md`

Do not document functionality that does not actually exist.

---

## 🚨 Security Contributions

Security improvements are especially welcome.

Examples include:

* Improved CSP guidance
* Better accessibility
* Safer DOM handling
* Improved validation UX
* Security documentation
* Dependency hygiene
* Secure backend architecture proposals

Remember that frontend validation is not a substitute for backend security.

---

## 📦 Dependencies

Before adding a dependency, ask:

1. Is it actually necessary?
2. Can the feature be implemented with existing browser APIs?
3. Is the package maintained?
4. Does it introduce unnecessary attack surface?
5. Is the license compatible?
6. Does it significantly increase bundle size?

For a small vanilla JavaScript project, fewer dependencies are generally preferable.

---

## 🚫 What We Don't Want

Avoid pull requests that:

* Rewrite the project into a framework without justification
* Add unnecessary dependencies
* Remove accessibility attributes
* Introduce hardcoded credentials
* Store sensitive data in localStorage
* Pretend demo authentication is real authentication
* Add excessive animations
* Break mobile layouts
* Mix unrelated changes
* Modify security-sensitive behavior without documentation

---

## 🤝 Code Review

Maintainers may request changes related to:

* Accessibility
* Security
* Maintainability
* Browser compatibility
* Performance
* Naming
* Documentation
* Scope

Please treat review as part of improving the project rather than as a personal judgment.

---

## 📜 License

By contributing, you agree that your contributions may be distributed under the project's applicable license.

If a formal license is added later, this section should be updated to reference it explicitly.

---

## ❤️ Thank You

Every contribution helps improve SecureSign.

Whether you're fixing a typo, improving accessibility, correcting a validation issue, improving responsive behavior, or proposing a stronger security architecture, thoughtful contributions are welcome.
