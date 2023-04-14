"use client";

/**
 * Don't judge this code too harshly, it was written almost 10+ years ag
 */

import React, { useEffect } from "react";
import debounce from "lodash.debounce";

export function vizScript() {
    // Global
    var settings = {
        focalLength: 350,
        aspectRatio: 1.25,
        bottomOffset: 0 /*64*/,
        logicRefreshRate: 10,
        endStep: 800,
        camera: {
            x: 0,
            y: 0,
            z: -100,
            center: [50, 50],
        },
        fonts: {
            header: "Segoe UI, Open Sans, HelveticaNeue, sans-serif",
            header2: "Segoe UI Light, Open Sans, HelveticaNeue, sans-serif",
            small: "sans-serif",
        },
        text: {
            initialTextOffset: 75,
        },
    };

    var state = {
        // Initial state, may change in execution
        useDim: {},
        mouse: {},
        introAnimComplete: false,
        postMouseMove: false,
        postMouseMoveTimer: null,
        time: 0,
        model: {
            boxPoints: {
                // Initial points of box. Will be morphed into cube with front face x: 25-75, y: 25-75, z: 100-150
                f1: { x: 25, y: 25, z: 100 },
                f2: { x: 75, y: 25, z: 100 },
                f3: { x: 75, y: 75, z: 100 },
                f4: { x: 25, y: 75, z: 100 },

                b1: { x: 75, y: 90, z: 40 },
                b2: { x: 25, y: 90, z: 40 },

                t1: { x: 75, y: 8, z: 120 },
                t2: { x: 25, y: 8, z: 120 },
            },
            detailPoints: {
                box1frontLeft: {},
                box1backRight: {},
            },
            detailVectors: {
                box1first: { x: 0, y: 0, z: 0 },
            },
            b1TextOffsetVector: { x: 0, y: 0 },
            box2Points: {
                f1: { x: 25, y: 25, z: 180 },
                f2: { x: 75, y: 25, z: 180 },
                f3: { x: 75, y: 75, z: 180 },
                f4: { x: 25, y: 75, z: 180 },

                b1: { x: 25, y: 25, z: 180 },
                b2: { x: 75, y: 25, z: 180 },
                b3: { x: 75, y: 75, z: 180 },
                b4: { x: 25, y: 75, z: 180 },
            },
            box3Points: {},
            box4Points: {},

            horizon: {
                s: { x: -300, y: 65 },
                e: { x: -300, y: 65 },
            },
        },
        firstLayerInit: false,
        temp: {},
        ce: {
            // Cached Elements
            pageTitle: document.getElementById("title"),
            container: document.getElementById("frontContainer"),
            locationLabel: document.getElementById("f_locationLabel"),
            menu: document.getElementById("f_menu"),
            latestItems: document.getElementById("f_latestItems"),
        },
    };

    (function () {
        // Not global.
        // Constants
        var X = 0,
            Y = 1;
        var timer;
        var utility = {
            // Value can be numeric percentage of w/h distance or array to reference to point in state.model (e.g. ["boxPoints", "f1"])
            percentDim: function (value, dimension) {
                if (value.x != null && value.y != null) {
                    // Case of pt supplied.
                    if (dimension == X) value = value.x;
                    if (dimension == Y) value = value.y;
                } else if (isNaN(value) && state.model[value[0]][value[1]] != null) {
                    // Case of reference pt supplied.
                    if (dimension == X) value = state.model[value[0]][value[1]]["x"];
                    if (dimension == Y) value = state.model[value[0]][value[1]]["y"];
                } else {
                }
                if (dimension == X)
                    return (
                        (value / (100 * settings.aspectRatio)) * state.useDim.width +
                        state.useDim.offsetWidth
                    );
                if (dimension == Y)
                    return (value / 100) * state.useDim.height + state.useDim.offsetHeight;
            },
            point2DFrom3D: function (point, addVector, scale) {
                if (point.x == null && point.y == null && state.model[point[0]][point[1]] != null) {
                    // Case of reference pt supplied.
                    point = state.model[point[0]][point[1]];
                }
                if (addVector != null) point = utility.applyVector(point, addVector);
                if (scale == null)
                    scale =
                        settings.focalLength / (settings.focalLength + point.z - settings.camera.z);
                return {
                    x:
                        (point.x - settings.camera.x - settings.camera.center[0]) * scale +
                        settings.camera.center[0],
                    y:
                        (point.y - settings.camera.y - settings.camera.center[1]) * scale +
                        settings.camera.center[1],
                    scale: 100 * scale,
                };
            },
            applyVector: function (originalPoint, vector) {
                if (vector.x == null) vector.x = 0;
                if (vector.y == null) vector.y = 0;
                if (vector.z == null) vector.z = 0;
                return {
                    x: originalPoint.x + vector.x,
                    y: originalPoint.y + vector.y,
                    z: originalPoint.z + vector.z,
                };
            },
            setCanvasSize: function (width, height) {
                if (height * settings.aspectRatio > width) {
                    state.useDim.width = width;
                    state.useDim.height = width / settings.aspectRatio;
                    state.useDim.offsetWidth = 0;
                    state.useDim.offsetHeight = parseInt((height - state.useDim.height) / 2);
                }
                if (width / settings.aspectRatio > height) {
                    state.useDim.height = height;
                    state.useDim.width = height * settings.aspectRatio;
                    state.useDim.offsetHeight = 0;
                    state.useDim.offsetWidth = parseInt((width - state.useDim.width) / 2);
                }
                canvas.width = width;
                canvas.height = height;
            },
            rotationMatrix: function (degree, point, center) {
                if (center == null) center = { x: 0, y: 0 };
                point.x -= center.x;
                point.y -= center.y;
                return {
                    x: point.x * Math.cos(degree) - point.y * Math.sin(degree) + center.x,
                    y: point.x * Math.sin(degree) + point.y * Math.cos(degree) + center.y,
                };
            },
            rotationYMatrix: function (degree, point, originXZ) {
                if (originXZ == null) originXZ = { x: 50, z: 50 };
                point.x -= originXZ.x;
                point.z -= originXZ.z;
                return {
                    x: point.x * Math.cos(degree) + point.z * Math.sin(degree) + originXZ.x,
                    y: point.y,
                    z: -point.x * Math.sin(degree) + point.z * Math.cos(degree) + originXZ.x,
                };
            },
            clonePointSetObject: function (object, newObject) {
                newObject = new Object();
                for (var pt in object) {
                    newObject[pt] = {
                        x: object[pt]["x"],
                        y: object[pt]["y"],
                        z: object[pt]["z"],
                    };
                }
                return newObject;
            },
            setMouseCoords: function (evt) {
                state.mouse.x = evt.clientX;
                state.mouse.y = evt.clientY;
                //clearTimeout(state.postMouseMoveTimer);
                //state.postMouseMove = true;
                //state.postMouseMoveTimer = setTimeout(function(){
                //  state.postMouseMove = false;
                //}, 2000);
                //window.requestAnimationFrame(drawInitial);
                //console.log("x: " + state.mouse.x + ", y: " + state.mouse.y);
            },
        };

        var canvas = document.getElementById("front-page-canvas");
        var ctx = canvas.getContext("2d");
        // Fallback(s) for reqAnimFrame
        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 100);
            };

        var resizeFunc = debounce(function () {
            const containerSize = state.ce.container.getBoundingClientRect();
            utility.setCanvasSize(
                containerSize.width,
                containerSize.height - settings.bottomOffset
            );
            window.requestAnimationFrame(drawInitial);
            setTimeout(ui.setUI, 100);
            // document.getElementById("bgarea").style.height = utility.percentDim(
            //     ["horizon", "e"],
            //     Y
            // );
        }, 250);

        window.addEventListener("resize", resizeFunc, { passive: true });

        resizeFunc();

        function drawInitial(cx) {
            cx = ctx;
            cx.clearRect(0, 0, canvas.width, canvas.height);

            if (state.firstLayerInit) drawFirstLayer(cx);

            /*
          cx.moveTo(utility.percentDim(0, X), utility.percentDim(0, Y));
          cx.lineTo(utility.percentDim(50, X), utility.percentDim(5, Y));
          cx.lineTo(utility.percentDim(100, X), utility.percentDim(0, Y));
          cx.lineTo(utility.percentDim(0, X), utility.percentDim(0, Y));
          cx.lineWidth = 5;
          cx.stroke();
          */

            cx.beginPath();
            // Big lines (edges)

            if (
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y) <
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
            ) {
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), Y)
                );
            } else {
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                );
            }

            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), X),
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), X),
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), Y)
            );

            if (
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) >
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
            ) {
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y)
                );
                cx.fillStyle = "#f4f4f4";
                if (state.time > 300) cx.fill();
                cx.lineWidth = 2;
                cx.strokeStyle = "#000";
                cx.stroke();
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                );
                if (state.time < 300) cx.fill();
            } else {
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                );
                cx.fillStyle = "#f4f4f4";
                cx.fill();
                cx.lineWidth = 2;
                cx.strokeStyle = "#000";
                cx.stroke();
            }

            if (
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), X) >
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X) ||
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y) >
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X)
            ) {
                cx.beginPath();
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y)
                );

                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y)
                );

                if (
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) >
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                ) {
                    cx.strokeStyle = "#000";
                    cx.lineWidth = 2;
                    cx.stroke();
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                    );
                    cx.fillStyle = "#f4f4f4";
                    cx.fill();

                    cx.beginPath();
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                    );
                    cx.lineWidth = 1;
                    cx.stroke();
                } else {
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                    );
                    cx.lineWidth = 2;
                    cx.stroke();
                    cx.fillStyle = "#e4e4e4";
                    cx.fill();
                }

                if (
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y) >
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
                ) {
                    cx.beginPath(); // Begin path for small lines if no edge between front-facing square's top and bottom right corners.
                    // Draw background lines
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), Y)
                    );

                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y)
                    );

                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
                    );

                    cx.lineWidth = 1;
                    cx.strokeStyle = "#999";
                    cx.stroke();

                    cx.beginPath();
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                    );

                    cx.lineWidth = 1;
                    cx.strokeStyle = "#000";
                    cx.stroke();
                    cx.beginPath();
                } else if (
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) <
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), Y)
                ) {
                    cx.beginPath();
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "t2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), Y)
                    );
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y)
                    );

                    cx.lineWidth = 1;
                    cx.strokeStyle = "#999";
                    cx.stroke();

                    cx.beginPath();
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                    );
                    cx.moveTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                    );
                    cx.lineTo(
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), X),
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
                    );

                    cx.lineWidth = 1;
                    cx.strokeStyle = "#000";
                    cx.stroke();
                }
            } else {
                // Make edge between front-facing square's top and bottom right corners.
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                ); // Top right corner
                cx.lineWidth = 2;
                cx.strokeStyle = "#000";
                cx.stroke();
                cx.beginPath(); // Begin path for small lines.
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                ); // Bottom right corner
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), Y)
                );
            }

            // Small lines (creases)
            //cx.beginPath();
            if (
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "t1"]), Y) <=
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
            ) {
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f2"]), Y)
                ); // Top right corner
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f1"]), Y)
                );
            }

            cx.lineWidth = 1;
            cx.strokeStyle = "#999";
            cx.stroke();

            if (
                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) >
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y) &&
                state.time > 300
            ) {
                cx.beginPath();
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f3"]), Y)
                ); // Bottom right corner
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), X),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "f4"]), Y)
                );
                cx.lineWidth = 1;
                cx.strokeStyle = "#000";
                cx.stroke();
            }

            // Text
            cx.font = "8pt sans-serif";
            cx.fillStyle = "#444";
            if (state.time < 300) {
                cx.fillText(
                    '4" by 4" by 4" Box Model #' + (3245 + state.time),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                        10 +
                        state.model.b1TextOffsetVector.x,
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) +
                        state.model.b1TextOffsetVector.y
                );
                cx.font = "15pt " + settings.fonts.header;
                if (state.time < 75) {
                    cx.fillText(
                        "Imagine",
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                            10 +
                            state.model.b1TextOffsetVector.x,
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                            15 +
                            +state.model.b1TextOffsetVector.y
                    );
                } else if (state.time < 150) {
                    cx.fillText(
                        "Plan",
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                            10 +
                            state.model.b1TextOffsetVector.x,
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                            15 +
                            state.model.b1TextOffsetVector.y
                    );
                } else if (state.time < 225) {
                    cx.fillText(
                        "Set",
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                            10 +
                            state.model.b1TextOffsetVector.x,
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                            15 +
                            state.model.b1TextOffsetVector.y
                    );
                } else {
                    cx.fillText(
                        "Build",
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                            10 +
                            state.model.b1TextOffsetVector.x,
                        utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                            15 +
                            state.model.b1TextOffsetVector.y
                    );
                }
            } else {
                cx.fillStyle = "rgba(45,45,45," + (1 - (state.time - 300) / 50) + ")";
                cx.fillText(
                    '4" by 4" by 4" Box Model #' + (3245 + 300),
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                        10 +
                        state.model.b1TextOffsetVector.x,
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) +
                        state.model.b1TextOffsetVector.y
                );
                cx.font = "15pt sans-serif";
                cx.fillText(
                    "Continue",
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                        10 +
                        state.model.b1TextOffsetVector.x,
                    utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                        15 +
                        state.model.b1TextOffsetVector.y
                );
                if (state.time > 325) {
                    cx.font =
                        Math.max(parseInt(state.useDim.height / 30), 16) +
                        "pt " +
                        settings.fonts.header2;
                    if (state.time < 475) {
                        cx.fillStyle =
                            "rgba(0,0,0," + Math.min(Math.abs((state.time - 325) % 2), 0.25) + ")";
                        if (state.time < 345) {
                            cx.fillText(
                                "constraints",
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                                    settings.text.initialTextOffset +
                                    state.model.b1TextOffsetVector.x,
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                                    24 +
                                    state.model.b1TextOffsetVector.y
                            );
                        } else if (state.time < 370) {
                            cx.fillText(
                                "prototyping",
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                                    settings.text.initialTextOffset +
                                    state.model.b1TextOffsetVector.x,
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                                    24 +
                                    state.model.b1TextOffsetVector.y
                            );
                        } else if (state.time < 400) {
                            cx.fillText(
                                "testing",
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                                    settings.text.initialTextOffset +
                                    state.model.b1TextOffsetVector.x,
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                                    24 +
                                    state.model.b1TextOffsetVector.y
                            );
                        } else if (state.time < 435) {
                            cx.fillText(
                                "iteration",
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                                    settings.text.initialTextOffset +
                                    state.model.b1TextOffsetVector.x,
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                                    24 +
                                    state.model.b1TextOffsetVector.y
                            );
                        } else if (state.time < 475) {
                            cx.fillText(
                                "development",
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), X) +
                                    settings.text.initialTextOffset +
                                    state.model.b1TextOffsetVector.x,
                                utility.percentDim(utility.point2DFrom3D(["boxPoints", "b1"]), Y) -
                                    24 +
                                    state.model.b1TextOffsetVector.y
                            );
                        }
                    } else if (state.time < 630) {
                        cx.font =
                            Math.max(parseInt(state.useDim.height / 30), 18) +
                            "pt " +
                            settings.fonts.header;
                        cx.fillStyle =
                            "rgba(0,0,0," +
                            (1 - Math.min((Math.max(state.time, 600) - 600) / 30, 1)) +
                            ")";
                        if (!state.temp.firstTextFixed) {
                            state.temp.firstTextFixed = utility.point2DFrom3D(
                                state.model.boxPoints.b1
                            );
                            state.temp.firstTextFixed.enabled = true;
                            // console.log(state.temp.firstTextFixed);
                        }
                        cx.fillText(
                            "design",
                            utility.percentDim(state.temp.firstTextFixed, X) +
                                settings.text.initialTextOffset +
                                state.model.b1TextOffsetVector.x,
                            utility.percentDim(state.temp.firstTextFixed, Y) -
                                24 +
                                state.model.b1TextOffsetVector.y
                        );
                        if (state.time > 520) {
                            if (state.time < 600) {
                                cx.fillStyle =
                                    "rgba(0,0,0," + Math.min((state.time - 520) / 40, 1) + ")";
                            } else {
                                cx.fillStyle =
                                    "rgba(40,40,40," +
                                    (1 - Math.min((state.time - 600) / 30, 1)) +
                                    ")";
                            }
                            cx.fillText(
                                "   + computation",
                                utility.percentDim(state.temp.firstTextFixed, X) +
                                    settings.text.initialTextOffset +
                                    (state.model.b1TextOffsetVector.x -
                                        state.model.b1TextOffsetVector.x * 1.25),
                                utility.percentDim(state.temp.firstTextFixed, Y) +
                                    6 +
                                    state.model.b1TextOffsetVector.y
                            );
                        }
                    } else {
                        // Past 630
                        cx.font =
                            "bold " +
                            Math.max(parseInt(state.useDim.height / 12), 18) +
                            "pt " +
                            settings.fonts.header;
                        /*
                if ( // Hovering
                  state.mouse.y > utility.percentDim(50, Y) - 20 && 
                  state.mouse.y < utility.percentDim(50, Y) + 40 &&
                  state.mouse.x > utility.percentDim(state.temp.firstTextFixed, X) + settings.text.initialTextOffset &&
                  state.mouse.x < utility.percentDim(state.temp.firstTextFixed, X) + settings.text.initialTextOffset + Math.max(state.useDim.height / 140, 120)
                ){
                  cx.fillStyle= "rgba(60,60,60," + (Math.min((Math.max(state.time, 630) - 630) / 60, 1)) + ")";
                  cx.fillText("akb", utility.percentDim(state.temp.firstTextFixed, X) + settings.text.initialTextOffset + state.model.b1TextOffsetVector.x, utility.percentDim(50, Y) - 24);
                
                } else {
                  cx.fillStyle= "rgba(210,210,210," + (Math.min((Math.max(state.time, 630) - 630) / 60, 1)) + ")";
                  cx.fillText("akb", utility.percentDim(state.temp.firstTextFixed, X) + settings.text.initialTextOffset + state.model.b1TextOffsetVector.x, utility.percentDim(50, Y) - 24);
                
                }
                */
                        /*
                cx.fillText("akb", utility.percentDim(state.temp.firstTextFixed, X) + settings.text.initialTextOffset + state.model.b1TextOffsetVector.x, utility.percentDim(50, Y) - 24);
                
                cx.fillStyle= "rgba(210,210,210," + (Math.min((Math.max(state.time, 630) - 650) / 60, 1)) + ")";
                cx.font = 14 + 'pt ' + settings.fonts.header;
                cx.fillText("Boston, MA", utility.percentDim(state.temp.firstTextFixed, X) + settings.text.initialTextOffset + state.model.b1TextOffsetVector.x, utility.percentDim(["horizon", "e"], Y) - 3);
                */
                    }
                }
            }

            postEffects(cx);

            if (state.time < settings.endStep || state.postMouseMove)
                window.requestAnimationFrame(drawInitial);
        }

        function drawFirstLayer(cx) {
            drawHorizon(cx);
            if (state.model.box3Points.f1.y < state.model.boxPoints.b1.y) {
                drawSimpleBox(cx, state.model.box3Points);
                drawSimpleBox(cx, state.model.box4Points);
            }
            drawSimpleBox(cx, state.model.box2Points);
        }

        function drawHorizon(cx) {
            cx.beginPath();
            cx.moveTo(
                utility.percentDim(["horizon", "s"], X),
                utility.percentDim(["horizon", "s"], Y)
            );
            cx.lineTo(
                utility.percentDim(["horizon", "e"], X),
                utility.percentDim(["horizon", "e"], Y)
            );
            cx.lineWidth = 1;
            cx.strokeStyle = "#999";
            cx.stroke();
        }

        function drawSimpleBox(cx, boxPointSet) {
            cx.beginPath();
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), Y)
            );
            cx.fillStyle = "#eee";
            cx.fill();

            if (
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), X) <
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), X)
            ) {
                cx.beginPath();
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), Y)
                );
                cx.fillStyle = "#ddd";
                cx.fill();
            }

            cx.beginPath();
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), Y)
            );
            if (
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b4), Y) >
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), Y)
            ) {
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b4), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b4), Y)
                );
            } else {
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), Y)
                );
            }
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), Y)
            );
            //cx.fillStyle= "#eee";
            //cx.fill();
            //cx.moveTo(utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), X), utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), Y));
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), Y)
            );
            cx.lineWidth = 1;
            cx.strokeStyle = "#000";
            cx.stroke();

            cx.beginPath();
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b3), Y)
            );
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f3), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), X),
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f4), Y)
            );
            cx.lineWidth = 1;
            cx.strokeStyle = "#444";
            cx.stroke();

            if (
                utility.percentDim(utility.point2DFrom3D(boxPointSet.b1), Y) <
                utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), Y)
            ) {
                cx.beginPath();
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b1), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b1), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f2), Y)
                );
                cx.fillStyle = "#eee";
                cx.fill();
                cx.beginPath();
                cx.moveTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.f1), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b1), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b1), Y)
                );
                cx.lineTo(
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), X),
                    utility.percentDim(utility.point2DFrom3D(boxPointSet.b2), Y)
                );
                cx.lineWidth = 1;
                cx.strokeStyle = "#000";
                cx.stroke();
            }
        }

        function postEffects(cx) {
            if (state.time < 590) return;
            cx.beginPath();
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), X),
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), X),
                utility.percentDim(
                    utility.point2DFrom3D(["detailPoints", "box1frontLeft"], {
                        y: state.model.detailVectors.box1first.y,
                    }),
                    Y
                )
            );
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1backRight"]), X),
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), Y)
            );
            cx.lineTo(
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1backRight"]), X),
                utility.percentDim(
                    utility.point2DFrom3D(["detailPoints", "box1frontLeft"], {
                        y: state.model.detailVectors.box1first.y,
                    }),
                    Y
                )
            );

            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), X),
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), Y)
            );
            cx.lineTo(
                utility.percentDim(
                    utility.point2DFrom3D(["detailPoints", "box1frontLeft"], {
                        x: state.model.detailVectors.box1first.x,
                    }),
                    X
                ),
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontRight"]), Y)
            );
            cx.moveTo(
                utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), X),
                utility.percentDim(
                    utility.point2DFrom3D(["detailPoints", "box1frontLeft"], {
                        y: state.model.detailVectors.box1first.y,
                    }),
                    Y
                )
            );
            cx.lineTo(
                utility.percentDim(
                    utility.point2DFrom3D(["detailPoints", "box1frontLeft"], {
                        x: state.model.detailVectors.box1first.x,
                    }),
                    X
                ),
                utility.percentDim(
                    utility.point2DFrom3D(["detailPoints", "box1frontLeft"], {
                        y: state.model.detailVectors.box1first.y,
                    }),
                    Y
                )
            );

            cx.lineWidth = 1;
            cx.strokeStyle = "#555";
            cx.stroke();
        }

        function cleanup() {
            window.removeEventListener("resize", resizeFunc);
        }

        timer = {
            tFunc: function () {
                // Animation logic calculation
                state.time++;
                if (state.time > 50 && state.time < 190) {
                    if (state.model.boxPoints.b1.z < 150) {
                        state.model.boxPoints.b1.z += 90 / state.time;
                    } else {
                        state.model.boxPoints.b1.z = 150;
                        state.model.boxPoints.t1.z = 150;
                    }

                    state.model.boxPoints.b2.z = state.model.boxPoints.b1.z;
                    if (state.model.boxPoints.t1.z > state.model.boxPoints.b1.z) {
                        state.model.boxPoints.t1.z += state.time / 550;
                        state.model.boxPoints.t2.z = state.model.boxPoints.t1.z;
                    } else {
                        state.model.boxPoints.t1.z = state.model.boxPoints.t2.z =
                            state.model.boxPoints.b1.z;
                    }

                    if (state.model.boxPoints.b1.y > state.model.boxPoints.f3.y) {
                        state.model.boxPoints.b1.y -= 0.18;
                        state.model.boxPoints.b2.y -= 0.18;
                    } else {
                        state.model.boxPoints.b1.y = state.model.boxPoints.b2.y =
                            state.model.boxPoints.f3.y;
                    }

                    if (state.model.boxPoints.t1.y < state.model.boxPoints.f1.y) {
                        state.model.boxPoints.t1.y += state.time / 550;
                        state.model.boxPoints.t2.y = state.model.boxPoints.t1.y;
                    } else {
                        state.model.boxPoints.t1.y = state.model.boxPoints.t2.y =
                            state.model.boxPoints.f1.y;
                    }

                    state.model.boxPoints.f4.z =
                        state.model.boxPoints.f3.z =
                        state.model.boxPoints.f2.z =
                        state.model.boxPoints.f1.z -=
                            0.5;
                }
                if (state.time < 300) {
                    settings.camera.x += 0.2;
                    settings.camera.z += 0.2;
                    settings.focalLength -= 0.5;
                } else if (state.time < 400) {
                    if (state.time < 375) {
                        state.model.b1TextOffsetVector.y -= 0.5;
                    }
                    if (state.time > 375) {
                        state.model.b1TextOffsetVector.x -= 0.6;
                    }
                }

                if (state.time > 400) {
                    if (!state.firstLayerInit) {
                        // Create 2nd box.
                        state.model.box3Points = utility.clonePointSetObject(
                            state.model.box2Points
                        );
                        state.model.box3Points.b1.z =
                            state.model.box3Points.b2.z =
                            state.model.box3Points.b3.z =
                            state.model.box3Points.b4.z =
                                state.model.box3Points.f1.z;
                        state.model.box3Points.f1.y =
                            state.model.box3Points.f2.y =
                            state.model.box3Points.b1.y =
                            state.model.box3Points.b2.y =
                                state.model.boxPoints.f4.y + 5;

                        state.model.box4Points = utility.clonePointSetObject(
                            state.model.box2Points
                        );
                        state.model.box4Points.f1.z =
                            state.model.box4Points.f2.z =
                            state.model.box4Points.f3.z =
                            state.model.box4Points.f4.z =
                                state.model.boxPoints.f1.z;
                        state.model.box4Points.b1.z =
                            state.model.box4Points.b2.z =
                            state.model.box4Points.b3.z =
                            state.model.box4Points.b4.z =
                                state.model.boxPoints.b1.z;
                        state.model.box4Points.f1.y =
                            state.model.box4Points.f2.y =
                            state.model.box4Points.b1.y =
                            state.model.box4Points.b2.y =
                                state.model.boxPoints.f4.y + 5;
                        state.model.box4Points.f1.x =
                            state.model.box4Points.f4.x =
                            state.model.box4Points.b1.x =
                            state.model.box4Points.b4.x =
                                state.model.boxPoints.f4.x - 5;
                        state.model.box4Points.f3.x =
                            state.model.box4Points.f2.x =
                            state.model.box4Points.b3.x =
                            state.model.box4Points.b2.x =
                                state.model.boxPoints.f4.x - 5;

                        state.firstLayerInit = true;
                    }
                    if (
                        state.model.box2Points.b4.z - state.model.box2Points.f4.z <
                        state.model.boxPoints.t2.z - state.model.boxPoints.f1.z
                    ) {
                        state.model.box2Points.b4.z += 1.5;
                        state.model.box2Points.b1.z =
                            state.model.box2Points.b2.z =
                            state.model.box2Points.b3.z =
                                state.model.box2Points.b4.z;
                    } else {
                        state.model.box2Points.b4.z =
                            state.model.box2Points.f4.z +
                            state.model.boxPoints.t2.z -
                            state.model.boxPoints.f1.z;

                        state.model.box2Points.b1.z =
                            state.model.box2Points.b2.z =
                            state.model.box2Points.b3.z =
                                state.model.box2Points.b4.z;
                        if (state.time < 580) {
                            state.model.box2Points.f1.y = state.model.box2Points.f2.y -= 0.36;
                            state.model.box2Points.b1.y = state.model.box2Points.b2.y -= 0.36;
                            //state.model.box2Points.b2.x += .15;
                            //state.model.box2Points.b3.x += .15;
                            //state.model.box2Points.b1.x += .15;
                            //state.model.box2Points.b4.x += .15;
                            //state.model.box2Points.b4.y += .1;
                            //state.model.box2Points.b3.z += 1;
                            //state.model.box2Points.b4.z += 1;
                            //state.model.box2Points.b3.y = state.model.box2Points.b4.y += 0.25;
                            //state.model.box2Points.b1.y = state.model.box2Points.b2.y += 0.5;
                        }
                    }

                    //state.model.boxPoints.f3.y = state.model.boxPoints.f4.y -= 0.2;
                    //state.model.boxPoints.f1.y = state.model.boxPoints.f2.y -= 0.2;
                }

                if (state.time > 450) {
                    if (state.time < 500) settings.camera.y += 0.5;
                    if (state.time < 580) {
                        state.model.boxPoints.f4.y = state.model.boxPoints.f3.y += 0.36;
                        state.model.boxPoints.b2.y = state.model.boxPoints.b1.y += 0.36;
                        state.model.box3Points.f3.y =
                            state.model.box3Points.f4.y =
                            state.model.box3Points.b3.y =
                            state.model.box3Points.b4.y =
                                state.model.boxPoints.f4.y;
                        state.model.box4Points.f3.y =
                            state.model.box4Points.f4.y =
                            state.model.box4Points.b3.y =
                            state.model.box4Points.b4.y =
                                state.model.boxPoints.f4.y;
                    } else if (state.time < 660) {
                        settings.camera.y -= 0.1;
                        settings.camera.x -= 0.1;
                        state.model.box4Points.f1.x =
                            state.model.box4Points.b1.x =
                            state.model.box4Points.f4.x =
                            state.model.box4Points.b4.x -=
                                0.5;
                        state.model.box3Points.b1.z =
                            state.model.box3Points.b2.z =
                            state.model.box3Points.b3.z =
                            state.model.box3Points.b4.z +=
                                1.5;
                    }
                    if (state.time < 640) {
                        //settings.focalLength += 1;
                        state.model.b1TextOffsetVector.x += 0.15;
                        settings.camera.z -= 0.25;
                    }
                    if (state.model.box2Points.f3.x > state.model.boxPoints.f3.x - 3) {
                        state.model.box2Points.f2.x = state.model.box2Points.f3.x -= 0.02;
                        state.model.box2Points.b2.x = state.model.box2Points.b3.x -= 0.02;
                        state.model.box2Points.f1.x = state.model.box2Points.f4.x += 0.02;
                        state.model.box2Points.b1.x = state.model.box2Points.b4.x += 0.02;
                        state.model.box2Points.f2.z = state.model.box2Points.f1.z += 0.02;
                        state.model.box2Points.b2.z = state.model.box2Points.b1.z += 0.02;
                        state.model.box2Points.f3.z = state.model.box2Points.f4.z -= 0.02;
                        state.model.box2Points.b3.z = state.model.box2Points.b4.z -= 0.02;
                        //console.log("x:" + state.model.box2Points.f1.x);
                        timer.updateBoundValues();
                    }
                    if (state.model.horizon.e.x < Math.abs(state.model.horizon.s.x) + 100) {
                        state.model.horizon.e.x += 3;
                    }
                    if (state.model.box2Points.f3.z > state.model.boxPoints.f3.z + 3) {
                        state.model.box2Points.f1.z =
                            state.model.box2Points.f2.z =
                            state.model.box2Points.f3.z =
                            state.model.box2Points.f4.z -=
                                2;
                        state.model.box2Points.b1.z =
                            state.model.box2Points.b2.z =
                            state.model.box2Points.b3.z =
                            state.model.box2Points.b4.z -=
                                2;
                    } else {
                        state.model.box2Points.f1.z =
                            state.model.box2Points.f2.z =
                            state.model.box2Points.f3.z =
                            state.model.box2Points.f4.z =
                                state.model.boxPoints.f3.z + 3;
                        state.model.box2Points.b1.z =
                            state.model.box2Points.b2.z =
                            state.model.box2Points.b3.z =
                            state.model.box2Points.b4.z =
                                state.model.boxPoints.b2.z - 3;
                    }

                    if (
                        state.time > 590 &&
                        state.model.detailPoints.box1frontLeft.y +
                            state.model.detailVectors.box1first.y <
                            state.model.detailPoints.box1backRight.y
                    ) {
                        state.model.detailVectors.box1first.y += 1;
                    } else if (state.time > 590) {
                        state.model.detailVectors.box1first.y =
                            state.model.detailPoints.box1backRight.y -
                            state.model.detailPoints.box1frontLeft.y;
                        if (
                            state.model.detailPoints.box1frontLeft.x +
                                state.model.detailVectors.box1first.x <
                            state.model.detailPoints.box1backRight.x
                        ) {
                            state.model.detailVectors.box1first.x += 0.5;
                        } else {
                            state.model.detailVectors.box1first.x =
                                state.model.detailPoints.box1backRight.x -
                                state.model.detailPoints.box1frontLeft.x;
                        }
                    }

                    //state.model.box2Points.f3.x -= 0.24;
                    //state.model.box2Points.f3.z -= 0.24;

                    //state.model.box2Points.b3.x = state.model.box2Points.b2.x -= 0.24;

                    //state.model.boxPoints.f2.y = state.model.boxPoints.f1.y += 0.05;
                    //state.model.box2Points.b2.y = state.model.box2Points.b1.y += 0.05;

                    //state.model.box2Points.f4.x = state.model.box2Points.f1.x -= 0.36;
                    //state.model.box2Points.b4.x = state.model.box2Points.b1.x -= 0.36;
                    //}
                }

                // Set UI Stuff
                if (state.time == settings.endStep - 100) {
                    ui.init();
                }

                // Exit
                if (state.time >= settings.endStep) {
                    timer.clear();
                    state.introAnimComplete = true;
                }
            },
            updateBoundValues: function () {
                // Inner Box
                state.model.detailPoints.box1frontLeft = {
                    x: state.model.box2Points.f1.x,
                    y: state.model.boxPoints.f1.y + 3,
                    z: state.model.box2Points.f1.z,
                };
                state.model.detailPoints.box1backRight = {
                    x: state.model.box2Points.f3.x,
                    y: state.model.boxPoints.f3.y - 3,
                    z: state.model.box2Points.f3.z,
                };
                state.model.detailPoints.box1frontRight = {
                    x: state.model.box2Points.f2.x,
                    y: state.model.boxPoints.f2.y + 3,
                    z: state.model.box2Points.f2.z,
                };
            },
            clear: function () {
                clearInterval(timer.interval);
            },
        };

        var ui = {
            init: function () {
                // Get time + apply color to BG.
                var time = new Date();
                time = time.getHours();
                if (time > 17) {
                    document.body.className += " night";
                }

                ui.setUI();
                document.body.className += " introcomplete";
            },
            setUI: function () {
                // state.ce.locationLabel.style.left = utility.percentDim(utility.point2DFrom3D(["box3Points", "b2"]), X) + 10 + 'px';
                // state.ce.locationLabel.style.top  = utility.percentDim(["horizon", "e"], Y) - 25 + 'px';
                // state.ce.container.style.width = canvas.width + "px";
                // state.ce.container.style.height = canvas.height + "px";

                var offsetWidth = 60;
                // if (window.innerWidth >= 400) offsetWidth = 40;
                var leftDistance = utility.percentDim(
                    utility.point2DFrom3D(["box3Points", "b2"]),
                    X
                );
                if (!isNaN(leftDistance)) {
                    state.ce.menu.style.left = leftDistance + offsetWidth + "px";
                }
                state.ce.menu.style.top =
                    utility.percentDim(["horizon", "e"], Y) +
                    1 /* - 4 - state.ce.menu.offsetHeight */ +
                    "px";

                state.ce.latestItems.style.left = state.ce.menu.style.left;
                state.ce.latestItems.style.top =
                    parseInt(state.ce.menu.style.top) - state.ce.latestItems.offsetHeight + "px";
                /*
            state.ce.pageTitle.style.top  = utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), Y) - state.ce.pageTitle.offsetHeight - 15 + 'px';
            state.ce.pageTitle.style.left = utility.percentDim(utility.point2DFrom3D(["detailPoints", "box1frontLeft"]), X) + 15 + 'px';
            */
            },
        };

        function onCanvasClick() {
            // Speed up anim if running.
            if (state.introAnimComplete) return;
            ui.init();
            timer.clear();
            timer.interval = setInterval(timer.tFunc, settings.logicRefreshRate / 300);
        }

        // Initialize

        // TODO:
        // Just figure out position based on time delta.
        // This code is like 10yrs old tho so prly no reason to..
        timer.interval = setInterval(timer.tFunc, settings.logicRefreshRate); // Logic timer
        canvas.addEventListener("mousemove", utility.setMouseCoords, false);
        canvas.addEventListener("click", onCanvasClick);

        return function cleanup() {
            canvas.removeEventListener("mousemove", utility.setMouseCoords);
            canvas.removeEventListener("click", onCanvasClick);
            window.removeEventListener("resize", resizeFunc);
        };
    })();
}

export const cleanupVizScript = () => {};

export const VizScript = ({ children }) => {
    useEffect(() => {
        const cleanupScript = vizScript();
        return cleanupScript;
    }, []);
    return children;
};