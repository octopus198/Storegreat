import Form from '@/app/ui/order/create-order';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {

  return (
    <main>
      <Form  />
    </main>
  );
}