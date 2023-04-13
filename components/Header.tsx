import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Transition, Menu } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { LinkProps } from "next/link";
import React, { Fragment } from "react";

export type HeaderProps = {
  children?: [React.ReactNode, React.ReactNode, React.ReactNode];
};

export function Header({ children }: HeaderProps) {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <header className="grid grid-cols-3 bg-indigo-600 text-white shadow">
      <div className="grid grid-cols-header items-center gap-2 p-2">
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
        {children ? children[0] : null}
      </div>

      {children ? children[1] : null}

      <div className="col-start-3 flex items-center justify-end gap-2 p-2">
        {children ? children[2] : null}
        {/* Profile dropdown */}
        <UserButton />
      </div>
    </header>
  );
}
