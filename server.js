const firebase = require('firebase/app');
require('firebase/firestore');

    // Initialize Firebase app
    var firebaseConfig = {
        apiKey: "AIzaSyA438akSsOMeCY8OFufbAqnwLeUn7rMpj0",
  authDomain: "jotunheimdb.firebaseapp.com",
  databaseURL: "https://jotunheimdb-default-rtdb.firebaseio.com",
  projectId: "jotunheimdb",
  storageBucket: "jotunheimdb.appspot.com",
  messagingSenderId: "1076646258266",
  appId: "1:1076646258266:web:d3026093cc3c46c72e1a63",
  measurementId: "G-D9DDZGYWRV"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const express = require('express');
const { getPurchasableItemsServer } = require('./server'); // Assuming your server-side code is in a separate file

const app = express();
const port = process.env.PORT || 3000;

app.get('/purchasable-items', async (req, res) => {
  try {
    const items = await getPurchasableItemsServer();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static('public')); // Serve static files from the 'public' directory

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function getPurchasableItems() {
  const collectionPaths = [
    '/ItemDatabase/Type/AdminShop',
    '/ItemDatabase/Type/Ammo',
    '/ItemDatabase/Type/ArmorSets',
    '/ItemDatabase/Type/BossDrops',
    '/ItemDatabase/Type/BossSummons',
    '/ItemDatabase/Type/BuildingCraftingMaterials',
    '/ItemDatabase/Type/CookedFood',
    '/ItemDatabase/Type/Currency',
    '/ItemDatabase/Type/Fish',
    '/ItemDatabase/Type/FishingBait',
    '/ItemDatabase/Type/Mead',
    '/ItemDatabase/Type/RawFood',
    '/ItemDatabase/Type/Seeds',
    '/ItemDatabase/Type/Shields',
    '/ItemDatabase/Type/TamedAnimals',
    '/ItemDatabase/Type/Tools',
    '/ItemDatabase/Type/Trophies',
    '/ItemDatabase/Type/Weapons'
  ];

  const itemsPromises = collectionPaths.map((collectionPath) =>
    firestore
      .collection(collectionPath)
      .where('AdminShopList', '==', true)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.get('ItemName'));
      })
  );

  return Promise.all(itemsPromises).then((results) => {
    return results.flat();
  });
}

// Server-side function to retrieve and return the purchasable items
function getPurchasableItemsServer() {
  return getPurchasableItems();
}

module.exports = {
  getPurchasableItemsServer
};
