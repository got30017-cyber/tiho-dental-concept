'use strict';
document.documentElement.classList.add('js');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); }
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('is-open', open); menuToggle.setAttribute('aria-expanded', String(open)); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 }); reveals.forEach(element => observer.observe(element)); } else reveals.forEach(element => element.classList.add('is-in'));

const form = document.querySelector('#booking-form');
const nameInput = document.querySelector('#demo-name');
const phoneInput = document.querySelector('#demo-phone');
const direction = document.querySelector('#direction');
const doctor = document.querySelector('#doctor');
const consent = document.querySelector('#demo-consent');
const success = document.querySelector('#success');
function clearError(input) { input.removeAttribute('aria-invalid'); document.getElementById(input.getAttribute('aria-describedby')).textContent = ''; }
function setError(input, message) { input.setAttribute('aria-invalid', 'true'); document.getElementById(input.getAttribute('aria-describedby')).textContent = message; }
function resetFormView() { form.hidden = false; success.hidden = true; }
[nameInput, phoneInput, direction, doctor, consent].forEach(input => { input.addEventListener('input', () => clearError(input)); input.addEventListener('change', () => clearError(input)); });
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { resetFormView(); direction.value = button.dataset.service; direction.dispatchEvent(new Event("change")); clearError(direction); document.querySelector('#booking').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); nameInput.focus({ preventScroll: true }); }));
document.querySelector('#fill-demo').addEventListener('click', () => { resetFormView(); nameInput.value = 'Анна'; phoneInput.value = '+7 (000) 000-00-00'; if (!direction.value) { direction.value = 'Пока не знаю — нужна консультация'; direction.dispatchEvent(new Event('change')); } [nameInput, phoneInput, direction].forEach(clearError); consent.focus({ preventScroll: true }); });
phoneInput.addEventListener('blur', () => { const digits = phoneInput.value.replace(/\D/g, ''); if (digits.length === 11 && /^[78]/.test(digits)) phoneInput.value = `+7 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9,11)}`; });
form.addEventListener('submit', event => {
  event.preventDefault();
  [nameInput, phoneInput, direction, consent].forEach(clearError);
  if (!/^[\p{L}][\p{L}\s’-]{1,59}$/u.test(nameInput.value.trim())) setError(nameInput, 'Введите вымышленное имя: от 2 букв.');
  if (!/^[+\d\s()-]+$/.test(phoneInput.value) || !/^[78]\d{10}$/.test(phoneInput.value.replace(/\D/g, ''))) setError(phoneInput, 'Используйте тестовый номер +7 (000) 000-00-00.');
  if (!direction.value) setError(direction, 'Выберите направление или консультацию.');
  if (!doctor.value) setError(doctor, 'Выберите вымышленного врача.');
  if (!consent.checked) setError(consent, 'Подтвердите, что данные вымышленные.');
  const scheduleValid = doctor.value ? validateSchedule() : true;
  const invalid = form.querySelector('[aria-invalid="true"]');
  if (invalid || !scheduleValid) { if (invalid === direction) { directionTrigger.setAttribute('aria-invalid', 'true'); directionTrigger.focus(); } else if (invalid === doctor) { doctorTrigger.setAttribute('aria-invalid', 'true'); doctorTrigger.focus(); } else if (invalid === schedule || !invalid) { setCalendarOpen(true); dateTrigger.focus(); } else invalid.focus(); return; }
  document.querySelector('#success-description').textContent = `Вы выбрали: ${direction.value}. Врач: ${doctor.value}. ${prettyDate(selectedDate)}, ${selectedTime}. Демо-заявка успешно проверена; реальная запись не создана.`;
  form.reset(); form.hidden = true; success.hidden = false; success.focus();
});
document.querySelector('#reset-demo').addEventListener('click', () => { resetFormView(); nameInput.focus(); });
const dialog = document.querySelector('#contact-dialog');
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => { document.querySelector('#contact-description').textContent = button.dataset.contact === 'Почта' ? 'hello@tiho.example — демонстрационный адрес на зарезервированном домене. Письмо не создаётся и не отправляется. У этой вымышленной клиники нет настоящей почты.' : `${button.dataset.contact} показан как пример способа связи. Это портфолио-проект: настоящего аккаунта клиники нет, переход в мессенджер не выполняется.`; dialog.showModal(); }));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#dialog-ok').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });

// Native button supports click, touch, Enter and Space without scroll interception.
const toothToggle = document.querySelector('#tooth-toggle');
const toothStates = [
  ['01 / ЭМАЛЬ', 'Защитная оболочка', 'Эмаль покрывает коронку и защищает расположенный под ней дентин. В ней нет живых клеток, поэтому повреждённая эмаль не восстанавливается сама.', 'Снять эмаль'],
  ['02 / ДЕНТИН', 'Слой под эмалью', 'Дентин лежит под эмалью и составляет основную часть зуба. В нём есть микроскопические канальцы, поэтому при обнажении дентина зуб может реагировать на холодное и горячее.', 'Показать пульпу'],
  ['03 / ПУЛЬПА', 'Внутри есть жизнь', 'Пульпа содержит нервы и кровеносные сосуды и продолжается в каналах корней. Через сосуды к тканям зуба поступают питательные вещества и кислород.', 'Собрать зуб']
];
let toothStep = 0;
function renderTooth() {
  toothToggle.dataset.stage = String(toothStep);
  toothToggle.setAttribute('aria-label', toothStates[toothStep][3]);
  document.querySelector('#tooth-action-text').textContent = toothStates[toothStep][3];
  ['tooth-number', 'tooth-layer', 'tooth-text'].forEach((id, index) => { document.getElementById(id).textContent = toothStates[toothStep][index]; });
}
toothToggle.addEventListener('click', () => { toothStep = (toothStep + 1) % toothStates.length; renderTooth(); });
renderTooth();

// Progressive enhancement of the native direction select.
const picker = document.querySelector('.direction-picker');
const directionTrigger = document.querySelector('#direction-trigger');
const directionOptions = document.querySelector('#direction-options');
const choices = [...direction.options].filter(option => option.value);
picker.hidden = false;
direction.hidden = true;
direction.required = false;
direction.closest('.select-field').classList.add('enhanced');
document.querySelector('#direction-label').htmlFor = 'direction-trigger';
choices.forEach(option => {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'direction-option'; button.setAttribute('role', 'option'); button.setAttribute('aria-selected', 'false'); button.tabIndex = -1;
  button.textContent = option.textContent; button.dataset.value = option.value;
  button.addEventListener('click', () => { direction.value = option.value; direction.dispatchEvent(new Event('change')); closeDirections(); directionTrigger.focus(); });
  directionOptions.append(button);
});
function syncDirection() {
  document.querySelector('#direction-value').textContent = direction.value || 'Выберите направление';
  directionOptions.querySelectorAll('button').forEach(button => button.setAttribute('aria-selected', String(button.dataset.value === direction.value)));
  directionTrigger.removeAttribute('aria-invalid');
}
function closeDirections() { directionOptions.hidden = true; directionTrigger.setAttribute('aria-expanded', 'false'); }
function openDirections(last = false) {
  directionOptions.hidden = false; directionTrigger.setAttribute('aria-expanded', 'true');
  const buttons = [...directionOptions.children];
  (buttons.find(button => button.dataset.value === direction.value) || (last ? buttons.at(-1) : buttons[0])).focus();
}
directionTrigger.addEventListener('click', () => directionOptions.hidden ? openDirections() : closeDirections());
directionTrigger.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); openDirections(event.key === 'ArrowUp'); } });
directionOptions.addEventListener('keydown', event => {
  const buttons = [...directionOptions.children]; const index = buttons.indexOf(document.activeElement);
  let next;
  if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
  if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = buttons.length - 1;
  if (next !== undefined) { event.preventDefault(); buttons[next].focus(); }
  if (event.key === 'Escape') { event.preventDefault(); closeDirections(); directionTrigger.focus(); }
  if (event.key === 'Tab') closeDirections();
});
document.addEventListener('click', event => { if (!picker.contains(event.target)) closeDirections(); });
picker.addEventListener('focusout', event => { if (!picker.contains(event.relatedTarget)) closeDirections(); });
direction.addEventListener('change', () => { syncDirection(); populateDoctors(); clearSchedule(); });
syncDirection();

// Doctor selector shares the same visual and keyboard pattern as directions.
const doctorPicker = document.querySelector('.doctor-picker');
const doctorTrigger = document.querySelector('#doctor-trigger');
const doctorOptions = document.querySelector('#doctor-options');
doctorPicker.hidden = false;
doctor.hidden = true;
doctor.required = false;
document.querySelector('#doctor-label').htmlFor = 'doctor-trigger';
const doctorsByDirection = {
  'Профилактика и гигиена': ['Таисия Орлова', 'Илья Брезин', 'Вера Ратина'],
  'Лечение зубов': ['Алина Белова', 'Марк Лавров', 'Диана Кострова'],
  'Восстановление зубов': ['Лев Соколов', 'Кира Веденеева', 'Никита Аверин'],
  'Ортодонтия': ['Софья Миронова', 'Артём Платонов', 'Нина Савицкая'],
  'Эстетика улыбки': ['Элина Чернова', 'Роман Власов', 'Полина Серебрякова'],
  'Пока не знаю — нужна консультация': ['Злата Горская', 'Иван Лунёв']
};
function populateDoctors() {
  doctor.replaceChildren(new Option('Выберите врача', ''));
  doctorOptions.replaceChildren();
  for (const name of doctorsByDirection[direction.value] || []) {
    doctor.add(new Option(name, name));
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'direction-option'; button.setAttribute('role', 'option'); button.setAttribute('aria-selected', 'false'); button.tabIndex = -1;
    button.textContent = name; button.dataset.value = name;
    button.addEventListener('click', () => { doctor.value = name; doctor.dispatchEvent(new Event('change')); closeDoctors(); doctorTrigger.focus(); });
    doctorOptions.append(button);
  }
  document.querySelector('.doctor-field').hidden = !direction.value;
  closeDoctors(); clearError(doctor); syncDoctor();
}
function syncDoctor() {
  document.querySelector('#doctor-value').textContent = doctor.value || 'Выберите врача';
  doctorOptions.querySelectorAll('button').forEach(button => button.setAttribute('aria-selected', String(button.dataset.value === doctor.value)));
  doctorTrigger.removeAttribute('aria-invalid');
  document.querySelector('#schedule').hidden = !doctor.value;
}
function closeDoctors() { doctorOptions.hidden = true; doctorTrigger.setAttribute('aria-expanded', 'false'); }
function openDoctors(last = false) {
  closeDirections(); doctorOptions.hidden = false; doctorTrigger.setAttribute('aria-expanded', 'true');
  const buttons = [...doctorOptions.children];
  (buttons.find(button => button.dataset.value === doctor.value) || (last ? buttons.at(-1) : buttons[0])).focus();
}
doctorTrigger.addEventListener('click', () => doctorOptions.hidden ? openDoctors() : closeDoctors());
doctorTrigger.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); openDoctors(event.key === 'ArrowUp'); } });
doctorOptions.addEventListener('keydown', event => {
  const buttons = [...doctorOptions.children]; const index = buttons.indexOf(document.activeElement);
  let next;
  if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
  if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = buttons.length - 1;
  if (next !== undefined) { event.preventDefault(); buttons[next].focus(); }
  if (event.key === 'Escape') { event.preventDefault(); closeDoctors(); doctorTrigger.focus(); }
  if (event.key === 'Tab') closeDoctors();
});
document.addEventListener('click', event => { if (!doctorPicker.contains(event.target)) closeDoctors(); });
doctorPicker.addEventListener('focusout', event => { if (!doctorPicker.contains(event.relatedTarget)) closeDoctors(); });
doctor.addEventListener('change', () => { syncDoctor(); clearError(doctor); clearSchedule(); });
populateDoctors();

// Deliberately fictional availability. All dates are calculated locally.
const schedule = document.querySelector('#schedule');
const dateTrigger = document.querySelector('#date-trigger');
const calendarPanel = document.querySelector('#calendar-panel');
const scheduleTimes = document.querySelector('#schedule-times');
function setCalendarOpen(open) { calendarPanel.hidden = !open; dateTrigger.setAttribute('aria-expanded', String(open)); }
dateTrigger.addEventListener('click', () => setCalendarOpen(calendarPanel.hidden));
const today = new Date(); today.setHours(0, 0, 0, 0);
let monthOffset = 0;
let selectedDate = null;
let selectedTime = '';
const appointmentTimes = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const prettyDate = date => date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
function busyDate(date) { return date.getDay() === 0 || date.getDate() % 7 === 3; }
function busyTime(date, index) {
  const start = new Date(date); const [hours, minutes] = appointmentTimes[index].split(':').map(Number); start.setHours(hours, minutes);
  return start <= new Date() || (date.getDate() + index + Math.max(direction.selectedIndex, 0) + Math.max(doctor.selectedIndex, 0)) % 4 === 0;
}
function availableDate(date) { return date >= today && !busyDate(date) && appointmentTimes.some((_, index) => !busyTime(date, index)); }
function renderCalendar() {
  const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  document.querySelector('#calendar-month').textContent = month.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  document.querySelector('#month-prev').disabled = monthOffset === 0;
  document.querySelector('#month-next').disabled = monthOffset === 2;
  const grid = document.querySelector('#calendar-days'); grid.replaceChildren();
  const padding = (month.getDay() + 6) % 7;
  for (let i = 0; i < padding; i++) { const blank = document.createElement('span'); blank.setAttribute('aria-hidden', 'true'); grid.append(blank); }
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= last; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const past = date < today; const busy = !past && !availableDate(date);
    const button = document.createElement('button'); button.type = 'button'; button.className = 'calendar-day'; button.disabled = past || busy;
    button.dataset.date = dateKey(date); button.setAttribute('aria-pressed', String(selectedDate && dateKey(selectedDate) === dateKey(date) || false));
    button.setAttribute('aria-label', `${prettyDate(date)} — ${past ? 'прошедшая дата' : busy ? 'все окна заняты' : 'есть свободное время'}`);
    button.classList.toggle('is-past', past); button.classList.toggle('is-busy', busy); button.classList.toggle('is-today', dateKey(date) === dateKey(today));
    const number = document.createElement('span'); number.textContent = day; button.append(number);
    if (busy) { const label = document.createElement('small'); label.textContent = 'занято'; button.append(label); }
    button.addEventListener('click', () => { selectedDate = date; selectedTime = ''; clearScheduleError(); renderCalendar(); renderTimes(); setCalendarOpen(false); dateTrigger.focus({ preventScroll: true }); });
    grid.append(button);
  }
}
function clearScheduleError() { document.querySelector('#schedule-error').textContent = ''; schedule.removeAttribute('aria-invalid'); }
function renderTimes() {
  scheduleTimes.hidden = !selectedDate;
  document.querySelector('#date-trigger-text').textContent = selectedDate ? prettyDate(selectedDate) : 'Выбрать дату';
  const container = document.querySelector('#time-slots'); container.replaceChildren();
  document.querySelector('#time-heading').textContent = selectedDate ? `${prettyDate(selectedDate)} / выберите время` : 'Выберите свободную дату';
  document.querySelector('#schedule-selection').textContent = selectedDate && selectedTime ? `Демо-запись: ${prettyDate(selectedDate)}, ${selectedTime}.` : '';
  if (!selectedDate) return;
  appointmentTimes.forEach((time, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'time-slot'; button.disabled = busyTime(selectedDate, index); button.setAttribute('aria-pressed', String(time === selectedTime)); button.setAttribute('aria-label', `${time} — ${button.disabled ? 'занято' : 'свободно'}`);
    const label = document.createElement('span'); label.textContent = time; button.append(label);
    if (button.disabled) { const busy = document.createElement('small'); busy.textContent = 'занято'; button.append(busy); }
    button.addEventListener('click', () => { selectedTime = time; clearScheduleError(); renderTimes(); document.querySelector('.time-slot[aria-pressed="true"]').focus({ preventScroll: true }); });
    container.append(button);
  });
}
function clearSchedule() { selectedDate = null; selectedTime = ''; clearScheduleError(); setCalendarOpen(false); renderCalendar(); renderTimes(); }
function validateSchedule() {
  if (!selectedDate || !selectedTime) { schedule.setAttribute('aria-invalid', 'true'); document.querySelector('#schedule-error').textContent = 'Выберите свободные дату и время для демо-записи.'; return false; }
  if (!availableDate(selectedDate) || busyTime(selectedDate, appointmentTimes.indexOf(selectedTime))) { clearSchedule(); schedule.setAttribute('aria-invalid', 'true'); document.querySelector('#schedule-error').textContent = 'Это время уже недоступно. Выберите другое окно.'; return false; }
  clearScheduleError(); return true;
}
document.querySelector('#month-prev').addEventListener('click', () => { if (monthOffset > 0) { monthOffset--; renderCalendar(); } });
document.querySelector('#month-next').addEventListener('click', () => { if (monthOffset < 2) { monthOffset++; renderCalendar(); } });
form.addEventListener('reset', () => { monthOffset = 0; clearSchedule(); closeDirections(); closeDoctors(); queueMicrotask(() => { syncDirection(); populateDoctors(); }); });
renderCalendar(); renderTimes();

// Enable submission only after the local-only handler and all controls initialize.
form.querySelector('[type=submit]').disabled = false;
