import { UserPlus, UserMinus, ArrowLeftRight, Trophy } from "lucide-react";

const iconMap = {
  join: <UserPlus className="w-6 h-6 text-green-500" />,
  leave: <UserMinus className="w-6 h-6 text-red-500" />,
  position: <ArrowLeftRight className="w-6 h-6 text-blue-500" />,
};

const messageMap = {
  join: () => `Te has unido a la liga.`,
  leave: () => `Has abandonado la liga.`,
  position: ([name]) => `${name} ha cambiado de posición.`,
};

export default function LeagueMessage({ type, participants = [] }) {
  const icon = iconMap[type];
  const message = messageMap[type](participants);

  return (
    <div className="relative border border-gray-300 rounded-lg p-6 shadow-sm mb-4">
      <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-2 py-1 text-sm font-semibold rounded-tl-lg rounded-br-lg">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div className="mt-6 flex items-start space-x-4">
        {icon}
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
