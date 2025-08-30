// Initialize demo user in localStorage
export const initializeDemoUser = () => {
  const users = JSON.parse(localStorage.getItem('shopease_users') || '[]');
  
  // Check if demo user already exists
  const demoUserExists = users.find((user: any) => user.username === 'demo');
  
  if (!demoUserExists) {
    const demoUser = {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@shopease.com',
      password: 'demo123'
    };
    
    users.push(demoUser);
    localStorage.setItem('shopease_users', JSON.stringify(users));
  }
};

// Call this function when the app starts
if (typeof window !== 'undefined') {
  initializeDemoUser();
}