// import React from 'react'

// const Loading = () => {
//     return (
//         <div className="flex justify-center items-center h-[70vh]">
//             <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-orange-300 border-gray-200"></div>
//         </div>
//     )
// }

// export default Loading





















// import React from "react";

// const Loading = ({ message = "Loading..." }) => {
//   return (
//     <div className="flex flex-col justify-center items-center h-[70vh] space-y-6">
//       {/* Spinner */}
//       <div className="relative">
//         <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-orange-500 border-gray-300 shadow-lg"></div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="h-8 w-8 bg-orange-500 rounded-full animate-pulse"></span>
//         </div>
//       </div>

//       {/* Message */}
//       <p className="text-gray-600 text-lg font-medium animate-pulse">
//         {message}
//       </p>
//     </div>
//   );
// };

// export default Loading;


























import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh] space-y-6">
      {/* Box animation */}
      <div className="flex space-x-2">
        <div className="h-6 w-6 bg-orange-500 rounded-md animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="h-6 w-6 bg-orange-400 rounded-md animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="h-6 w-6 bg-orange-300 rounded-md animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>

      {/* Message */}
      <p className="text-gray-600 text-lg font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default Loading;
