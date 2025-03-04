const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = {
  products: [
    {
      name: 'basmati-rice.jpg',
      url: 'https://raw.githubusercontent.com/your-username/banglabazar-assets/main/products/basmati-rice.jpg'
    },
    {
      name: 'red-lentils.jpg',
      url: 'https://raw.githubusercontent.com/your-username/banglabazar-assets/main/products/red-lentils.jpg'
    },
    {
      name: 'mango-pickle.jpg',
      url: 'https://raw.githubusercontent.com/your-username/banglabazar-assets/main/products/mango-pickle.jpg'
    }
  ],
  banners: [
    {
      name: 'diwali-sale.jpg',
      url: 'https://raw.githubusercontent.com/your-username/banglabazar-assets/main/banners/diwali-sale.jpg'
    },
    {
      name: 'fresh-vegetables.jpg',
      url: 'https://raw.githubusercontent.com/your-username/banglabazar-assets/main/banners/fresh-vegetables.jpg'
    }
  ]
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}. Status code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllImages() {
  // Create directories if they don't exist
  const dirs = ['public/images/products', 'public/images/banners'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Download product images
  console.log('Downloading product images...');
  for (const product of imageUrls.products) {
    const filepath = path.join('public/images/products', product.name);
    try {
      await downloadImage(product.url, filepath);
      console.log(`Downloaded ${product.name}`);
    } catch (error) {
      console.error(`Error downloading ${product.name}:`, error.message);
    }
  }

  // Download banner images
  console.log('\nDownloading banner images...');
  for (const banner of imageUrls.banners) {
    const filepath = path.join('public/images/banners', banner.name);
    try {
      await downloadImage(banner.url, filepath);
      console.log(`Downloaded ${banner.name}`);
    } catch (error) {
      console.error(`Error downloading ${banner.name}:`, error.message);
    }
  }

  console.log('\nDownload completed!');
}

downloadAllImages(); 