const getData = (min, max, count) => {
    return Array.from(
        {
            length: count,
        },
        () => Math.floor(Math.random() * (max - min) + min)
    );
};
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
(function (H) {
    function clamp(value, min, max) {
        return value > min ? (value < max ? value : max) : min;
    }
    H.wrap(
        H.layouts["reingold-fruchterman"].prototype,
        "applyLimitBox",
        function (proceed, node, box) {
            var radius = node.radius;
            function getDist(a, b) {
                let y = b.plotX - a.plotX;
                let x = b.plotY - a.plotY;
                return Math.sqrt(x * x + y * y);
            }
            function getTriangleArea(a, b, c) {
                const side1 = getDist(a, b),
                    side2 = getDist(b, c),
                    side3 = getDist(a, c);
                // calculate the semi-perimeter
                const s = (side1 + side2 + side3) / 2;
                //calculate the area
                const areaValue = Math.sqrt(
                    s * (s - side1) * (s - side2) * (s - side3)
                );
                return areaValue;
            }
            function insideTriangle(p, a, b, c) {
                triangleArea = getTriangleArea(a, b, c);
                areaSum = 0;
                areaSum += getTriangleArea(a, b, p);
                areaSum += getTriangleArea(a, c, p);
                areaSum += getTriangleArea(b, c, p);
                if (Math.abs(Math.floor(triangleArea) - Math.floor(areaSum)) <= 1) {
                    return true;
                }
                return false;
            }
            let h = box.height,
                m = box.width / 2; // length of half of base
            h = Math.min(h, 2 * m);
            m = Math.min(m, h / 2)
                halfOfBase = {
                    plotX: box.width / 2,
                    plotY: h,
                },
                tA = {
                    // left bottom corner
                    plotX: halfOfBase.plotX - m,
                    plotY: h,
                },
                tB = {
                    // right bottom corner
                    plotX: halfOfBase.plotX + m,
                    plotY: h,
                },
                tC = {
                    // middle top corner
                    plotX: halfOfBase.plotX,
                    plotY: 0,
                };
            let a = node.plotX - tA.plotX;
            if (node.plotX > halfOfBase.plotX) {
                a = tB.plotX - node.plotX;
            }
            const b = (a * h) / m,
                D = {
                    plotX: node.plotX,
                    plotY: h - b,
                };
            if (!insideTriangle(node, tA, tB, tC)) {
                const A = (tA.plotY - tC.plotY) / (tA.plotX - tC.plotX),
                    B = -1,
                    C =
                        tA.plotY -
                        ((tA.plotY - tC.plotY) / (tA.plotX - tC.plotX)) *
                            tA.plotX,
                    rightA = (tB.plotY - tC.plotY) / (tB.plotX - tC.plotX),
                    rightB = -1,
                    rightC =
                        tB.plotY -
                        ((tB.plotY - tC.plotY) / (tB.plotX - tC.plotX)) *
                            tB.plotX;
                const pL =
                        Math.abs(A * node.plotX + B * node.plotY + C) /
                        Math.sqrt(A * A + B * B),
                    rightpL =
                        Math.abs(
                            rightA * node.plotX + rightB * node.plotY + rightC
                        ) / Math.sqrt(rightA * rightA + rightB * rightB);
                let pX, pY;
                if (node.plotY > h) {
                    node.plotY = clamp(
                        node.plotY,
                        tC.plotY,
                        h
                    );
                }
                else if (pL < rightpL) {
                    let dY = a * (pL) / Math.sqrt(a*a + b*b);
                    let dX = b * (pL) / Math.sqrt(a*a + b*b);
                    pY = node.plotY + dY;
                    pX = node.plotX + dX;
                    // Limit X-coordinates:
                    node.plotX = clamp(
                        node.plotX,
                        pX,
                        tB.plotX + radius
                    );
                    node.plotY = clamp(
                        node.plotY,
                        pY, 
                        tB.plotY + radius
                    );
                } else {
                    let dY = a * (rightpL) / Math.sqrt(a*a + b*b);
                    let dX = b * (rightpL) / Math.sqrt(a*a + b*b);
                    pY = node.plotY + dY;
                    pX = node.plotX - dX;
                    // Limit X-coordinates:
                    node.plotX = clamp(
                        node.plotX,
                        tA.plotX + radius,
                        pX
                    );
                    node.plotY = clamp(
                        node.plotY,
                        pY, 
                        tB.plotY + radius
                    );
                }
                // Limit X-coordinates:
                node.plotX = clamp(
                    node.plotX,
                    tA.plotX + radius,
                    tB.plotX + radius
                );
                // Limit Y-coordinates:
                node.plotY = clamp(node.plotY, tC.plotY + radius, h);
            }
        }
    );
})(Highcharts);
Highcharts.chart("container", {
    chart: {
        type: "packedbubble",
        height: 1000
    },
    plotOptions: {
        packedbubble: {
            minSize: "10%",
            maxSize: '90%',
            layoutAlgorithm: {
                gravitationalConstant: 0.002
            }
        },
    },
    series: [
        {
            data: getData(1, 50, 300),
        },
    ],
});