import Link from 'next/link';
import React, { useState, useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  import PickleType from '@/data/pickles.json';  


const PickleData = () => {
    const router = useRouter();
    const {type} = router.query;

    const PickleDesc = type ? PickleType.filter(pickle => pickle.type === type) : [];

    const amount = PickleDesc.length > 0 ? PickleDesc[0].amount : null;

    const [weight, setWeight] = useState('250');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(amount);

    const calculatePrice = (weight, quantity) => {
        const pricePerGram = {
            '250': amount,
            '500': 2 * amount,
            '1': 4 * amount
        };
        return pricePerGram[weight] * quantity;
    };

    useEffect(() => {
        setPrice(calculatePrice(weight, quantity));
    }, [weight, quantity]);
  
    return (
      <>
        <Header title="Chicken Pickle" />
        <div className="p-8 pb-12 text-left scroll-smooth">
            {PickleDesc.map((pickle) => (
            <div key={pickle.type} className="grid sm:grid-cols-2 gap-6 gap-6 pt-4">
                <div className="sm:px-8">
                    {pickle.image.map((data) => (
                    <img key={data.name} src={data.name} alt={data.name} className="w-full h-64 sm:h-60 md:h-[28rem] object-fill" />
                    ))}
                    <h1 className="md:hidden mt-8 pb-2 font-serif text-bold">{pickle.name}</h1><hr/>
                    <div className="md:hidden grid grid-cols-2 gap-6">
                        <div className="mt-4">
                            <h3 className="mb-2 text-sm text-[#666666] font-semibold">Price</h3>
                            <label>{price}</label>
                        </div>
                        <div className="mt-2">
                            <h3 className="mb-2 text-sm text-[#666666] font-semibold">Weight</h3>
                            <Select value={weight} onValueChange={setWeight}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="250">250 gms</SelectItem>
                                    <SelectItem value="500">500 gms</SelectItem>
                                    <SelectItem value="1">1 Kg</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-2 col-span-2">
                            <h3 className="mb-2 text-sm text-[#666666] font-semibold">Quantity</h3>
                            <div className="flex gap-2">
                                <button className="p-2 w-8 bg-[#cbcbcb]" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    -
                                </button>
                                <label className="px-4 py-2 bg-[#cbcbcb]">{quantity}</label>
                                <button className="p-2 w-8 bg-[#cbcbcb]" onClick={() => setQuantity(quantity + 1)}>
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-8 mb-2 text-[#666666] text-left font-semibold">Health benefits</h3><hr/>
                    <h3 className="mt-4 mb-2 text-[#666666]">{pickle.benefits}</h3>
                    <h3 className="mt-4 mb-2 text-[#666666] text-left font-semibold">Product Storage</h3><hr/>
                    <h3 className="mt-4 mb-2 text-[#666666]">{pickle.storage}</h3>
                </div>
                <div className="sm:px-8 md:px:12">
                    <h1 className="hidden md:block pb-2 md:text-4xl font-serif text-bold">{pickle.name}</h1><hr/>
                    <div className="hidden md:grid grid-cols-3 gap-6">
                        <div className="mt-8">
                            <h3 className="mb-2 text-sm text-[#666666] font-semibold">Price</h3>
                            <label>{price}</label>
                        </div>
                        <div className="mt-8">
                            <h3 className="mb-2 text-sm text-[#666666] font-semibold">Weight</h3>
                            <Select value={weight} onValueChange={setWeight}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="250">250 gms</SelectItem>
                                    <SelectItem value="500">500 gms</SelectItem>
                                    <SelectItem value="1">1 Kg</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-8">
                            <h3 className="mb-2 text-sm text-[#666666] font-semibold">Quantity</h3>
                            <div className="flex gap-2">
                                <button className="p-2 w-8 bg-[#cbcbcb]" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    -
                                </button>
                                <label className="px-4 py-2 bg-[#cbcbcb]">{quantity}</label>
                                <button className="p-2 w-8 bg-[#cbcbcb]" onClick={() => setQuantity(quantity + 1)}>
                                    +
                                </button>
                            </div>
                        </div>
                    </div>    
                    <h3 className="mt-8 mb-2 text-[#666666] font-semibold">Product Description</h3><hr/>
                    <h3 className="mt-4 mb-2 text-[#666666]">{pickle.desc}</h3>
                    <h3 className="mt-4 mb-2 text-[#666666]">{pickle.desc2}</h3>
                    <h3 className="mt-4 mb-2 text-[#666666] font-semibold">Ingredients</h3><hr/>
                    <div className="grid grid-cols-1 gap-2 pt-4">
                    {pickle.ingredients.map((pickle) => (
                        <h3 key={pickle.name} className="text-[#666666]">{pickle.name}</h3>
                    ))}
                    </div>                        

                </div>    
            </div>
            ))}
        </div>
        <Footer></Footer>
        </>
    );
  };
  
  export default PickleData;