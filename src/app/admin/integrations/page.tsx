import { redirect } from 'next/navigation';

export default function IntegrationsRedirectPage() {
  redirect('/admin/settings?tab=integrations');
}
