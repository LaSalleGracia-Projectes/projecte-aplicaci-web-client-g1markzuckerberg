import { UserPlus, UserMinus, ArrowLeftRight } from "lucide-react";

const iconMap = {
  join: <UserPlus className="w-6 h-6 text-green-500" />,
  leave: <UserMinus className="w-6 h-6 text-red-500" />,
  position: <ArrowLeftRight className="w-6 h-6 text-blue-500" />,
};

export default function LeagueMessage({ type, message }) {
  const icon = iconMap[type] || <ArrowLeftRight className="w-6 h-6 text-gray-500" />;

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
