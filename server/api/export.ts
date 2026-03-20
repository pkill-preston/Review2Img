import satori from "satori";
import {Resvg} from "@resvg/resvg-js";
import {readFile} from "node:fs/promises";
import {join} from "node:path";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const {title, year, director, review, poster, rating, liked, user} = body;

	const getImageBase64 = async (url: string) => {
		const res = await fetch(url);
		const buffer = await res.arrayBuffer();
		return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
	};


	const [posterBase64, avatarBase64, font] = await Promise.all([
		getImageBase64(poster),
		getImageBase64(user.picture),
		readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf"))
	]);

	const numericRating = Number(rating) || 0;

	const createStar = (type: "full" | "half" | "empty") => {
		const starPath =
			"M1.16235 8.64292C0.849103 8.35324 1.01926 7.82955 1.44296 7.77931L7.44653 7.06722C7.61922 7.04674 7.76921 6.93831 7.84204 6.7804L10.3743 1.29061C10.553 0.903178 11.1038 0.903104 11.2825 1.29054L13.8147 6.78029C13.8875 6.93819 14.0365 7.04692 14.2092 7.0674L20.2131 7.77931C20.6368 7.82955 20.8065 8.35339 20.4933 8.64308L16.0552 12.7481C15.9275 12.8661 15.8707 13.0419 15.9045 13.2124L17.0824 19.1421C17.1656 19.5606 16.7202 19.8848 16.3479 19.6764L11.0725 16.7228C10.9208 16.6378 10.7365 16.6382 10.5847 16.7232L5.30883 19.6757C4.93652 19.8841 4.49033 19.5606 4.57349 19.1421L5.75154 13.2128C5.78543 13.0422 5.72873 12.8661 5.60106 12.748L1.16235 8.64292Z";

		const id = `half-${Math.random()}`;

		return {
			type: "svg",
			props: {
				width: 40,
				height: 38,
				viewBox: "0 0 22 21",
				children: [
					{
						type: "path",
						props: {
							d: starPath,
							stroke: "white",
							strokeWidth: 2,
							fill: "none"
						}
					},
					...(type === "full"
						? [{type: "path", props: {d: starPath, fill: "white"}}]
						: []),
					...(type === "half"
						? [
								{
									type: "defs",
									props: {
										children: {
											type: "clipPath",
											props: {
												id,
												children: {
													type: "rect",
													props: {x: 0, y: 0, width: 11, height: 21}
												}
											}
										}
									}
								},
								{
									type: "path",
									props: {
										d: starPath,
										fill: "white",
										clipPath: `url(#${id})`
									}
								}
							]
						: [])
				]
			}
		};
	};

	const buildStars = (rating: number) => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (rating >= i + 1) stars.push(createStar("full"));
			else if (rating >= i + 0.5) stars.push(createStar("half"));
			else stars.push(createStar("empty"));
		}
		return stars;
	};

	const createHeart = (liked: boolean) => ({
		type: "svg",
		props: {
			width: 36,
			height: 36,
			viewBox: "0 0 24 24",
			children: {
				type: "path",
				props: {
					d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.61C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
					fill: liked ? "white" : "none",
					stroke: "white",
					strokeWidth: 2
				}
			}
		}
	});

	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					width: 1080,
					height: 1920,
					position: "relative",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#000",
					color: "#fff",
					fontFamily: "Inter"
				},
				children: [
					{
						type: "img",
						props: {
							src: posterBase64,
							style: {
								position: "absolute",
								width: "100%",
								height: "100%",
								objectFit: "cover",
								opacity: 0.25
							}
						}
					},
					{
						type: "div",
						props: {
							style: {
								position: "absolute",
								width: "100%",
								height: "100%",
								background:
									"linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4))"
							}
						}
					},
					{
						type: "div",
						props: {
							style: {
								width: 920,
								height: 1560,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center"
							},
							children: [
								{
									type: "img",
									props: {
										src: posterBase64,
										style: {
											width: 320,
											height: 480,
											borderRadius: 16,
											marginBottom: 40
										}
									}
								},
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											alignItems: "baseline",
											gap: 12,
											marginBottom: 10,
											flexWrap: "wrap",
											justifyContent: "center"
										},
										children: [
											{
												type: "span",
												props: {
													style: {fontSize: 48, fontWeight: 700},
													children: title
												}
											},
											{
												type: "span",
												props: {
													style: {fontSize: 36, opacity: 0.8},
													children: `(${year})`
												}
											}
										]
									}
								},
								{
									type: "div",
									props: {
										style: {
											fontSize: 32,
											opacity: 0.85,
											marginBottom: 30
										},
										children: director
									}
								},
								{
									type: "div",
									props: {
										style: {
											fontSize: 32,
											opacity: 0.9,
											marginBottom: 30,
											padding: "0 40px",
											display: "flex",
											textAlign: "center",
											flexDirection: "column",
											gap: 8
										},
										children: review.split("\n").map((line: string) => ({
											type: "span",
											props: {children: line}
										}))
									}
								},
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 12,
											marginBottom: 40
										},
										children: [...buildStars(numericRating), createHeart(liked)]
									}
								},
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											alignItems: "center",
											gap: 12
										},
										children: [
											{
												type: "img",
												props: {
													src: avatarBase64,
													style: {
														width: 100,
														height: 100,
														borderRadius: "25%"
													}
												}
											},
											{
												type: "div",
												props: {
													style: {
														display: "flex",
														flexDirection: "column"
													},
													children: [
														{
															type: "span",
															props: {
																style: {fontSize: 32},
																children: user.name
															}
														},
														{
															type: "span",
															props: {
																style: {
																	fontSize: 26,
																	opacity: 0.7
																},
																children: "made with Storyboxd"
															}
														}
													]
												}
											}
										]
									}
								}
							]
						}
					}
				]
			}
		},
		{
			width: 1080,
			height: 1920,
			fonts: [
				{
					name: "Inter",
					data: font,
					weight: 400
				}
			]
		}
	);

	const resvg = new Resvg(svg);
	const png = resvg.render();

	return new Response(png.asPng(), {
		headers: {"Content-Type": "image/png"}
	});
});
