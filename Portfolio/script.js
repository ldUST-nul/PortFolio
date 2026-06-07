/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   あなただけの場所  /  script.js  （作品データ ＆ 動き = JavaScript）
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */


/* ════════════════════════════════════════════════
   ① 作品データ（配列）  ← ここだけ編集すればOK ✎ EDIT
   --------------------------------------------------
   作品を増やすには、{ } のかたまりを1つコピーして
   カンマで区切って足すだけ。HTML はいじりません。
   減らすときは、かたまりごと消すだけ。
   ════════════════════════════════════════════════ */
const works = [
  // 作品を追加するときは images: [] に複数枚入れられる
  // category は "3DCG" / "GameCoding" / "Game" のどれかにする
  // ------------------------------ 3DCG --------------------------------------
  {
    title: "Room",
    genre: "PostEffect",
    desc: "1つの部屋に指す光、自然と良く見えるもの。",
    url: "#",
    images: [
      "Images/3DCG/Room/Room1.png",
    ],
    category: "3DCG",
  },
  {
    title: "Postalize",
    genre: "PostEffect",
    desc: "グラデーションを減らした映像、不気味だがどこか惹かれる。",
    url: "#",
    images: [
      "Images/3DCG/Postalize/RedCube.gif",
      "Images/3DCG/Postalize/Name1.gif",
    ],
    category: "3DCG",
  },
  {
    title: "Liminal Space",
    genre: "Liminal Space",
    desc: "現実と非現実の境界、どこか懐かしくて不安な空間。",
    url: "#",
    images: [
      "Images/3DCG/LiminalSpace/PoolRoom1Photoshops.png",
    ],
    category: "3DCG",
  },
  {
    title: "Sky",
    genre: "DreamCore",
    desc: "空",
    url: "#",
    images: [
      "Images/3DCG/Sky/Sky1.png",
    ],
    category: "3DCG",
  },
  // ------------------------------ Coding --------------------------------------
  
  
  // ------------------------------ CreateGames --------------------------------------
  
  
  // ------------------------------ FanArt --------------------------------------
  {
    title: "The Joy Of Creation 「Ignite Bonnie」",
    genre: "Fan Art",
    desc: "FiveNightsAtFreddy'sの二次創作であるTJOCのBonnieをテーマにした作品。",
    url: "#",
    images: [
      "Images/FanArt/FNAF/IBonnie1.jpg",
      "Images/FanArt/FNAF/IBonnie2.png",
      "Images/FanArt/FNAF/IBonnie3.png",
      "Images/FanArt/FNAF/IBonnie_MaterialPreview1.png",
      "Images/FanArt/FNAF/IBonnie_MaterialPreview2.png",
      "Images/FanArt/FNAF/IBonnie_MaterialPreview3.png",
    ],
    category: "FanArt",
  },
];


/* ════════════════════════════════════════════════
   ② 配列を1個ずつ HTML に変換して並べる
   --------------------------------------------------
   C# の LINQ でいう .Select(...) とほぼ同じ発想です。
   「配列を回して、各要素を別の形（HTML）に変換する」。
   ════════════════════════════════════════════════ */
const CATEGORIES = ["3DCG", "GameCoding", "Game", "FanArt"];

let activeCategory = CATEGORIES[0];

function renderTabs() {
  const bar = document.querySelector("#works-tabs");
  if (!bar) return;

  bar.innerHTML = CATEGORIES.map(cat => `
    <button class="tab-btn${cat === activeCategory ? " active" : ""}" data-cat="${cat}">
      <span class="dash left">—</span>
      <span class="label">${cat}</span>
      <span class="dash right">—</span>
    </button>
  `).join("");

  bar.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderTabs();
      renderWorks();
    });
  });
}

function renderWorks() {
  const grid = document.querySelector("#works-grid");
  if (!grid) return;

  const filtered = works.filter(w => w.category === activeCategory);

  const html = filtered
    .map((w, i) => {
      const number = String(i + 1).padStart(2, "0");
      const images = w.images || [];
      const firstImg = images[0] || "";

      const dots = images.length > 1
        ? `<div class="img-dots">
            ${images.map((_, di) =>
              `<button class="img-dot${di === 0 ? " active" : ""}" data-idx="${di}"></button>`
            ).join("")}
           </div>`
        : "";

      return `
        <div class="work" data-images='${JSON.stringify(images)}' data-genre="${w.genre || ""}">
          <span class="wnum">${number}</span>
          <div class="work-img-wrap">
            <img class="work-img" src="${firstImg}" alt="${w.title}">
            ${dots}
          </div>
          <h3>${w.title}</h3>
          ${w.genre ? `<span class="work-genre">${w.genre}</span>` : ""}
          <p>${w.desc}</p>
          <a class="arrow" href="${w.url}">View <span></span></a>
        </div>
      `;
    })
    .join("");

  grid.innerHTML = html || `<p style="color:var(--muted);font-size:14px;padding:38px 34px;">まだ作品がありません。</p>`;

  // ドットのクリックで画像を切り替える
  grid.querySelectorAll(".work").forEach(card => {
    const images = JSON.parse(card.dataset.images || "[]");
    card.querySelectorAll(".img-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.idx);
        card.querySelector(".work-img").src = images[idx];
        card.querySelectorAll(".img-dot").forEach((d, i) => {
          d.classList.toggle("active", i === idx);
        });
      });
    });
  });
}


/* ════════════════════════════════════════════════
   ③ スクロールに合わせて、章をそっと浮かび上がらせる
   ════════════════════════════════════════════════ */
function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}


/* ════════════════════════════════════════════════
   ④ ページが読み込まれたら、上の処理を実行する
   ════════════════════════════════════════════════ */
function setupModal() {
  const modal     = document.getElementById("work-modal");
  const modalImg  = modal.querySelector(".modal-img");
  const modalDots = document.getElementById("modal-dots");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc  = document.getElementById("modal-desc");
  const closeBtn  = modal.querySelector(".modal-close");

  let currentImages = [];
  let currentIdx = 0;
  const imgArea = modal.querySelector(".modal-img-area");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");

  function openModal(work) {
    currentImages = work.images || [];
    currentIdx = 0;
    imgArea.classList.toggle("has-multiple", currentImages.length > 1);
    showModalImage(0);
    document.getElementById("modal-genre").textContent = work.genre || "";
    modalTitle.textContent = work.title;
    modalDesc.textContent  = work.desc;
    modal.classList.add("open");
  }

  function showModalImage(idx) {
    currentIdx = (idx + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIdx] || "";
    idx = currentIdx;

    modalDots.innerHTML = currentImages.length > 1
      ? currentImages.map((_, i) =>
          `<button class="img-dot${i === idx ? " active" : ""}" data-idx="${i}"></button>`
        ).join("")
      : "";
  }

  modalDots.addEventListener("click", e => {
    const dot = e.target.closest(".img-dot");
    if (!dot) return;
    showModalImage(Number(dot.dataset.idx));
  });

  prevBtn.addEventListener("click", () => showModalImage(currentIdx - 1));
  nextBtn.addEventListener("click", () => showModalImage(currentIdx + 1));

  function closeModal() {
    modal.classList.remove("open");
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // renderWorks が呼ばれるたびに View ボタンへイベントを付け直す
  document.getElementById("works-grid").addEventListener("click", e => {
    const arrow = e.target.closest(".arrow");
    if (!arrow) return;
    e.preventDefault();
    const card = arrow.closest(".work");
    const images = JSON.parse(card.dataset.images || "[]");
    const title = card.querySelector("h3").textContent;
    const genre = card.dataset.genre || "";
    const desc  = card.querySelector("p").textContent;
    openModal({ images, title, genre, desc });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();    // タブを生成する
  renderWorks();   // 作品を配列から生成して並べる
  setupReveal();   // 登場アニメーションを準備する
  setupModal();    // モーダルの開閉を準備する
});
