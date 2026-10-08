export default function Backdrop({ open, onClose }) {
  return <button className={`backdrop${open ? ' visible' : ''}`} type="button" aria-label="Close navigation menu" tabIndex={open ? 0 : -1} onClick={onClose} />;
}
