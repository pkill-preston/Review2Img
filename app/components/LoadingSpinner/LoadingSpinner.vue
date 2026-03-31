<template>
  <span class="loader"></span>
</template>

<script setup lang="ts">
// No script needed
</script>

<style scoped>
.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--loader-main);
  box-shadow:
    32px 0 var(--loader-main),
    -32px 0 var(--loader-main);
  position: relative;
  animation: flash 0.6s ease-in-out infinite alternate;
}

/* Base color variables using your OKLCH color */
.loader {
  --loader-main: oklch(0.7899 0.2343 147.0684);     /* Main bright color */
  --loader-dim:  oklch(0.7899 0.2343 147.0684 / 0.25); /* Dim version with transparency */
}

/* Optional: Dark theme adjustment (slightly brighter/different lightness for better visibility) */
@media (prefers-color-scheme: dark) {
  .loader {
    --loader-main: oklch(0.82 0.2343 147.0684);     /* Slightly lighter for dark backgrounds */
    --loader-dim:  oklch(0.82 0.2343 147.0684 / 0.28);
  }
}

@keyframes flash {
  0% {
    background-color: var(--loader-dim);
    box-shadow:
      32px 0 var(--loader-dim),
      -32px 0 var(--loader-main);
  }
  50% {
    background-color: var(--loader-main);
    box-shadow:
      32px 0 var(--loader-dim),
      -32px 0 var(--loader-dim);
  }
  100% {
    background-color: var(--loader-dim);
    box-shadow:
      32px 0 var(--loader-main),
      -32px 0 var(--loader-dim);
  }
}
</style>