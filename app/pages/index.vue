<script setup lang="ts">
import { ref } from 'vue'
import Input from '../components/ui/input/Input.vue'
import Button from '../components/ui/button/Button.vue'

interface ReviewData {
  user: {
    name: string
    picture: string
  }
  review: {
    text: string
    liked: boolean
    rating: number
  }
  film: {
    name: string
    releaseDate: string
    poster: string
    page: string
    director: string
  }
}

const data = ref<ReviewData | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)
const username = ref("")

const getUserProfile = async (username: string) => {
  const reviews = "https://letterboxd.com/" + username + "/reviews/"
}
</script>

<template>
	<div class="flex flex-col justify-center px-4 items-center gap-4">
		<div
			class="flex md:w-full  max-w-[720px] text-center text-xl justiy-center items-center flex-col gap-4"
		>
			<p>Welcome to StoryLoggd !</p>
			<p>
				Enter your username to retrieve your last 5 reviews or your review url
			</p>
			<div class="flex text-lg items-center justify-center w-full md:flex-row flex-col gap-4">
				<Input
					@keydown.enter="getUserProfile(username)"
					placeholder="@username"
					class="max-w-[16rem] shadow-lg p-6 border-2"
					v-model="username"
				></Input>
				<NuxtLink :to="`/latestreviews?username=${username}`">
					<Button
						class="w-[16rem] p-6"
						size="icon-lg"
						@click="getUserProfile(username)"
					>
						Submit
					</Button>
				</NuxtLink>
			</div>
		</div>
		<div class="w-auto h-[576px] overflow-hidden">
			<div v-if="loading" class="text-center text-gray-500">
				Loading review...
			</div>

			<div v-else-if="error" class="text-center text-red-600">
				Failed to load: {{ error }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
