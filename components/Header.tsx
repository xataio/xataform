import { useAuth, useUser } from "@clerk/nextjs";
import { Transition, Menu } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { LinkProps } from "next/link";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Header() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const userNavigation: Array<{
    name: string;
    onClick?: () => void;
    href?: LinkProps["href"];
  }> = [
    {
      name: "Your Profile",
      href: {
        pathname: "/user-profile/[[...index]]",
      },
    },
    { name: "Sign out", onClick: signOut },
  ];

  return (
    <header className="flex-auto grow-0 bg-indigo-600 text-white shadow">
      <div className="mx-auto p-2">
        <div className="flex justify-between">
          <Link
            href="/forms"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Image
              className="h-7 w-auto pr-2"
              priority={false}
              src="/xataform-logo.svg"
              alt="XataForm"
              width={32}
              height={32}
            />
            <h1>XataForm</h1>
          </Link>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-4 flex-shrink-0">
            <div>
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                {user ? (
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={user.profileImageUrl}
                    alt="Profile picture"
                    width={32}
                    height={32}
                  />
                ) : (
                  <UserIcon className="h-8 w-8 rounded-full bg-indigo-200 fill-indigo-400" />
                )}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) =>
                      item.href ? (
                        <Link
                          href={item.href}
                          className={classNames(
                            active ? "bg-indigo-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          className={classNames(
                            active ? "bg-indigo-100" : "",
                            "block px-4 py-2 text-sm text-gray-700",
                            "cursor-pointer "
                          )}
                          onClick={item.onClick}
                        >
                          {item.name}
                        </a>
                      )
                    }
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
