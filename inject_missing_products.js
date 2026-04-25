const fs = require('fs');

const dataRaw = fs.readFileSync('./data/pickles.json', 'utf8');
let pickles = JSON.parse(dataRaw);

const newProducts = [
  {
    "type": "VellulliPodi",
    "name": "Vellulli Karam Podi",
    "image": [{ "name": "/images/Podi & Gun Powder Masala/Red Chilli Garlic Podi & vellulli karam podi.jfif" }],
    "benefits": "Garlic (Vellulli) is globally renowned for its immense health benefits. This potent podi is rich in allicin, supporting cardiovascular health and reducing blood pressure. Regular consumption of garlic podi with hot rice and ghee enhances digestion and boosts absolute immunity.",
    "amount": 165,
    "ingredients": [
        { "name": "Premium Garlic Cloves" },
        { "name": "Guntur Red Chillies" },
        { "name": "Roasted Chana Dal" },
        { "name": "Cumin Seeds" },
        { "name": "Sea Salt" }
    ],
    "desc": "Andhra Store's classic Vellulli Karam Podi is carefully hand-pounded to retain the robust, intense flavor of fresh garlic and the fiery hit of Guntur chillies. Perfect for mixing with hot steamed rice and ghee or as a side for idlis and dosas.",
    "desc2": "Available in freshly sealed 250g, 500g, and 1kg authentic packs.",
    "storage": "Store in an airtight container immediately after unpacking. Keep away from moisture to retain crispness and vivid aroma for up to 6 months."
  },
  {
    "type": "PalliPodi",
    "name": "Palli Karampodi",
    "image": [{ "name": "/images/Podi & Gun Powder Masala/Peanut Podi.JPG" }],
    "benefits": "Peanuts are an excellent source of plant-based protein, healthy fats, and fiber. This Palli Podi provides sustained energy, supports heart health, and offers essential vitamins and minerals for daily wellness.",
    "amount": 160,
    "ingredients": [
        { "name": "Roasted Peanuts" },
        { "name": "Red Chillies" },
        { "name": "Garlic" },
        { "name": "Cumin Seeds" },
        { "name": "Curry Leaves" }
    ],
    "desc": "Our signature Palli (Peanut) Karampodi delivers a deeply nutty, mildly spicy, and highly addictive flavor profile. Traditionally stone-ground to achieve the perfect coarse texture for your breakfast tiffins.",
    "desc2": "Available in freshly sealed 250g, 500g, and 1kg authentic packs.",
    "storage": "Store in an airtight container immediately after unpacking. Keep away from moisture to retain crispness and vivid aroma for up to 6 months."
  },
  {
    "type": "KarivepakuPodi",
    "name": "Karivepaku Karam Podi",
    "image": [{ "name": "/images/Podi & Gun Powder Masala/Nala Karam Podi.JPG" }],
    "benefits": "Curry leaves are a powerhouse of iron and folic acid. Consuming Karivepaku Podi treats anemia, purifies the blood, improves skin complexion, and is famously known to promote healthy hair growth and prevent premature greying.",
    "amount": 160,
    "ingredients": [
        { "name": "Sun-dried Curry Leaves" },
        { "name": "Urad Dal" },
        { "name": "Tamarind" },
        { "name": "Coriander Seeds" },
        { "name": "Red Chillies" }
    ],
    "desc": "Hand-crafted using fresh, tender curry leaves sourced directly from Andhra farms, our Karivepaku Podi is an aromatic masterpiece. A highly nutritious spice blend that transforms any simple meal.",
    "desc2": "Available in freshly sealed 250g, 500g, and 1kg authentic packs.",
    "storage": "Store in an airtight container immediately after unpacking. Keep away from moisture to retain crispness and vivid aroma for up to 6 months."
  },
  {
    "type": "KothimeeraPodi",
    "name": "Kothimeera Karam Podi",
    "image": [{ "name": "/images/Podi & Gun Powder Masala/Kandi Podi.jpg" }],
    "benefits": "Coriander (Kothimeera) is incredibly cooling for the digestive tract. It acts as a natural detoxifier, aids in clearing the skin, and helps in lowering bad cholesterol while elevating good cholesterol levels.",
    "amount": 160,
    "ingredients": [
        { "name": "Fresh Coriander Leaves" },
        { "name": "Chana Dal" },
        { "name": "Tamarind" },
        { "name": "Red Chillies" },
        { "name": "Garlic" }
    ],
    "desc": "A vibrant green, tangy, and earthy spice mix made by slowly roasting fresh coriander leaves. Kothimeera Karam Podi by Andhra Store brings a refreshing and deeply satisfying zest to idlis, dosas, and rice.",
    "desc2": "Available in freshly sealed 250g, 500g, and 1kg authentic packs.",
    "storage": "Store in an airtight container immediately after unpacking. Keep away from moisture to retain crispness and vivid aroma for up to 6 months."
  },
  {
    "type": "Chegodi",
    "name": "Traditional Chegodi",
    "image": [{ "name": "/images/Andhra Special/Chegodi.jpg" }],
    "benefits": "Made primarily from rice flour and moong dal, Chegodilu are a light and highly digestible snack. The addition of cumin and sesame seeds aids digestion and offers calcium.",
    "amount": 120,
    "ingredients": [
        { "name": "Premium Rice Flour" },
        { "name": "Moong Dal" },
        { "name": "Sesame Seeds" },
        { "name": "Cumin Seeds" },
        { "name": "Red Chilli Powder" }
    ],
    "desc": "Chegodi is the ultimate ring-shaped crunchy Andhra snack. Perfectly spiced, flawlessly golden, and incredibly addictive, it is the absolute best companion for your evening tea or coffee.",
    "desc2": "Available in freshly sealed 250g, 500g, and 1kg packs.",
    "storage": "Store in a dry, airtight container to maintain maximum crunchiness. Best consumed within 3 months."
  },
  {
    "type": "Murukulu",
    "name": "Bhavnagari Gathiya / Murukulu",
    "image": [{ "name": "/images/Snacks/Bhavnagari_Gathiya.webp" }],
    "benefits": "Made from besan (gram flour), these snacks offer a higher protein and fiber content than typical refined flour snacks, making them a relatively healthier savory option.",
    "amount": 150,
    "ingredients": [
        { "name": "Gram Flour (Besan)" },
        { "name": "Carom Seeds (Ajwain)" },
        { "name": "Edible Cooking Oil" },
        { "name": "Sea Salt" }
    ],
    "desc": "Crispy, savory, and delicately spiced, our Murukulu / Gathiya captures the authentic essence of Indian savory snacks. Extruded into classic shapes and deep-fried to golden perfection.",
    "desc2": "Available in freshly sealed 250g, 500g, and 1kg packs.",
    "storage": "Store in a dry, airtight container to maintain maximum crunchiness. Best consumed within 3 months."
  },
  {
    "type": "Pootharekulu",
    "name": "Traditional Pootharekulu",
    "image": [{ "name": "/images/Andhra Special/Rice Paper Roll _Putharekulu.jpg" }],
    "benefits": "A cultural masterpiece. When made with pure jaggery and ghee, it provides instant healthy energy, while the dry fruits stuffed inside offer essential micronutrients and healthy fats.",
    "amount": 250,
    "ingredients": [
        { "name": "Wafer-thin Rice Starch Paper" },
        { "name": "Premium Ghee" },
        { "name": "Jaggery / Sugar" },
        { "name": "Cashews & Almonds" }
    ],
    "desc": "Originating from Atreyapuram, Pootharekulu (Paper Sweet) is an intricate, royal Andhra delicacy. Delicate, translucent rice starch papers are generously coated with pure ghee, sugar/jaggery, and crushed dry fruits, then skillfully folded.",
    "desc2": "Available in premium 10-piece and 20-piece assorted gift boxes.",
    "storage": "Handle with extreme care as they are highly fragile. Store in an airtight box and consume within 2-3 weeks for optimal freshness."
  },
  {
    "type": "Kaja",
    "name": "Madatha Kaja",
    "image": [{ "name": "/images/Andhra Special/Madta Kaja.jpg" }],
    "benefits": "A traditional festive indulgence that offers a swift rush of energy from the sugar syrup, combined with the satiating richness of ghee.",
    "amount": 200,
    "ingredients": [
        { "name": "All-purpose Flour" },
        { "name": "Pure Ghee" },
        { "name": "Sugar Syrup" },
        { "name": "Cardamom Powder" }
    ],
    "desc": "Madatha Kaja is a legendary layered sweet from coastal Andhra. The dough is rolled into multiple thin layers, deep-fried until flawlessly crispy, and soaked in a warm, cardamom-infused sugar syrup.",
    "desc2": "Available in freshly packed 250g, 500g, and 1kg boxes.",
    "storage": "Store in an airtight container at room temperature. Do not refrigerate as the syrup will crystallize. Consume within 15 days."
  },
  {
    "type": "Sunnundalu",
    "name": "Urad Dal Laddu (Sunnundalu)",
    "image": [{ "name": "/images/Andhra Special/Sunundalu_ Urad Dal Laddu.jpg" }],
    "benefits": "Sunnundalu are famously recommended for strengthening bones and muscles, especially for growing children and women. Urad dal is a formidable source of protein, calcium, and iron.",
    "amount": 300,
    "ingredients": [
        { "name": "Roasted Urad Dal (Black Gram) Flour" },
        { "name": "Jaggery / Sugar" },
        { "name": "Pure Country Ghee" },
        { "name": "Cardamom" }
    ],
    "desc": "Sunnundalu are traditional, highly nutritious Andhra laddus crafted by blending roasted urad dal powder with jaggery and generous amounts of pure, aromatic ghee. A rich, melt-in-the-mouth experience.",
    "desc2": "Available in expertly packed 250g, 500g, and 1kg boxes.",
    "storage": "Store in an airtight container. The high ghee content keeps them fresh for up to 30 days at room temperature."
  },
  {
    "type": "Ariselu",
    "name": "Jaggery Ariselu",
    "image": [{ "name": "/images/Andhra Special/Ariselu-Sweet.jpg" }],
    "benefits": "Jaggery acts as an excellent digestive agent and aids in detoxifying the liver. The sesame seeds pressed onto the Ariselu provide a potent dose of calcium and healthy fatty acids.",
    "amount": 180,
    "ingredients": [
        { "name": "Freshly Ground Rice Flour" },
        { "name": "Dark Jaggery" },
        { "name": "Sesame Seeds" },
        { "name": "Pure Ghee & Oil" }
    ],
    "desc": "Ariselu is the sovereign of South Indian festive sweets. This traditional, deep-fried delicacy is forged by carefully balancing soaked rice flour and boiling jaggery syrup, resulting in a soft, chewy interior and a delightfully crispy, sesame-studded exterior.",
    "desc2": "Available in freshly packed 250g, 500g, and 1kg boxes.",
    "storage": "Store in an airtight container to retain its chewy texture. Consume within 15-20 days."
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
console.log('Successfully injected 10 missing products to data/pickles.json');
