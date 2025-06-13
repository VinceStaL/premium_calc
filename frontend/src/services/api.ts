import axios from 'axios';
import { PremiumParams } from '../types/premium';

const API_URL = '/api';

export const calculatePremium = async (params: PremiumParams): Promise<any> => {
  try {
    console.log('Sending to API:', JSON.stringify(params));
    const response = await axios.post(`${API_URL}/calculate-premium`, params);
    console.log('API response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error calculating premium:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};