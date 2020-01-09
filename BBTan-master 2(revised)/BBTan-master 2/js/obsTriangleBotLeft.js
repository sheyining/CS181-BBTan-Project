class ObsTriangleBotLeft {
  constructor(ctx,row,column) {
    this.x = (TILE_WIDTH * column) + TILE_PADDING;
    this.y = (TILE_HEIGHT * row) + TILE_PADDING;
    this.ctx = ctx;
    this.level;
    this.vertices1 = [this.x , this.y];
    this.vertices2 = [this.x,this.y + OBSTACLE_HEIGHT];
    this.vertices3 = [this.x + OBSTACLE_WIDTH, this.y + OBSTACLE_HEIGHT];
    this.textX = 4;//aligning font at center
    this.textY = 36;//aligning font at center
    this.ctx.strokeStyle = 'yellow';
    this.ctx.fillStyle = 'yellow';
    this.ctx.lineWidth = LINE_WIDTH;
  }

  drawTriangleBotLeft(level) {
    this.level = level;
    this.ctx.beginPath();
    this.ctx.moveTo(this.vertices1[0],this.vertices1[1]);
    this.ctx.lineTo(this.vertices2[0],this.vertices2[1]);
    this.ctx.lineTo(this.vertices3[0],this.vertices3[1]);
    this.ctx.fillText(this.level,this.textX+this.x,this.textY+this.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  // checkCollision(ball) {
  //
  //     final float[] vertices = poly.getTransformedVertices(); // get all points for this polygon (x and y)
  //     final int numFloats = vertices.length; // get the amount of points(x and y)
  //     // loop through each  point's x and y values
  //     for (int i = 0; i < numFloats; i += 2) {
  //       // get the first and second point(x and y of first vertice)
  //       Vector2 start = new Vector2(vertices[i],vertices[i + 1]);
  //       // get 3rd and 4th point (x and y of second vertice) (uses modulo so last point can use first point as end)
  //       Vector2 end = new Vector2(vertices[(i + 2) % numFloats], vertices[(i + 3) % numFloats]);
  //       // get the center of the circle
  //       Vector2 center = new Vector2(circ.x, circ.y);
  //       // get the square radius
  //       float squareRadius = circ.radius * circ.radius;
  //       // use square radius to check if the given line segment intersects the given circle.
  //       return Intersector.intersectSegmentCircle (start, end, center, squareRadius);
  //     }
  //   }
}