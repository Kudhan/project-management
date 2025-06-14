import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export const WorkspaceAvatar = ({
  color,
  name,
}: {
  color: string;
  name: string;
}) => {
  return (
    <Avatar className="w-6 h-6 rounded overflow-hidden flex items-center justify-center">
      <AvatarImage src="" alt={name} />
      <AvatarFallback
        className="w-full h-full flex items-center justify-center text-xs font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
