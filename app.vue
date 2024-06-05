<template>
  <div class="frame">
    <div class="function">
      <div class="left">
        <p class="title">Review2Image</p>
        <p class="title">Insert your review link to generate a picture with it</p>
        <div class="example container">
          <p class="tutorial">you can get your link by clicking here on the review</p>
        </div>
        <input type="text" class="linkField" placeholder="Ex: https://letterboxd.com/user/film/city-lights/"
          name="getReview" ref="getReview">
        <button class="button" label="Submit" size="lg" @click="getInputValue()">Submit</button>
      </div>
      <div class="right">
        <div v-if="loading != false" class="loading">
          <orbit-spinner :animation-duration="500" :size="50" color="#ffffff" />
        </div>
        <ReviewCard v-if="this.getWindowMeasure().width > 1280" key="1" class="card" :review="info?.review"
          :title="info?.title.name" :year="info?.title.year" :moviePoster="info?.title.moviePoster"
          :director="info?.title.director" :user="info?.user.userName" :profilePicture="info?.user.profilePicture"
          :rating="info?.rating" ref="card" />
      </div>
    </div>
    <FooterBar />
  </div>
</template>

<script lang="ts">
import { OrbitSpinner } from 'epic-spinners';

export default {
  components: {
    OrbitSpinner,
  },
  data() {
    return {
      input: '',
      info: {
        "user": {
          "userName": "Username",
          "profilePicture": "/_nuxt/public/placeholder.webp"
        },
        "title": {
          "name": "Movie Title",
          "url": "",
          "director": "Foo",
          "year": new Date().getFullYear(),
          "moviePoster": "/_nuxt/public/poster_placeholder.png"
        },
        "rating": 1,
        "review": "Certainly one of the films ever created"
      },
      loading: false,
    }
  },
  methods: {
    getWindowMeasure() {
      return {
        height: window.innerHeight,
        width: window.innerWidth
      }
    },
    async operation() {
      const info = await this.getInputValue()
      await this.getImage()
    },
    async getImage() {
      let info = this.$data.info
      const bases = await $fetch('/api/base64', {
        method: 'POST',
        body: {
          "key": [info.title.moviePoster, info.user.profilePicture]
        }
      })
      info.title.moviePoster = `data:image/png;base64,${bases[0]}`
      info.user.profilePicture = `data:image/png;base64,${bases[1]}`
    },
    async getInputValue() {
      this.loading = !this.loading
      const reviewURL = this.$refs.getReview.value
      const info = await $fetch('/api/scrap', {
        query: {
          reviewURL: reviewURL,
        }
      })
      this.info = info
      await this.getImage()
      this.$forceUpdate();
      this.loading = !this.loading
    }
  },
}
</script>
<style>
body {
  display: flex;
  margin: 0;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
}

#__nuxt {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Neuton:ital,wght@0,200;0,300;0,400;0,700;0,800;1,400&family=Xanh+Mono:ital@0;1&display=swap');

* {
  font-family: "Manrope", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

p,
h1,
h2,
h3,
h4 {
  margin: 0;
  padding: 0;
}

* {
  color: white;
  padding: 0;
}

.function {
  padding: 1.5rem;
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}

.frame {
  background: #14181c url(https://s.ltrbxd.com/static/img/content-bg.0d9a0f0f.png) 0 -1px repeat-x;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
}

.button {
  padding: 12px 8px;
  border-radius: 12px;
  background: #00E054;
  border: none;
  color: white;
  font-size: 1em;
  cursor: pointer;
}

.left {
  background-color: #456;
  padding: 1rem;
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: 1rem
}

.example.container {
  display: flex;
  width: 500px;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 2rem;
  text-align: center;
}

.tutorial {
  max-width: 200px;
  text-align: center;
  font-size: 2rem;
}

.linkField {
  font-size: 1em;
  width: 90%;
  height: 40px;
  border: 1px solid black;
  border-radius: 8px;
  color: black;
  padding: 6px;
}

.right {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  align-items: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  z-index: 9;
  background: rgb(0 0 0 / 40%);
  width: 100%;
}
</style>