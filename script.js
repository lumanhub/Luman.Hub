document.addEventListener("DOMContentLoaded", () => {
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
    const items = [];

    serviceCards.forEach((card) => {
      const name = card.getAttribute("data-name") || "Serviço";
      const price = Number(card.getAttribute("data-price")) || 0;
      const qtyInput = card.querySelector(".qty-input");
      const qty = qtyInput ? Number(qtyInput.value) || 0 : 0;

      if (qty > 0) {
        const subtotal = price * qty;
        total += subtotal;
        items.push({ name, price, qty, subtotal });
      }
    });

    summaryList.innerHTML = "";

    if (items.length === 0) {
      summaryList.innerHTML = `<div class="empty-summary">Nenhum item selecionado ainda.</div>`;
    } else {
      items.forEach((item) => {
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

    if (!qtyInput) return;

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        qtyInput.value = Number(qtyInput.value || 0) + 1;
        updateSummary();
      });
    }

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        const current = Number(qtyInput.value || 0);
        qtyInput.value = current > 0 ? current - 1 : 0;
        updateSummary();
      });
    }

    qtyInput.addEventListener("input", () => {
      const value = Number(qtyInput.value);
      qtyInput.value = !isNaN(value) && value >= 0 ? value : 0;
      updateSummary();
    });
  });

  if (clearOrderBtn) {
    clearOrderBtn.addEventListener("click", () => {
      serviceCards.forEach((card) => {
        const qtyInput = card.querySelector(".qty-input");
        if (qtyInput) qtyInput.value = 0;
      });
      updateSummary();
    });
  }

  if (sendOrderBtn) {
    sendOrderBtn.addEventListener("click", () => {
      let total = 0;
      let hasItems = false;
      let message = "Olá, quero solicitar um orçamento na Luman.%0A%0A";

      serviceCards.forEach((card) => {
        const name = card.getAttribute("data-name") || "Serviço";
        const price = Number(card.getAttribute("data-price")) || 0;
        const qtyInput = card.querySelector(".qty-input");
        const qty = qtyInput ? Number(qtyInput.value) || 0 : 0;

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
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    });
  }

  updateSummary();
});
