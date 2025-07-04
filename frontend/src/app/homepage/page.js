import Head from 'next/head';

export default function Home() {
  return (
    <div className="bg-neutral min-h-screen">
      
      <Head>
        
        <title>Food Delivery App</title>
        <meta name="description" content="Order delicious meals online" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-primary flex justify-between text-white p-4 shadow">
        <div className="container mx-auto flex justify-start items-center">
              <img src="/fast-delivery.png" alt="Fast Delivery" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold">Cravangers</h1>
        </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/menu" className="hover:text-secondary">Menu</a></li>
              <li><a href="/login" className="hover:text-secondary">Login</a></li>
              <li><a href="/cart" className="hover:text-secondary">Cart</a></li>
            </ul>
          </nav>
        
      </header>

      {/* Hero Section */}
      <section className='location px-10 text-black'>Location</section>
      <section className="container mx-auto py-12 text-center">
        <h2 className="text-text text-4xl font-bold mb-4">Crave It, Order It!</h2>
        <p className="text-text text-lg mb-6">Discover delicious meals delivered right to your door.</p>
        <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">
          Explore Menu
        </button>
      </section>

      {/* Sample Menu Items */}
      <section className="container mx-auto py-8">
        <h3 className="text-text text-2xl font-semibold mb-6">Popular Dishes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item 1 */}
          <div className="bg-white border border-accent rounded-lg shadow p-4">
            <h4 className="text-text text-xl font-semibold">Margherita Pizza</h4>
            <p className="text-text">Fresh tomatoes, mozzarella, and basil.</p>
            <p className="text-primary font-bold">$12.99</p>
            <button className="bg-accent text-white px-4 py-2 mt-2 rounded hover:bg-success">
              Add to Cart
            </button>
          </div>
          {/* Item 2 */}
          <div className="bg-white border border-accent rounded-lg shadow p-4">
            <h4 className="text-text text-xl font-semibold">Chicken Burger</h4>
            <p className="text-text">Grilled chicken, lettuce, and mayo.</p>
            <p className="text-primary font-bold">$8.99</p>
            <button className="bg-accent text-white px-4 py-2 mt-2 rounded hover:bg-success">
              Add to Cart
            </button>
          </div>
          {/* Item 3 */}
          <div className="bg-white border border-accent rounded-lg shadow p-4">
            <h4 className="text-text text-xl font-semibold">Caesar Salad</h4>
            <p className="text-text">Crisp romaine, croutons, and Caesar dressing.</p>
            <p className="text-primary font-bold">$6.99</p>
            <button className="bg-accent text-white px-4 py-2 mt-2 rounded hover:bg-success">
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Food Delivery App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}