// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import Filter from "./Filter"; // Assuming you have a Filter component

// const Searchbar = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   // Function to update the search query
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   return (
//     <div>
//       <Navbar searchQuery={searchQuery} onSearch={handleSearch} />
//       <Filter searchQuery={searchQuery} />
//     </div>
//   );
// };

// export default Searchbar;






import React, { useState } from "react";
import Navbar from "./Navbar";
import Filter from "./Filter"; // Assuming you have a Filter component

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Function to update the search query
  const handleSearch = (query) => {
    setSearchQuery(query);  // This updates the search query in the state
  };

  return (
    <div>
      {/* Pass the search query and the onSearch handler to Navbar */}
      <Navbar searchQuery={searchQuery} onSearch={handleSearch} />
      <Filter searchQuery={searchQuery} />
    </div>
  );
};

export default Searchbar;
