require("dotenv").config();
const express = require("express");
const { checkUser } = require("../middleware/auth");
const { searchProject, getSearchResult } = require("../services/search");
const router = express.Router();


router.get("/search", checkUser, async (req, res) => {
    const user = req.user;
    console.log("The user ", user);
    let searchedItem = req.query.search;
    let criteria = req.query.searchBy;
    let page = req.query.page || 1;


    console.log("The searched item ", searchedItem);
    console.log("The criteria ", criteria);
  
    let result = await getSearchResult({search:searchedItem, searchBy:criteria, page })

    console.log("Result ", result)

    // if(page && (searchedItem == undefined)){
    //   res.json({ data:result[1], resultsFound: result[2], numOfPages:result[3], currentPage:result[4], searchBy:result[5]})
    // }
    // else
     if(result[0] !== false) {
      return res.json({searchedItem:req.query, data:result[1], resultsFound: result[2], numOfPages:result[3], currentPage:result[4], searchBy:result[5], note:"Search"})

    } else {
      return res.status(404).json({error: "Invalid search criteria (Valid search types include search by name, abstract, authors and tags.)", message: `0 results found for ${criteria}.`})
    }

  });

module.exports = router;
