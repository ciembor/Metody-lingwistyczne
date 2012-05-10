$(document).ready(function() {
    
    if ($("#output").length) { 

        // set up canvas context //////////////////////////////////////////////////////////////////
        var canvas = $("#output")[0];
        var ctx = canvas.getContext('2d');
        
        function init() {
            // clear canvas
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        init();

    } else { 
        console.log("Canvas element not found.");
    } 

});