import clsx from "clsx";

export function Panel({
  children,
  isOpen,
}: React.PropsWithChildren<{ isOpen: boolean }>) {
  return (
    <section
      className={clsx(
        isOpen ? "w-64 min-w-[16rem]" : "w-0",
        "z-10 flex h-full flex-col shadow-lg transition-all overflow-x-hidden"
      )}
    >
      {children}
    </section>
  );
}
