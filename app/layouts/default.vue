<template>
	<div>
		<div class="w-full flex justify-between items-center p-4 border mb-6">
      <NuxtLink to="/"><p class="text-xl">StoryLoggd</p></NuxtLink>
			<div><ThemeToggler/></div>
		</div>
		<slot />
	</div>
</template>
