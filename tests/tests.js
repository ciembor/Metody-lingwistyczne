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
    var group = createGroup();
    group.moveTail(new Point(x1, y1));
    var tail = group.getTail();
    var head = group.getHead();
    
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
    deepEqual(groupInvertTest(300, 150), [[500, 150], [300, 150]], "Konstrukcja grupy i getter ogona grupy");
});
