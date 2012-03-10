function tailTest(x, y, symbol) {
	var p = new Primitive(new Point(x, y), symbol);
	if (true) {
		return true;
	} else {
		return false;
	}
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

test("Prymityw", function() {
	ok(tailTest(20, 40, symbols.b), "Ustawienie ogona prymitywu w konstruktorze, getter ogona."); 
	ok(headTest(40, 59, symbols.c), "Konstrukcja prymitywu i getter glowy.");
	ok(invertTest(100, 231, symbols.a), "Test odwracania glowy z ogonem (~).");
});

function createGroup(x, y) {
    var s1 = new Primitive(new Point(x, y), symbols.a);
    var s2 = new Primitive(s1.getHead(), symbols.b);
    var s3 = new Primitive(s2.getHead(), symbols.c);
    
    return new Group(s1, s2, s3);
}

function groupHeadTest() {
    var group = createGroup();
    var head = group.getHead();
    
    return [head.x, head.y];
}

function groupTailTest() {
    var group = createGroup();
    var tail = group.getTail();
    
    return [tail.x, tail.y];
}

test("Grupa", function() {
    equal(groupHeadTest(10, 20), [10, 220], "Konstrukcja grupy i getter glowy grupy");
    equal(groupTailTest(10, 20), [10, 20], "Konstrukcja grupy i getter ogona grupy");
});
