"use strict";

/* ============================================================
   SecureSign — Sign Up Page (Demo)

   CLIENT-SIDE VALIDATION ONLY.

   This demo does NOT create real accounts.

   Production requirements:
     - HTTPS
     - Server-side validation
     - Argon2id / bcrypt / scrypt
     - Secure HttpOnly SameSite cookies
     - CSRF protection where applicable
     - Rate limiting
     - Brute-force protection
     - Email verification
     - Generic authentication responses
   ============================================================ */

(function () {

  /* ---------- Configuration ---------- */

  const USERNAME_MIN = 3;
  const USERNAME_MAX = 32;

  const EMAIL_MAX = 254;

  const PASSWORD_MIN = 12;
  const PASSWORD_MAX = 128;

  const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const USERNAME_REGEX =
    /^[A-Za-z0-9._-]+$/;

  const UX_COOLDOWN_MS = 1500;

  const DEMO_LATENCY_MS = 1200;


  /* ---------- DOM references ---------- */

  const form =
    document.getElementById("signup-form");

  const usernameInput =
    document.getElementById("username");

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const confirmPasswordInput =
    document.getElementById("confirm-password");

  const termsInput =
    document.getElementById("terms");

  const togglePasswordBtn =
    document.getElementById("toggle-password");

  const toggleConfirmPasswordBtn =
    document.getElementById(
      "toggle-confirm-password"
    );

  const submitBtn =
    document.getElementById("submit-btn");

  const statusEl =
    document.getElementById("form-status");

  const usernameErrorEl =
    document.getElementById("username-error");

  const emailErrorEl =
    document.getElementById("email-error");

  const passwordErrorEl =
    document.getElementById("password-error");

  const confirmPasswordErrorEl =
    document.getElementById(
      "confirm-password-error"
    );

  const termsErrorEl =
    document.getElementById("terms-error");

  const passwordStrengthFill =
    document.getElementById(
      "password-strength-fill"
    );

  const passwordStrengthLabel =
    document.getElementById(
      "password-strength-label"
    );

  const successPanel =
    document.getElementById(
      "success-panel"
    );

  const resetDemoBtn =
    document.getElementById(
      "reset-demo"
    );


  /* ---------- Safety check ---------- */

  if (
    !form ||
    !usernameInput ||
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput ||
    !termsInput ||
    !togglePasswordBtn ||
    !toggleConfirmPasswordBtn ||
    !submitBtn ||
    !statusEl ||
    !usernameErrorEl ||
    !emailErrorEl ||
    !passwordErrorEl ||
    !confirmPasswordErrorEl ||
    !termsErrorEl ||
    !passwordStrengthFill ||
    !passwordStrengthLabel ||
    !successPanel ||
    !resetDemoBtn
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
    statusEl.textContent =
      message || "";

    if (state) {
      statusEl.dataset.state =
        state;
    } else {
      delete statusEl.dataset.state;
    }
  }


  function setFieldError(
    input,
    errorEl,
    message
  ) {
    errorEl.textContent =
      message || "";

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


  function setTermsError(message) {
    termsErrorEl.textContent =
      message || "";

    if (message) {
      termsInput.setAttribute(
        "aria-invalid",
        "true"
      );
    } else {
      termsInput.setAttribute(
        "aria-invalid",
        "false"
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
      emailInput,
      emailErrorEl,
      ""
    );

    setFieldError(
      passwordInput,
      passwordErrorEl,
      ""
    );

    setFieldError(
      confirmPasswordInput,
      confirmPasswordErrorEl,
      ""
    );

    setTermsError("");

    setStatus("", "");
  }


  /* ---------- Validation ---------- */

  function validateUsername(rawValue) {

    const value =
      String(rawValue || "")
        .trim();

    if (!value) {
      return "Please choose a username.";
    }

    if (value.length < USERNAME_MIN) {
      return `Username must be at least ${USERNAME_MIN} characters.`;
    }

    if (value.length > USERNAME_MAX) {
      return `Username must be ${USERNAME_MAX} characters or fewer.`;
    }

    if (!USERNAME_REGEX.test(value)) {
      return "Username contains unsupported characters.";
    }

    return "";
  }


  function validateEmail(rawValue) {

    const value =
      String(rawValue || "")
        .trim();

    if (!value) {
      return "Please enter your email address.";
    }

    if (value.length > EMAIL_MAX) {
      return "That email address is too long.";
    }

    if (!EMAIL_REGEX.test(value)) {
      return "Please enter a valid email address.";
    }

    return "";
  }


  function validatePassword(rawValue) {

    const value =
      String(rawValue || "");

    if (!value) {
      return "Please create a password.";
    }

    if (value.length < PASSWORD_MIN) {
      return `Password must be at least ${PASSWORD_MIN} characters.`;
    }

    if (value.length > PASSWORD_MAX) {
      return "That password is too long.";
    }

    return "";
  }


  function validateConfirmPassword() {

    if (!confirmPasswordInput.value) {
      return "Please confirm your password.";
    }

    if (
      confirmPasswordInput.value !==
      passwordInput.value
    ) {
      return "Passwords do not match.";
    }

    return "";
  }


  function validateTerms() {

    if (!termsInput.checked) {
      return "You must agree to the Terms of Service and Privacy Policy.";
    }

    return "";
  }


  /* ---------- Password strength ---------- */

  function calculatePasswordStrength(password) {

    if (!password) {
      return {
        score: 0,
        label: "Enter a password"
      };
    }


    let score = 0;


    if (password.length >= 12) {
      score++;
    }

    if (password.length >= 16) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }


    if (score <= 2) {
      return {
        score: 1,
        label: "Weak password"
      };
    }

    if (score <= 4) {
      return {
        score: 2,
        label: "Moderate password"
      };
    }

    if (score === 5) {
      return {
        score: 3,
        label: "Strong password"
      };
    }

    return {
      score: 4,
      label: "Very strong password"
    };
  }


  function updatePasswordStrength() {

    const result =
      calculatePasswordStrength(
        passwordInput.value
      );


    passwordStrengthFill.dataset.level =
      String(result.score);

    passwordStrengthLabel.textContent =
      result.label;
  }


  /* ---------- Password visibility ---------- */

  function setupPasswordToggle(
    button,
    input
  ) {

    button.addEventListener(
      "click",
      function () {

        const willShow =
          input.type === "password";

        input.type =
          willShow
            ? "text"
            : "password";

        button.setAttribute(
          "aria-pressed",
          willShow
            ? "true"
            : "false"
        );

        button.setAttribute(
          "aria-label",
          willShow
            ? "Hide password"
            : "Show password"
        );

        input.focus();
      }
    );
  }


  setupPasswordToggle(
    togglePasswordBtn,
    passwordInput
  );

  setupPasswordToggle(
    toggleConfirmPasswordBtn,
    confirmPasswordInput
  );


  /* ---------- Live validation ---------- */

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


  emailInput.addEventListener(
    "input",
    function () {

      if (
        emailInput.getAttribute(
          "aria-invalid"
        ) === "true"
      ) {
        setFieldError(
          emailInput,
          emailErrorEl,
          ""
        );
      }
    }
  );


  passwordInput.addEventListener(
    "input",
    function () {

      updatePasswordStrength();

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

      if (
        confirmPasswordInput.value
      ) {
        setFieldError(
          confirmPasswordInput,
          confirmPasswordErrorEl,
          validateConfirmPassword()
        );
      }
    }
  );


  confirmPasswordInput.addEventListener(
    "input",
    function () {

      if (
        confirmPasswordInput.getAttribute(
          "aria-invalid"
        ) === "true"
      ) {
        setFieldError(
          confirmPasswordInput,
          confirmPasswordErrorEl,
          ""
        );
      }
    }
  );


  termsInput.addEventListener(
    "change",
    function () {

      if (termsInput.checked) {
        setTermsError("");
      }
    }
  );


  /* ---------- Reset ---------- */

  function resetDemo() {

    successPanel.hidden = true;

    form.hidden = false;

    form.reset();

    clearAllErrors();

    updatePasswordStrength();

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
    resetDemo
  );


  /* ---------- Success ---------- */

  function showSuccess() {

    if (!successPanel.hidden) {
      return;
    }

    form.hidden = true;

    successPanel.hidden = false;

    resetDemoBtn.focus();
  }


  /* ---------- Form submission ---------- */

  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      /* Duplicate submission guard */

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


      /* Validate */

      const usernameError =
        validateUsername(
          usernameInput.value
        );

      const emailError =
        validateEmail(
          emailInput.value
        );

      const passwordError =
        validatePassword(
          passwordInput.value
        );

      const confirmPasswordError =
        validateConfirmPassword();

      const termsError =
        validateTerms();


      setFieldError(
        usernameInput,
        usernameErrorEl,
        usernameError
      );

      setFieldError(
        emailInput,
        emailErrorEl,
        emailError
      );

      setFieldError(
        passwordInput,
        passwordErrorEl,
        passwordError
      );

      setFieldError(
        confirmPasswordInput,
        confirmPasswordErrorEl,
        confirmPasswordError
      );

      setTermsError(
        termsError
      );


      /* Stop on validation failure */

      if (
        usernameError ||
        emailError ||
        passwordError ||
        confirmPasswordError ||
        termsError
      ) {

        setStatus(
          "Please correct the highlighted fields.",
          "error"
        );


        if (usernameError) {
          usernameInput.focus();
        } else if (emailError) {
          emailInput.focus();
        } else if (passwordError) {
          passwordInput.focus();
        } else if (confirmPasswordError) {
          confirmPasswordInput.focus();
        } else {
          termsInput.focus();
        }

        return;
      }


      /* ---------- Demo request ---------- */

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
        "Creating your account…",
        "loading"
      );


      /*
       * DEMO ONLY.
       *
       * No credentials are sent anywhere.
       * No account is created.
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
           * Demonstration success.
           *
           * A production application should
           * only show success after the backend
           * successfully creates the account.
           */

          setStatus(
            "Account created successfully.",
            "success"
          );

          showSuccess();

        },
        DEMO_LATENCY_MS
      );

    }
  );


  /* ---------- Initial state ---------- */

  updatePasswordStrength();

  usernameInput.focus();

})();