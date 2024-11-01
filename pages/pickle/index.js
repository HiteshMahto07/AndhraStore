import Link from 'next/link';
import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";

const pickleData = {
    "veg":[
      {
        title:'Veg',
        image: '/ginger-1.jpeg',
        name: 'Ginger Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Ginger"
      },
      {
        title:'Veg',
        image: '/mango-1.jpeg',
        name: 'Mango Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Mango"
      },
      {
        title:'Veg',
        image: '/garlic-1.jpeg',
        name: 'Garlic Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Garlic"
      },
      {
        title:'Veg',
        image: '/redchilli-1.jpeg',
        name: 'Red Chilli Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "RedChilli"
      },
      {
        title:'Veg',
        image: '/gongura-1.jpeg',
        name: 'Gongura Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Gongura"
      },
      {
        title:'Veg',
        image: '/tomato-1.jpeg',
        name: 'Tomato Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Tomato"
      },
      {
        title:'Veg',
        image: '/lemon-1.jpeg',
        name: 'Lemon Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Lemon"
      },
      {
        title:'Veg',
        image: '/curry-1.jpeg',
        name: 'Curry Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Curry"
      },
      {
        title:'Veg',
        image: '/green-1.jpeg',
        name: 'Green Chilli Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "GreenChilli"
      }
    ],
    "non-veg":[
      {
        title:'Non Veg',
        image: '/mutton-1.jpeg',
        name: 'Chicken Pickle',
        price: 'Rs.300',
        link: '/pickleinfo',
        type: "Chicken"
      },
      {
        title:'Non Veg',
        image: '/mutton-1.jpeg',
        name: 'Meat Pickle',
        price: 'Rs.350',
        link: '/pickleinfo',
        type: "Meat"
      },
      {
        title:'Non Veg',
        image: '/prawns-1.jpeg',
        name: 'Prawns Pickle',
        price: 'Rs.170',
        link: '/pickleinfo',
        type: "Prawns"
      },
      {
        title:'Non Veg',
        image: '/mutton-1.jpeg',
        name: 'Fish Pickle',
        price: 'Rs.200',
        link: '/pickleinfo',
        type: "Fish"
      }
    ]
};

const Pickle = () => {
  const router = useRouter();
  const { type } = router.query;

  const [activeCategory, setActiveCategory] = useState('veg'); // default category

  useEffect(() => {
      if (type) {
          setActiveCategory(type);
      }
  }, [type]);

  const handleRedirect = (pickle) => {
    router.push({
        pathname: pickle.link,
        query: { type: pickle.type }
    });
};

  const activePickleData = pickleData[activeCategory] || [];

  if (!activePickleData.length) {
      return <p>Loading... or No pickles available for this category.</p>;
  }

  return (
      <>
          <Header title="Pickle Site" />
          <div className="p-8 pb-12 text-center md:text-left scroll-smooth">
              <h1 className="text-xl text-bold pb-4 md:text-3xl font-serif">{activePickleData[0].title} Pickles</h1> <hr className="pb-4"/>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-6 pt-2">
                  {activePickleData.map((pickle, index) => (
                      <div key={index} className="bg-white p-2 md:p-6 rounded shadow-md hover:shadow-xl text-[14px] md:text-sm text-black" onClick={() => handleRedirect(pickle)}>
                          <img src={pickle.image} alt={pickle.name} className="w-full h-36 sm:h-36 md:h-48 object-fill rounded-lg" />
                          <div className="md:grid md:grid-cols-3 pt-5">
                              <div className="md:col-span-2">
                                  <h3 className="font-bold">{pickle.name}</h3>
                                  <p className="text-gray-700 pt-1">From {pickle.price}</p>
                              </div>
                              <div className='hidden md:block'>
                                  <Link href={{ pathname: pickle.link, query: { type: pickle.type } }}>
                                          <Button variant="outline" className="float-right">
                                              View
                                          </Button>
                                  </Link>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <Footer />
      </>
  );
};
  
  export default Pickle;