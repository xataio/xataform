import { Fragment, useState } from "react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import Link, { LinkProps } from "next/link";
import { usePopper } from "react-popper";

export type MenuItem =
  | {
      title: string;
      href: LinkProps["href"];
      className?: string;
    }
  | {
      title: string;
      onClick: () => void;
      className?: string;
    };

type Separator = "---";

type MenuItemWithSeparator = MenuItem | Separator;

export type MenuProps = {
  items: MenuItemWithSeparator[];
};

export function Menu(props: MenuProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          padding: 8,
        },
      },
    ],
  });

  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <HeadlessMenu.Button
        ref={setReferenceElement}
        className="flex items-center rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 hover:text-gray-600"
      >
        <span className="sr-only">Open options</span>
        <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </HeadlessMenu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items
          ref={setPopperElement}
          className="z-10 mt-2 w-56 divide-y divide-slate-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={styles.popper}
          {...attributes.popper}
        >
          {groupBySeparators(props.items).map((items, i) => (
            <div className="py-1" key={`group-${i}`}>
              {items.map((item) => (
                <HeadlessMenu.Item key={item.title}>
                  {({ active }) => {
                    if ("href" in item) {
                      return (
                        <Link
                          href={item.href}
                          className={clsx(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm",
                            item.className
                          )}
                        >
                          {item.title}
                        </Link>
                      );
                    }
                    return (
                      <button
                        onClick={item.onClick}
                        className={clsx(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full px-4 py-2 text-left text-sm",
                          item.className
                        )}
                      >
                        {item.title}
                      </button>
                    );
                  }}
                </HeadlessMenu.Item>
              ))}
            </div>
          ))}
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
}

function groupBySeparators(items: MenuItemWithSeparator[]) {
  return items.reduce(
    (mem, item) => {
      if (item === "---") {
        return [...mem, []];
      }
      mem[mem.length - 1].push(item);
      return mem;
    },
    [[]] as MenuItem[][]
  );
}
