/* ============================================================
   SecureSign — Login Page (Demo)
   Vanilla JavaScript. No external dependencies.

   IMPORTANT:
   This file performs CLIENT-SIDE validation only.

   It does NOT authenticate users.

   A real implementation MUST:
     - Receive credentials over HTTPS
     - Validate input server-side
     - Hash passwords with Argon2id / bcrypt / scrypt
     - Manage sessions with secure, HttpOnly cookies
     - Implement rate limiting & brute-force protection
     - Return generic authentication errors
   ============================================================ */

"use strict";

(function () {
  /* ---------- Configuration ---------- */

  const USERNAME_MAX = 254;
  const PASSWORD_MAX = 128;

  const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /*
   * UX-only cooldown.
   * This is NOT a security mechanism.
   * Real rate limiting MUST be server-side.
   */
  const UX_COOLDOWN_MS = 1500;

  /*
   * Simulated network latency for the demo.
   */
  const DEMO_LATENCY_MS = 1100;


  /* ---------- DOM references ---------- */

  const form =
    document.getElementById("login-form");

  const usernameInput =
    document.getElementById("username");

  const passwordInput =
    document.getElementById("password");

  const toggleBtn =
    document.getElementById("toggle-password");

  const submitBtn =
    document.getElementById("submit-btn");

  const ssoBtn =
    document.getElementById("sso-btn");

  const forgotLink =
    document.getElementById("forgot-link");

  const statusEl =
    document.getElementById("form-status");

  const usernameErrorEl =
    document.getElementById("username-error");

  const passwordErrorEl =
    document.getElementById("password-error");

  const successPanel =
    document.getElementById("success-panel");

  const resetDemoBtn =
    document.getElementById("reset-demo");

  const demoSuccessBtn =
    document.getElementById("demo-success");


  /* ---------- Safety check ---------- */

  if (
    !form ||
    !usernameInput ||
    !passwordInput ||
    !toggleBtn ||
    !submitBtn ||
    !ssoBtn ||
    !forgotLink ||
    !statusEl ||
    !usernameErrorEl ||
    !passwordErrorEl ||
    !successPanel ||
    !resetDemoBtn ||
    !demoSuccessBtn
  ) {
    console.error(
      "[SecureSign] Required DOM elements are missing."
    );

    return;
  }


  /* ---------- State ---------- */

  let inFlight = false;
  let lastSubmitAt = 0;


  /* ---------- Helpers ---------- */

  function setStatus(message, state) {
    statusEl.textContent = message || "";

    if (state) {
      statusEl.dataset.state = state;
    } else {
      delete statusEl.dataset.state;
    }
  }


  function setFieldError(
    input,
    errorEl,
    message
  ) {
    errorEl.textContent = message || "";

    if (message) {
      input.setAttribute(
        "aria-invalid",
        "true"
      );

      input.classList.add(
        "is-invalid"
      );
    } else {
      input.setAttribute(
        "aria-invalid",
        "false"
      );

      input.classList.remove(
        "is-invalid"
      );
    }
  }


  function clearAllErrors() {
    setFieldError(
      usernameInput,
      usernameErrorEl,
      ""
    );

    setFieldError(
      passwordInput,
      passwordErrorEl,
      ""
    );

    setStatus("", "");
  }


  /* ---------- Validation ---------- */

  /*
   * Username/email validation.
   *
   * Usernames are allowed.
   * If the value contains "@", it receives
   * basic email validation.
   */
  function validateUsername(rawValue) {
    const value =
      String(rawValue || "").trim();

    if (!value) {
      return "Please enter your email or username.";
    }

    if (value.length > USERNAME_MAX) {
      return "That value is too long.";
    }

    if (
      value.includes("@") &&
      !EMAIL_REGEX.test(value)
    ) {
      return "Please enter a valid email address.";
    }

    return "";
  }


  /*
   * IMPORTANT:
   * Passwords are NOT trimmed,
   * lowercased, or otherwise modified.
   */
  function validatePassword(rawValue) {
    const value =
      String(rawValue || "");

    if (!value) {
      return "Please enter your password.";
    }

    if (value.length > PASSWORD_MAX) {
      return "That password is too long.";
    }

    return "";
  }


  /* ---------- Password visibility ---------- */

  function togglePasswordVisibility() {
    const willShow =
      passwordInput.type === "password";

    passwordInput.type =
      willShow ? "text" : "password";

    toggleBtn.setAttribute(
      "aria-pressed",
      willShow ? "true" : "false"
    );

    toggleBtn.setAttribute(
      "aria-label",
      willShow
        ? "Hide password"
        : "Show password"
    );

    passwordInput.focus();
  }


  toggleBtn.addEventListener(
    "click",
    togglePasswordVisibility
  );


  /* ---------- Clear errors while typing ---------- */

  usernameInput.addEventListener(
    "input",
    function () {
      if (
        usernameInput.getAttribute(
          "aria-invalid"
        ) === "true"
      ) {
        setFieldError(
          usernameInput,
          usernameErrorEl,
          ""
        );
      }
    }
  );


  passwordInput.addEventListener(
    "input",
    function () {
      if (
        passwordInput.getAttribute(
          "aria-invalid"
        ) === "true"
      ) {
        setFieldError(
          passwordInput,
          passwordErrorEl,
          ""
        );
      }
    }
  );


  /* ---------- Placeholder handlers ---------- */

  forgotLink.addEventListener(
    "click",
    function (event) {
      event.preventDefault();

      setStatus(
        "Password recovery requires a backend. This link is a UI placeholder.",
        "info"
      );
    }
  );


  ssoBtn.addEventListener(
    "click",
    function () {
      setStatus(
        "Single sign-on is not implemented in this demo. This button is a UI placeholder.",
        "info"
      );
    }
  );


  /* ---------- Success panel ---------- */

  function showSuccessPanel() {
    if (!successPanel.hidden) {
      return;
    }

    clearAllErrors();

    form.hidden = true;

    successPanel.hidden = false;

    resetDemoBtn.focus();
  }


  function resetToForm() {
    successPanel.hidden = true;

    form.hidden = false;

    form.reset();

    clearAllErrors();

    inFlight = false;

    submitBtn.disabled = false;

    submitBtn.classList.remove(
      "is-loading"
    );

    submitBtn.removeAttribute(
      "aria-busy"
    );

    usernameInput.focus();
  }


  resetDemoBtn.addEventListener(
    "click",
    resetToForm
  );


  /* ---------- Demo success preview ---------- */

  demoSuccessBtn.addEventListener(
    "click",
    function () {
      showSuccessPanel();
    }
  );


  /* ---------- Form submission ---------- */

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      /*
       * Duplicate submission guard.
       * UX only — NOT security.
       */
      const now = Date.now();

      if (inFlight) {
        return;
      }

      if (
        now - lastSubmitAt <
        UX_COOLDOWN_MS
      ) {
        return;
      }


      /* ---------- Validate ---------- */

      const usernameError =
        validateUsername(
          usernameInput.value
        );

      const passwordError =
        validatePassword(
          passwordInput.value
        );


      setFieldError(
        usernameInput,
        usernameErrorEl,
        usernameError
      );

      setFieldError(
        passwordInput,
        passwordErrorEl,
        passwordError
      );


      if (
        usernameError ||
        passwordError
      ) {
        setStatus(
          "Please correct the highlighted fields.",
          "error"
        );

        (
          usernameError
            ? usernameInput
            : passwordInput
        ).focus();

        return;
      }


      /* ---------- Begin demo request ---------- */

      inFlight = true;

      lastSubmitAt = now;

      submitBtn.disabled = true;

      submitBtn.classList.add(
        "is-loading"
      );

      submitBtn.setAttribute(
        "aria-busy",
        "true"
      );

      setStatus(
        "Signing in…",
        "loading"
      );


      /*
       * DEMO ONLY.
       *
       * A real application would POST
       * credentials to a secure backend here.
       *
       * The backend should:
       *
       * 1. Re-validate input server-side.
       * 2. Look up the user.
       * 3. Verify password using Argon2id,
       *    bcrypt, or scrypt.
       * 4. Issue a Secure + HttpOnly +
       *    SameSite session cookie.
       * 5. Return generic authentication errors.
       */

      window.setTimeout(
        function () {
          inFlight = false;

          submitBtn.disabled = false;

          submitBtn.classList.remove(
            "is-loading"
          );

          submitBtn.removeAttribute(
            "aria-busy"
          );


          /*
           * Generic error.
           *
           * No account enumeration.
           * No fake authentication.
           */
          setStatus(
            "Invalid email or password. (Demo response — no real authentication is performed.)",
            "error"
          );

          passwordInput.focus();

          passwordInput.select();
        },
        DEMO_LATENCY_MS
      );
    }
  );


  /* ---------- Initial focus ---------- */

  usernameInput.focus();

})();