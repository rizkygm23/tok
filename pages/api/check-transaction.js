// import midtransClient from 'midtrans-client';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { orderId } = req.query; // Jangan gunakan "orderId: orderId"


//     // Inisialisasi Midtrans
//     let core = new midtransClient.CoreApi({
//       isProduction: false, // Set sesuai dengan kebutuhan Anda
//       serverKey: 'SB-Mid-server-8e7Xq-DdjPcRf8ADrRgm_Bpc', // Ganti dengan Server Key Anda
//       // clientKey: 'SB-Mid-client-KuJQTXqcZiyvlCYw', // Ganti dengan Client Key Anda
//     });

//     try {
//       console.log('Checking transaction for order ID:', orderId);
//       const transactionStatus = await core.transaction.status(orderId);
//       console.log('Transaction status:', transactionStatus);
//       res.status(200).json(transactionStatus);
//     } catch (error) {
//       console.error('Error fetching transaction status:', error.response?.data || error.message);
//       res.status(500).json({ error: 'Something went wrong', details: error.message });
//     }
    
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
