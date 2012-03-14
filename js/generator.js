
// convert infix notation to reverse polish notation /////////////////////////////////////////////
function infixToRPN(string) {
    
    var infix = string;
    var token;
    var postfix = [];
    var stack = [];
    var operators = ["x", "+", "-", "~", "(", ")"];

    while (infix.length > 0) {
        
        // like array.shift, but with string...
        token = infix[0];
        infix = infix.substr(1);

        if ($.inArray(token, operators) !== -1) {
            
            if (")" === token) {
                while ("(" !== stack[stack.length - 1]) {
                    postfix.push(stack.pop());
                }
                // pop "("
                stack.pop();
                
            } else {
                stack.push(token);
            }
            
        } else {
            postfix.push(token);
        }
        
    }
    
    while (stack.length > 0) {
        postfix.push(stack.pop());
    }
    
    return postfix;
    
}

// point (tail and head) /////////////////////////////////////////////////////////////////////////
function Point(x, y) {
    
    if (x === undefined || x === null || y === undefined || y === null) {
        this.x = 50;
        this.y = 250;
    } else {
        this.x = x;
        this.y = y; 
    }
    
}

// group of primitives, node in the tree /////////////////////////////////////////////////////////
function Group() {
        
    var childs = Array.prototype.slice.call(arguments);
    var inverted = false;
    
    function draw(ctx) {
        for(var i = 0, len = childs.length; i < len ; i++) {
            console.log("drawing group...  [("+getTail().x+","+getTail().y+"), ("+getHead().x+","+getHead().y+")]");
            childs[i].draw(ctx);
        }
    }
    
    function getTail() { 
        return inverted ? childs[childs.length-1].getHead() : childs[0].getTail();
    }
    
    function getHead() { 
        return inverted ? childs[0].getTail() : childs[childs.length-1].getHead();
    }

    function moveTail(point) {
        var old = new Point(getTail().x, getTail().y);  // deep copy, not reference!
        for(var i = 0, len = childs.length; i < len ; i++) {
            var tail = new Point(childs[i].getTail().x + point.x - old.x,
                                 childs[i].getTail().y + point.y - old.y);
            
            childs[i].moveTail(tail);
        }
    }

    function moveHead(point) {
        var old = new Point(getHead().x, getHead().y);  // deep copy, not reference!
        for(var i = 0, len = childs.length; i < len ; i++) {
            var head = new Point(childs[i].getHead().x + point.x - old.x,
                                 childs[i].getHead().y + point.y - old.y);
            childs[i].moveHead(head);
        }
    }

    function alertEdges() {
        for(var i = 0, len = childs.length; i < len ; i++) {
            alert(i + ' tail: ' + childs[i].getTail().x + '/' + childs[i].getTail().y + " | head: " + childs[i].getHead().x + '/' + childs[i].getHead().y)
        }    
    }

    function invert() { 
        inverted = inverted ? false : true; 
    }
    
    return {
        draw: draw,
        getTail: getTail,
        getHead: getHead,
        alertEdges: alertEdges,
        moveTail: moveTail,
        moveHead: moveHead,
        invert: invert
    };

}

// primitive, leaf node //////////////////////////////////////////////////////////////////////////
function Primitive(tail_point, symbol) {
    
    var tail = new Point(tail_point.x, tail_point.y);
    var head = new Point(tail.x + symbol.x, tail.y + symbol.y);

    var drawable = symbol.drawable;
    
    function draw(ctx) {
        if (drawable) {
            
            console.log("drawing primitive... [("+tail.x+","+tail.y+"), ("+head.x+","+head.y+")]");
            
            var diff = {
                x: (head.x - tail.x) / 8,
                y: (head.y - tail.y) / 8
            };
            
            ctx.beginPath();  
            ctx.moveTo(tail.x + diff.x, tail.y + diff.y);  
            ctx.lineTo(head.x - diff.x , head.y - diff.y);  
            ctx.stroke();
            
        }
    }

    function getTail() { 
        return tail; 
    }
    
    function getHead() { 
        return head; 
    }

    function moveTail(point) {
        head.x += point.x - tail.x;
        head.y += point.y - tail.y;
        // deep copy, not just reference
        tail.x = point.x;
        tail.y = point.y;
    }

    function moveHead(point) {
        tail.x += point.x - head.x;
        tail.y += point.y - head.y;
        // deep copy, not just reference
        head.x = point.x;
        head.y = point.y;
    }

    function invert() { 
        var tmp = tail; 
        tail = head; 
        head = tmp; 
    }

    return {
        draw: draw,
        getTail: getTail,
        getHead: getHead,
        moveTail: moveTail,
        moveHead: moveHead,
        invert: invert
    };
    
}

// terminal symbols //////////////////////////////////////////////////////////////////////////////
var symbols = {
    
    // vertical line (|)
    a: {
        x: 0,
        y: -100,
        drawable: true
    },
    
    // horizontal line (-)
    b: {
        x: 100,
        y: 0,
        drawable: true
    },
    
    // diagonal line (\)
    c: {
        x: 100,
        y: 100,
        drawable: true
    },
    
    // space
    s: {
        x: 0,
        y: -100,
        drawable: false
    }
    
};

var operators = {
    
    "~": function(arg) {
        arg.invert();
        return arg;
    },
    
    "x": function(arg1, arg2) {
        arg2.moveTail(arg1.getTail());
        return new Group(arg1, arg2);
    },
    
    "+": function(arg1, arg2) {
        arg2.moveTail(arg1.getHead());
        return new Group(arg1, arg2);
    },
    
    "-": function(arg1, arg2) {
        arg2.moveHead(arg1.getHead());
        return new Group(arg1, arg2);
    }
        
};

// generated formula /////////////////////////////////////////////////////////////////////////////
var Formula = function(string) {
    
   // var operators = ops;
    var infix = string;
    var result = null;
    
    function draw(ctx) {
        
        var postfix = infixToRPN(infix);    // it's an array, not string
       // var operators = ["x", "+", "-", "~"];
        var stack = [];
        var operator; 
        var primitive;
        
        // replace symbols with objects
        for(var i = 0, len = postfix.length; i < len; i++) {
            if(symbols.hasOwnProperty(postfix[i])) {
                postfix[i] = new Primitive(new Point(), symbols[postfix[i]]);
            }
        }
        
        // calculate formula (from postfix into tree of primitives and their groups)
        while (postfix.length > 1 || (postfix.length && stack.length)) {
                        
            console.log(postfix);
            console.log(stack);
            // push primitives into stack
            while ($.inArray(postfix[0], Object.keys(operators)) === -1) {
                stack.push(postfix.shift());
            }
            
            // get the operator
            operator = postfix.shift();
            console.log("operator: " + operator);
            // use operator on argument / arguments
            if ("~" === operator) {
                
                try {
                    // put result into begin of postfix
                    console.log("(~) postfix: " + postfix);
                    console.log("(~) stack: " + stack);
                    postfix.unshift(operators["~"](stack.pop()));

                } catch(e) {
                    console.log(e);
                    return -1;
                }
                
            } else if ($.inArray(operator, Object.keys(operators)) !== -1) {
                console.log("dwuargumentowy operator");
                try {
                    // put result into begin of postfix
                    console.log("("+operator+") postfix: " + postfix);
                    console.log("("+operator+") stack: " + stack);
                    var arg2 = stack.pop();
                    var arg1 = stack.pop();
                    
                    postfix.unshift(operators[operator](arg1, arg2));
                    console.log("po ("+operator+") postfix: " + postfix);
                    console.log("po ("+operator+") stack: " + stack);
                } catch(e) {
                    console.log(e);
                    return -1;
                }
               
            }
        }
        
       // console.log(postfix[0]);
        postfix[0].draw(ctx);
        
    }
    
    return {
        draw: draw,
        set: function set(string, operators) { infix = string; },
        get: function get() { return infix; }
    };
    
};

$(document).ready(function() {
    
    // set up canvas context /////////////////////////////////////////////////////////////////////

    if ($("#output").length) { 

        var ctx = $("#output")[0].getContext('2d');
        ctx.strokeStyle = "#dd1144";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
    
        // var point = new Point(100, 150);
        // var primitive = new Primitive(point, symbols.a);
        // primitive.draw(ctx);
        // primitive = new Primitive(point, symbols.b);
        // primitive.draw(ctx);
        // primitive = new Primitive(point, symbols.c);
        // primitive.draw(ctx);
//         
        // var s1 = new Primitive(new Point(300, 150), symbols.a);
        // var s2 = new Primitive(s1.getHead(), symbols.b);
        // var s3 = new Primitive(s2.getHead(), symbols.c);
//         
        // var group =  new Group(s1, s2, s3);
//         
        // group.draw(ctx);
        
         var formula = new Formula("a+a+b+(~a)+(~b)+c");       // R
         // var formula = new Formula("a+a+b+(~a)+(~b)x(~a)");    // A
        // var formula = new Formula("(b+a+~b)+a+b");                     // S
        formula.draw(ctx);
        
   //     alert(infixToRPN("(((a+a)+b)-(a+(ax(~b))))"));
    } /* else {
        console.log("Canvas element not found.");
    } */

});

