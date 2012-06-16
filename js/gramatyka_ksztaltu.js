var COLORS = {
  
  FIRST: "rgb(40,40,40)",
  HOVER: "#049cdb",
  INACTIVE: "rgb(80,80,80)",
  BEAVER: "#AA0000"
  
};

function Point(x, y) {
    
  if (x === undefined || x === null || y === undefined || y === null) {
    this.x = 10;
    this.y = 260;
  } else {
    this.x = x;
    this.y = y; 
  }
    
}

var IdGenerator = {
  
  counter: 0,
  getId: function() {
    this.counter += 1;
    console.log("id: " + this.counter);
    return this.counter;
  }
  
};

// equilateral triangle
function newA(point, side_length) {
  
  var points = [],
      id = IdGenerator.getId()
      that = this;
  
  points.push(new Point(point.x, point.y));
  points.push(new Point(point.x + side_length, point.y));
  points.push(new Point(point.x + (side_length / 2), point.y + ((side_length * Math.sqrt(3)) / 2)));
  
  var triangle = new Kinetic.Polygon({
    points: points,
    fill: COLORS.FIRST,
  });
  
  function draw(figuresLayer, figures) {
    
    triangle.on("mouseover", function() {
      this.setFill(COLORS.HOVER);
      figuresLayer.draw();
      document.body.style.cursor='pointer';
      console.log(id);
    });
    
    triangle.on("mouseout", function() {
      this.setFill(COLORS.FIRST);
      figuresLayer.draw();
      document.body.style.cursor='auto';
    });
    
    triangle.on("click", function() {
      
      console.log("pop id: " + id);
      $("#productions").dataset("id", id);
      $("#productions").show();
      triangle.off("click");
      triangle.off("mouseover");
      triangle.off("mouseout");
      document.body.style.cursor='auto';
    });
    
    figuresLayer.add(triangle);
    
  }
  
  return {
    
    "id": id,
    "shape": "A",
    "points": points,
    "side_length": side_length,
    "draw": draw
    
  };
  
}

// three equilateral triangles in one
function newB(a) {
  
  var points = [],
      triangles = [],
      id = IdGenerator.getId();
      
  points.push(new Point(a.points[0].x, 
                        a.points[0].y));
  points.push(new Point(a.points[0].x + (a.side_length / 2), 
                        a.points[0].y));
  points.push(new Point(a.points[0].x + (a.side_length / 4), 
                        a.points[0].y + ((a.side_length * Math.sqrt(3)) / 4)));

  triangles.push(newA(points[0], a.side_length / 2));
  triangles.push(newA(points[1], a.side_length / 2));
  triangles.push(newA(points[2], a.side_length / 2));
  
  function draw(figuresLayer, figures) {
    console.log(triangles.length);
    for (var i = 0; i < triangles.length; ++i) {
      triangles[i].draw(figuresLayer, figures);
      console.log(draw);
    }
    
  }
  
  return {
    
    "id": id,
    "shape": "B",
    "triangles": triangles,
    "draw": draw
    
  };
  
}

function newC(a) {
  
  var points = [],
      id = IdGenerator.getId()
  
  points.push(new Point(a.points[0].x, a.points[0].y));
  points.push(new Point(a.points[1].x, a.points[1].y));
  points.push(new Point(a.points[2].x, a.points[2].y));
  
  var triangle = new Kinetic.Polygon({
    points: points,
    fill: COLORS.INACTIVE,
  });
  
  function draw(figuresLayer, figures) {
    figuresLayer.add(triangle);
  }
  
  return {
    
    "id": id,
    "shape": "C",
    "points": points,
    "draw": draw
    
  };
  
}

var newFigures = function(s) {

  var figures = [];
  figures.push(s);
  
  function push(figure) {
    var decomposition = [];
    
    switch (figure.shape) {
      case "B":
        decomposition = figure.triangles;
        break;
      default: 
        decomposition.push(figure);
    }
    figures = figures.concat(decomposition);
  }
  
  function pop(id) {
    for (var i = 0; i < figures.length; ++i) {
      
      if (id === figures[i].id) {
        
        return figures.splice(i, 1)[0];
      }
    }
  }
  
  function draw(figuresLayer, self) {
    figuresLayer.removeChildren();
    figuresLayer.clear();
    for (var i = 0; i < figures.length; ++i) {
      figures[i].draw(figuresLayer, self);
      console.log(figures);
    }
  }
  
  return {
    "push": push,
    "pop": pop,
    "draw": draw
  };
  
};

window.onload = function() {
    
  var S = newA(new Point(0, 0), 570);
  var figures = newFigures(S);
  
  var stage = new Kinetic.Stage({
    container: "output-container",
    width: 570,
    height: 500
  });
  var figuresLayer = new Kinetic.Layer();

  figuresLayer.setScale(1, -1);
  figuresLayer.move(0, 500);

  figures.draw(figuresLayer, figures);
  stage.add(figuresLayer);

  $(".production").live("click", function() {
    figures.draw(figuresLayer, figures);
    figuresLayer.draw();
    var id = parseInt($("#productions").dataset("id"));
    if ("AtoB" === $(this).attr("id")) {
      figures.push(newB(figures.pop(id)));
    }
    else if ("AtoC" === $(this).attr("id")) {
      figures.push(newC(figures.pop(id)));
    }
    $("#productions").hide();
      figures.draw(figuresLayer, figures);
    figuresLayer.draw();
  })

};