import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export default function PaymentStatus() {
  const router = useRouter();
  const { orderId: order_id } = router.query;
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && order_id) {
      const checkTransactionStatus = async () => {
        try {
          console.log('Checking transaction status for order ID:', order_id);

          // Panggil API Midtrans untuk mendapatkan status transaksi
          const response = await fetch(`/api/check-transaction?orderId=${order_id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Midtrans Response:', data);
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
              setTransactionStatus(transactionStatus);
            }
          } else {
            console.error('Failed to fetch transaction status');
          }
        } catch (error) {
          console.error('Error fetching transaction status:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkTransactionStatus();
    }
  }, [router.isReady, order_id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Status Pembayaran</h1>
      {isLoading ? (
        <p>Mohon tunggu, status pembayaran sedang diproses...</p>
      ) : transactionStatus ? (
        <p>
          Status Pembayaran Anda: <strong>{transactionStatus}</strong>
        </p>
      ) : (
        <p>Gagal memproses status pembayaran. Silakan coba lagi nanti.</p>
      )}
    </div>
  );
}
