// Device Info Utility for Web

export const DeviceInfo = {
  deviceType: 'web',

  getDeviceModel(): string {
    // Get browser and OS info from user agent
    const userAgent = navigator.userAgent;
    
    // Detect OS
    let os = 'Unknown OS';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    
    // Detect Browser
    let browser = 'Unknown Browser';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
    
    return `${os} - ${browser}`;
  },

  async getDeviceIP(): Promise<string | null> {
    try {
      // Try to get IP from a public API
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || null;
    } catch (error) {
      console.error('Error fetching IP:', error);
      // Fallback: return null (backend will try to get it from request)
      return null;
    }
  },

  async getFcmToken(): Promise<string> {
    // TODO: Implement Firebase Cloud Messaging token retrieval for web
    // For now, return a placeholder
    // When Firebase is integrated, use:
    // import { getMessaging, getToken } from 'firebase/messaging';
    // const messaging = getMessaging();
    // const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
    // return token || '';
    
    // Placeholder - replace with actual FCM token when Firebase is set up
    return `web_fcm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

