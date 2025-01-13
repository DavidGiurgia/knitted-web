import React from 'react';
import { Avatar, Tooltip } from "@nextui-org/react"; // Poți folosi o bibliotecă de UI pentru avatare


const ChatLinkItem = ({ participants }) => {
    if (!participants || participants.length === 0) {
        return null; // Dacă nu există utilizatori, nu afișăm nimic
      }

      const displayedUsers = participants.slice(0, 2); // Limităm numărul de utilizatori afișați
      const remainingCount = participants.length - 2; // Calculăm câți utilizatori nu sunt afișați
      return (
        <div className="flex items-center gap-2">
          {/* Grupul de avatare */}
          <div className="flex -space-x-6 space-y-2">
            {displayedUsers.map((user, index) => (
              <Tooltip key={index} content={user.username}>
                <Avatar
                  src={user.avatarUrl || ""}
                  alt={user?.fullname|| user.username}
                />
              </Tooltip>
            ))}
    
          </div>
    
          {/* Text descriptiv */}
          <span className="text-sm">
            {displayedUsers.map((user) => user.username).join(", ")}
            {remainingCount > 0 && `, and ${remainingCount} more`}
          </span>
        </div>
      );
}

export default ChatLinkItem