// "use client";

// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import Papa from "papaparse";

// interface ClerkUser {
//   id: string;
//   first_name: string | null;
//   last_name: string | null;
//   email_addresses: { email_address: string, id: string }[];
//   profile_image_url: string;
//   public_metadata?: { role?: "admin" | "user" };
//   created_at: number;
//   updated_at: number;
//   last_sign_in_at: number | null;
//   external_accounts: { provider: string }[];
//   primary_phone_number: string | null;
// }

// export default function UserList() {
//   const [users, setUsers] = useState<ClerkUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 5;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("/api/clerk-users");
//         if (!res.ok) throw new Error("Failed to load users");
//         const data = await res.json();
//         setUsers(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const updateRole = async (userId: string, selectedRole: "admin" | "user") => {
//     try {
//       const res = await fetch(`/api/clerk-users/${userId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role: selectedRole }),
//       });

//       if (!res.ok) throw new Error("Failed to update role");

//       toast.success(`Role changed to ${selectedRole.toUpperCase()}`);
//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, public_metadata: { role: selectedRole } } : user
//         )
//       );
//     } catch (err: any) {
//       toast.error("Error: " + err.message);
//     }
//   };

//   const deleteUser = async (userId: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const res = await fetch(`/api/clerk-users/${userId}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete user");

//       toast.success("User deleted");
//       setUsers((prev) => prev.filter((user) => user.id !== userId));
//     } catch (err: any) {
//       toast.error("Error: " + err.message);
//     }
//   };

//   const filteredUsers = users.filter((user) =>
//     `${user.first_name ?? ""} ${user.last_name ?? ""}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * usersPerPage,
//     currentPage * usersPerPage
//   );

//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   if (loading) return <p className="p-4">Loading users...</p>;
//   if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

//   //CSV
//   const exportToCSV = () => {
//   const csv = Papa.unparse(users.map(user => ({
//     ID: user.id,
//     Name: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
//     Email: user.email_addresses[0]?.email_address,
//     Role: user.public_metadata?.role ?? "user",
//     SignupMethod: user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email",
//     Phone: user.primary_phone_number ?? "N/A",
//     CreatedAt: new Date(user.created_at * 1000).toISOString(),
//     UpdatedAt: new Date(user.updated_at * 1000).toISOString(),
//   })));

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "users.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     };

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <Toaster position="top-right" />
//       <h2 className="text-2xl font-bold mb-6">Registered Users</h2>

//       <input
//         type="text"
//         placeholder="Search by name..."
//         className="mb-4 px-4 py-2 border rounded w-full"
//         value={searchTerm}
//         onChange={(e) => {
//           setSearchTerm(e.target.value);
//           setCurrentPage(1);
//         }}
//       />

//       <div className="w-full overflow-x-auto rounded border">
//         <table className="w-full table-auto text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-2 py-2 border">Photo</th>
//               <th className="px-2 py-2 border">First Name</th>
//               <th className="px-2 py-2 border">Email</th>
//               <th className="px-2 py-2 border">Signed Up With</th>
//               <th className="px-2 py-2 border">Phone</th>
//               {/* <th className="px-2 py-2 border">User ID</th> */}
//               <th className="px-2 py-2 border">Created</th>
//               <th className="px-2 py-2 border">Updated</th>
//               <th className="px-2 py-2 border">Role</th>
//               <th className="px-2 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedUsers.map((user) => {
//               const role = user.public_metadata?.role ?? "user";
//               const signupMethod =
//                 user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email";

//               return (
//                 <tr key={user.id} className="border-t hover:bg-gray-50">
//                   <td className="px-2 py-2 border">
//                     <img
//                       src={user.profile_image_url}
//                       alt="profile"
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-2 py-2 border font-medium">{user.first_name ?? "N/A"}</td>
//                   <td className="px-2 py-2 border">{user.email_addresses[0]?.email_address}</td>
//                   <td className="px-2 py-2 border">{signupMethod}</td>
//                   <td className="px-2 py-2 border">{user.primary_phone_number ?? "N/A"}</td>
//                   {/* <td className="px-2 py-2 border">{user.id}</td> */}
//                   <td className="px-2 py-2 border">{new Date(user.created_at * 1000).toLocaleString()}</td>
//                   <td className="px-2 py-2 border">{new Date(user.updated_at * 1000).toLocaleString()}</td>
//                   <td className="px-2 py-2 border capitalize">
//                     <select
//                       value={role}
//                       onChange={(e) =>
//                         updateRole(user.id, e.target.value as "admin" | "user")
//                       }
//                       className="border rounded px-1 py-1"
//                     >
//                       <option value="user">User</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td className="px-2 py-2 border">
//                     <button
//                       onClick={() => deleteUser(user.id)}
//                       className="text-red-600 hover:underline text-xs"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center mt-6">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <p>
//           Page {currentPage} of {totalPages}
//         </p>
//         <button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//         <button
//             onClick={exportToCSV}
//             className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//             Export to CSV
//         </button>

//       </div>
//     </div>
//   );
// }














// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// interface ClerkUser {
//   id: string;
//   first_name: string | null;
//   last_name: string | null;
//   email_addresses: { email_address: string; id: string }[];
//   profile_image_url: string;
//   public_metadata?: { role?: "admin" | "user" };
//   created_at: number;
//   updated_at: number;
//   last_sign_in_at: number | null;
//   external_accounts: { provider: string }[];
//   primary_phone_number: string | null;
// }

// export default function UserList() {
//   const [users, setUsers] = useState<ClerkUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 5;

//   // Log user actions
//   const logActivity = async (action: string, detail: string) => {
//     await fetch("/api/activity-log", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action, detail }),
//     });
//   };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("/api/clerk-users");
//         if (!res.ok) throw new Error("Failed to load users");
//         const data = await res.json();
//         setUsers(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const updateRole = async (userId: string, selectedRole: "admin" | "user") => {
//     try {
//       const res = await fetch(`/api/clerk-users/${userId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ role: selectedRole }),
//       });

//       if (!res.ok) throw new Error("Failed to update role");

//       toast.success(`Role changed to ${selectedRole.toUpperCase()}`);
//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, public_metadata: { role: selectedRole } } : user
//         )
//       );
//       await logActivity("Role Change", `Changed role of user ${userId} to ${selectedRole}`);
//     } catch (err: any) {
//       toast.error("Error: " + err.message);
//     }
//   };

//   const deleteUser = async (userId: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const res = await fetch(`/api/clerk-users/${userId}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete user");

//       toast.success("User deleted");
//       setUsers((prev) => prev.filter((user) => user.id !== userId));
//       await logActivity("User Deletion", `Deleted user ${userId}`);
//     } catch (err: any) {
//       toast.error("Error: " + err.message);
//     }
//   };

//   const exportToCSV = () => {
//     const headers = [
//       "First Name",
//       "Last Name",
//       "Email",
//       "Phone",
//       "Signup Method",
//       "Role",
//       "Created",
//       "Updated",
//     ];

//     const rows = users.map((user) => [
//       user.first_name ?? "N/A",
//       user.last_name ?? "N/A",
//       user.email_addresses[0]?.email_address ?? "N/A",
//       user.primary_phone_number ?? "N/A",
//       user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email",
//       user.public_metadata?.role ?? "user",
//       new Date(user.created_at * 1000).toLocaleString(),
//       new Date(user.updated_at * 1000).toLocaleString(),
//     ]);

//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.href = encodedUri;
//     link.download = "users.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     toast.success("Exported to CSV");
//     logActivity("Export", "Exported user data to CSV");
//   };

//   const filteredUsers = users.filter((user) =>
//     `${user.first_name ?? ""} ${user.last_name ?? ""}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * usersPerPage,
//     currentPage * usersPerPage
//   );

//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   if (loading) return <p className="p-4">Loading users...</p>;
//   if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <Toaster position="top-right" />
//       <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

//       <div className="mb-4 flex justify-between flex-wrap gap-2">
//         <input
//           type="text"
//           placeholder="Search by name..."
//           className="px-4 py-2 border rounded w-full md:w-1/3"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//         <button
//           onClick={exportToCSV}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
//         >
//           Export to CSV
//         </button>
//       </div>

//       <div className="overflow-auto rounded border">
//         <table className="min-w-full table-auto text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-2 py-2 border">Photo</th>
//               <th className="px-2 py-2 border">First Name</th>
//               <th className="px-2 py-2 border">Email</th>
//               <th className="px-2 py-2 border">Signed Up With</th>
//               <th className="px-2 py-2 border">Phone</th>
//               {/* <th className="px-2 py-2 border">User ID</th> */}
//               <th className="px-2 py-2 border">Created</th>
//               <th className="px-2 py-2 border">Updated</th>
//               <th className="px-2 py-2 border">Role</th>
//               <th className="px-2 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedUsers.map((user) => {
//               const role = user.public_metadata?.role ?? "user";
//               const signupMethod =
//                 user.external_accounts?.[0]?.provider === "oauth_google" ? "Google" : "Email";

//               return (
//                 <tr key={user.id} className="border-t hover:bg-gray-50">
//                   <td className="px-2 py-2 border">
//                     <img
//                       src={user.profile_image_url}
//                       alt="profile"
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-2 py-2 border font-medium">{user.first_name ?? "N/A"}</td>
//                   <td className="px-2 py-2 border">{user.email_addresses[0]?.email_address}</td>
//                   <td className="px-2 py-2 border">{signupMethod}</td>
//                   <td className="px-2 py-2 border">{user.primary_phone_number ?? "N/A"}</td>
//                   {/* <td className="px-2 py-2 border">{user.id}</td> */}
//                   <td className="px-2 py-2 border">
//                     {new Date(user.created_at * 1000).toLocaleString()}
//                   </td>
//                   <td className="px-2 py-2 border">
//                     {new Date(user.updated_at * 1000).toLocaleString()}
//                   </td>
//                   <td className="px-2 py-2 border capitalize">
//                     <select
//                       value={role}
//                       onChange={(e) =>
//                         updateRole(user.id, e.target.value as "admin" | "user")
//                       }
//                       className="border rounded px-1 py-1"
//                     >
//                       <option value="user">User</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   </td>
//                   <td className="px-2 py-2 border">
//                     <button
//                       onClick={() => deleteUser(user.id)}
//                       className="text-red-600 hover:underline text-xs"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between items-center mt-6">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <p>
//           Page {currentPage} of {totalPages}
//         </p>
//         <button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//         <Link href="/activity-log" className="text-blue-600 hover:underline">
//   Activity Log
// </Link>
//       </div>
//     </div>
//   );
// }
