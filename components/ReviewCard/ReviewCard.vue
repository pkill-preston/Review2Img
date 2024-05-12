<template>
  <div class="card container">
    <div class="poster half">
      <div class="image">
        <img class="movie"
          src="https://a.ltrbxd.com/resized/film-poster/1/6/5/3/0/16530-all-quiet-on-the-western-front-0-1000-0-1500-crop.jpg?v=bff4d496a1"
          alt="movie poster" srcset="">
        <div class="shadow">
          <p class="text title">All Quiet on the Western Front</p>
          <p class="text year">(2022)</p>
          <p class="text director">Edward Berger</p>
        </div>
      </div>
    </div>
    <div class="review half">
      <div class="review container">
        <div class="quotes container">
          <p class="review text">
            Lorem ipsum dolor sit amet. Non galisum voluptatem est accusamus debitis et ipsa iusto et quia accusantium
            sed saepe galisum non quis quod. Qui beatae inventore et nulla officiis id quae suscipit At cupiditate
            cupiditate est molestiae voluptas et placeat veasdasdlit.</p>
          <div class="quotes box">
            <div class="upper quote">„</div>
            <div class="lower quote">“</div>
          </div>
        </div>
      </div>
      <div class="user">
        <div class="profile">
          <img class="user icon"
            src="https://a.ltrbxd.com/resized/avatar/upload/6/8/9/2/1/0/4/shard/avtr-0-220-0-220-crop.jpg?v=d30fbd7c8c"
            alt="user icon">
          <p class="name">filledwithblues</p>
        </div>
        <div class="rating">
          <p class="value">5</p>
          <img class="star" src="public/Vector.svg" alt="a star icon">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {

    return {}
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Neuton:ital,wght@0,200;0,300;0,400;0,700;0,800;1,400&display=swap');

.card.container {
  display: flex;
  height: 45rem;
  min-height: 45rem;
  max-height: 45rem;
  min-width: 45rem;
  max-width: 45rem;
  background: #14181C;
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
  position: relative;
  height: 45rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.movie {
  display: flex;
  object-fit: cover;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.shadow {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 45%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
  padding: 0 1rem 2rem 1rem;
  justify-content: flex-end;
  align-items: center;
}

.text {
  text-align: center;
}

.title {
  font-size: 2.25em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.year {
  font-size: 1.5em;
}

.director {
  font-size: 2em
}

.review.half {
  padding: 0 1rem 0 1rem;
}

.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
}

.rating {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
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
  width: 100%;
  display: flex;
  top: 0;
  flex-direction: column;
  justify-content: space-between;
}

.quote {
  width: 100%;
  font-size: 2.5em;
  font-family: "Neuton", serif;
}

.upper.quote {
  position: absolute;
  top: -50px;
}

.lower.quote {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  bottom: -50px;
}

.review.text {
  font-size: 2.25em;
  font-family: "Neuton", serif;
  font-weight: 200;
  font-style: normal;
  word-spacing: 0px;
  font-size: 2.25em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 12;
  -webkit-box-orient: vertical;
}

.profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user.icon {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}

.name {
  font-size: 1.5em;
}

.value {
  font-size: 1.5em;
}
</style>