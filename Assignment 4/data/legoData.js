// data/legoData.js
// Simple in-memory lego data module with addSet(newSet) returning a Promise

class LegoData {
  constructor() {
    // initial sample data
    this.sets = [
      {
        set_num: "001",
        name: "Starter Set",
        year: "2020",
        theme_id: "100",
        num_parts: "50",
        img_url: "https://fakeimg.pl/300x300?text=Starter"
      }
    ];
  }

  getAllSets() {
    // return a shallow copy to prevent external mutation
    return this.sets.slice();
  }

  addSet(newSet) {
    return new Promise((resolve, reject) => {
      if (!newSet || !newSet.set_num) {
        return reject('Invalid set data');
      }
      const exists = this.sets.some(s => String(s.set_num) === String(newSet.set_num));
      if (exists) {
        return reject('Set already exists');
      }
      // add set
      this.sets.push(newSet);
      resolve();
    });
  }
}

module.exports = LegoData;
