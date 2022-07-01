const Project = require("../models/project");
const { translateError } = require("./mongo_helper");

/* Search project */
const searchProject = async({search, searchBy, page=1}) => {

    console.log("search", search)
    console.log("search by", searchBy)

    // let offSet = 4 //8;
    const pageLimit = 4;

    const fResult = await Project.find({"clown" : {$regex: `${search}`, $options: "i"}})
    console.log("Search Fresult ", fResult);
    const result = await Project.find({searchBy : {$regex: `${search}`, $options: "i"}})
    console.log("Search result length ", result.length)

    let searchCount = await Project.find({searchBy: {$regex: `${search}`, $options: "i"}}).countDocuments();
    console.log("Search result length ", searchCount)
    

    let searchResults = result;

    const resultPages = Math.ceil(searchCount/pageLimit);
    console.log("Number of pages for resilt ", resultPages)
    searchResults = await Project.find({searchBy: {$regex: `${search}`, $options: "i"}}).skip((page -1) * pageLimit).limit(pageLimit)
    if(searchResults) {
        return [ true, searchResults]
    } else {
        return [false, "No result"]
    }
}

/* Get Search results including pagination */
const getSearchResult = async ({search, searchBy="name", page=1}) => {

    let results = [];
    let searchCount = null;
    const pageLimit = 4;    //Hpw many results should be returned per page

    console.log("results from search ", results);

    console.log("searchby ", searchBy);
    console.log("searchby ", page);

    if(searchBy === "name") {
        results = await Project.find({name: {$regex: `${search}`, $options:"i" }}).skip((page-1) * pageLimit).limit(pageLimit)
        searchCount = await Project.find({name: {$regex: `${search}`, $options:"i" }}).countDocuments()

    } else if(searchBy === "abstract") {
        results = await Project.find({abstract: {$regex: `${search}`, $options:"i" }}).skip((page-1) * pageLimit).limit(pageLimit)
        searchCount = await Project.find({abstract: {$regex: `${search}`, $options:"i" }}).countDocuments()

    } else if (searchBy === "authors") {
        results = await Project.find({authors: {$regex: `${search}`, $options:"i" }}).skip((page-1) * pageLimit).limit(pageLimit)
        searchCount = await Project.find({authors: {$regex: `${search}`, $options:"i" }}).countDocuments()

    } else if( searchBy === "tags") {
        results = await Project.find({tags: {$regex: `${search}`, $options:"i" }}).skip((page-1) * pageLimit).limit(pageLimit)
        searchCount = await Project.find({tags: {$regex: `${search}`, $options:"i" }}).countDocuments()

    } 
    else {
        return [false, "Invalid search type. Valid Search type includes - name, abstract, authors and tags"]
        // results = await Project.find({}).sort({_id:-1}).skip( (page-1)*pageLimit).limit(pageLimit);
        // searchCount = await Project.find({}).countDocuments()
    }

    // To calculate the total number of pages a search has results for
    const resultPages = Math.ceil(searchCount/pageLimit);
    resultPages == 0? page=0 :page
    return [ true, results, searchCount, resultPages, page, searchBy]
}

module.exports = {
    searchProject,
    getSearchResult,
};
