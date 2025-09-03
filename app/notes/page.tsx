import { createClient } from '../../utils/supabase/server';

export default async function Notes() {
  const supabase = createClient();
  const { data: notes, error } = await supabase.from("notes").select();

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading notes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Data from Supabase:</h2>
        <pre className="bg-white p-4 rounded border overflow-auto">
          {JSON.stringify(notes, null, 2)}
        </pre>
      </div>
    </div>
  );
}