(function (window) {
  "use-strict";

  const APP_ELEMENT = document.querySelector("#app");
  const PAGINATION_CONTAINER = document.querySelector("#pagination");
  let frequencyContainer = document.querySelector("#kanjiFrequencyContainer");
  const kana =
    "ーあぁかさたなはまやゃらわがざだばぱぴびぢじぎゐりみひにちしきぃいうぅくすつぬふむゆゅるぐずづぶぷぺべでぜげゑれめへねてせけぇえおぉことそのほもよょろをごぞどぼぽんっゔアァカサタナハマヤャラワガザダバパピビヂジギヰリミヒニチシキィイウゥクスツヌフムユュルグズヅブプペベデゼゲヱレメヘネテセケェエオォコソトノモホヨョロヲゴゾドボポンッヴ";

  const splitKana = kana.split("");
  let allKanji = [];
  let uniqueKanji = [];
  let kanjiCount = [];
  let KanJiLevelThree = [];
  let japanLevelThree = [];
  let wordTotal = 0;
  let paginationArr = [];
  let paginationCount = 0;

  function toggleContent(e) {
    const TARGET_ELEMENT = e.currentTarget;
    const TARGET_ELEMENT_CHILD = document.querySelector(
      `[data-flash-card="${TARGET_ELEMENT.dataset.flashCardParent}"]`
    );

    TARGET_ELEMENT_CHILD.classList.toggle("show-content");
  }

  function populatePage() {
    let fragment = document.createDocumentFragment();
    let iterationCounter = 0;
    let i = paginationCount;
    for (i; iterationCounter < 100; i++) {
      let elementToAppend = document.createElement("div");
      let flashCardHeader = document.createElement("div");
      elementToAppend.classList.add("flash-card");
      flashCardHeader.classList.add("flash-card__header");
      flashCardHeader.setAttribute("data-flash-card-parent", iterationCounter);
      flashCardHeader.innerHTML = `
    <h5 class="flash-card__header-title">
    ${VOCAB_DATA[i]["Opt-Sen-Index"]} ${VOCAB_DATA[i]["Vocab-furigana"]} (${VOCAB_DATA[i]["Vocab-meaning"]})  
  </h5>
     <a href="https://forvo.com/search/${VOCAB_DATA[i]["Vocab-expression"]}" target="_blank" class="flash-card__header-link" title="open forvo word page">🔗</a>
    `;
      elementToAppend.innerHTML = `

    <div data-flash-card="${iterationCounter}" class="flash-card__body flash-card__content">
            <strong class="flash-card__body-content">${VOCAB_DATA[i]["Sentence-furigana"]}</strong>
            ${VOCAB_DATA[i]["Sentence-meaning"]}
          
    </div>
     `;
      flashCardHeader.addEventListener("click", toggleContent);
      elementToAppend.prepend(flashCardHeader);

      iterationCounter++;
      fragment.appendChild(elementToAppend);
    }

    APP_ELEMENT.innerHTML = "";
    APP_ELEMENT.appendChild(fragment);
  }

  function startPagination(e) {
    const clickedPaginationButton = e.target;
    console.log(e.target);
    paginationArr.forEach((element) => {
      if (element.classList.contains("active")) {
        element.classList.remove("active");
        element.removeAttribute("disabled");
      }
    });

    clickedPaginationButton.classList.add("active");
    clickedPaginationButton.setAttribute("disabled", "disabled");

    paginationCount = +clickedPaginationButton.dataset.pagination;

    populatePage();
  }

  function populatePaginationButtons() {
    let paginationLength = VOCAB_DATA.length / 100 - 1;
    let fragment = document.createDocumentFragment();

    for (let i = 0; i <= paginationLength; i++) {
      const PAGINATION_BUTTON = document.createElement("button");

      PAGINATION_BUTTON.setAttribute("data-pagination", i * 100);
      PAGINATION_BUTTON.classList.add("pagination-button");
      PAGINATION_BUTTON.innerText = i + 1;

      if (i === 0) {
        PAGINATION_BUTTON.setAttribute("disabled", "disabled");
        PAGINATION_BUTTON.classList.add("active");
      }
      PAGINATION_BUTTON.addEventListener("click", startPagination);
      paginationArr.push(PAGINATION_BUTTON);
      fragment.appendChild(PAGINATION_BUTTON);
    }

    PAGINATION_CONTAINER.appendChild(fragment);
  }
  function getKanjiCount(kanji) {
    let kanjiObject;
    let frequentCount = 0;
    allKanji.forEach((el) => {
      if (el === kanji) {
        frequentCount++;
      }
    });

    kanjiObject = {
      uniqueKanji: kanji,
      count: frequentCount,
    };
    kanjiCount.push(kanjiObject);
  }

  function getKanji() {
    VOCAB_DATA.forEach((el) => {
      if (
        el["jlpt"] === "JLPT5" ||
        el["jlpt"] === "JLPT4" ||
        el["jlpt"] === "JLPT3"
      ) {
        japanLevelThree.push(el["Vocab-expression"]);
        wordTotal++;
      }

      const vocabArray = el["Vocab-expression"].split("");
      vocabArray.forEach((kanas) => {
        if (!kana.includes(kanas)) {
          allKanji.push(kanas);
          if (!uniqueKanji.includes(kanas)) {
            uniqueKanji.push(kanas);
            if (
              el["jlpt"] === "JLPT5" ||
              el["jlpt"] === "JLPT4" ||
              el["jlpt"] === "JLPT3"
            ) {
              KanJiLevelThree.push(kanas);
            }
          }
        }
      });
    });
  }

  function populateKanjiFrequency(kanjiObj) {
    const kanjiContainer = document.createElement("div");
    const kanjiCharacter = document.createElement("span");
    const kanjiCount = document.createElement("span");

    kanjiContainer.classList.add("kanji-container");
    kanjiCharacter.classList.add("kanji-character");
    kanjiCount.classList.add("kanji-count");

    kanjiCharacter.innerText = kanjiObj.uniqueKanji;
    kanjiCount.innerText = kanjiObj.count;

    kanjiContainer.appendChild(kanjiCharacter);
    kanjiContainer.appendChild(kanjiCount);

    return kanjiContainer;
  }

  function populateKanji() {
    const fragment = document.createDocumentFragment();

    kanjiCount.forEach((kanjiObj) => {
      const kanjiElement = populateKanjiFrequency(kanjiObj);

      fragment.appendChild(kanjiElement);
    });

    frequencyContainer.appendChild(fragment);
  }

  function compare(a, b) {
    const bandA = a.count;
    const bandB = b.count;

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison * -1;
  }
  populatePaginationButtons();

  populatePage();
  getKanji();

  uniqueKanji.forEach((el) => {
    getKanjiCount(el);
  });

  kanjiCount = kanjiCount.sort(compare);

  populateKanji();
})(window);
