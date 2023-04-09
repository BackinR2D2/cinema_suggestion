const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeData(options) {
	try {
		/*
        
            options = {
                title_type: tv_movie / tv_series,mini_series
                genres: history / action / etc
                release_date: '2001'
                user_rating: '7.0,10.0'
            }

			{
				media_types: [ 'tv_series', 'music_video' ],
				genres: [ 'comedy' ],
				release_date: '2003'
			}

        */
		const titleTypesString = options.media_types.join(',');
		const genresString = options.genres.join(',');

		const URL = `https://www.imdb.com/search/title/?title_type=${titleTypesString}&user_rating=7.0,10.0&genres=${genresString}&release_date=${options.release_date}&count=100`;
		const { data } = await axios.get(URL);
		const $ = cheerio.load(data);
		const listBody = $(
			'#main > div > div.lister.list.detail.sub-list > div'
		).children();
		const queryData = [];
		listBody.map((listElement) => {
			const elementTitle = $(listBody[listElement])
				.find('.lister-item-content > h3.lister-item-header > a')
				.text();
			const elementLink = $(listBody[listElement])
				.find('.lister-item-content > h3.lister-item-header > a')
				.attr('href');
			let elementPoster = $(listBody[listElement])
				.find('div.lister-item-image > a > img')
				.attr('loadlate');
			const elementRating = $(listBody[listElement])
				.find('.lister-item-content > .ratings-bar > div > strong')
				.text();
			const elementDuration = $(listBody[listElement])
				.find('.lister-item-content > p:nth-child(2) > .runtime')
				.text();
			const elementGenres = $(listBody[listElement])
				.find('.lister-item-content > p:nth-child(2) > .genre')
				.text();
			const elementDescription = $(listBody[listElement])
				.find('.lister-item-content > p:nth-child(4)')
				.text();

			const hasDirectorInformation = $(listBody[listElement])
				.find('.lister-item-content >  p:nth-child(5)')
				.text()
				.includes('Director:');

			let elementDirector = null;
			let elementDirectorInformation = null;

			if (hasDirectorInformation) {
				elementDirector = $(listBody[listElement])
					.find('.lister-item-content >  p:nth-child(5) > a:first')
					.text();
				elementDirectorInformation = $(listBody[listElement])
					.find('.lister-item-content >  p:nth-child(5) > a:first')
					.attr('href');
			}

			elementPoster = elementPoster.replaceAll('67', '360');
			elementPoster = elementPoster.replaceAll('98', '0');

			const extractedData = {
				elementTitle,
				elementLink,
				elementPoster,
				elementRating,
				elementDuration,
				elementGenres,
				elementDescription,
				elementDirector,
				elementDirectorInformation,
			};

			Object.entries(extractedData).forEach(([key, value]) => {
				extractedData[key] = value && value.trim();
			});
			queryData.push(extractedData);
		});

		return queryData;
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = scrapeData;
