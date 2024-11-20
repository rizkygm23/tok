import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { orderId } = req.query;

    // Inisialisasi Midtrans
    let core = new midtransClient.CoreApi({
      isProduction: false, // Set sesuai dengan kebutuhan Anda
      serverKey: 'SB-Mid-server-8e7Xq-DdjPcRf8ADrRgm_Bpc', // Ganti dengan Server Key Anda
      clientKey: 'SB-Mid-client-KuJQTXqcZiyvlCYw', // Ganti dengan Client Key Anda
    });

    try {
      // Mendapatkan status transaksi dari Midtrans
      const transactionStatus = await core.transaction.status(orderId);
      res.status(200).json(transactionStatus);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
