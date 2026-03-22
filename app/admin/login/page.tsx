// app/admin/login/page.tsx
import { login } from "../../actions";

export default function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Kita gunakan promise biasa tanpa async di function definition
  const errorPromise = props.searchParams.then((params) => params.error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Admin</h1>
        
        {/* Catatan: Pesan error mungkin butuh handling khusus di versi ini, 
            tapi untuk sekarang kita tampilkan form dulu */}

        <form action={login}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan password admin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}