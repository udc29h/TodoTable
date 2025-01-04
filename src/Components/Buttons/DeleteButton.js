export default function createDeleteButton () {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn bg-red-400 text-white px-2 py-1 rounded';
  deleteButton.textContent = 'Delete';
  return deleteButton;
};