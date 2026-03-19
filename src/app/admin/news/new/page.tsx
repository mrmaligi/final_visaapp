import { redirect } from 'next/navigation';

export default function NewNewsPage() {
  // Redirect to the edit page with 'new' as the ID
  redirect('/admin/news/new/edit');
}
