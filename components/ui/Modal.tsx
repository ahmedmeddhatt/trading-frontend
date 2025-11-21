// ui/Modal.tsx
export const Modal = ({ open, onClose, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur flex justify-center items-center z-50">
      <div className="glass p-6 rounded-2xl shadow-2xl w-[420px] relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};
