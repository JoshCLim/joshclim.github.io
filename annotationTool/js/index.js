var yellow = '#f6f6eb';
var blue = '#d5d6ea';
var green = '#d7ecd9';
var orange = '#f5d5cb';
var pink = '#f6ecf5';
var purple = '#f3ddf2';

// alert upon selection code
    // https://stackoverflow.com/questions/5517260/how-to-have-a-popup-after-selecting-text
    // http://jsfiddle.net/PQbb7/7/
function getSelected() {
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.getSelection) {
        return document.getSelection();
    }
    else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
            return selection.text;
        }
        return false;
    }
    return false;
}

// on highlight, return selection and show toolbar
$('.text-div').mouseup(function(event) {
    var selection = getSelected();



    if (selection && selection != '') {
        //show toolbar where mouse is
        var x = event.clientX;
        var y = event.clientY;

        $(".tools-bar").css('left', x + 'px');
        $(".tools-bar").css('top', y + 'px');
        $(".tools-bar").css('filter', 'opacity(0)');
        $(".tools-bar").css('display', 'flex');
        $(".tools-bar").css('filter', 'opacity(80%)');

        // when toolbar is clicked, highlight stuff
        $(".tools-bar > div").on('click', function(){
            var highlight_colour = window[$(this).attr('class')]
            //console.log($(this).attr('class'))
            //console.log(highlight_colour)

            // change bg colour of highlighted selection
                // https://stackoverflow.com/questions/56623727/how-to-change-font-style-of-window-getselection
            var span = document.createElement("span");
            span.style.backgroundColor = highlight_colour;
            //console.log(span);

            if (selection.rangeCount) {
                var range = selection.getRangeAt(0).cloneRange();
                //console.log(range);
                range.surroundContents(span);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        

    } else {
        $(".tools-bar").css('display', 'none');
    }
});

// add line numbers
for (i=614; i<=952; i++) {
    $(".line-numbers-div").append("<div>" + i + "</div>")
}

$(".colour-bar > .up-arrow").on('click', function() {
    if ($(".colour-bar > .up-arrow > div").hasClass('upside-down')) {
        $(".colour-bar > .up-arrow > div").removeClass('upside-down');
        $("body").css('padding-top', '0');
        $(".selection-bar").slideUp(200);
        $(".colour-bar > div").css('height', '30px');
    } else {
        $(".colour-bar > .up-arrow > div").addClass('upside-down');
        $("body").css('padding-top', 'calc(50vh - 30px)');
        $(".selection-bar").slideDown(200).css('display', 'flex');
        $(".colour-bar > div").css('height', '0');
    }
});