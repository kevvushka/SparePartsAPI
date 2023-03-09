import fs from 'fs';
import express from 'express';

const app = express();

const file = fs.readFileSync('LE.txt', 'utf-8')
var items = file.split("\n")
var data = []
for(var i = 0; i < items.length; i = i + 1){
    var item = items[i].split("\t")
    for(var i2 = 0; i2 < item.length; i2 = i2 + 1){
        item[i2] = item[i2].replaceAll("\"", "")
    }
    data.push({
        "id": item[0],
        "nimi": item[1],
        "ladu1": parseInt(item[2]),
        "ladu2": parseInt(item[3]),
        "ladu3": parseInt(item[4]),
        "ladu4": parseInt(item[5]),
        "ladu5": parseInt(item[6]),
        "firma": item[9],
        "hind": parseFloat(item[10].replace(",", "."))
    })
}

app.get('/parts', (req, res) => {
    var result = [...data]

    var params = req.query
    var page = 0
    var filterBy = "name"
    var sortBy = "name"
    var filter = ""
    var sortOrder = "asc"

    if(Object.keys(params).length > 0){
        if(params.sortBy){
            sortBy = params.sortBy
            if(params.sortOrder){
                sortOrder = params.sortOrder
            }
            result.sort((a, b) => {
                if(sortOrder == "asc" || sortOrder == "undefined"){
                    if(a[sortBy] > b[sortBy]){
                        return 1;
                    }
                    if(a[sortBy] < b[sortBy]){
                        return -1;
                    }
                } else if(sortOrder == "desc") {
                    if(a[sortBy] < b[sortBy]){
                        return 1;
                    }
                    if(a[sortBy] > b[sortBy]){
                        return -1;
                    }
                }
                return 0;
            }) 
        }

        if(params.filterBy){
            filterBy = params.filterBy
            if(params.filter){
                filter = params.filter
                result = result.filter(item => item[filterBy].toLowerCase().includes(filter.toLowerCase()))
            }
        }

        if(params.page){
            page = parseInt(params.page)
            result = result.slice(page * 10, page * 10 + 10)
        } else {
            result = result.slice(0, 10)
        }
    }

    res.json(result)
});

app.listen("3000", () => {
    console.log(`Example app listening on port 3000!`)
})