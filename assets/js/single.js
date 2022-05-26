var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");



var getRepoName = function(){
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if(repoName){
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    }else{
        document.location.replace("./index.html");
    }
};


var getRepoIssues = function(repo){
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
// creating the fetch from the API
fetch(apiUrl).then(function(response){
    // request successful
    if(response.ok) {
        response.json().then(function(data){
            // pass data to DOM funtction
            displayIssues(data);

            // check to see is api has paginated issues
            if(response.headers.get("Link")){
                displayWarning(repo);
            }
        });
    } else{
        document.location.replace("./index.html");
    }
});
};

var displayIssues = function(issues){
    for(i=0; i<issues.length; i++){
        // create a link element to take users to the issues on Github
        var issuesEl = document.createElement("a");
        issuesEl.classList = "list-item flex-row justify-space-between align-center";
        issuesEl.setAttribute("href", issues[i].html_url);
        issuesEl.setAttribute("target","_blank");

        // create span to hold the issues title
        var titelEl = document.createElement("span");
        titelEl.textContent = issues[i].title;

        // append yo container
        issuesEl.appendChild(titelEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check to see if it is an issue or pull request
        if(issues[i].pull_request){
            typeEl.textContent = "(Pull Request)";
        } else{
            typeEl.textContent = "(Issue)";
        }

        issuesEl.appendChild(typeEl);

        issueContainerEl.appendChild(issuesEl);

        if(issues.length === 0){
            issueContainerEl.textContent = "This repo has no open issues!";
            return;
        }
    }

};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
  
    // create link element
    var linkEl = document.createElement("a");
    linkEl.textContent = "GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);
  };

getRepoName();