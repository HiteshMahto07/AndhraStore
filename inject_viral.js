const fs = require('fs');

const dataRaw = fs.readFileSync('./data/pickles.json', 'utf8');
let pickles = JSON.parse(dataRaw);

const newProducts = [
  {
    "type": "PanMukhwas",
    "name": "Calcutta Pan Mukhwas",
    "image": [{ "name": "/images/Viral Products/Pan Mukhwas.jpeg" }],
    "benefits": "A refreshing mouth freshener that aids digestion after heavy meals and leaves a lingering, sweet, authentic paan flavor.",
    "amount": 150,
    "ingredients": [
        { "name": "Betel Leaves" },
        { "name": "Fennel Seeds" },
        { "name": "Dried Dates" },
        { "name": "Rose Petals (Gulkand)" }
    ],
    "desc": "Experience the royal taste of Calcutta with this perfectly sweet and refreshing Pan Mukhwas. Ideal for digestion and fresh breath.",
    "desc2": "Available in 250g, 500g, and 1kg packs.",
    "storage": "Keep in an airtight container in a cool, dry place to maintain maximum freshness."
  },
  {
    "type": "RajwadiMukhwas",
    "name": "Rajwadi Mukhwas",
    "image": [{ "name": "/images/Viral Products/Rajwadi-mukhwas.jpg" }],
    "benefits": "Packed with seeds and aromatic dry fruits, Rajwadi Mukhwas provides a rich source of micronutrients and acts as a powerful digestive aid.",
    "amount": 180,
    "ingredients": [
        { "name": "Roasted Fennel" },
        { "name": "Coriander Seeds" },
        { "name": "Sesame Seeds" },
        { "name": "Mixed Spices" }
    ],
    "desc": "A premium, royal mouth freshener blend with a satisfying crunch and an explosion of traditional Indian flavors.",
    "desc2": "Available in 250g, 500g, and 1kg packs.",
    "storage": "Store in an airtight container to preserve crispness and aroma."
  },
  {
    "type": "RangBhiRangiMukhwas",
    "name": "Rang Bhi Rangi Mukhwas",
    "image": [{ "name": "/images/Viral Products/Rang Bhi Rangi Mukhwas.webp" }],
    "benefits": "Colorfully delightful and packed with digestive fennel, this sweet treat is a massive hit with children and adults alike.",
    "amount": 120,
    "ingredients": [
        { "name": "Sugar-coated Fennel" },
        { "name": "Silver Leaves" },
        { "name": "Sweet Candies" }
    ],
    "desc": "A vibrant, colorful burst of sweetness and fennel! The classic Rang Bhi Rangi Mukhwas brings back childhood memories with every bite.",
    "desc2": "Available in 250g, 500g, and 1kg premium jars.",
    "storage": "Store in a cool, dry place away from direct sunlight."
  },
  {
    "type": "EyeWarmer",
    "name": "Therapeutic Eye Pack Warmer",
    "image": [{ "name": "/images/Viral Products/Eye Pack Wamer 1.jpeg" }, { "name": "/images/Viral Products/Eye Pack Wamer 2.jpeg" }],
    "benefits": "Relieves eye strain, massive headaches, and tension. Filled with natural grains and herbs that retain gentle, comforting heat.",
    "amount": 499,
    "ingredients": [
        { "name": "Premium Cotton Cover" },
        { "name": "Natural Grains" },
        { "name": "Lavender/Herbs" }
    ],
    "desc": "Melt away the stress of screen time with our natural, reusable Eye Pack Warmer. Simply heat in the microwave for a few seconds and enjoy spa-like relief at home.",
    "desc2": "Available as a single pack with a washable outer cover.",
    "storage": "Keep in a clean dry place when not in use."
  },
  {
    "type": "BlackPepperPapad",
    "name": "Black Pepper Papad",
    "image": [{ "name": "/images/Viral Products/Black_pepper_papad_2-removebg-preview-2.png" }],
    "benefits": "Black pepper improves stomach acid secretion, aiding in digestion, while the lentil base provides a light, protein-rich crunch.",
    "amount": 90,
    "ingredients": [
        { "name": "Urad Dal Flour" },
        { "name": "Crushed Black Pepper" },
        { "name": "Sea Salt" },
        { "name": "Asafoetida (Hing)" }
    ],
    "desc": "Hand-rolled and sun-dried, our classic Black Pepper Papad is thin, immensely crispy, and packed with the fiery punch of crushed pepper.",
    "desc2": "Available in perfectly sealed 250g and 500g packs.",
    "storage": "Store in a dry place. Can be roasted or deep-fried."
  },
  {
    "type": "SpringRollSheets",
    "name": "Premium Spring Roll Sheets",
    "image": [{ "name": "/images/Viral Products/Spring Roll Sheets.jpeg" }],
    "benefits": "A versatile base for dozens of snacks, these sheets are cleanly manufactured to hold fillings without breaking easily.",
    "amount": 140,
    "ingredients": [
        { "name": "Wheat Flour" },
        { "name": "Water" },
        { "name": "Salt" },
        { "name": "Edible Oil" }
    ],
    "desc": " ultra-thin, highly elastic spring roll sheets perfect for making crunchy, golden-brown spring rolls, samosas, and viral wrap hacks effortlessly at home.",
    "desc2": "Available in packs of 20 and 40 sheets.",
    "storage": "Keep frozen. Thaw at room temperature for 30 minutes before use."
  }
];

// Check which products need to be added
newProducts.forEach(product => {
  const exists = pickles.find(p => p.type === product.type);
  if (!exists) {
    pickles.push(product);
  }
});

fs.writeFileSync('./data/pickles.json', JSON.stringify(pickles, null, 4));
console.log('Successfully injected viral products to data/pickles.json');
