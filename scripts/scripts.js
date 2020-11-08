function fadeOtherThan(proj) {
    var projView = $("#proj-view");
    projView.children().not($(proj)).addClass("faded");
    $(proj).removeClass("faded");
}

function unfadeOtherThan(proj) {
    var projView = $("#proj-view");
    projView.children().not($(proj)).removeClass("faded");
}

function showProj(proj) {
    let projs = [
        ["#proj-view-aboutme", "#e5d3e6"],
        ["#proj-view-danpass", "#D9BFFF"],
        ["#proj-view-evolvi", "#BAE4FF"],
        ["#proj-view-restberry", "#FFC9C9"],
        ["#proj-view-upcoming", "#FFE7AD"],
    ];

    let indexIsMe = -1;

    for (let i = 0; i < projs.length; i++) {
        const element = projs[i];
        
        if(element[0] == proj){
            indexIsMe = i;
        }

        if($(element[0]).hasClass("project-info-view-shown")) {
            $(element[0]).removeClass("project-info-view-shown");
        }     
    } 

    $(proj).addClass("project-info-view-shown");
    $("body").css("background-color", projs[indexIsMe][1]);
}

$(document).ready(function () {
    let projBsAndVs = [
        ["#proj-danpass-button", "#proj-view-danpass"],
        ["#proj-evolvi-button", "#proj-view-evolvi"],
        ["#proj-restberry-button", "#proj-view-restberry"],
        ["#proj-upcoming-button", "#proj-view-upcoming"],
    ];

    for (let i = 0; i < projBsAndVs.length; i++) {
        const proj = projBsAndVs[i];
        
        $(proj[0]).click(function(event) {
            // project danpass is up right now. about me should be shown
            if($(proj[1]).hasClass("project-info-view-shown")) {
                unfadeOtherThan(proj[0]);
                showProj("#proj-view-aboutme");   
            }
            else{ // project danpass should be shown
                fadeOtherThan(proj[0]);
                showProj(proj[1]);
            }  
        });
    }

    $(document).mouseup(function(e) 
    {
        // if the target of the click isn't the container nor a descendant of the container
        if (!$.contains(document.getElementById("main-view"), e.target)) 
        {
            showProj("#proj-view-aboutme");
            unfadeOtherThan($("project-box").not($("faded")));
        }
    });
});
