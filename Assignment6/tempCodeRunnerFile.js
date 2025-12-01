class legoData {
    constructor() {
        this.sets = [];
    }

    initialize() {
        return new Promise((resolve, reject) => {
            try {
                const setData = require("./data/setData");
                const themeData = require("./data/themeData");
                    
                this.sets = [];
                 

                setData.forEach(set => {
                    const theme = themeData.find(t => t.id === set.theme_id);

                    this.sets.push({
                        set_num: set.set_num,
                        name: set.name,
                        year: set.year,
                        theme_id: set.theme_id,
                        num_parts: set.num_parts,
                        img_url: set.img_url,
                        theme: theme ? theme.name : "Unknown"
                    });
                });
                resolve(); 
            } catch (err) {
                reject(`Error initializing data: ${err}`);
            }
        });
    }