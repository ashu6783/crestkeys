import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Mail, LogOut, Edit, User, UserCog } from "lucide-react";


interface ProfileCardProps {
  currentUser: {
    username: string;
    email: string;
    accountType:string;
    avatar?: string;
  };
  postCount: number;
  savedCount: number;
  boughtCount: number;
  handleLogout: () => Promise<void>;
}

const ProfileCard: React.FC<ProfileCardProps> = memo(({
  currentUser,
  postCount,
  savedCount,
  boughtCount,
  handleLogout,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-[#171b2c] to-[#4d4b1e] shadow-xl rounded-xl md:rounded-2xl p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto">
          <div className="relative">
            <img
              src={currentUser.avatar || "/avatar.svg"}
              alt="Avatar"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-3 md:border-4 border-[#B8860B] shadow-lg hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-2 -right-2 bg-teal-100 text-teal-600 text-xs font-bold rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center shadow-sm">
              {currentUser.username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {currentUser.username}
            </h1>
            <p className="text-[#B8860B] flex items-center justify-center sm:justify-start gap-1 mt-1 text-sm md:text-base">
              <Mail size={14} />
              {currentUser.email}
            </p>
            <p className="text-white flex items-center justify-center sm:justify-start gap-1 mt-1 text-sm lg:font-bold md:text-base" >
              <UserCog size={14}/>
              Account type : <span className="font-extrabold">{currentUser.accountType}</span>
            </p>

            <div className="mt-4 flex gap-2 md:gap-3 justify-center sm:justify-start flex-wrap sm:flex-nowrap">
              <Link to="/profile/update">
                <button className="bg-[#B8860B] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-md flex items-center gap-1 md:gap-2 hover:scale-105 transition-transform active:scale-95 text-sm md:text-base">
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#0d2718] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-md flex items-center gap-1 md:gap-2 hover:scale-105 transition-transform active:scale-95 text-sm md:text-base"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="w-full sm:w-auto mt-4 md:mt-0 p-3 md:p-6 bg-black bg-opacity-20 rounded-lg border border-[#B8860B] border-opacity-30">
          <div className="flex items-center gap-2 mb-2">
            <User className="text-[#B8860B]" size={16} />
            <h3 className="text-white font-medium text-sm md:text-base">Account Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-white">
            <div>
              <p className="text-xs md:text-sm text-gray-300">Posts</p>
              <p className="text-xl md:text-2xl font-bold">{postCount}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-300">Saved</p>
              <p className="text-xl md:text-2xl font-bold">{savedCount}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-300">Bought</p>
              <p className="text-xl md:text-2xl font-bold">{boughtCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.currentUser.username === nextProps.currentUser.username &&
    prevProps.currentUser.accountType===nextProps.currentUser.accountType&&
    prevProps.currentUser.email === nextProps.currentUser.email &&
    prevProps.currentUser.avatar === nextProps.currentUser.avatar &&
    prevProps.postCount === nextProps.postCount &&
    prevProps.savedCount === nextProps.savedCount &&
    prevProps.boughtCount === nextProps.boughtCount
  );
});

export default ProfileCard;