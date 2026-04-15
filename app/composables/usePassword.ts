// composables/usePassword.ts
export function usePassword() {
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  function togglePassword() {
    showPassword.value = !showPassword.value;
  }

  function toggleConfirmPassword() {
    showConfirmPassword.value = !showConfirmPassword.value;
  }

  function checkStrength(str: string) {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /\d/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(str),
      text: req.text,
    }));
  }

  const strength = (password: Ref<string>) =>
    computed(() => checkStrength(password.value));

  const score = (password: Ref<string>) =>
    computed(
      () => checkStrength(password.value).filter((req) => req.met).length,
    );

  const color = (score: Ref<number>) =>
    computed(() => {
      if (score.value === 0) return "neutral";
      if (score.value <= 1) return "error";
      if (score.value <= 2) return "warning";
      if (score.value === 3) return "warning";
      return "success";
    });

  const text = (score: Ref<number>) =>
    computed(() => {
      if (score.value === 0) return "Enter a password";
      if (score.value <= 2) return "Weak password";
      if (score.value === 3) return "Medium password";
      return "Strong password";
    });

  return {
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    strength,
    score,
    color,
    text,
  };
}
