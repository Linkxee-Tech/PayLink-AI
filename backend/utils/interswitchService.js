const axios = require('axios');
const crypto = require('crypto');

class InterswitchService {
  constructor() {
    this.clientId = process.env.INTERSWITCH_CLIENT_ID;
    this.clientSecret = process.env.INTERSWITCH_CLIENT_SECRET;
    this.env = process.env.INTERSWITCH_ENV || 'sandbox';
    this.baseUrl = this.env === 'sandbox' 
      ? 'https://sandbox.interswitchng.com' 
      : 'https://api.interswitchng.com';
  }

  // Generate OAuth2 Token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await axios.post(`${this.baseUrl}/passport/oauth/token`, 
        'grant_type=client_credentials', 
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Interswitch Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Interswitch');
    }
  }

  // Generate Authorisation Header and Signature (Example for Transfer)
  generateHeaders(accessToken, httpMethod, url, timestamp, nonce) {
    // Note: Actual Interswitch signatures often involve hashing the URL + Timestamp + Nonce + Secret.
    // For Sandbox, simplified headers are often accepted or specific rules apply.
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Timestamp': timestamp,
      'Nonce': nonce,
      'SignatureMethod': 'SHA256',
      'TerminalID': '3PBP0001', // Example Terminal ID
    };
  }

  // Name Enquiry (Validate Hospital Bank Details)
  async nameEnquiry(accountNumber, bankCode) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(`${this.baseUrl}/api/v2/quickteller/account/enquiry`, {
        accountNumber,
        bankCode
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Interswitch Name Enquiry Error:', error.response?.data || error.message);
      return { success: false, message: 'Account validation failed' };
    }
  }

  // Initiate Disbursement (Transfer to Hospital)
  async initiateTransfer(details) {
    try {
      const { amount, accountNumber, bankCode, reference } = details;
      const token = await this.getAccessToken();
      
      const payload = {
        transferCode: '901', // Standard code for bank transfer
        amount: amount * 100, // Interswitch uses kobo/minor units
        accountNumber,
        bankCode,
        requestReference: reference,
        terminalId: '3PBP0001'
      };

      // In Sandbox, we mock the final success
      if (this.env === 'sandbox') {
        return { success: true, transactionId: `ISW-${Date.now()}`, status: 'Success' };
      }

      const response = await axios.post(`${this.baseUrl}/api/v2/quickteller/payments/transfers`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      return { success: true, ...response.data };
    } catch (error) {
      console.error('Interswitch Transfer Error:', error.response?.data || error.message);
      return { success: false, message: 'Transfer failed' };
    }
  }
}

module.exports = new InterswitchService();
