// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Users, Gauge } from "lucide-react";
// import { useClerk, useUser, UserButton } from '@clerk/nextjs';
// import { Calendar, Clock } from "lucide-react";


// const AdminHeader = () => {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const { user } = useUser();


//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       const formattedDate = now.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       });

//       const formattedTime = now.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: true,
//       });

//       console.log('Time updated:', formattedTime); // ✅ debug

//       setDate(formattedDate);
//       setTime(formattedTime);
//     };

//     updateTime();
//     const interval = setInterval(updateTime, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-gradient-to-r from-gray-900 via-black to-orange-600 text-white rounded-2xl p-6 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between">
//       {/* Left Section */}
//       <div className="flex items-center gap-4 mb-4 md:mb-0">
//         <div className="p-3 bg-white/10 rounded-full">
//           <Gauge className="w-6 h-6 text-white" />
//         </div>
//         <div>
//           {user ? (
//             <>
//               <h2 className="text-2xl font-extrabold tracking-tight">
//                 <span className="font-semibold">{user.fullName || user.primaryEmailAddress?.emailAddress}</span>'s Dashboard
//               </h2>
//               <p className="text-sm text-gray-300 mt-1">
//                 Platform Metrics Summary — here’s what’s happening today.
//               </p>
//             </>
//           ) : (
//             <>
//               <h2 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h2>
//               <button
//                 onClick={() => openSignIn()}
//                 className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-sm font-medium transition"
//               >
//                 <Users className="w-4 h-4" />
//                 <span>Sign In</span>
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-6 text-sm font-medium">
//       <span className="flex items-center gap-2">
//         <Calendar className="w-4 h-4 text-white/80" />
//         <span className="text-white/90">{date}</span>
//       </span>
//       <span className="flex items-center gap-2">
//         <Clock className="w-4 h-4 text-white/80 animate-spin-slow" />
//         <span className="text-white/90">{time}</span>
//       </span>
//     </div>
//     </div>
//   );
// };

// export default AdminHeader;














































// "use client";
// import React, { useEffect, useState } from "react";
// import { Users, Gauge, Calendar, Clock } from "lucide-react";
// import { useUser } from "@clerk/nextjs";

// const AdminHeader = () => {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [greeting, setGreeting] = useState("Welcome");
//   const { user } = useUser();

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();

//       // Greeting logic
//       const hour = now.getHours();
//       if (hour < 12) setGreeting("Good Morning");
//       else if (hour < 18) setGreeting("Good Afternoon");
//       else setGreeting("Good Evening");

//       const formattedDate = now.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });

//       const formattedTime = now.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//         hour12: true,
//       });

//       setDate(formattedDate);
//       setTime(formattedTime);
//     };

//     updateTime();
//     const interval = setInterval(updateTime, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-orange-700 text-white rounded-2xl p-6 mb-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between border border-white/10">
//       {/* Left Section */}
//       <div className="flex items-center gap-5 mb-4 md:mb-0">
//         <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-md">
//           <Gauge className="w-7 h-7 text-orange-400 animate-pulse" />
//         </div>
//         <div>
//           {user ? (
//             <>
//               <h2 className="text-2xl font-bold tracking-tight">
//                 {greeting},{" "}
//                 <span className="text-orange-300">
//                   {user.fullName || user.primaryEmailAddress?.emailAddress}
//                 </span>
//               </h2>
//               <p className="text-sm text-gray-300 mt-1">
//                 Here’s a quick look at today’s insights and platform metrics.
//               </p>
//             </>
//           ) : (
//             <>
//               <h2 className="text-2xl font-bold tracking-tight">
//                 {greeting}, Admin
//               </h2>
//               <button
//                 className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-sm font-medium transition backdrop-blur-md"
//               >
//                 <Users className="w-4 h-4" />
//                 <span>Sign In</span>
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-6 text-sm font-medium">
//         <span className="flex items-center gap-2">
//           <Calendar className="w-4 h-4 text-orange-300" />
//           <span className="text-white/90">{date}</span>
//         </span>
//         <span className="flex items-center gap-2">
//           <Clock className="w-4 h-4 text-orange-300 animate-spin-slow" />
//           <span className="text-white/90">{time}</span>
//         </span>
//       </div>
//     </div>
//   );
// };

// export default AdminHeader;

























'use client';
import React, { useEffect, useState } from 'react';
import { Users, Gauge, Calendar, Clock, Sun, Sunrise, Sunset, Moon } from "lucide-react";
import { useUser } from '@clerk/nextjs';

const AdminHeader = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [tagline, setTagline] = useState({ text: '', icon: null });
  const { user } = useUser();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      setDate(formattedDate);
      setTime(formattedTime);

      const hours = now.getHours();
      if (hours < 12) {
        setGreeting("Good Morning");
        setTagline({
          text: "Start your day strong",
          icon: <Sunrise className="w-4 h-4 text-yellow-300" />,
        });
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
        setTagline({
          text: "Keep pushing forward",
          icon: <Sun className="w-4 h-4 text-orange-300" />,
        });
      } else {
        setGreeting("Good Evening");
        setTagline({
          text: "You did great today, recharge for tomorrow",
          icon: <Moon className="w-4 h-4 text-indigo-300" />,
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // <div className="bg-gradient-to-r from-gray-900 via-black to-orange-600 text-white rounded-2xl p-6 mb-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between">
    //   {/* Left Section */}
    //   <div className="flex items-center gap-4 mb-4 md:mb-0">
    //     <div>
    //       {user ? (
    //         <>
    //           <h2 className="text-2xl font-extrabold tracking-tight">
    //             <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-400 text-transparent bg-clip-text">
    //               {greeting},
    //             </span>{" "}
    //             <span className="font-semibold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
    //               {user?.firstName || user?.fullName?.split(" ")[0] || user?.primaryEmailAddress?.emailAddress}
    //             </span>

    //           </h2>

    //           <p className="flex items-center gap-2 text-sm mt-1 bg-gradient-to-r from-gray-200 to-gray-400 text-transparent bg-clip-text">
    //             {tagline.icon} {tagline.text}
    //           </p>
    //         </>
    //       ) : (
    //         <>
    //           <h2 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h2>
    //           <p className="flex items-center gap-2 text-sm text-gray-300 mt-1">
    //             {tagline.icon} {tagline.text}
    //           </p>
    //           <button
    //             onClick={() => openSignIn()}
    //             className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-sm font-medium transition"
    //           >
    //             <Users className="w-4 h-4" />
    //             <span>Sign In</span>
    //           </button>
    //         </>
    //       )}
    //     </div>
    //   </div>

    //   {/* Right Section */}
    //   <div className="flex items-center gap-6 text-sm font-medium">
    //     <span className="flex items-center gap-2">
    //       <Calendar className="w-4 h-4 text-white/80" />
    //       <span className="text-white/90">{date}</span>
    //     </span>
    //     <span className="flex items-center gap-2">
    //       <Clock className="w-4 h-4 text-white/80 animate-spin-slow" />
    //       <span className="text-white/90">{time}</span>
    //     </span>
    //   </div>
    // </div>

    <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 
                    border border-orange-100 
                    text-gray-900 
                    rounded-2xl p-6 mb-6 
                    shadow-md hover:shadow-lg 
                    transition-shadow 
                    flex flex-col md:flex-row items-start md:items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div>
          {user ? (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 text-transparent bg-clip-text">
                  {greeting},
                </span>{" "}
                <span className="font-semibold bg-gradient-to-r from-gray-800 to-gray-500 text-transparent bg-clip-text">
                  {user?.firstName || user?.fullName?.split(" ")[0] || user?.primaryEmailAddress?.emailAddress}
                </span>
              </h2>

              <p className="flex items-center gap-2 text-sm mt-1 bg-gradient-to-r from-gray-600 to-gray-400 text-transparent bg-clip-text">
                {tagline.icon} {tagline.text}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight">Admin Dashboard</h2>
              <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                {tagline.icon} {tagline.text}
              </p>
              <button
                onClick={() => openSignIn()}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-sm font-medium transition text-orange-700"
              >
                <Users className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>{date}</span>
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500 animate-spin-slow" />
          <span>{time}</span>
        </span>
      </div>
    </div>

  );
};

export default AdminHeader;
