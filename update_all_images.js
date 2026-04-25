const fs = require('fs');
const path = require('path');

const map = {
  '/mango-1.jpeg': '/images/Veg Pickle/Mango Pickle 1 (2).png',
  '/chicken-1.jpeg': '/images/Non Veg Pickle/Chicken Pickle.png',
  '/fish-1.jpeg': '/images/Non Veg Pickle/Fish Pickle.png',
  '/fish-2.jpeg': '/images/Non Veg Pickle/Fish Pickle 1.jpg',
  '/mutton-1.jpeg': '/images/Non Veg Pickle/Mutton Pickle.png',
  '/garlic-1.jpeg': '/images/Veg Pickle/Garlic Pickle.png',
  '/gongura-1.jpeg': '/images/Veg Pickle/Gongura Pickle.png',
  '/tomato-1.jpeg': '/images/Veg Pickle/Tomato Pickle 1.png',
  '/redchilli-1.jpeg': '/images/Veg Pickle/Red Chilli Pickle.png',
  '/kareli-1.jpeg': '/images/Veg Pickle/Karela Pickle.jpg',
  '/amla-1.jpeg': '/images/Veg Pickle/Amla Pickle.png',
  '/curry-1.jpeg': '/images/Veg Pickle/Curry Leaves Pickle.jpg',
  '/green-1.jpeg': '/images/Veg Pickle/Green Chilli Pickle.png',
  '/lemon-1.jpeg': '/images/Veg Pickle/Lemon Pickle.png',
  '/prawns-1.jpeg': '/images/Non Veg Pickle/Prawns Pickle.png',
  '/ginger-1.jpeg': '/images/Veg Pickle/Ginger Pickle 1.png'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFiles() {
  const dirs = ['./pages', './components'];
  let count = 0;
  
  dirs.forEach(dir => {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        for (const [oldPath, newPath] of Object.entries(map)) {
          if (content.includes(oldPath)) {
            // Use regex to replace all occurrences literally
            // Escape dots and dashes in oldPath
            const regex = new RegExp(oldPath.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            content = content.replace(regex, newPath);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated: ${filePath}`);
          count++;
        }
      }
    });
  });
  console.log(`Total files updated: ${count}`);
}

processFiles();
