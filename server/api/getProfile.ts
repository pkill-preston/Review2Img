import * as cheerio from "cheerio";
import {parseStringPromise} from "xml2js";

const fetchHTML = async (url: string): Promise<string> => {
	const res = await fetch(url, {
		headers: {
			"User-Agent":
				"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
			Accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.9",
			Referer: "https://letterboxd.com/",
			Connection: "keep-alive"
		}
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch ${url} - Status: ${res.status}`);
	}

	return await res.text();
};

const getProfile = async (username: string) => {
	const url = `https://letterboxd.com/${username}/rss/`;
	const xml = await fetchHTML(url);

	const parsed = await parseStringPromise(xml);

	const items = parsed?.rss?.channel?.[0]?.item ?? [];

	return items.slice(0, 5).map((item: any) => {
		const descriptionHTML = item.description?.[0] || "";

		const desc$ = cheerio.load(descriptionHTML);
		const image = desc$("img").first().attr("src") || null;

		return {
			film: item["letterboxd:filmTitle"]?.[0] || "",
			link: item.link?.[0] || "",
			image
		};
	});
};

export default defineEventHandler(async (event) => {
	const {username} = getQuery(event);

	if (!username || typeof username !== "string") {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing or invalid 'username' query parameter"
		});
	}

	try {
		return await getProfile(username);
	} catch (error: any) {
		console.error(`Letterboxd RSS error for user ${username}:`, error);

		throw createError({
			statusCode: 502,
			statusMessage: `Failed to fetch Letterboxd profile for "${username}"`
		});
	}
});
