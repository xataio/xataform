export function ErrorMessage({ children }: { children: string }) {
  return (
    <div className="m-2 rounded border border-red-900 bg-red-300 p-2 text-sm text-red-900">
      Error: {children}
    </div>
  );
}
