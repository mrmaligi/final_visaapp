import { redirect } from 'next/navigation';

export default function NewVisaPage() {
  redirect('/admin/visas/new/edit');
}
