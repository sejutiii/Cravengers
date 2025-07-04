import Head from 'next/head';

export default function Login() {
  return (
    <div className="bg-neutral min-h-screen">
      <Head>
        <title>Login - Food Delivery App</title>
        <meta name="description" content="Login to your Food Delivery account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header with Logo */}
      <header className="bg-primary text-white p-4 shadow">
        <div className="container mx-auto flex items-center">
          <a href='/homepage' className='flex items-center' ><img src="/fast-delivery.png" alt="Cravangers" className="h-10" />
         <h1 className="text-2xl font-bold">Cravangers</h1></a>     
        </div>
      </header>

      {/* Login Form Section */}
      <div className="flex items-center justify-center py-12">
        <div className="bg-white border border-accent rounded-lg shadow p-6 w-full max-w-md">
          <h2 className="text-text text-2xl font-semibold mb-6">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-text font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-text font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition mb-4"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-success"
            >
              Forgot Password?
            </button>
          </form>
          <p className="text-text text-center mt-4">
            Don’t have an account?{' '}
            <a href="/register" className="text-primary hover:text-secondary">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}