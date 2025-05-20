// // pages/admin/users.tsx
// import { fetchClerkUsers } from '@/lib/clerk';

// export async function getServerSideProps() {
//   try {
//     const users = await fetchClerkUsers();

//     return {
//       props: { users },
//     };
//   } catch (error: any) {
//     return {
//       props: { users: [], error: error.message },
//     };
//   }
// }

// type User = {
//   id: string;
//   first_name?: string;
//   last_name?: string;
//   email_addresses: { email_address: string }[];
// };

// export default function UsersPage({ users, error }: { users: User[]; error?: string }) {
//   if (error) return <div className="text-red-500">Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Clerk Users</h1>
//       <ul className="space-y-2">
//         {users.map((user) => (
//           <li key={user.id} className="p-2 border rounded">
//             <p>
//               <strong>Name:</strong> {user.first_name || ''} {user.last_name || ''}
//             </p>
//             <p>
//               <strong>Email:</strong> {user.email_addresses?.[0]?.email_address || 'N/A'}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }







// app/admin/users/page.tsx
import { fetchClerkUsers } from '@/lib/clerk';

export default async function UsersPage() {
  let users = [];

  try {
    users = await fetchClerkUsers();
  } catch (error: any) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clerk Users</h1>
      <ul className="space-y-2">
        {users.map((user: any) => (
          <li key={user.id} className="p-4 border rounded-md">
            <p>
              <strong>Name:</strong> {user.first_name || ''} {user.last_name || ''}
            </p>
            <p>
              <strong>Email:</strong> {user.email_addresses?.[0]?.email_address || 'N/A'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
