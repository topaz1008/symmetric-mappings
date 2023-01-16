const VIEW_WIDTH = 1280,
    VIEW_HEIGHT = 720;

const canvas = document.getElementById('main'),
    context = canvas.getContext('2d');

canvas.width = VIEW_WIDTH;
canvas.height = VIEW_HEIGHT;

const HALF_WIDTH = VIEW_WIDTH / 2,
    HALF_HEIGHT = VIEW_HEIGHT / 2;

let lastTime = Date.now();

requestAnimationFrame(update);

// The 'Symmetric Mappings' of Field & Golubitsky
// defined by
const lambda = 1.52,
    alpha = -1,
    beta = 0.1,
    gamma = -0.8;

const n = new Complex(3);
const Z = new Complex({ re: 0.1, im: -0.1 });

function f(z) {
    const right = ((z.conjugate()).pow(n.sub(1))).mul(gamma);
    const left = z.mul((lambda + alpha * Math.pow(z.abs(), 2) + beta * (z.pow(n).re)));

    return left.add(right);
}

/**
 * Gives a list of the results of applying f to expr 0 through iterations times.
 *
 * e.g. nestList(f, x, 4) -> [x, f(x), f(f(x)), f(f(f(x))), f(f(f(f(x))))]
 *
 * @param f
 * @param expr
 * @param iterations
 * @returns {*[]}
 */
function nestList(f, expr, iterations) {
    const result = [];

    result.push(expr);
    for (let i = 1; i < iterations; i++) {
        result.push(f(result[i - 1]));
    }

    return result;
}

const points = nestList(f, Z, 10000);

/**
 * Update loop
 */
function update(time) {
    // Real time passed since the last call to this function
    const deltaTime = (Date.now() - lastTime) / 1000;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(HALF_WIDTH, HALF_HEIGHT);
    context.clearRect(-HALF_WIDTH, -HALF_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT);

    context.fillStyle = '#ffffff';

    for (let i = 0; i < points.length; i++) {
        const p = points[i];

        context.beginPath();
        context.arc(p.re * 100, p.im * 100, 1, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    lastTime = Date.now();

    requestAnimationFrame(update);
}
