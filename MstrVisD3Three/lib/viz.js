/*global d3,THREE,TWEEN,requestAnimationFrame */
(function () {
    var VIZ = {};

    var camera, renderer, controls, scene = new THREE.Scene();
    VIZ.init = function (w, h) {

        VIZ.width = w;
        VIZ.height = h;

        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(VIZ.width, VIZ.height);
        renderer.domElement.style.position = 'absolute';
        camera = new THREE.PerspectiveCamera(40, VIZ.width / VIZ.height, 1, 10000);
        camera.position.z = 3000;
        camera.setLens(30);
        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 0.5;
        controls.minDistance = 100;
        controls.maxDistance = 6000;
        controls.addEventListener('change', VIZ.render);
    };
    VIZ.drawElements = function (data) {
        VIZ.count = data.length;
        var margin = {top: 25, right: 0, bottom: 16, left: 50},
            width = 225 - margin.left - margin.right,
            height = 140 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

        x.domain(data[0].data.map(function (d) {
            return d.name;
        }));
        //we need to have max of all tiles
        var y = d3.scale.linear()
            .range([height, 0]).domain([0, d3.max(data, function (d) {
                return d3.max(d.data, function(da){
                   return da.value;
                });
            })]);

        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");
        var color = d3.scale.ordinal()
            .range(['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)']);

        d3.selectAll('.element').remove();
       var tiles = d3.selectAll('.element')
            .data(data).enter()
            .append('div')
            .attr('class', 'element');

        tiles.append('div')
            .attr('class', 'chartTitle')
            .html(function (d) {
                return d.name;
            });

        tiles.append('div')
            .attr('class', 'metricName')
            .html(function (d) {
                return d.mname;
            });
        tiles.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "chartg")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        tiles.select(".chartg")
            .append("g").attr("class", "seriesg")
            .selectAll("series")
            .data(function (d) {
                return d.data;
            }).enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.name);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                var h = height - y(d.value);
                if(h<0){
                    h=0;
                }
                return h;
            })
            .attr("width", x.rangeBand())
            .style("fill", function (d) { return color(d.name); });


        tiles.select(".chartg").append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        tiles.select(".chartg").append("g")
            .attr("class", "y axis")
            .call(yAxis);

        tiles.each(setData);
        tiles.each(objectify);
    };

    function objectify(d) {
        var object = new THREE.CSS3DObject(this);
        object.position = d.random.position;
        scene.add(object);
    }

    function setData(d, i) {
        var vector, phi, theta;
        var random = new THREE.Object3D();
        random.position.x = Math.random() * 4000 - 2000;
        random.position.y = Math.random() * 4000 - 2000;
        random.position.z = Math.random() * 4000 - 2000;
        d.random = random;

        var sphere = new THREE.Object3D();
        vector = new THREE.Vector3();
        phi = Math.acos(-1 + ( 2 * i ) / (VIZ.count - 1));
        theta = Math.sqrt((VIZ.count - 1) * Math.PI) * phi;
        sphere.position.x = 800 * Math.cos(theta) * Math.sin(phi);
        sphere.position.y = 800 * Math.sin(theta) * Math.sin(phi);
        sphere.position.z = 800 * Math.cos(phi);
        vector.copy(sphere.position).multiplyScalar(2);
        sphere.lookAt(vector);
        d.sphere = sphere;

        var helix = new THREE.Object3D();
        vector = new THREE.Vector3();
        phi = (i + 12) * 0.250 + Math.PI;
        helix.position.x = 1000 * Math.sin(phi);
        helix.position.y = -(i * 8) + 500;
        helix.position.z = 1000 * Math.cos(phi);
        vector.x = helix.position.x * 2;
        vector.y = helix.position.y;
        vector.z = helix.position.z * 2;
        helix.lookAt(vector);
        d.helix = helix;

        var grid = new THREE.Object3D();
        grid.position.x = (( i % 4 ) * 400) - 800;
        grid.position.y = ( -( Math.floor(i / 4) % 4 ) * 400 ) + 800;
        grid.position.z = (Math.floor(i / 25)) * 1000 - 2000;
        d.grid = grid;
    }

    VIZ.render = function () {
        renderer.render(scene, camera);
        document.getElementById('container').appendChild(renderer.domElement);
        d3.select("#menu").selectAll('button')
            .data(['sphere', 'helix', 'grid']).enter()
            .append('button')
            .html(function (d) {

                return d;
            })
            .on('click', function (d) {

                VIZ.transform(d);
            });
    };

    VIZ.transform = function (layout) {
        var duration = 1000;
        TWEEN.removeAll();
        scene.children.forEach(function (object) {
            var newPos = object.element.__data__[layout].position;
            new TWEEN.Tween(object.position)
                .to({x: newPos.x, y: newPos.y, z: newPos.z}, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .start();

            var newRot = object.element.__data__[layout].rotation;
             new TWEEN.Tween(object.rotation)
                .to({x: newRot.x, y: newRot.y, z: newRot.z}, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .start();
        });

        new TWEEN.Tween(this)
            .to({}, duration)
            .onUpdate(VIZ.render)
            .start();
    };

    VIZ.animate = function () {
        requestAnimationFrame(VIZ.animate);
        TWEEN.update();
        controls.update();
    };

    VIZ.resize = function (w, h) {
        VIZ.width = parseInt(w, 10);
        VIZ.height = parseInt(h, 10);
        camera.aspect = VIZ.width / VIZ.height;
        camera.updateProjectionMatrix();
        renderer.setSize(VIZ.width, VIZ.height);
        VIZ.render();
    };
    window.VIZ = VIZ;

}())