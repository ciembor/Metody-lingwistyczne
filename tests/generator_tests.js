test("Odwrotna notacja polska", function() {
    deepEqual(infixToRPN("3+2x5").join(""), "325x+", "3+2x5"); 
    deepEqual(infixToRPN("2x(5+2)").join(""), "252+x", "2x(5+2)"); 
    deepEqual(infixToRPN("5+((1+2)x4)-3").join(""), "512+4x3-+", "5+((1+2)x4)-3"); 
    deepEqual(infixToRPN("4x(3-1)+(2x3)").join(""), "431-23x+x", "4x(3-1)+(2x3)"); 
    deepEqual(infixToRPN("(7+3)x(5-2)x2").join(""), "73+52-2xx", "(7+3)x(5-2)x2"); 
 /*   deepEqual(infixToRPN("b+(~a)").join(""), "", "b+(~a)"); 
    deepEqual(infixToRPN("(~a)+b").join(""), "", "(~a)+b"); */
    // deepEqual(infixToRPN("a-(a+b)").join(""), "", "a-(a+b)"); 
    // deepEqual(infixToRPN("((a+a)+b)-(a)").join(""), "", "((a+a)+b)-(a)"); 
});

function tailTest(x, y, symbol) {
	var p = new Primitive(new Point(x, y), symbol);
    return [p.getTail().x, p.getTail().y];
}

function headTest(x, y, symbol) {
    var p = new Primitive(new Point(x, y), symbol);
    if (p.getHead().x === x + symbol.x && p.getHead().y === y + symbol.y) {
        return true;
    } else {
        return false;
    } 
}

function invertTest(x, y, symbol) {
    var p = new Primitive(new Point(x, y), symbol);
    p.invert();
	if (p.getHead().x === x && p.getHead().y === y) {
		if (p.getTail().x === x + symbol.x && p.getTail().y === y + symbol.y) {
            return true;
		}
    } else {
        return false;
    } 
}

function moveHeadTest(x, y, symbol, move_x, move_y) {
    var p = new Primitive(new Point(x, y), symbol);
    p.moveHead(new Point(move_x, move_y));
    
    var head = p.getHead();
    var tail = p.getTail();
    
    return [[tail.x, tail.y], [head.x, head.y]];
}


test("Prymityw", function() {
	deepEqual(tailTest(20, 40, symbols.b), [20, 40], "Ustawienie ogona prymitywu w konstruktorze, getter ogona."); 
	ok(headTest(40, 59, symbols.c), "Konstrukcja prymitywu i getter glowy.");
	ok(invertTest(100, 231, symbols.a), "Test odwracania glowy z ogonem (~).");
	deepEqual(moveHeadTest(100, 231, symbols.a, 1000, 1231), [[1000, 1331], [1000, 1231]], "Przemieszczanie prymitywu \"za glowe\".");
});

function createGroup(x, y) {
    var s1 = new Primitive(new Point(x, y), symbols.a);
    var s2 = new Primitive(s1.getHead(), symbols.b);
    var s3 = new Primitive(s2.getHead(), symbols.c);
    
    return new Group(s1, s2, s3);
}

function groupHeadTest(x, y) {
    var group = createGroup(x, y);
    var head = group.getHead();
    
    return [head.x, head.y];
}

function groupTailTest(x, y) {
    var group = createGroup(x, y);
    var tail = group.getTail();
    
    return [tail.x, tail.y];
}

function groupMoveTailTest(x, y, x1, y1) {
    var group = createGroup(x, y);
    group.moveTail(new Point(x1, y1));
    var tail = group.getTail();
    var head = group.getHead();
    
    // group.alertEdges();
    
    return [[tail.x, tail.y], [head.x, head.y]];
}

function groupMoveHeadTest(x, y, x1, y1) {
    var group = createGroup(x, y);
    // group.alertEdges();
    group.moveHead(new Point(x1, y1));
    var tail = group.getTail();
    var head = group.getHead();
    
    // group.alertEdges();
    
    return [[tail.x, tail.y], [head.x, head.y]];
}

function groupInvertTest(x, y) {
    var group = createGroup(x, y);
    group.invert();
    var tail = group.getTail();
    var head = group.getHead();
 
    return [[tail.x, tail.y], [head.x, head.y]];
}

test("Grupa", function() {
    deepEqual(groupHeadTest(300, 150), [500, 150], "Konstrukcja grupy i getter glowy grupy");
    deepEqual(groupTailTest(300, 150), [300, 150], "Konstrukcja grupy i getter ogona grupy");
    deepEqual(groupMoveTailTest(300, 150, 30, 50), [[30, 50], [230, 50]], "Przemieszczanie grupy \"za ogon\".");
    deepEqual(groupMoveHeadTest(300, 150, 230, 50), [[30, 50], [230, 50]], "Przemieszczanie grupy \"za głowę\".");
    deepEqual(groupInvertTest(300, 150), [[500, 150], [300, 150]], "Konstrukcja grupy i getter ogona grupy");
});

function operatorTypeTest() {
    var p1 = new Primitive(new Point(200, 300), symbols.a);
    var p2 = new Primitive(new Point(20, 30), symbols.b);
    var result = operators["+"](p1, p2);

    return typeof result;
}

function groupEdgesTest(operator, x0, y0, difforder) {
    var p1 = new Primitive(new Point(x0, y0), symbols.a);
    var p2 = new Primitive(new Point(1000, 1000), symbols.b);
    var p3 = new Primitive(new Point(2000, 2000), symbols.c);
    var group;
    
    if (!difforder) {
        group = operators[operator](p1, p2);
        group = operators[operator](group, p3);
    } else {
        group = operators[operator](p2, p3);
        group = operators[operator](p1, group);
    }
    
    return [[group.getTail().x, group.getTail().y], [group.getHead().x, group.getHead().y]];
}

test("Operatory", function() {
    deepEqual(operatorTypeTest(), "object", "Test operatora + (typu zwracanej wartości).");
    deepEqual(groupEdgesTest('+', 0, 0, false), [[0, 0], [200, 0]], "Test końców grupy dla operatora + (głowa [0, 0]).");
    deepEqual(groupEdgesTest('-', 0, 0, false), [[0, 0], [0, -100]], "Test końców grupy dla operatora - (głowa [0, 0]).");
    deepEqual(groupEdgesTest('x', 0, 0, false), [[0, 0], [100, 100]], "Test końców grupy dla operatora x (głowa [0, 0]).");
    deepEqual(groupEdgesTest('+', 300, 600, false), [[300, 600], [500, 600]], "Test końców grupy dla operatora + (głowa [300, 300]).");
    deepEqual(groupEdgesTest('-', 300, 600, false), [[300, 600], [300, 500]], "Test końców grupy dla operatora - (głowa [300, 300]).");
    deepEqual(groupEdgesTest('x', 300, 600, false), [[300, 600], [400, 700]], "Test końców grupy dla operatora x (głowa [300, 300]).");
    deepEqual(groupEdgesTest('+', 300, 600, true), [[300, 600], [500, 600]], "Test końców grupy dla operatora + (głowa [300, 300], odwrócona kolejność działań).");
    deepEqual(groupEdgesTest('-', 300, 600, true), [[300, 600], [300, 500]], "Test końców grupy dla operatora - (głowa [300, 300], odwrócona kolejność działań).");
    deepEqual(groupEdgesTest('x', 300, 600, true), [[300, 600], [400, 700]], "Test końców grupy dla operatora x (głowa [300, 300], odwrócona kolejność działań).");
});
