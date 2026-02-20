/**
 * Rate limiting middleware for critical endpoints
 * Prevents abuse and ensures fair usage
 */

const requestCounts = new Map();

/**
 * Rate limit middleware factory
 * @param {number} maxRequests - Maximum requests allowed per time window
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} identifier - Custom identifier (defaults to IP)
 */
export const createRateLimit = (maxRequests, windowMs, identifier = 'ip') => {
  return (req, res, next) => {
    // Get identifier (IP address or custom)
    const key = identifier === 'ip' ? req.ip : req.user?.user_id || req.ip;
    const now = Date.now();
    
    // Initialize or get existing request data
    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 0, resetTime: now + windowMs });
    }
    
    const data = requestCounts.get(key);
    
    // Reset if time window expired
    if (now > data.resetTime) {
      data.count = 0;
      data.resetTime = now + windowMs;
    }
    
    // Increment request count
    data.count++;
    
    // Set rate limit headers
    const remaining = Math.max(0, maxRequests - data.count);
    const resetTime = Math.ceil(data.resetTime / 1000);
    
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime);
    
    // Check if limit exceeded
    if (data.count > maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: resetTime,
      });
    }
    
    next();
  };
};

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime + 300000) { // Keep for 5 minutes after expiry
      requestCounts.delete(key);
    }
  }
}, 300000);

// Preset rate limiters
export const bookingRateLimit = createRateLimit(10, 60 * 60 * 1000); // 10 bookings per hour per user
export const searchRateLimit = createRateLimit(100, 60 * 1000); // 100 searches per minute per IP
