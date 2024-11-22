import midtransClient from 'midtrans-client';
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderId, grossAmount, customerDetails } = req.body;

    // Konfigurasi Midtrans
    let snap = new midtransClient.Snap({
      isProduction: false, // Ubah menjadi `true` saat production
      serverKey: 'SB-Mid-server-8e7Xq-DdjPcRf8ADrRgm_Bpc', // Ganti dengan Server Key Midtrans Anda
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: customerDetails,
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      await res.status(200).json({  redirectUrl:transaction.redirect_url});
      const { error } = await supabase
        .from('transaction')        
        .update({ status: 'Success' })
        .eq('order_id', orderId);
      
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong', details: error });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
