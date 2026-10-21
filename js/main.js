// =========================================================
// Модальное окно открывает и закрывает сам Bootstrap
// (атрибуты data-bs-toggle="modal" и data-bs-dismiss="modal").
// Здесь только:
//   1) подставляем в окно название выбранной книги;
//   2) проверяем формы перед отправкой.
// =========================================================


// ---------- 1. Название книги в модальном окне ----------

const orderModal = document.getElementById('order-modal');

if (orderModal) {
  // Событие Bootstrap: срабатывает перед открытием окна.
  orderModal.addEventListener('show.bs.modal', (event) => {
    // relatedTarget — кнопка «Забронировать», которая открыла окно.
    const button = event.relatedTarget;
    const product = button ? button.dataset.product : '';

    // Записываем книгу в скрытое поле и показываем её в окне.
    orderModal.querySelector('#selected-product').value = product;
    orderModal.querySelector('[data-product-name]').textContent = product || 'не выбрана';
  });
}


// ---------- 2. Проверка форм ----------

// Формы с классом needs-validation (модальное окно и страница заявки).
document.querySelectorAll('.needs-validation').forEach((form) => {
  form.addEventListener('submit', (event) => {
    // Backend пока не подключён, поэтому отменяем реальную отправку.
    event.preventDefault();

    // checkValidity() проверяет required, type="email", pattern, minlength.
    if (!form.checkValidity()) {
      // Класс was-validated включает стили Bootstrap:
      // красные рамки и тексты .invalid-feedback у ошибочных полей.
      form.classList.add('was-validated');
      return;
    }

    // Всё заполнено верно: очищаем форму.
    form.reset();
    form.classList.remove('was-validated');

    // Если форма в модальном окне — закрываем его.
    const modal = form.closest('.modal');
    if (modal) {
      bootstrap.Modal.getInstance(modal).hide();
    }

    // Показываем сообщение об успехе (id указан в data-success).
    const message = document.getElementById(form.dataset.success);
    if (message) {
      message.hidden = false;
      setTimeout(() => {
        message.hidden = true;
      }, 5000);
    }
  });
});
