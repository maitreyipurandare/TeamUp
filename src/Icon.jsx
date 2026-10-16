import {
  LuCircleHelp,
  LuSettings,
  LuArrowLeft,
  LuInfo,
  LuSearch,
  LuSlidersHorizontal,
  LuHouse,
  LuCalendarDays,
  LuUser,
  LuBell,
  LuUsers,
  LuTrophy,
  LuChevronRight,
  LuChevronDown,
  LuCamera,
  LuGrid3X3,
  LuMapPin,
  LuVolleyball,
} from "react-icons/lu";
import { PiFootball, PiBroom } from "react-icons/pi";

const ICONS = {
  help: LuCircleHelp,
  gear: LuSettings,
  back: LuArrowLeft,
  info: LuInfo,
  search: LuSearch,
  sliders: LuSlidersHorizontal,
  home: LuHouse,
  cal: LuCalendarDays,
  user: LuUser,
  bell: LuBell,
  users: LuUsers,
  trophy: LuTrophy,
  chev: LuChevronRight,
  down: LuChevronDown,
  cam: LuCamera,
  grid: LuGrid3X3,
  pin: LuMapPin,
  volleyball: LuVolleyball,
  football: PiFootball,
  broom: PiBroom,
};

export default function Icon({ name, size }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} />;
}
