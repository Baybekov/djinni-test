const apiUrl = "https://picsum.photos/v2/list?page=1&limit=9";
const container = document.getElementById("cards-container");

//дадим дефолтные стартовые значения
let page = 1;
let isLoading = false;

// функция для создания карточки
function createCard(photo) {
	const card = document.createElement("div");
	card.className = "col-6";

	const cardDiv = document.createElement("div");
	cardDiv.className = "border border-1 rounded";

	const img = document.createElement("img");
	img.className = "img-fluid";
	img.src = photo.download_url;
	img.alt = photo.author;

	const content = document.createElement("div");
	content.className = "d-flex flex-column p-3";
	const title = document.createElement("h2");
	title.textContent = photo.author;
	const desc = document.createElement("p");
    desc.className = 'desc';
	desc.textContent =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore harum hic ad...";
	const moreDesc = document.createElement("p");
	moreDesc.textContent =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore harum hic ad nobis voluptates ducimus inventore beatae pariatur libero nihil autem nemo facilis dolore illum quisquam dolores, soluta velit nisi?";
	moreDesc.className = "more-desc";
	const moreBtn = document.createElement("p");
	moreBtn.className = "moreBtn";
	moreBtn.textContent = "Show more...";

	const actions = document.createElement("div");
	actions.className = "d-flex p-3 flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row flex-xxl-row";
	const saveBtn = document.createElement("button");
	saveBtn.className = "btn main-bg-color text-white me-1";
	saveBtn.textContent = "Save to collection";
	const shareBtn = document.createElement("button");
	shareBtn.className = "btn btn-white border border-1";
	shareBtn.textContent = "Share";

	content.appendChild(title);
	content.appendChild(desc);
	content.appendChild(moreDesc);
	content.appendChild(moreBtn);
	actions.appendChild(saveBtn);
	actions.appendChild(shareBtn);
	card.appendChild(cardDiv);
	cardDiv.appendChild(img);
	cardDiv.appendChild(content);
	cardDiv.appendChild(actions);
	return card;
}

// функция для загрузки фото и создания карточек
async function loadPhotos() {
	isLoading = true;
	const response = await fetch(`${apiUrl}&page=${page}`);
	const photos = await response.json();
	photos.forEach((photo) => {
		const card = createCard(photo);
		container.appendChild(card);
	});
	isLoading = false;
	page++;
	return true;
}

/// функция для кнопки show more..

async function showMore() {
	await loadPhotos();
	const moreBtns = document.querySelectorAll(".moreBtn");
	const moreTexts = document.querySelectorAll(".more-desc");
    const descs = document.querySelectorAll(".desc");

	moreBtns.forEach((btn, i) => {
		let isOpen = false;
		btn.addEventListener("click", async function () {
			if (isOpen) {
				descs[i].style.display = "block";
				moreTexts[i].style.display = "none";
				btn.innerHTML = "Show more..";
				isOpen = false;
			} else {
				moreTexts[i].style.display = "block";
				descs[i].style.display = "none";
				btn.innerHTML = "Hide";
				isOpen = true;
			}
		});
	});
}

// функция для проверки, находится ли пользователь в конце страницы
function isEndOfPage() {
	const scrollTop =
		document.documentElement.scrollTop || document.body.scrollTop;
	const scrollHeight =
		document.documentElement.scrollHeight || document.body.scrollHeight;
	const clientHeight =
		document.documentElement.clientHeight || document.body.clientHeight;
	return scrollTop + clientHeight >= scrollHeight - 1;
}

// обработчик скролла окна
window.addEventListener("scroll", () => {
	if (isEndOfPage() && !isLoading) {
		loadPhotos();
	}
});


/////dark mode

const darkModeBtn = document.getElementById('darkmode');
let isDarkModeActive = false;

darkModeBtn.addEventListener('click', () => {
  if (isDarkModeActive) {
    document.body.classList.remove("dark");
	darkModeBtn.innerHTML = '<i class="bi bi-moon"></i>Dark Mode';
    isDarkModeActive = false;
  } else {
    document.body.classList.add("dark");
	darkModeBtn.innerHTML = '<i class="bi bi-brightness-high"></i>Light Mode';
    isDarkModeActive = true;
  }
});

// загружаем первую порцию фото при открытии
loadPhotos();
//ждём пока выполнится loadPhotos
showMore();
