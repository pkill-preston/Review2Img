import * as cheerio from "cheerio";

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

const fetchHTML = async (url: string): Promise<string> => {
	const res = await fetch(url, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
		}
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch ${url}: ${res.status}`);
	}

	return await res.text();
};

const getReviewInfo = async (url: string): Promise<ReviewData> => {
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

	const totalStart = performance.now();

	const html = await measure("fetch_review", () => fetchHTML(url));

	const $ = await measure("parse_review_html", async () => cheerio.load(html));

	const userName = $("a.name").text().trim() || null;

	const userPicture =
		$(".person-summary.-inline > a > img")
			.attr("src")
			?.replaceAll("-48", "-1000") ?? null;

	let reviewText = $(".js-review-body > p").text().trim() || "";

	const liked = $(".glyph.inline-liked.-like").length > 0;

	const ratingRaw = $(".glyph.-rating > title").text() || "";

	let rating: number | string = "";

	if (ratingRaw) {
		rating = ratingRaw.includes("½")
			? ratingRaw.replace("½", "").length + 0.5
			: ratingRaw.length;
	}

	if (reviewText.length >= 220) {
		reviewText = reviewText.slice(0, 220) + "...";
	}

	const topline = $(".topline");

	const filmName = topline.children().eq(0).text().trim() || null;
	const filmReleaseDate = topline.children().eq(1).text().trim() || null;

	const rawFilmPage = topline.children().eq(0).find("a").attr("href") ?? null;

	const filmPage = rawFilmPage ? new URL(rawFilmPage, url).href : null;

	const jsonText = $('script[type="application/ld+json"]').html() ?? "";

	const filmPosterMatch = jsonText.match(/"image"\s*:\s*"([^"]+)"/);

	let filmPoster = filmPosterMatch?.[1] ?? "";

	if (filmPoster) {
		filmPoster = filmPoster
			.replace(/-\d{3,4}(?=-crop\.jpg|$)/i, "-1500")
			.replace(/0-\d+-0-\d+(?=-crop)/i, "0-1000-0-1500")
			.replace(/-(\d{3})-/, "-1000-");
	}

	let director: string | null = null;

	if (filmPage) {
		const filmHTML = await measure("fetch_film", () => fetchHTML(filmPage));

		const $$ = await measure("parse_film_html", async () =>
			cheerio.load(filmHTML)
		);

		director = $$(".contributorlist").children().first().text().trim() || null;
	}

	timings["total"] = performance.now() - totalStart;

	console.table(timings);

	return {
		user: {name: userName, picture: userPicture},
		review: {text: reviewText, liked, rating},
		film: {
			name: filmName,
			releaseDate: filmReleaseDate,
			poster: filmPoster,
			page: filmPage,
			director
		}
	};
};

export default defineEventHandler(async (event) => {
	const reviewURL = getQuery(event).reviewURL as string | undefined;

	if (!reviewURL) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing reviewURL query parameter"
		});
	}

	return await getReviewInfo(reviewURL);
});
