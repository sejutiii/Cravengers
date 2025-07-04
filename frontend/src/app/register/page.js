'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupSelection() {
  const router = useRouter();

  const options = [
    {
      label: 'Customer',
      image: '/user.png',
      link: '/CustomerSignup'
    },
    {
      label: 'Rider',
      image: '/motorbike.png',
      link: '/RiderSignup'
    },
    {
      label: 'Restaurant Owner',
      image: '/tray.png',
      link: '/RestaurantSignup'
    }
  ];

  return (
    <div className="bg-neutral min-h-screen">
      {/* Header with logo and app name (do not change this section) */}
      <header className="bg-primary text-white p-4 shadow">
        <a href='/homepage' className="container mx-auto flex items-center">
          <img src="/fast-delivery.png" alt="Cravengers" className="h-10" />
          <h1 className="text-2xl font-bold ml-2">Cravangers</h1>
        </a>
      </header>

      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-3xl font-bold mb-8 text-primary">Sign Up As</h2>
        <div className="flex flex-col gap-6 w-full max-w-md">
          {options.map(option => (
            <button
              key={option.label}
              onClick={() => router.push(option.link)}
className="flex items-center justify-start bg-accent hover:bg-secondary text-white font-semibold py-4 px-6 rounded-lg shadow transition text-lg gap-4 transform hover:scale-105"            >
              <Image
                src={option.image}
                alt={option.label}
                width={40}
                height={40}
                className="rounded-full bg-white p-1"
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}