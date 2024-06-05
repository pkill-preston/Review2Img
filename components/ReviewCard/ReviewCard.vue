<template>
  <div ref="card" class="card container">
    <div class="poster half">
      <div class="image">
        <img ref="poster" class="movie" :src=moviePoster alt="movie poster" srcset="">
      </div>
    </div>
    <div class="review half">
      <div class="film info">
        <p class="title">{{ title }}</p>
        <p class="director">{{ director }}<span style="color: white;">, {{ year }}</span></p>
      </div>
      <div class="review container">
        <div class="quotes container">
          <p class="review text">{{ review }}</p>
          <div class="quotes box">
            <div class="upper quote">„</div>
            <div class="lower quote">“</div>
          </div>
        </div>
      </div>
      <div class="user">
        <div class="profile">
          <img ref="avatar" class="user icon" :src=profilePicture alt="user icon">
          <p class="name">{{ user }}</p>
        </div>
        <div class="rating">
          <p class="value">{{ rating }}</p>
          <img class="star" src="public/Vector.svg" alt="a star icon">
        </div>
      </div>
    </div>
  </div>
  <div class="options">
    <div class="submit">

    </div>
    <div class="share">

    </div>
    <button class="button" size="lg" @click="downloadImg()" label="Download">Download</button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  props: {
    title: {
      type: String,
      default: "Movie Title",
    },
    moviePoster: {
      type: String,
      default: "/_nuxt/public/poster_placeholder.png",
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    director: {
      type: String,
      default: "Foo",
    },
    user: {
      type: String,
      default: "Username",
    },
    profilePicture: {
      type: String,
      default: "/_nuxt/public/placeholder.webp",
    },
    rating: {
      type: Number,
      default: 1,
    },
    review: {
      type: String,
      default: "Certainly one of the films ever created",
    },
  },
  setup() {
  },
  methods: {
    cloneReviewCanvas(element) {
      var clone = element.cloneNode(true);
      var style = clone.style;
      style.color = 'white';
      style.position = "relative";
      style.top = window.innerHeight + "px";
      style.left = 0;
      document.body.appendChild(clone);
      return clone;
    },
    async downloadImg() {
      const card = document.querySelector('.card.container')
      window.scrollTo(0, 0);
      let clone = this.cloneReviewCanvas(card);
      html2canvas(clone, { scrollY: window.scrollY }).then((canvas) => {
        let dataURL = canvas.toDataURL("image/png", 1.0);
        let link = document.createElement("a");
        link.href = dataURL;
        link.download = 'review.png';
        document.body.removeChild(clone);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
    },
  }
}
</script>

<style lang="css" scoped>
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



.button {
  padding: 12px 8px;
  border-radius: 12px;
  background: #00E054;
  border: none;
  color: white;
  font-size: 1em;
  cursor: pointer;
}

.card.container {
  display: flex;
  height: 45rem;
  min-height: 45rem;
  max-height: 45rem;
  min-width: 45rem;
  max-width: 45rem;
  background: #202830;
}

.half {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
}

.poster {
  justify-content: flex-end;
  background: url();
  object-fit: contain;
}

.image {
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative
}

.movie {
  max-width: 150%;
  width: 150%;
  height: 100%;
}



.text {
  text-align: center;
}

.film.info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 1rem 1rem 0 1rem;
  height: 10rem;
  border-bottom: 1px solid white;
}

.title {
  margin: 0;
  font-size: 1.75em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.director {
  font-size: 1.5em;
  font-weight: 100;
  color: #40BCF4;
}

.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  color: #00E054;
}

.rating {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.review.container {
  height: 100%;
  display: flex;
  align-items: center;
  line-height: 3rem;
  position: relative;
}

.quotes.container {
  position: relative;
}

.quotes.box {
  position: absolute;
  height: 100%;
  max-width: 360px;
  width: 360px;
  display: flex;
  top: 0;
  flex-direction: column;
  justify-content: space-between;
}

.quote {
  width: 100%;
  font-size: 2.5em;
  font-family: "Neuton", serif;
  padding-bottom: 10px;
}

.upper.quote {
  position: absolute;
  top: -40px;
  padding-left: 1rem;
}

.lower.quote {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  bottom: -40px;
  right: 16px;
}

.review.text {
  font-size: 1.4em;
  font-family: "Xanh Mono", monospace;
  font-weight: 400;
  font-style: normal;
  font-weight: 200;
  max-height: 28rem;
  font-style: normal;
  word-spacing: 0px;
  overflow: hidden;
  padding: 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 9;
  -webkit-box-orient: vertical;
}

.user {
  border-top: 1px solid white;
  height: 100%;
  max-height: 80px;
  padding: 0 1rem;
}

.profile {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon {
  width: 50px;
  height: 50px !important;
  border: none;
  padding: 0;
  border-radius: 8px;
}

.icon.clone {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 8px;
}

.star {
  width: 50px;
  height: 50px;
}

.name {
  font-size: 1.5em;
  line-height: 80px;
}

.value {
  font-size: 1.5em;
}

.options {
  padding: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>