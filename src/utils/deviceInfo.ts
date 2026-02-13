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
    try {
      // Import and use real Firebase Messaging
      const { requestFcmToken } = await import('../services/firebase');
      const token = await requestFcmToken();
      
      if (token) {
        console.log('Real FCM token obtained for web');
        return token;
      }
      
      console.warn('Could not get FCM token - notifications may not work');
      return '';
    } catch (e) {
      console.error('Error getting FCM token:', e);
      return '';
    }
  }
};


