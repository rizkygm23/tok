// import { supabase } from '../../lib/supabase';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const notification = req.body;

//     // Validasi Signature Key untuk memastikan ini dari Midtrans
//     const serverKey = 'YOUR_SERVER_KEY'; // Ganti dengan Server Key Anda
//     const crypto = require('crypto');
//     const signature = crypto
//       .createHash('sha512')
//       .update(notification.order_id + notification.status_code + notification.gross_amount + serverKey)
//       .digest('hex');

//     if (signature !== notification.signature_key) {
//       return res.status(401).json({ message: 'Invalid Signature' });
//     }

//     // Ambil status transaksi dari notifikasi Midtrans
//     const { order_id, transaction_status } = notification;

//     // Update status transaksi di database Supabase
//     const { error } = await supabase
//       .from('transactions')
//       .update({ status: transaction_status })
//       .eq('order_id', order_id);

//     if (error) {
//       console.error('Error updating transaction status:', error);
//       return res.status(500).json({ error: 'Error updating transaction status' });
//     }

//     res.status(200).json({ message: 'Transaction status updated successfully' });
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
