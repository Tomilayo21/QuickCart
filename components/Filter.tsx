// "use client";

// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// const Filter = ({ searchQuery }: { searchQuery: string }) => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     const params = new URLSearchParams(searchParams.toString());

//     if (value === "") {
//       params.delete(name);
//     } else {
//       params.set(name, value);
//     }

//     if (searchQuery) {
//       params.set("search", searchQuery);
//     }

//     router.replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <div className="mt-12 flex flex-col md:flex-row md:items-center gap-2">
//       {/* Filter section */}
//       <div className="flex flex-wrap gap-4">
//         <select
//           name="type"
//           className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
//           onChange={handleFilterChange}
//         >
//           <option value="">Type</option>
//           <option value="physical">Physical</option>
//           <option value="digital">Digital</option>
//         </select>

//         <input
//           type="number"
//           name="min"
//           placeholder="Min price"
//           className="text-xs rounded-2xl px-4 py-2 w-24 ring-1 ring-gray-300 placeholder:text-gray-400"
//           onChange={handleFilterChange}
//         />
//         <input
//           type="number"
//           name="max"
//           placeholder="Max price"
//           className="text-xs rounded-2xl px-4 py-2 w-24 ring-1 ring-gray-300 placeholder:text-gray-400"
//           onChange={handleFilterChange}
//         />

//         <select
//           name="category"
//           className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
//           onChange={handleFilterChange}
//         >
//           <option value="">Category</option>
//           <option value="Earphone">Earphone</option>
//           <option value="Headphone">Headphone</option>
//           <option value="Watch">Watch</option>
//           <option value="Smartphone">Smartphone</option>
//           <option value="Laptop">Laptop</option>
//           <option value="Camera">Camera</option>
//           <option value="Accessories">Accessories</option>
//         </select>
//       </div>

//       {/* Sort section */}
//       <div className="md:self-end">
//         <select
//           name="sort"
//           className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-300"
//           onChange={handleFilterChange}
//         >
//           <option value="">Sort By</option>
//           <option value="asc price">Price (low to high)</option>
//           <option value="desc price">Price (high to low)</option>
//           <option value="asc date">Newest</option>
//           <option value="desc date">Oldest</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Filter;
























"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  searchQuery: string;
}

const Filter = ({ searchQuery }: FilterProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams.toString());

    // Apply or remove the filter
    if (value === "") {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    // Maintain the search query and reset page to 1
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex flex-col md:flex-row md:items-center gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        <select
          name="type"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
        >
          <option value="">Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>

        <input
          type="number"
          name="min"
          placeholder="Min price"
          className="text-xs rounded-2xl px-4 py-2 w-24 ring-1 ring-gray-300 placeholder:text-gray-400"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="max"
          placeholder="Max price"
          className="text-xs rounded-2xl px-4 py-2 w-24 ring-1 ring-gray-300 placeholder:text-gray-400"
          onChange={handleFilterChange}
        />

        <select
          name="category"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
        >
          <option value="">Category</option>
          <option value="Earphone">Earphone</option>
          <option value="Headphone">Headphone</option>
          <option value="Watch">Watch</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Laptop">Laptop</option>
          <option value="Camera">Camera</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* Sort Control */}
      <div className="md:self-end">
        <select
          name="sort"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-300"
          onChange={handleFilterChange}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
          <option value="asc date">Newest</option>
          <option value="desc date">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
