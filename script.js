document.addEventListener("DOMContentLoaded", function () {
  const serviceCards = document.querySelectorAll(".service-card");
  const summaryList = document.getElementById("summaryList");
  const totalPriceEl = document.getElementById("totalPrice");
  const clearOrderBtn = document.getElementById("clearOrderBtn");
  const sendOrderBtn = document.getElementById("sendOrderBtn");

  function formatBRL(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function updateSummary() {
    if (!summaryList || !totalPriceEl) return;

    let total = 0;
    let html = "";

    serviceCards.forEach(function (card) {
      const name = card.getAttribute("data-name") || "Serviço";
      const price = Number(card.getAttribute("data-price")) || 0;
      const input = card.querySelector(".qty-input");
      const qty = input ? Number(input.value) || 0 : 0;

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

    summaryList.innerHTML = html || `<div class="empty-summary">Nenhum item selecionado ainda.</div>`;
    totalPriceEl.textContent = formatBRL(total);
  }

  serviceCards.forEach(function (card) {
    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const input = card.querySelector(".qty-input");

    if (!input) return;

    if (plusBtn) {
      plusBtn.addEventListener("click", function () {
        input.value = Number(input.value || 0) + 1;
        updateSummary();
      });
    }

    if (minusBtn) {
      minusBtn.addEventListener("click", function () {
        const current = Number(input.value || 0);
        input.value = current > 0 ? current - 1 : 0;
        updateSummary();
      });
    }

    input.addEventListener("input", function () {
      const value = Number(input.value);
      input.value = isNaN(value) || value < 0 ? 0 : value;
      updateSummary();
    });
  });

  if (clearOrderBtn) {
    clearOrderBtn.addEventListener("click", function () {
      serviceCards.forEach(function (card) {
        const input = card.querySelector(".qty-input");
        if (input) input.value = 0;
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
        const input = card.querySelector(".qty-input");
        const qty = input ? Number(input.value) || 0 : 0;

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
      window.open(`https://wa.me/5521971574979?text=${message}`, "_blank");
    });
  }

  updateSummary();
});
