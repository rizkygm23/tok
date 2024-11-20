import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function PaymentStatus() {
  const router = useRouter();
  const { order_id } = router.query;

  useEffect(() => {
    if (order_id) {
      const checkTransactionStatus = async () => {
        try {
          // Panggil API Midtrans untuk mendapatkan status transaksi
          const response = await fetch(`/api/check-transaction?orderId=${order_id}`);
          if (response.ok) {
            const data = await response.json();
            const transactionStatus = data.transaction_status;

            // Update status transaksi di Supabase
            const { error } = await supabase
              .from('transaction')
              .update({ status: transactionStatus })
              .eq('order_id', order_id);

            if (error) {
              console.error('Error updating transaction status:', error);
            } else {
              console.log('Transaction status updated successfully');
            }
          } else {
            console.error('Failed to fetch transaction status');
          }
        } catch (error) {
          console.error('Error fetching transaction status:', error);
        }
      };

      checkTransactionStatus();
    }
  }, [order_id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Status Pembayaran</h1>
      <p>Mohon tunggu, status pembayaran sedang diproses...</p>
    </div>
  );
}
