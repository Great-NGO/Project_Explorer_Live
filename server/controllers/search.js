require("dotenv").config();
const express = require("express");
const { checkUser } = require("../middleware/auth");
const { getAllProjects } = require("../services/project");
const { searchProject, getSearchResult } = require("../services/search");
const router = express.Router();


router.get("/search", checkUser, async (req, res) => {
    const user = req.user;
    console.log("The user ", user);
    let searchedItem = req.query.search;
    let criteria = req.query.searchBy || "name";
    // criteria&&criteria.length<1 ? criteria = undefined : criteria; //If criteria length is less than 1 then make it undefined
    let page = req.query.page || 1;
    page == 0 ? page=1 : page;  //If page number is 0 from req params make it 1


    console.log("The searched item ", searchedItem);
    console.log("The criteria ", criteria);
  
    if(page >= 1 && (searchedItem === undefined || searchedItem.length < 1)){
      console.log("No searched item, Get all projects");
      const projects = await getAllProjects({page})
      return res.json({allProjects: projects[2], numOfPage: projects[3], currentPage:page, message:`${projects[2]} results found for All Projects'.`, data:projects[1] })
    }
    else {
    let result = await getSearchResult({search:searchedItem, searchBy:criteria, page })
    console.log("Result ", result)

      if(result[0] !== false) {
        return res.json({message:`${result[2]} results found for '${searchedItem}' by '${result[5]}'.`, numOfPages:result[3], currentPage:result[4], note:"Get Project(s) by Search", data:result[1], })

      } else {
        return res.status(404).json({message: `0 results found for '${searchedItem}' by '${criteria}'.`, data:[], error: "Invalid search criteria (Valid search types include search by name, abstract, authors and tags.)", })
      }
  }
  });

module.exports = router;
