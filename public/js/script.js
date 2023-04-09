const suggestionForm = document.querySelector('form.suggestionForm');
const formContainer = document.querySelector('.formContainer');
const genresContainer = document.querySelector('.genres');
const releaseDateInput = document.querySelector('.release_date > input');
const genres = [
	'Action',
	'Adventure',
	'Animation',
	'Biography',
	'Comedy',
	'Crime',
	'Documentary',
	'Drama',
	'Family',
	'Fantasy',
	'Film-Noir',
	'Game-Show',
	'History',
	'Horror',
	'Music',
	'Musical',
	'Mystery',
	'News',
	'Reality-TV',
	'Romance',
	'Sci-Fi',
	'Sport',
	'Talk-Show',
	'Thriller',
	'War',
	'Western',
];

genres.map((genre) => {
	const div = document.createElement('div');
	const lowerCaseGenre = genre.toLowerCase();
	div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${
					genre.includes('-')
						? lowerCaseGenre.replace('-', '_')
						: lowerCaseGenre
				}">
        <label class="form-check-label">
        ${genre}
        </label>`;
	div.classList.add('genre');
	genresContainer.appendChild(div);
});

releaseDateInput.setAttribute('max', new Date().getFullYear());

const shuffledTempList = (list) => {
	const isCompleted = list.every((element) => element.displayed);
	if (isCompleted) {
		return {
			status: 0,
			tempList: [],
		};
	}
	let randomIndex;
	const tempList = [];
	const notDisplayedElements = list.filter((el) => !el.displayed);
	if (notDisplayedElements.length < 5) {
		list.forEach((el) => (el.displayed = true));
		return {
			status: 2,
			tempList: notDisplayedElements,
		};
	}
	for (let i = 0; i < 5; i++) {
		randomIndex = Math.floor(Math.random() * list.length);
		while (list[randomIndex].displayed) {
			randomIndex = Math.floor(Math.random() * list.length);
		}
		tempList.push(list[randomIndex]);
		list[randomIndex].displayed = true;
	}
	return {
		status: 1,
		tempList,
	};
};

const restart = () => {
	window.location.href = '/html/index.html';
};

const validateEmail = (email) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

const modalHTML = `
<div class="modal-dialog modal-dialog-centered">
  <div class="modal-content">
	<div class="modal-header">
	  <h5 class="modal-title">Email</h5>
	  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	</div>
	<div class="modal-body">
	  <div class="mb-3">
		<label for="emailInput" class="form-label">Email address</label>
		<input type="email" class="form-control" id="emailInput" placeholder="example@gmail.com">
	  </div>
	</div>
	<div class="modal-footer">
	  <button type="button" class="btn btn-primary" id="sendEmailBtn">Send</button>
	</div>
  </div>
</div>
`;

const sendMail = (event, elementTitle) => {
	const elementData = suggestionList.find(
		(el) => el.elementTitle === elementTitle
	);
	const sendEmailBtn = document.getElementById('sendEmailBtn');

	const myModal = new bootstrap.Modal(document.getElementById('emailModal'));
	myModal.show();

	sendEmailBtn.addEventListener('click', async () => {
		try {
			const emailModalInput = document.querySelector('#emailInput');
			if (!emailModalInput.value) {
				alert('Enter a valid email address');
				return;
			}
			if (validateEmail(emailModalInput.value)) {
				const response = await fetch('/api/send-mail', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						element: elementData,
						userEmail: emailModalInput.value,
					}),
				});
				const data = await response.json();
				alert(data.message);
				myModal.hide();
				document.querySelector('.modal').remove();
				const modalDiv = document.createElement('div');
				modalDiv.classList.add('modal');
				modalDiv.setAttribute('tabindex', '-1');
				modalDiv.setAttribute('id', 'emailModal');
				modalDiv.innerHTML = modalHTML;
				document.body.append(modalDiv);
			} else {
				alert('Enter a valid email address');
			}
		} catch (error) {
			alert(error);
		}
	});
};

let suggestionList;

const callShuffledTempList = () => {
	const { tempList, status } = shuffledTempList(suggestionList);
	const suggestionDiv = document.querySelector('.suggestionList');
	suggestionDiv.innerHTML = '';
	if (status === 1) {
		tempList.forEach((element) => {
			const elementDiv = document.createElement('div');
			elementDiv.classList.add('suggestionElement');
			elementDiv.innerHTML = `
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						<img src="${element.elementPoster}" alt="${element.elementTitle}" />
					</a>
				</div>
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						${element.elementTitle}
					</a>
					${element.elementDescription ? `<p>${element.elementDescription}</p>` : ''}
					${
						element.elementDirector && element.elementDirectorInformation
							? `<p>Director: <a href="https://imdb.com${element.elementDirectorInformation}" target="_blank">${element.elementDirector}</a></p>`
							: ''
					}
					<p>${element.elementRating} | ${element.elementGenres}</p>
					<button type="button" class="btn btn-primary" data-arg='${JSON.stringify(
						element
					)}' onclick="sendMail(this, '${element.elementTitle}')" >
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
							<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>
						</svg>
						Send
            		</button>
				</div>
			`;
			suggestionDiv.append(elementDiv);
		});
		const btnSection = document.createElement('div');
		btnSection.innerHTML = `
			<div class="btnContainer">
				<button type="button" class="btn btn-success shuffleBtn" onclick="callShuffledTempList()">Shuffle</button>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(btnSection);
	} else if (status === 0) {
		const elementDiv = document.createElement('div');
		elementDiv.innerHTML = `
			<div>
				<p style="font-size:22px; margin: 20px 20px 20px 0;">List is completed. Search again.</p>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(elementDiv);
	} else if (status === 2) {
		tempList.forEach((element) => {
			const elementDiv = document.createElement('div');
			elementDiv.classList.add('suggestionElement');
			elementDiv.innerHTML = `
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						<img src="${element.elementPoster}" alt="${element.elementTitle}" />
					</a>
				</div>
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						${element.elementTitle}
					</a>
					${element.elementDescription ? `<p>${element.elementDescription}</p>` : ''}
					${
						element.elementDirector && element.elementDirectorInformation
							? `<p>Director: <a href="https://imdb.com${element.elementDirectorInformation}" target="_blank">${element.elementDirector}</a></p>`
							: ''
					}
					<p>${element.elementRating} | ${element.elementGenres}</p>
					<button type="button" class="btn btn-primary" data-arg='${JSON.stringify(
						element
					)}' onclick="sendMail(this, '${element.elementTitle}')" >
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
							<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>
						</svg>
						Send
            		</button>
				</div>
			`;
			suggestionDiv.append(elementDiv);
		});
		const btnSection = document.createElement('div');
		btnSection.innerHTML = `
			<div class="btnContainer">
				<p style="font-size:22px; margin: 20px 20px 20px 0;">Last Page of Suggestions</p>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(btnSection);
	}
};

const displaySuggestionList = (list, options) => {
	suggestionList = list;
	suggestionForm.remove();
	const suggestionDiv = document.createElement('div');
	suggestionDiv.classList.add('suggestionList');

	const searchHeading = document.createElement('h3');
	searchHeading.textContent = `Type(s): ${options
		.get('media_types')
		.join(', ')} | Genre(s): ${options.get('genres').join(', ')} ${
		options.get('release_date')
			? `| Release Date: ${options.get('release_date')}`
			: ''
	}`;
	formContainer.append(searchHeading);

	if (!list.length) {
		const elementDiv = document.createElement('div');
		elementDiv.innerHTML = `
			<div>
				<p style="font-size:22px; margin: 20px 20px 20px 0;">No Elements Found</p>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(elementDiv);
		formContainer.append(suggestionDiv);
		return;
	}

	if (list.length < 5) {
		list.forEach((element) => {
			const elementDiv = document.createElement('div');
			elementDiv.classList.add('suggestionElement');
			elementDiv.innerHTML = `
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						<img src="${element.elementPoster}" alt="${element.elementTitle}" />
					</a>
				</div>
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						${element.elementTitle}
					</a>
					${element.elementDescription ? `<p>${element.elementDescription}</p>` : ''}
					${
						element.elementDirector && element.elementDirectorInformation
							? `<p>Director: <a href="https://imdb.com${element.elementDirectorInformation}" target="_blank">${element.elementDirector}</a></p>`
							: ''
					}
					<p>${element.elementRating} | ${element.elementGenres}</p>
					<button type="button" class="btn btn-primary" data-arg='${JSON.stringify(
						element
					)}' onclick="sendMail(this, '${element.elementTitle}')" >
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
							<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>
						</svg>
						Send
            		</button>
				</div>
			`;
			suggestionDiv.append(elementDiv);
		});
		const btnSection = document.createElement('div');
		btnSection.innerHTML = `
			<div class="btnContainer">
				<p style="font-size:22px; margin: 20px 20px 20px 0;">Last Page of Suggestions</p>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(btnSection);
		formContainer.append(suggestionDiv);
		return;
	}

	list.forEach((element) => (element.displayed = false));

	const { tempList, status } = shuffledTempList(suggestionList);
	if (status) {
		tempList.forEach((element) => {
			const elementDiv = document.createElement('div');
			elementDiv.classList.add('suggestionElement');
			elementDiv.innerHTML = `
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						<img src="${element.elementPoster}" alt="${element.elementTitle}" />
					</a>
				</div>
				<div>
					<a href="https://imdb.com${element.elementLink}" target="_blank">
						${element.elementTitle}
					</a>
					${element.elementDescription ? `<p>${element.elementDescription}</p>` : ''}
					${
						element.elementDirector && element.elementDirectorInformation
							? `<p>Director: <a href="https://imdb.com${element.elementDirectorInformation}" target="_blank">${element.elementDirector}</a></p>`
							: ''
					}
					<p>${element.elementRating} | ${element.elementGenres}</p>
					<button type="button" class="btn btn-primary" data-arg='${JSON.stringify(
						element
					)}' onclick="sendMail(this, '${element.elementTitle}')" >
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
							<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>
						</svg>
						Send
            		</button>
				</div>
			`;
			suggestionDiv.append(elementDiv);
		});
		const btnSection = document.createElement('div');
		btnSection.innerHTML = `
			<div class="btnContainer">
				<button type="button" class="btn btn-success shuffleBtn" onclick="callShuffledTempList()">Shuffle</button>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(btnSection);
	} else {
		const elementDiv = document.createElement('div');
		elementDiv.innerHTML = `
			<div>
				<p style="font-size:22px; margin: 20px 20px 20px 0;">List is completed. Search again.</p>
				<button type="button" class="btn btn-primary restartBtn" onclick="restart()">Search Again</button>
			</div>
		`;
		suggestionDiv.append(elementDiv);
	}

	formContainer.append(suggestionDiv);
};

const getSuggestions = async (options) => {
	try {
		const request = await fetch('/api/get-suggestions', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(Object.fromEntries(options)),
		});
		const response = await request.json();
		displaySuggestionList(response.suggestionsList, options);
	} catch (error) {
		alert(error);
	}
};

suggestionForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const mediaTypesCheckboxInputsContainer =
		document.querySelectorAll('div.mediaTypeCheck');
	const genresCheckboxInputsContainer = document.querySelectorAll('div.genre');

	const options = new Map();
	options.set('media_types', []);
	options.set('genres', []);

	for (const mediaTypeCheckboxInputContainer of mediaTypesCheckboxInputsContainer) {
		const mediaTypeCheckboxInput = mediaTypeCheckboxInputContainer.children[0];
		if (mediaTypeCheckboxInput.checked) {
			options.set('media_types', [
				...options.get('media_types'),
				mediaTypeCheckboxInput.value,
			]);
		}
	}
	for (const genreCheckboxInputContainer of genresCheckboxInputsContainer) {
		const genreCheckboxInput = genreCheckboxInputContainer.children[0];
		if (genreCheckboxInput.checked) {
			options.set('genres', [
				...options.get('genres'),
				genreCheckboxInput.value,
			]);
		}
	}
	options.set('release_date', releaseDateInput.value);
	if (!options.get('media_types').length || !options.get('genres').length) {
		alert('Select at least a media type and a genre');
	} else {
		const submitBtnContainer = document.querySelector('.submitButtonContainer');
		submitBtnContainer.innerHTML = `
		<button class="btn btn-light" type="button" disabled style="width: 100%; font-size: 18px;">
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			Loading...
		</button>
		`;
		await getSuggestions(options);
	}
});
