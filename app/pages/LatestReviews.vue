<script setup lang="ts">
import Skeleton from '~/components/ui/skeleton/Skeleton.vue';
import Button from '~/components/ui/button/Button.vue';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner.vue';
import StoryImage from '~/components/StoryImage/StoryImage.vue';

const route = useRoute();

const loading = ref(true);
const reviews = ref<any[]>([]);
const cardLoading = ref(false);
const error = ref<string | null>(null);
const data = ref<any>(null);

onMounted(async () => {
  try {
    const res = await fetch(`/api/getProfile?username=${route.query.username}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    reviews.value = await res.json();
  } catch (err: any) {
    error.value = err instanceof Error ? err.message : 'Failed to load reviews';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const getReview = async (url: string) => {
  cardLoading.value = true;
  error.value = null;
  data.value = null;

  try {
    const res = await fetch(`/api/getReview?reviewURL=${encodeURIComponent(url)}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    data.value = await res.json();
  } catch (err: any) {
    error.value = err instanceof Error ? err.message : 'Failed to load review details';
    console.error(err);
  } finally {
    cardLoading.value = false;
  }
};

const exportImage = async () => {
  if (!data.value) return;

  try {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.value?.film?.name,
        year: data.value?.film?.releaseDate,
        director: data.value?.film?.director,
        review: data.value?.review?.text,
        poster: data.value?.film?.poster,
        rating: data.value?.review?.rating,
        liked: data.value?.review?.liked,
        user: data.value?.user,
      }),
    });

    if (!res.ok) throw new Error('Export failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.value?.film?.name || 'review'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (err: any) {
    console.error('Export error:', err);
  }
};
</script>

<template>
	<div class="w-full flex px-4 justify-center items-center min-h-screen py-8">
		<div class="flex flex-col max-w-[720px] gap-8 w-full">
			<div>
				<p class="text-3xl font-semibold">
					Found you,
					<span class="text-primary">{{ route.query.username }}</span>
				</p>
				<p class="text-muted-foreground mt-1">
					Please select one of the following films to generate your review
				</p>
			</div>

			<div v-if="error" class="text-red-500 text-center py-4">
				{{ error }}
			</div>

			<div class="flex gap-6 flex-wrap justify-center md:justify-between">
				<div
					v-for="(item, index) in reviews"
					:key="index"
					class="w-full sm:w-[48%] md:w-[30%] flex flex-col gap-3"
				>
					<div
						class="aspect-[2/3] bg-black border rounded-xl overflow-hidden relative"
					>
						<Skeleton v-if="loading" class="w-full h-full" />
						<img
							v-else
							:src="item.image"
							:alt="item.film"
							class="w-full h-full object-cover"
						/>
					</div>

					<p class="font-medium text-center line-clamp-2 min-h-[2.5em]">
						{{ item.film }}
					</p>

					<Dialog>
						<DialogTrigger as-child>
							<Button
								@click="getReview(item.link)"
								class="w-full"
								size="lg"
								variant="default"
							>
								Generate Story
							</Button>
						</DialogTrigger>

						<DialogContent
							class="flex !max-w-[92vw] h-[92vh] p-0 overflow-hidden"
						>
							<div
								class="h-full w-full flex justify-center items-center bg-background"
							>
								<LoadingSpinner v-if="cardLoading" class="scale-125" />

								<div
									v-else
									class="flex flex-col items-center w-full max-h-[85vh] p-4 overflow-auto"
								>
									<div class="scale-[0.32] md:scale-[0.35] origin-top my-8">
										<StoryImage
											:user="data?.user"
											:review="data?.review"
											:film="data?.film"
											attribution="watched & reviewed by @filledwithblues"
											:show-heart="true"
										/>
									</div>

									<Button
										@click="exportImage"
										variant="default"
										size="lg"
										class="px-10 py-6 text-xl font-semibold"
									>
										Download Image
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
