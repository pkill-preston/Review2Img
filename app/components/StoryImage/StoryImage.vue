<script setup lang="ts">
interface User {
  name: string
  picture: string
}

interface Review {
  text: string
  liked: boolean
  rating: number
}

interface Film {
  name: string
  releaseDate: string
  poster: string
  page: string
  director: string
}

interface Props {
  user: User
  review: Review
  film: Film
  showHeart: boolean
}

const props = defineProps<Props>()

function getStarState(index: number, rating: number) {
  if (rating >= index + 1) return 'full'
  if (rating >= index + 0.5) return 'half'
  return 'empty'
}
</script>

<template>
	<div
		class="relative w-full w-[1080px] h-[1920px] aspect-[9/16] overflow-hidden pt-[160px] pb-[200px] items-center rounded-2xl shadow-2xl flex flex-col"
	>
		<div
			class="absolute inset-0 bg-cover bg-center blur-xl brightness-50 scale-110"
			:style="{ backgroundImage: `url(${film.poster})` }"
		/>

		<div
			class="relative w-[920px] max-h-[1560px] gap-4 z-10 flex h-full flex-col items-center justify-center text-white"
		>
			<div
				class="shadow-xl ring-1 ring-black/40 rounded-lg overflow-hidden"
			>
				<img
					:src="film.poster"
					:alt="film.name"
					class="w-64 sm:w-72 h-auto object-cover"
					loading="lazy"
				/>
			</div>
			<div class="flex gap-2">
				<h2
				class="text-3xl sm:text-4xl font-bold text-center leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
			>
				{{ film.name }}
				<span class="text-2xl opacity-90 font-normal">
					({{ film.releaseDate }})
				</span>
			</h2>
			</div>

			<p class="text-lg sm:text-xl text-center opacity-90 drop-shadow">
				{{ film.director }}
			</p>

			<blockquote
				class="text-xl sm:text-2xl italic font-medium text-center leading-relaxed drop-shadow-lg max-w-[90%]"
			>
				“{{ review.text }}”
			</blockquote>

			<div class="flex items-center gap-4">
				<div class="flex gap-2">
					<StarRate
					v-for="(_, index) in 5"
					:key="index"
					:filled="getStarState(index, review.rating) === 'full'"
					:half="getStarState(index, review.rating) === 'half'"
				/>
				</div>

				<IsLiked
					class=" text-5xl text-red-500 drop-shadow-lg"
					title="Liked"
          			:liked="review.liked"
				>
				</IsLiked>
			</div>

			<div class="flex items-center gap-3 text-base drop-shadow">
				<img
					:src="user.picture"
					:alt="user.name"
					class="w-10 h-10 rounded-full border-2 border-white/80 object-cover shadow-md"
					loading="lazy"
				/>
				<div class="flex flex-col">
					<span class="font-medium font-sans tracking-wide">
						{{ user.name }}
					</span>
					<span class="text-sm opacity-80 font-sans">made with Storyloggd</span>
				</div>
			</div>
		</div>
	</div>
</template>
