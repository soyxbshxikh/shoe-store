# StepStyle: E-Commerce Shoe Store

StepStyle is a modern, responsive e-commerce platform built with Next.js that offers a seamless shopping experience for purchasing high-quality footwear. The application features a clean, intuitive user interface with product browsing, cart functionality, wishlist management, and secure checkout options.

![StepStyle Logo](/public/images/logo.svg)

## 🚀 Features

- **Product Browsing**: Browse a wide selection of shoes with filtering options
- **User Authentication**: Secure login and registration system
- **Account Management**: User profile with personal information
- **Shopping Cart**: Add, remove, and adjust quantities of products
- **Wishlist**: Save favorite products for later
- **Payment Processing**: Multiple payment options with real-time processing simulation
  - Credit Card (Stripe)
  - Mobile Wallet (Google Pay)
  - Cash on Delivery
- **Responsive Design**: Optimized for mobile, tablet, and desktop displays
- **Product Image Gallery**: Interactive product images with zoom capabilities
- **Dynamic Home Page**: Featured products carousel and grid layout

## 🛠️ Technologies

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks + Local Storage
- **Image Optimization**: Next.js Image Component
- **Deployment**: Vercel-ready

## 📂 Project Structure

```
shoe-store/
├── public/                 # Static assets
│   └── images/             # Product images and icons
├── src/
│   ├── app/                # Application pages using Next.js App Router
│   │   ├── page.tsx        # Home page
│   │   ├── about/          # About page
│   │   ├── account/        # User account management
│   │   ├── auth/           # Authentication (login, signup, forgot password)
│   │   ├── cart/           # Shopping cart
│   │   ├── contact/        # Contact information
│   │   ├── products/       # Product listings and details
│   │   └── wishlist/       # User wishlist
│   ├── components/         # Reusable UI components
│   │   ├── AddToCartButton.tsx
│   │   ├── AddToWishlistButton.tsx
│   │   ├── CartItems.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageCarousel.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailActions.tsx
│   │   ├── ProductImages.tsx
│   │   ├── ProductOptions.tsx
│   │   └── ... other components
│   └── lib/                # Utilities and data
│       ├── data.ts         # Data exports
│       └── data/           # Mock product data (JSON)
├── package.json            # Project dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoe-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Key Application Flows

### Shopping Flow
1. Browse products on home page or categories page
2. View product details
3. Select size and quantity
4. Add to cart
5. Proceed to checkout
6. Select payment method
7. Complete purchase

### User Account Flow
1. Register/Login to account
2. View and update personal information
3. View order history (when available)
4. Manage wishlist items

## 💳 Payment Processing

The application simulates real-time payment processing with:
- Transaction IDs
- Processing animations
- Success/failure states
- Receipt generation
- Merchant information display (UPI ID: soyxbshxikh@okhdfcbank)

## �� UI Components

### Main Components
- **Navbar**: Navigation with responsive mobile menu, user authentication, cart and wishlist counters
- **ProductCard**: Display product information with image, price, and category
- **ImageCarousel**: Interactive image slider with navigation and indicators
- **CartItems**: Shopping cart interface with payment processing
- **ProductImages**: Product detail image gallery with thumbnails

## 🧪 Local Development

The application uses mock data from JSON files located in `src/lib/data/`. In a production environment, this would be replaced with API calls to a backend service.

### Client-Side Storage
- User authentication status is stored in localStorage
- Cart and wishlist items persist across sessions

## 📈 Future Enhancements

- Backend API integration
- Product reviews and ratings
- Order tracking
- Advanced filtering and search
- User address management
- Admin dashboard

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Next.js and Tailwind CSS
