import Link from 'next/link';
import React, { useState } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";


const pickleData = [
  {
    image: '/chicken-1.jpeg',
    name: 'Chicken Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Chicken'
  },
  {
    image: '/mutton-1.jpeg',
    name: 'Meat Pickle',
    price: 'Rs.300',
    link: '/pickleinfo',
    type: 'Meat'
  },
  {
    image: '/prawns-1.jpeg',
    name: 'Prawns Pickle',
    price: 'Rs.170',
    link: '/pickleinfo',
    type: 'Prawns'
  },
  {
    image: '/ginger-1.jpeg',
    name: 'Ginger Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Ginger'
  },
  {
    image: '/mango-1.jpeg',
    name: 'Mango Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Mango'
  },
  {
    image: '/fish-2.jpeg',
    name: 'Fish Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Fish'
  },
  {
    image: '/garlic-1.jpeg',
    name: 'Garlic Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Garlic'
  },
  {
    image: '/redchilli-1.jpeg',
    name: 'Red Chilli Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'RedChilli'
  },
  {
    image: '/gongura-1.jpeg',
    name: 'Gongura Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Gongura'
  },
  {
    image: '/tomato-1.jpeg',
    name: 'Tomato Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Tomato'
  },
  {
    image: '/lemon-1.jpeg',
    name: 'Lemon Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Lemon'
  },
  {
    image: '/amla-1.jpeg',
    name: 'Amla Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Amla'
  },
  {
    image: '/curry-1.jpeg',
    name: 'Curry Leaves Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'Curry'
  },
  {
    image: '/green-1.jpeg',
    name: 'Green Chilli Pickle',
    price: 'Rs.200',
    link: '/pickleinfo',
    type: 'GreenChilli'
  }
];

//pagination start here
const HomePage = () => {

  const [allRecords, setAllRecords] = useState(pickleData);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // console.log(indexOfFirstRecord , indexOfLastRecord)

  const currentRecords = allRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // console.log('Total records: ', allRecords.length);
  // console.log('Current page records: ', currentRecords.length);

  //pagination end

  return (
    <>
      <Header title="Pickle Site" />
      <div className="px-4 py-8 text-center md:text-left scroll-smooth">
        <h1 className="text-xl md:text-3xl font-serif">Pickle Paradise</h1>
        <p className="py-3 text-[16px] text-left md:hidden">Experience the fiery flavors of Andhra Pradesh with our authentic pickles.
          From the tangy mango avakaya to the spicy gongura pickle, our hand-crafted delicacies will add a burst of zest to your meals.
          Each jar is a testament to the passion and craftsmanship of our local artisans, who have perfected the art of preserving
          the essence of fresh, seasonal ingredients.
        </p>

        <p className="py-3 text-left hidden md:block">My love for pickles has led me to land in East Godavari, Andhra Pradesh.
          There, the tradition of non-vegetarian pickle is a part of their daily meal serving.
          I tasted the delicious non-vegetarian pickle with rice, and the combination and flavor have become stuck in my taste buds,
          it&apos;s so delicious! 🤤 During this process, a thought arose in me to extract the true, authentic,
          and traditional recipe from Andhra Pradesh to deliver it to your dining table.
          Our team, Andhra Store, has traveled and learned from local non-vegetarian pickle makers to bring you the authentic
          and true traditional recipe. So, order now and give your taste buds the best experience of non-vegetarian pickles.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pt-2">

          {currentRecords.map((pickle) => (
            <div key={pickle.image} className="bg-white p-4 rounded shadow-md hover:shadow-xl text-[14px] md:text-sm text-black">
              <img src={pickle.image} alt={pickle.name} className="w-full h-28 sm:h-36 md:h-48 object-fill rounded-lg" />
              <div className="md:grid md:grid-cols-3 pt-5">
                <div className="md:col-span-2">
                  <h3 className="font-bold">{pickle.name}</h3>
                  <p className="text-gray-700 pt-1">From {pickle.price}</p>
                </div>
                <div className='hidden md:block'>
                  <Button variant="outline" className="float-right">
                    <Link href={{ pathname: pickle.link, query: { type: pickle.type } }}>View</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}

        </div>
        <div className='mt-8'>
          <Pagination
            recordsPerPage={recordsPerPage}
            totalRecords={pickleData ? pickleData.length : ""}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default HomePage;