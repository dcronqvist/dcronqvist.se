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
        ["#proj-view-danpass", "#A269EE"],
        ["#proj-view-aboutme", "#F5EBCF"],
        ["#proj-view-evolvi", "#5CB4EE"],
        ["#proj-view-restberry", "#EE7D7D"],
        ["#proj-view-upcoming", "#EEC042"],
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
});
