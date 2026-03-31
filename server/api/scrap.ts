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

let browserPromise: Promise<Browser> | null = null;

const getBrowser = async (): Promise<Browser> => {
	if (!browserPromise) {
		browserPromise = puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath(),
			headless: chromium.headless
		});
	}
	return browserPromise;
};

const setupPage = async (page: Page) => {
	await page.setRequestInterception(true);

	page.on("request", (req) => {
		const type = req.resourceType();

		if (["image", "font", "stylesheet", "media"].includes(type)) {
			req.abort();
		} else {
			req.continue();
		}
	});
};

const getReviewInfo = async (url: string): Promise<ReviewData> => {
	let page: Page | null = null;
	let filmPage: Page | null = null;

	const timings: Record<string, number> = {};

	const measure = async <T>(
		label: string,
		fn: () => Promise<T>
	): Promise<T> => {
		const start = performance.now();
		const result = await fn();
		timings[label] = performance.now() - start;
		return result;
	};

	try {
		const browser = await measure("browser_ready", () => getBrowser());

		page = await measure("new_page", () => browser.newPage());
		await setupPage(page);

		await measure("goto_review", () =>
			page!.goto(url, {
				waitUntil: "domcontentloaded",
				timeout: 35000
			})
		);

		const reviewBody = await measure("evaluate_review", () =>
			page!.evaluate((): ReviewData => {
				const userName =
					document.querySelector("a.name")?.textContent?.trim() ?? null;

				const userPicture =
					document
						.querySelector(".person-summary.-inline > a > img")
						?.getAttribute("src")
						?.replaceAll("-48", "-1000") ?? null;

				let reviewText =
					document.querySelector(".js-review-body > p")?.innerText?.trim() ??
					"";

				const liked = !!document.querySelector(".glyph.inline-liked.-like");

				const ratingRaw =
					document.querySelector(".glyph.-rating > title")?.textContent ?? "";

				let rating: number | string = "";

				if (ratingRaw) {
					rating = ratingRaw.includes("½")
						? ratingRaw.replace("½", "").length + 0.5
						: ratingRaw.length;
				}

				if (reviewText.length >= 220) {
					reviewText = reviewText.slice(0, 220) + "...";
				}

				const topline = document.querySelector(".topline");

				const filmName = topline?.children[0]?.textContent?.trim() ?? null;
				const filmReleaseDate =
					topline?.children[1]?.textContent?.trim() ?? null;

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
			})
		);

		let director: string | null = null;

		if (reviewBody.film.page) {
			filmPage = await measure("new_film_page", async () => {
				const p = await (await getBrowser()).newPage();
				await setupPage(p);
				return p;
			});

			await measure("goto_film", () =>
				filmPage!.goto(reviewBody.film.page!, {
					waitUntil: "domcontentloaded"
				})
			);

			director = await measure("evaluate_film", () =>
				filmPage!.evaluate(() => {
					return (
						document
							.querySelector(".contributorlist")
							?.children[0]?.textContent?.trim() ?? null
					);
				})
			);
		}

		await measure("close_pages", async () => {
			await page?.close();
			if (filmPage) await filmPage.close();
		});

		console.table(timings);

		return {
			...reviewBody,
			film: {
				...reviewBody.film,
				director
			}
		};
	} catch (err) {
		if (page) await page.close().catch(() => {});
		if (filmPage) await filmPage.close().catch(() => {});
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
