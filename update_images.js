const fs = require('fs');

const dataRaw = fs.readFileSync('./data/pickles.json', 'utf8');
let pickles = JSON.parse(dataRaw);

const mapping = {
  "Chicken": [
    "/images/Non Veg Pickle/Chicken Pickle.png",
    "/images/Non Veg Pickle/Chciken Pickle 1.png",
    "/images/Non Veg Pickle/Chicken.jpg"
  ],
  "Meat": [
    "/images/Non Veg Pickle/Mutton Pickle.png"
  ],
  "Prawns": [
    "/images/Non Veg Pickle/Prawns Pickle.png",
    "/images/Non Veg Pickle/Prawns Pickle 1.png",
    "/images/Non Veg Pickle/PRAWNS.jpg"
  ],
  "Fish": [
    "/images/Non Veg Pickle/Fish Pickle.png",
    "/images/Non Veg Pickle/Fish Pickle 1.jpg"
  ],
  "Ginger": [
    "/images/Veg Pickle/Ginger Pickle 1.png",
    "/images/Veg Pickle/Ginger Pickle.jpg"
  ],
  "Mango": [
    "/images/Veg Pickle/Mango Pickle.png",
    "/images/Veg Pickle/Mango.jpg",
    "/images/Veg Pickle/Mango Pickle 1 (2).png"
  ],
  "Garlic": [
    "/images/Veg Pickle/Garlic Pickle.png",
    "/images/Veg Pickle/Garlic Pickle 1.png",
    "/images/Veg Pickle/Garlic Pickle 1 (2).png",
    "/images/Veg Pickle/Garlic.jpg"
  ],
  "RedChilli": [
    "/images/Veg Pickle/Red Chilli Pickle.png",
    "/images/Veg Pickle/Red Chilli Pickle 1.png",
    "/images/Veg Pickle/Red Chilli Pickle 02.png"
  ],
  "Gongura": [
    "/images/Veg Pickle/Gongura Pickle.png",
    "/images/Veg Pickle/Gongura Pickle 1.png"
  ],
  "Tomato": [
    "/images/Veg Pickle/Tomato Pickle 1.png",
    "/images/Veg Pickle/Tomato Pickle.jpg",
    "/images/Veg Pickle/Tomato Pickle 1.jpg"
  ],
  "Lemon": [
    "/images/Veg Pickle/Lemon Pickle.png"
  ],
  "Amla": [
    "/images/Veg Pickle/Amla Pickle.png",
    "/images/Veg Pickle/Amla.jpg"
  ],
  "Curry": [
    "/images/Veg Pickle/Curry Leaves Pickle.jpg",
    "/images/Veg Pickle/Curry Leaves Pickle 1.jpg"
  ],
  "GreenChilli": [
    "/images/Veg Pickle/Green Chilli Pickle.png",
    "/images/Veg Pickle/Green Chilli Pickle 11.jpg"
  ]
};

pickles = pickles.map(p => {
  if (mapping[p.type]) {
    p.image = mapping[p.type].map(url => ({ name: url }));
  }
  return p;
});

fs.writeFileSync('./data/pickles.json', JSON.stringify(pickles, null, 4));
console.log('Successfully updated pickles.json');
