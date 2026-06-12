import { useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/ApiRequest";
import { AuthContext } from "../../context/AuthContext";
import { Plus, Save, FileText, LogOut, Inbox, ShoppingBag } from "lucide-react";
import ProfileCard from "../../components/ProfileCard";
import PostList from "../../components/list/PostList";
import { useGetProfilePostsQuery } from "../../state/api";
import { motion } from "framer-motion";

const SimpleLoader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function ProfilePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"myPosts" | "savedPosts" | "boughtPosts">("myPosts");
  const { data: postResponse, isLoading, isError } = useGetProfilePostsQuery();

  const handleLogout = useCallback(async () => {
    try {
      await apiRequest.post("/auth/logout");
      navigate("/");
      updateUser(null);
    } catch (err) {
      console.error(err);
    }
  }, [updateUser, navigate]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <SimpleLoader />
      </div>
    );
  }

  if (isLoading) return <SimpleLoader />;
  if (isError || !postResponse)
    return (
      <div className="bg-red-100 text-red-500 p-3 md:p-4 rounded-lg text-center text-sm md:text-base">
        Error loading data!
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-3 sm:px-6 md:px-10 py-6">
      {/* Profile Section */}
      <div className="mb-6">
        <ProfileCard
          currentUser={currentUser}
          postCount={postResponse.userPosts.length}
          savedCount={postResponse.savedPosts.length}
          boughtCount={postResponse.boughtPosts.length}
          handleLogout={handleLogout}
        />
      </div>

      {/* Tabs + Posts */}
      <div className="w-full backdrop-blur-lg bg-white/5 shadow-2xl rounded-2xl p-5 md:p-8 border border-white/10">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700 overflow-x-auto relative">
          {(
            [
              { id: "myPosts" as const, label: "My Posts", icon: FileText },
              { id: "savedPosts" as const, label: "Saved Posts", icon: Save },
              { id: "boughtPosts" as const, label: "Bought Properties", icon: ShoppingBag },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative py-2 md:py-3 px-4 md:px-6 flex items-center gap-2 font-medium text-sm md:text-base transition-all whitespace-nowrap`}
            >
              <Icon size={18} className={activeTab === id ? "text-[#FFD700]" : "text-gray-400"} />
              <span className={activeTab === id ? "text-white" : "text-gray-400 hover:text-white"}>
                {label}
              </span>

              {activeTab === id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFD700]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Posts Section */}
        {activeTab === "myPosts" && (
          <motion.div key="myPosts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">My Posts</h2>
              <Link to="/add">
                <button className="w-full sm:w-auto bg-[#FFD700] text-black px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg flex items-center justify-center gap-1 md:gap-2 hover:scale-105 transition-transform active:scale-95 text-sm md:text-base">
                  <Plus size={16} />
                  <span>Create Post</span>
                </button>
              </Link>
            </div>
            <PostList
              posts={postResponse.userPosts}
              emptyMessage={
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Inbox size={40} className="mb-3" />
                  <p>You haven't created any posts yet.</p>
                </div>
              }
            />
          </motion.div>
        )}

        {activeTab === "savedPosts" && (
          <motion.div key="savedPosts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Saved Posts</h2>
            <PostList
              posts={postResponse.savedPosts}
              emptyMessage={
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Inbox size={40} className="mb-3" />
                  <p>You haven't saved any posts yet.</p>
                </div>
              }
            />
          </motion.div>
        )}

        {activeTab === "boughtPosts" && (
          <motion.div key="boughtPosts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Bought Properties</h2>
            <PostList
              posts={postResponse.boughtPosts}
              emptyMessage={
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Inbox size={40} className="mb-3" />
                  <p>You haven't purchased any properties yet.</p>
                </div>
              }
            />
          </motion.div>
        )}
      </div>

      {/* Logout Button Floating Bottom Right */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
