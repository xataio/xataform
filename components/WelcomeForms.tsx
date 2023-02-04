import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./Button";

export type WelcomeFormsProps = {
  onCreateClick: () => void;
};

export function WelcomeForms(props: WelcomeFormsProps) {
  const { user } = useUser();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image src="/welcome-forms.svg" width={200} height={200} alt="Welcome" />
      <h1 className="mt-4 mb-2 text-xl">Welcome {user?.firstName}😊</h1>
      <p className="text-md mb-4 text-slate-500">
        It’s time to create something amazing!
      </p>
      <Button icon="add" onClick={props.onCreateClick}>
        Create xataform
      </Button>
    </div>
  );
}
