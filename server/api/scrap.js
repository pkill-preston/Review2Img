import puppeteer from 'puppeteer';

export default defineEventHandler(async (event) => {
  async function getReviewInfo(){
  const browser = await puppeteer.launch({
    headless: true
  })
  const page = await browser.newPage();
  await page.goto(getQuery(event).reviewURL,{waitUntil: 'domcontentloaded'});
  const reviewBody = await page.evaluate(() => {
    const userName = document.querySelector('.person-summary > h1 > a').innerText;
    const title = document.querySelector('.film-title-wrapper > a').innerText;
    const titleUrl = document.querySelector('.film-title-wrapper > a').href;
    let rating = document.querySelector('.rating').innerText;
    let review = document.querySelector('.col-12.review > div > div > div > p').innerText;
    let moviePosterLink = document.querySelector('script[type="application/ld+json"]').innerHTML.split('{')[4].split(":")
    let moviePoster = moviePosterLink[1]+':' + moviePosterLink[2]
    moviePoster = moviePoster.split(',')[0].replace('"',"")
    moviePoster = moviePoster.slice(0,-1)
    moviePoster = moviePoster.replace(new RegExp('-[1-9]{3}(.*?)', 'gm'),"-1500")
    moviePoster = moviePoster.replace(new RegExp('-([0-9]){3}-', 'm'),"-1000-")

    if(review.length >= 220){
      review = review.slice(0, 220) + '...'
    }

    if(rating[rating.length - 1] == '½'){
      rating = ''+rating.length - 1 + 0.5
    }else{
      rating = rating.length
    }

    return {
      user: {
        userName: userName,
      },
      title: {
        name: title,
        url: titleUrl,
        moviePoster: moviePoster,
      },
      rating: rating,
      review: review
    }
  }
)
  await page.goto(`${reviewBody.title.url}`,{waitUntil:'domcontentloaded'});
  const titleInfo = await page.evaluate(() => {
    const director = document.querySelector('.directorlist').innerText.split(',')[0]
    const year = document.querySelector('.releaseyear').innerText
    return{
      director: director,
      year: year
    }
  })

  reviewBody.title.director = titleInfo.director
  reviewBody.title.year = titleInfo.year
  await page.goto(`https://letterboxd.com/${getQuery(event).reviewURL.split('/')[3]}/`,{waitUntil: 'domcontentloaded'});
  const profilePicture = await page.evaluate(() => {
    return document.querySelector('.profile-avatar > span > img').src
  })
  reviewBody.user.profilePicture = profilePicture

  browser.close()

  return reviewBody
}
let reviewInfo = await getReviewInfo()

return reviewInfo

})


