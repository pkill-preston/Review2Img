<template>
	<span class="loader"></span>
</template>

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


.loader {
  --loader-main: oklch(0.7899 0.2343 147.0684);
  --loader-dim:  oklch(0.7899 0.2343 147.0684 / 0.25);
}


@media (prefers-color-scheme: dark) {
  .loader {
    --loader-main: oklch(0.82 0.2343 147.0684);
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
