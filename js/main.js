// =========================================================
// Минимальный JavaScript для КР №1:
//   1) открытие и закрытие модального окна <dialog>;
//   2) проверка форм встроенной HTML-валидацией и сообщение об успехе.
// Вся раскладка и оформление сделаны на HTML/CSS.
// =========================================================


// ---------- 1. Модальное окно быстрого заказа ----------

// На страницах без модалки (order.html, contacts.html) переменная будет null,
// поэтому дальше код модалки выполняется только при её наличии.
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  // Все кнопки «Заказать» с data-атрибутом data-order-product.
  const orderButtons = document.querySelectorAll('[data-order-product]');

  // Скрытое поле формы и подпись «Товар: ...» в шапке модалки.
  const productInput = orderDialog.querySelector('input[name="product"]');
  const productName = orderDialog.querySelector('[data-product-name]');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Берём название товара из data-order-product.
      const product = button.dataset.orderProduct;

      // Записываем его в скрытое поле (уйдёт вместе с формой)
      // и показываем пользователю в заголовке окна.
      productInput.value = product;
      productName.textContent = product;

      // showModal() открывает <dialog> поверх страницы с подложкой ::backdrop.
      // Esc закрывает окно автоматически — это встроено в браузер.
      orderDialog.showModal();
    });
  });

  // Кнопки «×» и «Отмена».
  orderDialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => orderDialog.close());
  });

  // Закрытие по клику на затемнённый фон:
  // клик по ::backdrop приходит в обработчик как клик по самому <dialog>.
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}


// ---------- 2. Проверка форм ----------

// Обрабатываем все формы с атрибутом data-validate
// (быстрый заказ, страница заявки, обратная связь).
document.querySelectorAll('form[data-validate]').forEach((form) => {
  // Блок с сообщением об успехе, id которого указан в data-success.
  const successMessage = document.getElementById(form.dataset.success);

  form.addEventListener('submit', (event) => {
    // Backend пока не подключён, поэтому отменяем реальную отправку.
    event.preventDefault();

    const fields = Array.from(form.elements).filter((element) => element.willValidate);

    // Сбрасываем прошлые ошибки.
    fields.forEach((field) => field.removeAttribute('aria-invalid'));

    // checkValidity() проверяет required, type="email", pattern, minlength и т. д.
    if (!form.checkValidity()) {
      fields.forEach((field) => {
        if (!field.checkValidity()) {
          // aria-invalid сообщает экранному диктору об ошибке,
          // а в CSS по этому атрибуту поле подсвечивается красным.
          field.setAttribute('aria-invalid', 'true');
        }
      });

      // Показываем стандартные подсказки браузера и ставим фокус на первое ошибочное поле.
      form.reportValidity();
      return;
    }

    // Всё заполнено верно: очищаем форму и показываем сообщение.
    form.reset();

    if (orderDialog && orderDialog.contains(form)) {
      orderDialog.close();
    }

    if (successMessage) {
      successMessage.hidden = false;
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Всплывающее уведомление (после модалки) прячем через 5 секунд.
      if (successMessage.classList.contains('notice--floating')) {
        setTimeout(() => {
          successMessage.hidden = true;
        }, 5000);
      }
    }
  });

  // Когда пользователь исправляет поле — убираем красную подсветку.
  form.addEventListener('input', (event) => {
    if (event.target.checkValidity && event.target.checkValidity()) {
      event.target.removeAttribute('aria-invalid');
    }
  });
});
