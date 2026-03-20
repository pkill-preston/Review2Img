<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Input from './components/ui/input/Input.vue'
import Button from './components/ui/button/Button.vue'

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

const getReview = async (url: string) => {
  loading.value = true
  error.value = null
  data.value = null

  try {
    const res = await fetch(`/api/scrap?reviewURL=${url}`)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`)
    }

    data.value = await res.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error"
  } finally {
    loading.value = false
  }
}

const exportImage = async () => {
  const res = await fetch("/api/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.value?.film.name,
      year: data.value?.film.releaseDate,
      director:data.value?.film.director,
      review: data.value?.review.text,
      poster: data.value?.film.poster,
      rating: data.value?.review.rating,
      liked: data.value?.review.liked,
      user: data.value?.user,
    }),
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "story.png";
  a.click();
};

const url = ref("")
</script>

<template>
	<div class="flex flex-col justify-center items-center gap-4">
		<div class="flex justiy-center items-center flex-col gap-4">
			<p>Welcome to Storyboxd</p>
			<p>Enter your review link to generate a story</p>
			<div class="flex gap-4">
				<Input v-model="url"></Input>
				<Button @click="getReview(url)">Submit</Button>
			</div>
		</div>
		<div class="w-auto h-[576px] overflow-hidden">
			<div v-if="loading" class="text-center text-gray-500">
				Loading review...
			</div>

			<div v-else-if="error" class="text-center text-red-600">
				Failed to load: {{ error }}
			</div>

			<div class="scale-[0.3] origin-top" v-else-if="data">
				<StoryImage
					:user="data.user"
					:review="data.review"
					:film="data.film"
					attribution="watched & reviewed by @filledwithblues"
					:show-heart="true"
				/>
			</div>
		</div>
		<Button v-if="data" @click="exportImage(data.film.name,url)">
			Download
		</Button>
	</div>
</template>
