$(document).ready(function () {
    //Canvas initialisieren
    var canvas = $('#canvas');
    var ctx = $('#canvas')[0].getContext('2d');
    var w = canvas.width();
    var h = canvas.height();
    var x = 340;

    //Graph initialisieren
    var center = new Point(w / 2.0, h / 2.0);
    var circleColor = 'red';
    var figureColor = 'black';
    var graph = new Graph(center, circleColor, figureColor);
    graph.autoComplete = true;
    graph.randomize();

    //Parameter ueberpruefen und anwenden
    var paramGetter = new ParamGetter();
    graph.setMinPointDistance(paramGetter.getMinPointDistance());
    graph.setScale(paramGetter.getScale());
    graph.setAutoComplete(paramGetter.getAutoComplete());
    graph.setVelocity(paramGetter.getVelocity());
    graph.setShowJointPieces(paramGetter.getShowJointPieces());
    graph.setRandomMode(paramGetter.getRandomMode());
    graph.load(paramGetter.getCode());

    //GUI
    var gui = new GUI();
    gui.initialize(graph, ctx);

    //Loop
    function refresh() {
        graph.update();
        ctx.clearRect(0, 0, w, h);
        graph.draw(ctx);
    }

    loop = setInterval(refresh, 20);
})
//Funktionen
function getUriWithoutParams() {
    return window.location.protocol + '//' + window.location.host + window.location.pathname;
}
//Ende Funktionen

//GUI
function GUI() {
}
GUI.prototype.initialize = function (graph, context) {
    //Buttonzustaende setzen
    if (graph.autoComplete)
        $('#autoComplete').button('toggle');

    if (graph.showJointPieces)
        $('#showJointPieces').button('toggle');

    switch (graph.randomMode) {
        case 'symmetrical':
            $('#randomModeSymmetrical').button('toggle');
            break;
        case 'asymmetrical':
            $('#randomModeAsymmetrical').button('toggle');
            break;
        case 'mixed':
            $('#randomModeMixed').button('toggle');
            break;
    }

    var showTimeInMs = 700;
    var hideTimeInMs = 100;

    $('#zoomIn').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#zoomOut').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#showPreviousFigure').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#randomize').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#saveFigure').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#showJointPieces').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#autoComplete').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });
    $('#randomMode').tooltip({
        container: 'body',
        delay: {
            show: showTimeInMs,
            hide: hideTimeInMs
        }
    });

    //EventListener
    $('#zoomIn').click(function () {
        graph.setScale(graph.scale + 2);
        if (graph.autoComplete)
            graph.completeFigure();
        else
            graph.reset();
    });
    $('#zoomOut').click(function () {
        graph.setScale(graph.scale - 2);
        if (graph.autoComplete)
            graph.completeFigure();
        else
            graph.reset();
    });

    $('#showPreviousFigure').click(function () {
        if ($('#showPreviousFigure').hasClass('disabled') == false) {
            graph.loadPreviousFigure();
            if (graph.history.hasPreviousItem() == false)
                $('#showPreviousFigure').addClass('disabled');
        }
        console.log(graph.history);
    });
    $('#randomize').click(function () {
        graph.randomize();
        $('#showPreviousFigure').removeClass('disabled');
        console.log(graph.history);
    });


    $('#autoComplete').click(function () {
        $('#autoComplete').button('toggle');
        if ($('#autoComplete').hasClass('active')) {
            graph.autoComplete = true;
            graph.completeFigure();
        }
        else
            graph.autoComplete = false;
    });
    $('#showJointPieces').click(function () {
        $('#showJointPieces').button('toggle');
        graph.showJointPieces = $('#showJointPieces').hasClass('active');
    });
    $('#saveFigure').click(function () {
        window.open(graph.getPNG(context));
    });

    $('#shareLink').mouseenter(function () {
        $('#shareLink').prop('href', graph.getShareLink());
    });

    $('#velocity').click(function () {
        graph.velocity = $('#velocity').prop('value');
        $('#shareLink').prop('href', graph.getShareLink());
    });
    $('#canvas').click(function (e) {
        graph.selectPiece(e.offsetX, e.offsetY);
    });

    $('#randomModeSymmetrical').click(function () {
        resetRandomModeButtons();
        $('#randomModeSymmetrical').button('toggle');
        graph.randomMode = 'symmetrical';
    });
    $('#randomModeAsymmetrical').click(function () {
        resetRandomModeButtons();
        $('#randomModeAsymmetrical').button('toggle');
        graph.randomMode = 'asymmetrical';
    });
    $('#randomModeMixed').click(function () {
        resetRandomModeButtons();
        $('#randomModeMixed').button('toggle');
        graph.randomMode = 'mixed';
    });
    //Ende EventListener

    var resetRandomModeButtons = function () {
        $('#randomModeSymmetrical').removeClass('active');
        $('#randomModeAsymmetrical').removeClass('active');
        $('#randomModeMixed').removeClass('active');
    };
}
//Ende GUI

//ParamGetter
function ParamGetter() {
}
ParamGetter.prototype.get = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);

    if (results == null)
        return null;
    else
        return results[1];
}
ParamGetter.prototype.getAutoComplete = function () {
    var completeFigure = this.get('autocomplete');
    if (completeFigure == null)
        return null;
    return completeFigure == 'true';
}
ParamGetter.prototype.getMinPointDistance = function () {
    var minPointDistance = parseFloat(this.get('mpd'));
    if (minPointDistance != null && isNaN(minPointDistance) == false && minPointDistance >= 0)
        return minPointDistance;
    return null;
}
ParamGetter.prototype.getScale = function () {
    var scale = parseFloat(this.get('scale'));
    if (scale != null && isNaN(scale) == false)
        return scale;
    return null;
}
ParamGetter.prototype.getCode = function () {
    var code = this.get('code');
    return code;
}
ParamGetter.prototype.getVelocity = function () {
    var velocity = parseInt(this.get('v'));
    if (velocity != null && isNaN(velocity) == false)
        return velocity;
    return null;
}
ParamGetter.prototype.getShowJointPieces = function () {
    var showJointPieces = this.get('showcircle');
    if (showJointPieces == null)
        return null;
    return showJointPieces == 'true';
}
ParamGetter.prototype.getRandomMode = function () {
    var mode = this.get('randommode');
    return mode;
}
//Ende ParamGetter

//Random
function Random() {
}
Random.prototype.getNumberWithNegative = function (min, max) {
    if (this.getBoolean())
        return this.getNumber(min, max) * -1;
    return this.getNumber(min, max);
}
Random.prototype.getBoolean = function () {
    return this.getNumber(0, 1) == 1;
}
Random.prototype.getNumber = function (min, max) {
    if (min > max)
        return -1;
    if (min == max)
        return min;
    return min + parseInt(Math.random() * (max - min + 1));
}
//Ende Random

//Point
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.getDistanceTo = function (x, y) {
    var a = Math.abs(this.x - x);
    var b = Math.abs(this.y - y);
    return Math.sqrt(a * a + b * b);
}
//Ende Point

//JointPiece
function JointPiece(position, radius, angleChangeRateInDegrees, angleInDegrees) {
    this.position = position;
    this.radius = radius;
    this.angleChangeRateInDegrees = angleChangeRateInDegrees;
    this.angleInDegrees = this.getValidAngle(angleInDegrees);
    this.startAngleInDegrees = this.angleInDegrees;
    this.innerSpiraloPiece = false;
}
JointPiece.prototype.isAtStartAngle = function () {
    var angleInDegreesFixed;
    if (360 - this.angleInDegrees < 1.0) //notwendig für Werte > 359 und < 360
        angleInDegreesFixed = 360 - this.angleInDegrees;
    else
        angleInDegreesFixed = this.angleInDegrees;
    var equal = Math.abs(angleInDegreesFixed - this.startAngleInDegrees);
    return equal < 0.00001;
}
JointPiece.prototype.getEndPoint = function (scale) {
    var x, y;
    x = this.position.x + Math.sin(Math.PI / 180.0 * this.angleInDegrees) * this.radius * scale;
    y = this.position.y + Math.cos(Math.PI / 180.0 * this.angleInDegrees) * this.radius * -scale;
    return new Point(x, y);
}
JointPiece.prototype.getValidAngle = function (value) {
    while (value >= 360.0)
        value -= 360.0;
    while (value < 0)
        value += 360.0;
    return value;
}
JointPiece.prototype.draw = function (context, color, scale) {
    var endPoint = this.getEndPoint(scale);
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();

    if (this.innerSpiraloPiece) {
        var endAngle = (Math.PI / 180.0) * 360.0;
        context.arc(this.position.x, this.position.y, this.radius * scale, 0, endAngle, false);
        context.stroke();
    }
    else {
        //Gelenkkreis
        var endAngle = (Math.PI / 180.0) * 360.0;
        context.arc(this.position.x, this.position.y, scale * 0.3, 0, endAngle, true);
        context.fill();
    }
    //Gelenkstueck
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
}
JointPiece.prototype.update = function (endPointOfConnectedJointPiece) {
    this.position = endPointOfConnectedJointPiece;
    this.angleInDegrees += this.angleChangeRateInDegrees;
    this.angleInDegrees = this.getValidAngle(parseFloat(this.angleInDegrees));
}
JointPiece.prototype.reset = function (endPointOfConnectedJointPiece) {
    this.angleInDegrees = this.startAngleInDegrees;
    this.position = endPointOfConnectedJointPiece;
}
JointPiece.prototype.isAtPosition = function (x, y, scale, maxPointDistance) {
    var endpoint = this.getEndPoint(scale);
    var delta = new Point(endpoint.x - this.position.x, endpoint.y - this.position.y);
    var m = delta.y / delta.x;
    var b = endpoint.y - m * endpoint.x;
    var linePoint = new Point(x, m * x + b);
    return linePoint.getDistanceTo(x, y) <= maxPointDistance;
}
//Ende JointPiece


//History
function History() {
    this.data = [];
    this.max = 50; //maximale Eintrage
    this.current = -1; // letzter geschriebener Index
}
History.prototype.add = function (code) {
    if (this.data.length < this.max) {
        if (this.current < this.length - 1)
            this.data[this.current++] = code;
        else {
            this.data.push(code);
            this.current++;
        }
    }
    else {
        if (this.current == this.max - 1)
            this.current = -1;
        this.current++;
        this.data[this.current] = code;
    }
}
History.prototype.containsItems = function () {
    return this.data.length > 0;
}
History.prototype.contains = function (code) {
    for (var i = 0; i < this.data.length; i++)
        if (this.data[i] == code)
            return true;
    return false;
}
History.prototype.hasPreviousItem = function () {
    var x = this.current > 0 || this.current == 0 && this.data.length > 1;
    console.log(x);
    return x;
}
History.prototype.getPreviousItem = function () {
    if (this.data.length > 1)
        if (this.current > 0)
            return this.data[this.current - 1];
        else
            return this.data[this.max - 1];
}
History.prototype.getCurrentItem = function () {
    return this.data[this.current];
}
History.prototype.moveToPreviousItem = function () {
    console.log(this);
    if (this.data.length > 1)
        if (this.current > 0)
            this.current -= 1;
        else
            this.current = this.max - 1;
    console.log(this);
}
//Ende History

//Graph
function Graph(center, jointPieceColor, figureColor) {
    this.history = new History();
    this.center = center;
    this.jointPieceColor = jointPieceColor;
    this.figureColor = figureColor;
    this.jointPieces = [];
    this.scale = 6;
    this.minPointDistance = 2;
    this.figurePoints = [];
    this.figureCompleted = false;
    this.figureTooBig = false;
    this.maxFigurePoints = 30000;
    this.autoComplete = false;
    this.showJointPieces = true;
    this.velocity = 6;
    this.randomMode = 'mixed';
    //Beschraenkungen
    this.maxScale = 100;
    this.minScale = 1;
    this.maxVelocity = 1000;
    this.minVelocity = 1;
    this.maxRadius = 50;
    this.minRadius = 5;
    this.maxAngleChangeRateInDegrees = 20;
    this.minAngleChangeRateInDegrees = -20;
}
Graph.prototype.loadPreviousFigure = function () {
    if (this.history.containsItems()) {
        this.history.moveToPreviousItem();
        this.load(this.history.getCurrentItem());
    }
}
Graph.prototype.clear = function () {
    this.jointPieces.length = 0; //loescht Array
    this.figurePoints.length = 0;
    this.figureCompleted = false;
    this.figureTooBig = false;
}
Graph.prototype.addJointPiece = function (radius, angleChangeRateInDegrees, angleInDegrees) {
    var elements = this.jointPieces.length;
    var jointPiece;
    if (elements > 0) {
        var endpoint = this.jointPieces[elements - 1].getEndPoint(this.scale);
        jointPiece = new JointPiece(endpoint, radius, angleChangeRateInDegrees, angleInDegrees);
    }
    else
        jointPiece = new JointPiece(this.center, radius, angleChangeRateInDegrees, angleInDegrees);

    this.jointPieces.push(jointPiece);
}
Graph.prototype.addSpiraloPiece = function (radius) {
    var elements = this.jointPieces.length;
    if (elements > 0) {
        var lastJointPiece = this.jointPieces[elements - 1];
        var angleChangeRateMultiplierForInnerCircle = lastJointPiece.radius / radius;
        this.addJointPiece(radius, lastJointPiece.angleChangeRateInDegrees, lastJointPiece.angleInDegrees + 180.0);
        this.addJointPiece(radius, -angleChangeRateMultiplierForInnerCircle * lastJointPiece.angleChangeRateInDegrees,
            lastJointPiece.angleInDegrees);
        this.jointPieces[this.jointPieces.length - 1].innerSpiraloPiece = true;
    }
}
Graph.prototype.draw = function (context) {
    //Zeichne Gelenke
    if (this.showJointPieces)
        for (var i = 0; i < this.jointPieces.length; i++)
            this.jointPieces[i].draw(context, this.jointPieceColor, this.scale);
    //Zeichne Figur
    var elements = this.figurePoints.length;
    context.strokeStyle = this.figureColor;
    context.beginPath();
    for (var i = 0; i < elements; i++) {
        context.lineTo(this.figurePoints[i].x, this.figurePoints[i].y);
    }
    context.stroke();
}
Graph.prototype.update = function () {
    for (var k = 0; k < this.velocity; k++) {
        var elements = this.jointPieces.length;
        if (elements > 0) {
            if (this.figureCompleted == false) {
                var drawingPosition = this.jointPieces[elements - 1].getEndPoint(this.scale);
                if (this.figurePoints.length == 0 || this.figurePoints.length > 0
                    && this.figurePoints[this.figurePoints.length - 1].getDistanceTo(drawingPosition.x, drawingPosition.y) >= this.minPointDistance
                    && this.figurePoints.length < this.maxFigurePoints)
                    this.figurePoints.push(drawingPosition);

                this.jointPieces[0].update(this.jointPieces[0].position);
                for (var i = 1; i < elements; i++)
                    this.jointPieces[i].update(this.jointPieces[i - 1].getEndPoint(this.scale));
            }

            if (this.isFigureCompleted()) {
                if (this.figureCompleted == false) {
                    if (this.areFigurePointsFree())
                        this.figurePoints.push(this.figurePoints[0]);
                    if (this.figureTooBig == false)
                        console.log('Figure completed with ' + this.figurePoints.length + ' points');
                }
                this.figureCompleted = true;
            }
        }
    }
}
Graph.prototype.isAtStartAngles = function () {
    for (var i = 0; i < this.jointPieces.length; i++)
        if (this.jointPieces[i].isAtStartAngle() == false) {
            return false;
        }
    return true;
}
Graph.prototype.isFigureCompleted = function () {
    return this.isAtStartAngles() && this.figurePoints.length > 0;
}
Graph.prototype.areFigurePointsFree = function () {
    return this.figurePoints.length < this.maxFigurePoints;
}
Graph.prototype.completeFigure = function () {
    if (this.jointPieces.length == 0)
        return;
    this.reset();
    while (this.figureCompleted == false) {
        if (this.areFigurePointsFree() == false) {
            this.figureTooBig = true;
            console.log('Couldn\'t complete figure because it\'s too complex (drawed ' + this.figurePoints.length + ' points)');
            return;
        }
        this.update();
    }
}
Graph.prototype.getCode = function () {
    //Codeaufbau: radius1|winkelgeschwindigkeit1|startwinkel1|r2|wg2|sw2:...
    var code = '';
    for (var i = 0; i < this.jointPieces.length; i++) {
        var piece = this.jointPieces[i];
        code += piece.radius + '|' + piece.angleChangeRateInDegrees + '|' + piece.startAngleInDegrees + '|';
    }
    return code.substring(0, code.length - 1);
}
Graph.prototype.getShareLink = function () {
    return getUriWithoutParams() +
        '?code=' + this.getCode() +
        '&scale=' + this.scale +
        '&v=' + this.velocity +
        '&autocomplete=' + this.autoComplete +
        '&randommode=' + this.randomMode +
        '&showcircle=' + this.showJointPieces;
}
Graph.prototype.load = function (code) {
    if (code == null) return;
    var pattern = /-?\d+(?:\.\d+)?/g;
    var regex = new RegExp(pattern);
    var results = [], found;
    while (found = regex.exec(code))
        results.push(parseFloat(found[0]));
    if (this.areCodeValuesValid(results)) {
        this.clear();
        for (var i = 0; i < results.length; i += 3)
            this.addJointPiece(results[i], results[i + 1], results[i + 2]);
        if (this.autoComplete)
            this.completeFigure();
    }
}
Graph.prototype.areCodeValuesValid = function (values) {
    if (values == null || values.length == 0 || values.length % 3 != 0)
        return false;
    for (var i = 0; i < values.length; i++)
        if (isNaN(values[i]))
            return false;
    for (var i = 0; i < values.length; i += 3)
        if (this.isValueValidRadius(values[i]) == false || this.isValueValidAngleChangeRateInDegrees(values[i + 1]) == false)
            return false;

    return true;
}
Graph.prototype.isValueValidRadius = function (value) {
    if (value == null)
        return false;
    return value >= this.minRadius && value <= this.maxRadius;
}
Graph.prototype.isValueValidAngleChangeRateInDegrees = function (value) {
    if (value == null)
        return false;
    return value >= this.minAngleChangeRateInDegrees && value <= this.maxAngleChangeRateInDegrees;
}
Graph.prototype.randomize = function () {
    if (this.jointPieces.length > 0)
        this.history.add(this.getCode());

    var random = new Random();
    this.clear();
    this.addJointPiece(random.getNumber(10, 20), random.getNumberWithNegative(1, 4) * 0.5, this.randomMode != 'symmetrical' ? random.getNumber(1, 359) : 0); //erstes Gelenk
    this.jointPieces[this.jointPieces.length - 1].innerSpiraloPiece = true;
    var pieces = random.getNumber(1, 3);
    if (random.getBoolean()) {
        //Nur SpiraloPiece
        for (var i = 0; i < pieces; i++) {
            var radius;
            do {
                radius = random.getNumber(5, 20);
            } while (radius > this.jointPieces[this.jointPieces.length - 1].radius);
            this.addSpiraloPiece(radius);
        }
    }
    else if (random.getBoolean()) {
        //Nur JointPieces
        for (var i = 0; i < pieces; i++)
            this.addJointPiece(random.getNumber(10, 20), random.getNumberWithNegative(1, 4) * 0.5, this.randomMode != 'symmetrical' ? random.getNumber(1, 359) : 0);
    }
    else {
        //Gemischt
        for (var i = 0; i < pieces; i++) {
            if (random.getBoolean()) {
                var radius;
                do {
                    radius = random.getNumber(5, 20);
                } while (radius > this.jointPieces[this.jointPieces.length - 1].radius);
                this.addSpiraloPiece(radius);
            }
            else
                this.addJointPiece(random.getNumber(10, 20), random.getNumberWithNegative(1, 4) * 0.5, this.randomMode != 'symmetrical' ? random.getNumber(1, 359) : 0);
        }
    }

    if (this.autoComplete)
        this.completeFigure();
}
Graph.prototype.setScale = function (value) {
    if (this.isValueValidScale(value))
        this.scale = value;
}
Graph.prototype.isValueValidScale = function (value) {
    if (value == null)
        return false;
    return value >= this.minScale && value <= this.maxScale;
}
Graph.prototype.setVelocity = function (value) {
    if (this.isValueValidVelocity(value))
        this.velocity = value;
}
Graph.prototype.isValueValidVelocity = function (value) {
    if (value == null)
        return false;
    return value >= this.minVelocity && value <= this.maxVelocity;
}
Graph.prototype.reset = function () {
    this.figurePoints.length = 0;
    this.figureCompleted = false;
    this.figureTooBig = false;
    elements = this.jointPieces.length;
    if (elements > 0) {
        this.jointPieces[0].reset(this.jointPieces[0].position);
        for (var i = 1; i < elements; i++)
            this.jointPieces[i].reset(this.jointPieces[i - 1].getEndPoint(this.scale));
    }

}
Graph.prototype.getPNG = function (context) {
    var canvas = document.getElementById('canvas');
    var gfx = canvas.toDataURL('image/png');
    //this.showJointPieces = true;
    return gfx;
}
Graph.prototype.selectPiece = function (x, y) {
    for (var i = 0; i < this.jointPieces.length; i++)
        if (this.jointPieces[i].isAtPosition(x, y, this.scale, 7))
            console.log(i + " angeklickt");
}
Graph.prototype.setShowJointPieces = function (value) {
    if (this.isValueValidBoolean(value))
        this.showJointPieces = value;
}
Graph.prototype.setAutoComplete = function (value) {
    if (this.isValueValidBoolean(value))
        this.autoComplete = value;
}
Graph.prototype.isValueValidBoolean = function (value) {
    return value != null && (value == 'true' || value == true);
}
Graph.prototype.setMinPointDistance = function (value) {
    if (this.isValueValidMinPointDistance(value))
        this.minPointDistance = value;
}
Graph.prototype.isValueValidMinPointDistance = function (value) {
    return value != null && value >= 0;
}
Graph.prototype.setRandomMode = function (value) {
    if (this.isValueValidRandomMode(value))
        this.randomMode = value;
}
Graph.prototype.isValueValidRandomMode = function (value) {
    if (value == null)
        return false;
    return value == 'mixed' || value == 'symmetrical' || value == 'asymmetrical';
}
//Ende Graph
	
	
	
	
	
	
	
	
	
