import { Avatar } from "@heroui/react";
import InitialsAvatar from "./InitialsAvatar";

const UserListItem = ({ user }) => {
  return (
    <div className="py-2 flex-1">
      <div className="flex items-center  gap-x-4">
        {user?.avatarUrl ? (
          <Avatar  showFallback src={user?.avatarUrl} />
        ) : (
          <InitialsAvatar nickname={user?.fullname} size={40} />
        )}
        <div className="flex flex-col flex-1">
          <div className="text-sm font-medium">{user?.username}</div>
          <div className="text-gray-500 text-sm">
            {user?.fullname || user?.bio || user?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
