export type ToastDeletionProps = {
  title: string;
  onUndo: () => void;
};

export function ToastDeletion({ title, onUndo }: ToastDeletionProps) {
  return (
    <div className="flex items-center">
      <div className="flex w-0 flex-1 justify-between">
        <p className="w-0 flex-1 text-sm font-medium text-gray-900">
          {title} has been deleted!
        </p>
        <button
          type="button"
          onClick={onUndo}
          className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:text-indigo-500"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
