// ConfirmModal.js
import "./ConfirmModal.css"; // Create a simple CSS for modal styling

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="confirm-modal__backdrop">
      <div className="confirm-modal__content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-modal__actions">
          <button className="btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn--confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
