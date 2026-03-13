document.addEventListener("DOMContentLoaded", function () {
  const serviceCards = document.querySelectorAll(".service-card");
  const summaryList = document.getElementById("summaryList");
  const totalPriceEl = document.getElementById("totalPrice");
  const clearOrderBtn = document.getElementById("clearOrderBtn");
  const sendOrderBtn = document.getElementById("sendOrderBtn");
  const dashboard = document.getElementById("dashboardMockup");

  function formatBRL(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function sanitizeQty(value) {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue) || numberValue < 0) return 0;
    return Math.floor(numberValue);
  }

  function updateSummary() {
    if (!summaryList || !totalPriceEl) return;

    let total = 0;
    let html = "";

    serviceCards.forEach(function (card) {
      const name = card.getAttribute("data-name") || "Serviço";
      const price = Number(card.getAttribute("data-price")) || 0;
      const qtyInput = card.querySelector(".qty-input");
      const qty = qtyInput ? sanitizeQty(qtyInput.value) : 0;

      if (qty > 0) {
        const subtotal = price * qty;
        total += subtotal;

        html += `
          <div class="summary-item">
            <div>
              <strong>${name}</strong>
              <span>${qty}x ${formatBRL(price)}</span>
            </div>
            <div class="summary-price">${formatBRL(subtotal)}</div>
          </div>
        `;
      }
    });

    summaryList.innerHTML = html || '<div class="empty-summary">Nenhum item selecionado ainda.</div>';
    totalPriceEl.textContent = formatBRL(total);
  }

  serviceCards.forEach(function (card) {
    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const qtyInput = card.querySelector(".qty-input");

    if (!qtyInput) return;

    if (plusBtn) {
      plusBtn.addEventListener("click", function () {
        qtyInput.value = sanitizeQty(qtyInput.value) + 1;
        updateSummary();
      });
    }

    if (minusBtn) {
      minusBtn.addEventListener("click", function () {
        const current = sanitizeQty(qtyInput.value);
        qtyInput.value = current > 0 ? current - 1 : 0;
        updateSummary();
      });
    }

    qtyInput.addEventListener("input", function () {
      qtyInput.value = sanitizeQty(qtyInput.value);
      updateSummary();
    });

    qtyInput.addEventListener("blur", function () {
      qtyInput.value = sanitizeQty(qtyInput.value);
      updateSummary();
    });
  });

  if (clearOrderBtn) {
    clearOrderBtn.addEventListener("click", function () {
      serviceCards.forEach(function (card) {
        const qtyInput = card.querySelector(".qty-input");
        if (qtyInput) qtyInput.value = 0;
      });
      updateSummary();
    });
  }

  if (sendOrderBtn) {
    sendOrderBtn.addEventListener("click", function () {
      let total = 0;
      let hasItems = false;
      let message = "Olá, quero solicitar um orçamento na Luman.%0A%0A";

      serviceCards.forEach(function (card) {
        const name = card.getAttribute("data-name") || "Serviço";
        const price = Number(card.getAttribute("data-price")) || 0;
        const qtyInput = card.querySelector(".qty-input");
        const qty = qtyInput ? sanitizeQty(qtyInput.value) : 0;

        if (qty > 0) {
          hasItems = true;
          const subtotal = price * qty;
          total += subtotal;
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
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  if (dashboard && window.innerWidth > 768) {
    document.addEventListener("mousemove", function (event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;

      dashboard.style.transform = `
        perspective(1200px)
        rotateX(${-y * 0.45}deg)
        rotateY(${x * 0.45}deg)
        translate3d(0, 0, 0)
      `;
    });

    document.addEventListener("mouseleave", function () {
      dashboard.style.transform = `
        perspective(1200px)
        rotateX(0deg)
        rotateY(0deg)
        translate3d(0, 0, 0)
      `;
    });
  }

  updateSummary();
});
