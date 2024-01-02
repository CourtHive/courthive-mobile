export function closeModal() {
  Array.from(document.querySelectorAll('.modal')).forEach((modal: any) => (modal.style.display = 'none'));
}
