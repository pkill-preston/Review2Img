import puppeteer, {Browser, Page} from "puppeteer-core";
import chromium from "@sparticuz/chromium";

interface User {
	name: string | null;
	picture: string | null;
}

interface Review {
	text: string;
	liked: boolean;
	rating: number | string;
}

interface Film {
	name: string | null;
	releaseDate: string | null;
	poster: string;
	page: string | null;
	director?: string | null;
}

interface ReviewData {
	user: User;
	review: Review;
	film: Film;
}

const getReviewInfo = async (url: string): Promise<ReviewData> => {
	let browser: Browser | null = null;

	try {
		browser = await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath(),
			headless: chromium.headless
		});

		const page: Page = await browser.newPage();
		await page.goto(url, {waitUntil: "domcontentloaded", timeout: 35000});

		const reviewBody = await page.evaluate((): ReviewData => {
			const userName =
				document.querySelector("a.name")?.textContent?.trim() ?? null;

			const userPicture =
				document
					.querySelector(".person-summary.-inline > a > img")
					?.getAttribute("src")
					?.replaceAll("-48", "-1000") ?? null;

			let reviewText =
				document.querySelector(".js-review-body > p")?.innerText?.trim() ?? "";

			const liked = !!document.querySelector(".glyph.inline-liked.-like");

			let ratingRaw =
				document.querySelector(".glyph.-rating > title")?.textContent ?? "";

			let rating: number | string = ratingRaw;

			if (ratingRaw.endsWith("½")) {
				rating = ratingRaw.length - 1 + 0.5;
			} else if (ratingRaw) {
				rating = ratingRaw.length;
			}

			if (reviewText.length >= 220) {
				reviewText = reviewText.slice(0, 220) + "...";
			}

			const topline = document.querySelector(".topline");
			const filmName = topline?.children[0]?.textContent?.trim() ?? null;
			const filmReleaseDate = topline?.children[1]?.textContent?.trim() ?? null;

			const filmPage =
				(topline?.children[0].children[0] as HTMLAnchorElement | undefined)
					?.href ?? null;

			const script = document.querySelector(
				'script[type="application/ld+json"]'
			);

			const jsonText = script?.textContent ?? "";
			const filmPosterMatch = jsonText.match(/"image"\s*:\s*"([^"]+)"/);

			let filmPoster = filmPosterMatch?.[1] ?? "";

			if (filmPoster) {
				filmPoster = filmPoster
					.replace(/-\d{3,4}(?=-crop\.jpg|$)/i, "-1500")
					.replace(/0-\d+-0-\d+(?=-crop)/i, "0-1000-0-1500")
					.replace(/-(\d{3})-/, "-1000-");
			}

			return {
				user: {name: userName, picture: userPicture},
				review: {text: reviewText, liked, rating},
				film: {
					name: filmName,
					releaseDate: filmReleaseDate,
					poster: filmPoster,
					page: filmPage
				}
			};
		});

		let director: string | null = null;

		if (reviewBody.film.page) {
			await page.goto(reviewBody.film.page, {
				waitUntil: "domcontentloaded"
			});

			director = await page.evaluate(() => {
				return (
					document
						.querySelector(".contributorlist")
						?.children[0]?.textContent?.trim() ?? null
				);
			});
		}

		await browser.close();

		return {
			...reviewBody,
			film: {
				...reviewBody.film,
				director
			}
		};
	} catch (err) {
		if (browser) await browser.close().catch(() => {});
		throw new Error(
			`Failed to scrape review: ${
				err instanceof Error ? err.message : String(err)
			}`
		);
	}
};

export default defineEventHandler(async (event) => {
	const reviewURL = getQuery(event).reviewURL as string | undefined;

	if (!reviewURL) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing reviewURL query parameter"
		});
	}

	const data = await getReviewInfo(reviewURL);
	return data;
});
