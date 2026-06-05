/**
 * Centralized advocate configuration from environment variables.
 * Avoids repeated import.meta.env lookups with fallback defaults.
 */
const advocateConfig = {
  name: import.meta.env.VITE_ADVOCATE_NAME || 'Shivam Chaturvedi',
  phone: import.meta.env.VITE_ADVOCATE_PHONE || '+91 75100 91599',
  phoneRaw: import.meta.env.VITE_ADVOCATE_PHONE_RAW || '7510091599',
};

export default advocateConfig;
