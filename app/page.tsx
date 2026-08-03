import ClientPage from './ClientPage';

export default function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return <ClientPage supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />;
}
