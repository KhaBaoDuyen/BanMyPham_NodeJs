const moment = require('moment-timezone');
const crypto = require('crypto');
const VNPAY_CONFIG = {
   vnpUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
   vnpTmnCode: 'LQF1OTAU',
   vnpHashSecret: 'RC362O58GB784GOPKFTPD9UXXL9QWWGB'
};

class VnPayService {
   static createPaymentUrl(txnRef, finalTotal, returnUrl, req) {
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const expireDate = moment().tz('Asia/Ho_Chi_Minh').add(5, 'minutes').format('YYYYMMDDHHmmss');

      const vnpParams = {
         vnp_Version: '2.1.0',
         vnp_Command: 'pay',
         vnp_TmnCode: VNPAY_CONFIG.vnpTmnCode,
         vnp_Amount: String(Math.round(finalTotal * 100)),
         vnp_CreateDate: moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss'),
         vnp_CurrCode: 'VND',
         vnp_IpAddr: ipAddr,
         vnp_Locale: 'vn',
         vnp_OrderInfo: `Thanh toán đơn hàng`,
         vnp_OrderType: 'Thanh toán VNPay',
         vnp_ReturnUrl: returnUrl,
         vnp_ExpireDate: expireDate,
         vnp_TxnRef: txnRef,
         vnp_BankCode: 'NCB',
      };

      const sortedParams = Object.keys(vnpParams).sort().reduce((acc, key) => {
         acc[key] = vnpParams[key];
         return acc;
      }, {});

      const signData = Object.keys(sortedParams)
         .map((key) => `${key}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, '+')}`)
         .join('&');

      const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnpHashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      sortedParams['vnp_SecureHash'] = signed;

      const paymentUrl = `${VNPAY_CONFIG.vnpUrl}?${Object.keys(sortedParams)
         .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, '+')}`)
         .join('&')}`;

      return paymentUrl;
   }

   static validateReturnUrl(vnpParams) {
      const secureHash = vnpParams['vnp_SecureHash'];
      delete vnpParams['vnp_SecureHash'];
      delete vnpParams['vnp_SecureHashType'];

      const sortedParams = Object.keys(vnpParams).sort().reduce((acc, key) => {
         acc[key] = vnpParams[key];
         return acc;
      }, {});

      const signData = Object.keys(sortedParams)
         .map((key) => `${key}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, '+')}`)
         .join('&');

      const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.vnpHashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      return secureHash === signed;
   }
}

module.exports = VnPayService;
