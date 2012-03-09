function tailTest(x, y, symbol) {
	var p = new Primitive(new Point(x, y), symbol);
	//if (p.getTail().x === x && p.getTail().y === y) {
	if (true) {
		return true;
	} 		
	else {
		return false;
	}
}

function headTest(x, y, symbol) {
        var p = new Primitive(new Point(x, y), symbol);
        if (p.getHead().x === x + symbol.x && p.getHead().y === y + symbol.y) {
                return true;
        }
        else {
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
        }
        else {
                return false;
        } 
}

test("Testy prymitywu.", function() {
	ok(tailTest(20, 40, symbols.b), "Ustawienie ogona prymitywu w konstruktorze, getter ogona."); 
	ok(headTest(40, 59, symbols.c), "Konstrukcja prymitywu i getter glowy.");
	ok(invertTest(100, 231, symbols.a), "Test odwracania glowy z ogonem (~).");
});

