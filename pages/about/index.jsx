import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function AboutUs() {
  return (
    <div>
      <Header />
      <div className="px-8 py-5 text-[14px] md:text-lg scroll-smooth h-screen">
        <h1 className="text-3xl font-semibold">About Us</h1>
        <p className='mt-4'>Welcome to Andhra Store, the
                ultimate destination for authentic nonveg pickles! We take immense pride in offering a diverse range of
                mouthwatering options, including chicken pickle, meat pickle, and prawns pickle, to tantalize your taste
                buds.
              </p>

              <p className='mt-2'>At Andhra Store, we combine
                our
                Telugu heritage with our expertise in the art of pickling to create unparalleled flavors that will
                transport
                you to the heart of Andhra Pradesh. Our pickles are crafted using time-honored recipes passed down
                through
                generations, ensuring an authentic taste that captures the essence of home.</p>

              <p className='mt-2'>Nestled in the vibrant city of Daman, we understand the yearning for authentic Telugu flavors,
                particularly
                when it comes to nonveg pickles. Recognizing the scarcity of such options in the area, we have made it
                our
                mission to fill this gap and bring these exquisite flavors to your doorstep.</p>

              <p className='mt-2'>Andhra Store is committed to
                providing an unforgettable experience for our customers. We prioritize customer satisfaction by ensuring
                our
                pickles are bursting with flavor and meticulously packaged to preserve their freshness.</p>

              <p className='mt-2'>Whether you are a Telugu native yearning for a taste of your roots or an adventurous food lover seeking
                new
                and exciting flavors, our nonveg pickles are here to satisfy your cravings. Elevate your meals with our
                range
                of chicken, meat, and prawns pickles, and unlock a world of culinary delight.</p>

              <p className='mt-2'>Thank you for choosing Andhra Store
                as your trusted source for authentic nonveg pickles in Daman. We are excited to serve you and become
                your
                go-to destination for unparalleled flavors that will leave you craving more. Explore our selection today
                and
                embark on a gastronomic journey like no other.</p>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;