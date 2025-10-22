// services/placetopay.js
import axios from 'axios';
import { log } from 'console';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const PLACETOPAY_URL = process.env.PTP_URL;
const LOGIN = process.env.PTP_LOGIN;
const SECRET_KEY = process.env.PTP_SECRET;

function generateAuth() {
  const seed = new Date().toISOString();
  const rawNonce = crypto.randomBytes(16).toString('hex');
  const nonce = Buffer.from(rawNonce).toString('base64');
  const toHash = rawNonce + seed + SECRET_KEY;
  const tranKey = Buffer.from(
    crypto.createHash('sha256').update(toHash).digest()
  ).toString('base64');

  return { login: LOGIN, tranKey, nonce, seed };
}

export async function createSession({ reference, description, amount, ip_origen, user_agent }) {
  try {
    const auth = generateAuth();
  
  const body = {
    auth,
    payment: {
      reference,
      description,
      amount: {
        currency: 'HNL',
        total: amount,
      },
    },
    //expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutos
    returnUrl: `${process.env.APP_URL}/scohorsil/perfil/mis-subastas/return/${reference}`,
    ipAddress: ip_origen,
    userAgent: user_agent,
  };

  //console.log(body);
  const { data } = await axios.post(`${PLACETOPAY_URL}/api/session`, body);
  
  
  return data;
  } catch (error) {
    console.error('Error al crear sesión de pago:', error);
    throw error;
  }
  
}

export async function getSessionStatus(requestId) {
  
  
  const auth = generateAuth();
  console.log(PLACETOPAY_URL);
  const { data } = await axios.post(
    `${PLACETOPAY_URL}/api/session/${requestId}`,
    { auth }
  );
  return data;
}

export async function getSessionStatusBySubasta(requestId) {
  const sessionId=await this.models.PaymentSession.findOne({
    where: { id_subasta: requestId },
    attributes: ['requestId']
  });

  const auth = generateAuth();
  const { data } = await axios.post(
    `${PLACETOPAY_URL}/api/session/${requestId}`,
    { auth }
  );
  return data;
}
