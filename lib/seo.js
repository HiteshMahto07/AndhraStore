export const SITE_URL = "https://andhrastore.com";

// Short, SEO-optimised display names used in title tags and schema
export const PRODUCT_SEO_NAMES = {
  Chicken:    "Andhra Chicken Pickle",
  Meat:       "Andhra Meat Pickle",
  Prawns:     "Andhra Prawns Pickle",
  Ginger:     "Andhra Ginger Pickle",
  Mango:      "Andhra Mango Pickle",
  Fish:       "Andhra Fish Pickle",
  Garlic:     "Andhra Garlic Pickle",
  RedChilli:  "Andhra Red Chilli Pickle",
  Gongura:    "Andhra Gongura Pickle",
  Tomato:     "Andhra Tomato Pickle",
  Lemon:      "Andhra Lemon Pickle",
  Amla:       "Andhra Amla Pickle",
  Curry:      "Andhra Curry Leaves Pickle",
  GreenChilli:"Andhra Green Chilli Pickle",
};

// Unique, keyword-rich meta descriptions per product (all under 160 chars)
export const PRODUCT_SEO_DESCS = {
  Chicken:    "Authentic Andhra boneless chicken pickle. Handcrafted with Guntur chillies, garam masala & cold-pressed oil. 250g from ₹300. No preservatives. Ships pan-India.",
  Meat:       "Traditional Andhra mutton pickle made in small batches with authentic spices. Rich, bold flavour. 250g from ₹350. No preservatives. Pan-India delivery.",
  Prawns:     "Spicy Andhra prawns pickle made with fresh seafood & East Godavari masala. 250g from ₹350. No preservatives. Ships across India.",
  Ginger:     "Zesty Andhra ginger pickle with roasted mustard, Guntur red chilli & cold-pressed groundnut oil. Aids digestion. 250g from ₹200. Pan-India shipping.",
  Mango:      "Authentic Andhra mango avakaya pickle — bold, tangy and fiery. Made with raw Rajahmundry mangoes. 250g from ₹200. No preservatives. Pan-India delivery.",
  Fish:       "Andhra fish pickle made with fresh catch & traditional spice blend. Rich in omega-3. 250g from ₹200. No preservatives. Delivered fresh pan-India.",
  Garlic:     "Pungent Andhra garlic pickle rich in allicin. Handcrafted with Guntur chillies & cold-pressed oil. 250g from ₹200. No preservatives. Pan-India delivery.",
  RedChilli:  "Fiery Andhra red chilli pickle for heat lovers. Made with whole Guntur red chillies & traditional masala. 250g from ₹200. No preservatives. Ships pan-India.",
  Gongura:    "Authentic Andhra gongura pickle — iconic sour sorrel leaf specialty of East Godavari. 250g from ₹200. No preservatives. Delivered fresh pan-India.",
  Tomato:     "Tangy Andhra tomato pickle rich in lycopene. Slow-cooked with mustard seeds & red chilli. 250g from ₹200. No preservatives. Pan-India delivery.",
  Lemon:      "Sharp Andhra lemon pickle with Guntur red chillies & roasted fenugreek. Great digestive aid. 250g from ₹200. No preservatives. Ships pan-India.",
  Amla:       "Andhra amla (Indian gooseberry) pickle — high in Vitamin C and antioxidants. 250g from ₹200. No preservatives. Pan-India delivery.",
  Curry:      "Andhra curry leaves pickle — aromatic, rich in Vitamins A, B, C & E. Pairs with rice and idli. 250g from ₹200. No preservatives. Pan-India shipping.",
  GreenChilli:"Andhra green chilli pickle for bold heat lovers. Made with fresh chillies & traditional masala. 250g from ₹200. No preservatives. Pan-India delivery.",
};

// Per-product ratings (shown in schema AggregateRating and UI star displays)
export const PRODUCT_RATINGS = {
  Chicken:    { rating: 4.8, count: 312 },
  Meat:       { rating: 4.7, count: 198 },
  Prawns:     { rating: 4.7, count: 167 },
  Ginger:     { rating: 4.5, count: 203 },
  Mango:      { rating: 4.9, count: 445 },
  Fish:       { rating: 4.3, count: 89  },
  Garlic:     { rating: 4.6, count: 178 },
  RedChilli:  { rating: 4.4, count: 134 },
  Gongura:    { rating: 4.5, count: 156 },
  Tomato:     { rating: 4.4, count: 112 },
  Lemon:      { rating: 4.3, count: 98  },
  Amla:       { rating: 4.2, count: 76  },
  Curry:      { rating: 4.3, count: 89  },
  GreenChilli:{ rating: 4.4, count: 103 },
};

export const NON_VEG_TYPES = new Set(['Chicken', 'Meat', 'Prawns', 'Fish']);
