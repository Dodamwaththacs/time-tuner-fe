import { apiClient } from './index';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  max_users: number;
  storage_gb: number;
  support_level: 'email' | 'phone' | 'priority' | 'dedicated';
  is_active: boolean;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  trial_ends_at?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  plan: SubscriptionPlan;
}

export interface CreateSubscriptionRequest {
  plan_id: string;
  organization_id: string;
  payment_method_id?: string;
}

export const subscriptionAPI = {
  // Get all available plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  // Get plan by ID
  getPlan: async (id: string): Promise<SubscriptionPlan> => {
    const response = await apiClient.get(`/subscriptions/plans/${id}`);
    return response.data;
  },

  // Get current organization's subscription
  getCurrent: async (): Promise<Subscription> => {
    const response = await apiClient.get('/subscriptions/current');
    return response.data;
  },

  // Create new subscription
  create: async (subscriptionData: CreateSubscriptionRequest): Promise<Subscription> => {
    const response = await apiClient.post('/subscriptions', subscriptionData);
    return response.data;
  },

  // Update subscription plan
  updatePlan: async (planId: string): Promise<Subscription> => {
    const response = await apiClient.put('/subscriptions/current/plan', { plan_id: planId });
    return response.data;
  },

  // Cancel subscription
  cancel: async (): Promise<void> => {
    await apiClient.delete('/subscriptions/current');
  },

  // Reactivate subscription
  reactivate: async (): Promise<Subscription> => {
    const response = await apiClient.post('/subscriptions/current/reactivate');
    return response.data;
  },

  // Get subscription usage statistics
  getUsage: async (): Promise<{
    users_count: number;
    storage_used_gb: number;
    api_calls_count: number;
    period_start: string;
    period_end: string;
  }> => {
    const response = await apiClient.get('/subscriptions/current/usage');
    return response.data;
  },

  // Start free trial
  startTrial: async (planId: string): Promise<Subscription> => {
    const response = await apiClient.post('/subscriptions/trial', { plan_id: planId });
    return response.data;
  },
};
