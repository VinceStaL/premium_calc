import axios from 'axios';
import { PremiumParams, PremiumResult } from '../types/premium';

const API_URL = '/api';

export const calculatePremium = async (params: PremiumParams): Promise<PremiumResult[]> => {
  try {
    const response = await axios.post(`${API_URL}/calculate-premium`, params);
    return response.data;
  } catch (error) {
    console.error('Error calculating premium:', error);
    throw error;
  }
};