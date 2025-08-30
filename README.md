# UrbanBasket - E-commerce Platform

A modern e-commerce platform built with React, TypeScript, and Tailwind CSS, featuring UPI QR code payment integration.

## 🚀 Features

- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure login/signup system
- **UPI Payment**: QR code payment integration
- **Order Tracking**: View order history and status
- **Responsive Design**: Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecom-sarthak-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

## 🔧 Configuration

### UPI Payment Setup
1. Update your UPI ID in the payment component
2. Configure merchant details in environment variables
3. Test with UPI apps (PhonePe, Paytm, GPay, etc.)

### Environment Variables
- `VITE_APP_NAME`: Application name
- `VITE_MERCHANT_UPI_ID`: Your UPI ID for receiving payments
- `VITE_MERCHANT_NAME`: Your business name

## 📱 Features Overview

### Authentication
- User registration and login
- Protected routes
- Session management

### Shopping Experience
- Product browsing and filtering
- Add to cart functionality
- Checkout process with address collection

### Payment System
- UPI QR code generation
- Payment verification
- Order confirmation

### Order Management
- Order history
- Order status tracking
- Delivery tracking

## 🎨 UI Components

Built with shadcn/ui components:
- Cards, Buttons, Forms
- Navigation, Tabs, Badges
- Alerts, Toasts, Modals

## 📱 Mobile Responsive

- Mobile-first design approach
- Touch-friendly interface
- Optimized for all screen sizes

## 🔒 Security

- Client-side form validation
- Secure payment handling
- Protected user data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**