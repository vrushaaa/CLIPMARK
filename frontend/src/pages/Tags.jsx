// import React, { useState, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import NavBar from "../components/NavBar";
// import { Tag, Menu } from "lucide-react";

// // --- Mock Data (Replace with API call in a real application) ---
// const mockTags = [
//   { name: "react", count: 8 },
//   { name: "javascript", count: 15 },
//   { name: "css", count: 5 },
//   { name: "backend", count: 12 },
//   { name: "productivity", count: 3 },
//   { name: "ai", count: 6 },
//   { name: "design", count: 2 },
//   { name: "tools", count: 10 },
//   { name: "tutorial", count: 7 },
//   { name: "api", count: 4 },
// ];

// // Simple component for a single tag link
// const TagLink = ({ name, count, isMostUsed = false }) => {
//   const primaryColor = isMostUsed
//     ? "bg-[#4CCCE6]/20 border-[#4CCCE6]/30 text-[#4CCCE6] hover:bg-[#4CCCE6]/30 hover:text-white" // Lighter for most used
//     : "bg-white/5 dark:bg-slate-800/50 border-transparent text-slate-900 dark:text-white group-hover:border-[#4CCCE6] group-hover:shadow-lg group-hover:shadow-[#4CCCE6]/10"; // Card hover style

//   const countBadge = isMostUsed
//     ? "bg-[#4CCCE6]/30 text-white"
//     : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

//   if (isMostUsed) {
//     return (
//       <a
//         // href={`/bookmarks?tag=${name}`} // Example link structure
//         className={`inline-flex items-center px-4 py-2 rounded-full transition-all ${primaryColor}`}
//       >
//         <span className="font-medium">#{name}</span>
//         <span
//           className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${countBadge}`}
//         >
//           {count}
//         </span>
//       </a>
//     );
//   }

//   // Tags Grid Item
//   return (
//     <a
//       // href={`/bookmarks?tag=${name}`}
//       className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-[#4CCCE6] hover:shadow-xl hover:shadow-[#4CCCE6]/10"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className="bg-[#4CCCE6]/10 p-3 rounded-lg group-hover:bg-[#4CCCE6]/20 transition-colors">
//           <Tag className="w-6 h-6 text-[#4CCCE6]" />
//         </div>
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium ${countBadge}`}
//         >
//           {count}
//         </span>
//       </div>

//       <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-[#4CCCE6] transition-colors mb-2">
//         #{name}
//       </h3>

//       <p className="text-slate-600 dark:text-slate-400 text-sm">
//         {count} {count === 1 ? "bookmark" : "bookmarks"}
//       </p>
//     </a>
//   );
// };

// export default function TagsPage() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
//   const [tags, setTags] = useState([]);

//   useEffect(() => {
//     // In a real app, you would fetch data here
//     // For now, use the mock data
//     const sortedTags = mockTags.sort((a, b) => b.count - a.count);
//     setTags(sortedTags);
//   }, []);

//   const totalTags = tags.length;
//   const mostUsedTags = tags.slice(0, 5);

//   return (
//     <>
//       <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

//       <div className="flex min-h-screen bg-[#e9f9fc] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
//         <button
//           onClick={toggleSidebar}
//           className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md lg:hidden transition hover:opacity-90"
//           aria-label="Toggle Sidebar"
//         >
//           <Menu size={24} />
//         </button>

//         {/* Sidebar Container */}
//         <div
//           className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
//             isSidebarOpen
//               ? "w-64 translate-x-0"
//               : "w-64 -translate-x-full lg:w-0"
//           } overflow-y-auto shrink-0`}
//         >
//           <Sidebar />
//           {/* Mobile Overlay */}
//           {isSidebarOpen && (
//             <div
//               onClick={toggleSidebar}
//               className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//               aria-hidden="true"
//             />
//           )}
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col">
//           <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
//             {/* Header Section */}
//             <div className="mb-10 mt-10">
//               <div className="flex flex-row gap-3 items-center">
//                 <Tag className="w-8 h-8 text-[#4CCCE6]" />
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-[#1999b3] dark:text-[#4CCCE6] mb-2">
//                   Your Tags
//                 </h1>
//               </div>
//               <p className="text-slate-600 dark:text-slate-400">
//                 Organize and filter your bookmarks by tags
//               </p>
//             </div>

//             {/* Stats Card */}
//             <div className="flex flex-col md:flex-row gap-6 mb-10">
//               {/* Total Tags Card */}
//               <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
//                 <p className="text-slate-600 dark:text-slate-400 text-sm">
//                   Total Tags
//                 </p>
//                 <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
//                   {totalTags}
//                 </p>
//               </div>

//               {/* Most Used Tags Card (Conditional) */}
//               {totalTags > 0 && (
//                 <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
//                   <div className="flex flex-row items-center gap-3 mb-4">
//                     <Tag className="w-6 h-6 text-[#1999b3] dark:text-[#4CCCE6]" />
//                     <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
//                       Most Used Tags
//                     </h2>
//                   </div>

//                   <div className="flex flex-wrap gap-3">
//                     {mostUsedTags.map((tag) => (
//                       <TagLink
//                         key={tag.name}
//                         name={tag.name}
//                         count={tag.count}
//                         isMostUsed={true}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Tags Grid */}
//             {totalTags > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
//                 {tags.map((tag) => (
//                   <TagLink key={tag.name} name={tag.name} count={tag.count} />
//                 ))}
//               </div>
//             ) : (
//               // Empty State
//               <div className="bg-white dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center shadow-lg">
//                 <div className="bg-slate-200/50 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Tag className="w-10 h-10 text-slate-500 dark:text-slate-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
//                   No tags yet
//                 </h3>
//                 <p className="text-slate-600 dark:text-slate-400">
//                   Start adding bookmarks to automatically create tags.
//                 </p>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tagService from "../services/tagService";

export default function Tags() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const navigate = useNavigate();

  // ---------------- FETCH TAGS ----------------
  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await tagService.getAllTags();
        setTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  const openTagBookmarks = (tagName) => {
    navigate(`/tags/${tagName}`);
  };

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex min-h-screen bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 transition-colors">

        {/* Mobile sidebar button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 lg:hidden z-50 p-2 rounded-full bg-[#4CCCE6] text-black shadow-md hover:opacity-90"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 
          transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-0"} 
          overflow-y-auto`}
        >
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 p-4 md:p-8">
          
          <h1 className="text-3xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-white mb-6">
            Tags
          </h1>

          {loading ? (
            <p className="text-slate-600 dark:text-slate-400">Loading tags...</p>
          ) : tags.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">
              No tags found. Add some bookmarks with tags!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {tags.map((tag) => (
                <div
                  key={tag.name}
                  onClick={() => openTagBookmarks(tag.name)}
                  className="
                    p-5 rounded-xl shadow-md cursor-pointer 
                    bg-white dark:bg-slate-800 
                    border border-[var(--color-sky-aqua-200)] dark:border-slate-700
                    transition-all duration-300 ease-in-out

                    hover:shadow-2xl 
                    hover:scale-[1.03]
                    hover:bg-[var(--color-sky-aqua-50)]
                    dark:hover:bg-slate-700
                    hover:border-[var(--color-sky-aqua-400)]
                  "
                >
                  <h2 className="text-xl font-bold capitalize text-[var(--color-sky-aqua-900)] dark:text-white">
                    #{tag.name}
                  </h2>

                  <span
                    className="
                      inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold
                      bg-[var(--color-sky-aqua-100)] text-[var(--color-sky-aqua-900)]
                      dark:bg-slate-700 dark:text-slate-200
                    "
                  >
                    {tag.count} bookmark(s)
                  </span>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </>
  );
}
