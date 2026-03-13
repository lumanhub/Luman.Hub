const serviceCards = document.querySelectorAll(".service-card");
const summaryList = document.getElementById("summaryList");
const totalPriceEl = document.getElementById("totalPrice");
const clearOrderBtn = document.getElementById("clearOrderBtn");
const sendOrderBtn = document.getElementById("sendOrderBtn");
const dashboard = document.querySelector(".dashboard-mockup");

function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function updateSummary() {
  const selectedItems = [];
  let total = 0;

  serviceCards.forEach((card) => {
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const qtyInput = card.querySelector(".qty-input");
    const qty = Number(qtyInput.value) || 0;

    if (qty > 0) {
      const subtotal = price * qty;
      total += subtotal;
      selectedItems.push({ name, price, qty, subtotal });
    }
  });

  summaryList.innerHTML = "";

  if (selectedItems.length === 0) {
    summaryList.innerHTML = `<div class="empty-summary">Nenhum item selecionado ainda.</div>`;
  } else {
    selectedItems.forEach((item) => {
      const div = document.createElement("div");
      div.className = "summary-item";
      div.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <span>${item.qty}x ${formatBRL(item.price)}</span>
        </div>
        <div class="summary-price">${formatBRL(item.subtotal)}</div>
      `;
      summaryList.appendChild(div);
    });
  }

  totalPriceEl.textContent = formatBRL(total);
}

serviceCards.forEach((card) => {
  const minusBtn = card.querySelector(".minus");
  const plusBtn = card.querySelector(".plus");
  const qtyInput = card.querySelector(".qty-input");

  plusBtn.addEventListener("click", () => {
    qtyInput.value = Number(qtyInput.value) + 1;
    updateSummary();
  });

  minusBtn.addEventListener("click", () => {
    const current = Number(qtyInput.value);
    qtyInput.value = current > 0 ? current - 1 : 0;
    updateSummary();
  });

  qtyInput.addEventListener("input", () => {
    if (qtyInput.value < 0 || qtyInput.value === "") qtyInput.value = 0;
    updateSummary();
  });
});

clearOrderBtn.addEventListener("click", () => {
  serviceCards.forEach((card) => {
    card.querySelector(".qty-input").value = 0;
  });
  updateSummary();
});

sendOrderBtn.addEventListener("click", () => {
  let message = "Olá, quero solicitar um orçamento na Luman.%0A%0A";
  let hasItems = false;
  let total = 0;

  serviceCards.forEach((card) => {
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const qty = Number(card.querySelector(".qty-input").value) || 0;

    if (qty > 0) {
      const subtotal = price * qty;
      total += subtotal;
      hasItems = true;
      message += `• ${name} — ${qty}x — ${formatBRL(subtotal)}%0A`;
    }
  });

  if (!hasItems) {
    alert("Selecione pelo menos um item antes de solicitar o orçamento.");
    return;
  }

  message += `%0ATotal estimado: ${formatBRL(total)}`;

  const phone = "5521971574979";
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank");
});

updateSummary();

const parallaxElements = document.querySelectorAll(".parallax");

function handleParallax() {
  const scrollY = window.scrollY;

  parallaxElements.forEach((element) => {
    const speed = parseFloat(element.dataset.speed || 0.05);
    const y = scrollY * speed;
    element.style.transform = `translate3d(0, ${y}px, 0)`;
  });
}

window.addEventListener("scroll", handleParallax);

document.addEventListener("mousemove", (e) => {
  if (!dashboard) return;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const rotateY = (e.clientX - centerX) / 45;
  const rotateX = -(e.clientY - centerY) / 55;

  dashboard.style.transform = `
    perspective(1200px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translate3d(0, 0, 0)
  `;
});

document.addEventListener("mouseleave", () => {
  if (!dashboard) return;

  dashboard.style.transform = `
    perspective(1200px)
    rotateX(0deg)
    rotateY(0deg)
    translate3d(0, 0, 0)
  `;
});
