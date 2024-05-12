import puppeteer from 'puppeteer';

const reviewPage = 'https://letterboxd.com/filledwithblues/film/raging-bull/';

async function getReviewInfo(){
  const browser = await puppeteer.launch({headless: true})

  const page = await browser.newPage();

  await page.goto(reviewPage);

  const reviewBody = await page.evaluate(() => {
    const userName = document.querySelector('.person-summary > h1 > a').innerText;
    const title = document.querySelector('.film-title-wrapper').innerText;
    const titleUrl = document.querySelector('.film-title-wrapper').children[0].href
    let rating = document.querySelector('.rating').innerText
    const review = document.querySelector('.col-12.review > div > div > div > p').innerText;

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
      },
      rating: rating,
      review: review
    }
  }
)
  await page.goto(`https://letterboxd.com/${reviewBody.userName}/`);
  const profilePicture = await page.evaluate(() => {
    return document.querySelector('.profile-avatar > span > img').src
  })

  reviewBody.user.profilePicture = profilePicture
  return reviewBody
  page.close()
}
let reviewInfo = await getReviewInfo()

console.log(reviewInfo)
