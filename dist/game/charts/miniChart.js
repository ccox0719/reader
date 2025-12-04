const GRID_COLOR = "rgba(255, 255, 255, 0.08)";
const LINE_COLOR = "#4FC3F7";
const FILL_COLOR = "rgba(79, 195, 247, 0.1)";
const POINT_COLOR = "#4FC3F7";
const prepareCanvas = (canvas) => {
    const ratio = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || canvas.width;
    const displayHeight = canvas.clientHeight || canvas.height;
    canvas.width = Math.max(1, Math.floor(displayWidth * ratio));
    canvas.height = Math.max(1, Math.floor(displayHeight * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return null;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx, width: displayWidth, height: displayHeight };
};
export const drawSparkline = (canvas, values) => {
    const prepared = prepareCanvas(canvas);
    if (!prepared || values.length === 0) {
        return;
    }
    const { ctx, width, height } = prepared;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(0.1, max - min);
    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (let i = 0; i <= 3; i += 1) {
        const y = (height / 3) * i;
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    values.forEach((value, index) => {
        const normalized = (value - min) / range;
        const x = (index / (values.length - 1 || 1)) * width;
        const y = height - normalized * height;
        if (index === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    ctx.fillStyle = FILL_COLOR;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = POINT_COLOR;
    values.forEach((value, index) => {
        const normalized = (value - min) / range;
        const x = (index / (values.length - 1 || 1)) * width;
        const y = height - normalized * height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
};
export const drawPieChart = (canvas, segments, emptyLabel = "No holdings") => {
    const prepared = prepareCanvas(canvas);
    if (!prepared)
        return;
    const { ctx, width, height } = prepared;
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    ctx.clearRect(0, 0, width, height);
    if (total === 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(emptyLabel, width / 2, height / 2 + 3);
        return;
    }
    const radius = Math.min(width, height) / 2 - 5;
    const centerX = width / 2;
    const centerY = height / 2;
    let startAngle = -Math.PI / 2;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    for (const segment of segments) {
        const slice = (segment.value / total) * Math.PI * 2;
        const endAngle = startAngle + slice;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = segment.color;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.restore();
        ctx.stroke();
        startAngle = endAngle;
    }
};
