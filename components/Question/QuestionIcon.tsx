import {
  AtSymbolIcon,
  Bars2Icon,
  Bars3BottomLeftIcon,
  BarsArrowDownIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon,
  HandThumbUpIcon,
  HashtagIcon,
  HomeIcon,
  IdentificationIcon,
  LinkIcon,
  ListBulletIcon,
  PhoneIcon,
  ScaleIcon,
  Squares2X2Icon,
  StarIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ForwardRefExoticComponent, SVGProps } from "react";
import { QuestionType } from "server/routers/question/question.schemas";

export type QuestionIconProps = {
  type: QuestionType;
  order?: number;
};

export function QuestionIcon({ type, order }: QuestionIconProps) {
  const { Icon, color } = variant[type];

  return (
    <div
      className={clsx(
        color,
        "flex flex-row items-center gap-2 rounded py-0.5 px-2 text-slate-800",
        "bg-"
      )}
    >
      <Icon className="h-4 w-4" />
      {typeof order === "number" && (
        <div className="min-w-[16px] text-right text-sm font-medium">
          {order}
        </div>
      )}
    </div>
  );
}

type Heroicon = ForwardRefExoticComponent<
  SVGProps<SVGSVGElement> & {
    title?: string | undefined;
    titleId?: string | undefined;
  }
>;

const variant: Record<QuestionType, { Icon: Heroicon; color: string }> = {
  // Contact info
  address: { Icon: HomeIcon, color: "bg-teal-500" },
  contactInfo: { Icon: IdentificationIcon, color: "bg-teal-500" },
  email: { Icon: AtSymbolIcon, color: "bg-teal-500" },
  phoneNumber: { Icon: PhoneIcon, color: "bg-teal-500" },
  website: { Icon: LinkIcon, color: "bg-teal-500" },

  // Text
  shortText: { Icon: Bars2Icon, color: "bg-sky-500" },
  longText: { Icon: Bars3BottomLeftIcon, color: "bg-sky-500" },

  // Number
  number: { Icon: HashtagIcon, color: "bg-green-500" },

  // Date
  date: { Icon: CalendarDaysIcon, color: "bg-orange-400" },

  // Choices
  dropdown: { Icon: ChevronDownIcon, color: "bg-pink-400" },
  yesNo: { Icon: HandThumbUpIcon, color: "bg-pink-400" },
  multipleChoice: { Icon: ListBulletIcon, color: "bg-pink-400" },

  // Structure
  statement: { Icon: ChatBubbleOvalLeftEllipsisIcon, color: "bg-yellow-500" },

  // Rating / Ranking
  matrix: { Icon: Squares2X2Icon, color: "bg-fuchsia-400" },
  opinionScale: { Icon: ChartBarIcon, color: "bg-fuchsia-400" },
  ranking: { Icon: BarsArrowDownIcon, color: "bg-fuchsia-400" },
  rating: { Icon: StarIcon, color: "bg-fuchsia-400" },

  // Legal
  legal: { Icon: ScaleIcon, color: "bg-lime-500" },
};
