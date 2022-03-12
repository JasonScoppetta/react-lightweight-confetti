import React from "react";

const _getRandRange = (min, max) => (max - min) * Math.random() + min;
const _getRandColor = () =>
  "#" + String(Math.floor(Math.random() * 16777215).toString(16));

const getColorsArray = (qt) => {
  const colors = [];
  for (let i = 0; i < qt; i++) {
    colors.push([_getRandColor(), _getRandColor()]);
  }
  return colors;
};

const Confetti = ({
  start = false,
  count = 500,
  gravity = 0.8,
  endVelocity = 10,
  drag = 0.075,
  confettiMaxWidth = 20,
  confettiMaxHeight = 30,
  confettiMinWidth = 10,
  confettiMinHeight = 10,
  explosionYForce = 50,
  explosionXForce = 50,
  colors: _colors = null,
  randomColors = 8,
}) => {
  const canvas = React.useRef();
  const [confetti, setConfetti] = React.useState([]);
  const [canvasContext, setCanvasContext] = React.useState(null);
  const [colors, setColors] = React.useState(
    _colors || getColorsArray(randomColors)
  );

  const getRandRange = React.useCallback(_getRandRange, []);

  const resizeCanvas = React.useCallback(() => {
    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;
  }, [canvas.current]);

  const getConfetti = React.useCallback(() => {
    const confetti = [];

    for (let i = 0; i < count; i++) {
      confetti.push({
        color: colors[Math.floor(getRandRange(0, colors.length - 1))],
        dimensions: {
          x: getRandRange(confettiMinWidth || 0, confettiMaxWidth || 0),
          y: getRandRange(confettiMinHeight || 0, confettiMaxHeight || 0),
        },
        position: {
          x: getRandRange(0, canvas.current.width),
          y: canvas.current.height,
        },
        rotation: getRandRange(0, 2.5 * Math.PI),
        scale: { x: 1, y: 1 },
        velocity: {
          x: getRandRange(-explosionXForce, explosionXForce),
          y: getRandRange(0, -explosionYForce),
        },
      });
    }

    return confetti;
  }, [canvas.current, colors, getRandRange]);

  const animate = () => {
    canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);

    confetti.forEach((piece, index) => {
      const w = piece.dimensions.x * piece.scale.x;
      const h = piece.dimensions.y * piece.scale.y;

      piece.position.x += piece.velocity.x;
      piece.position.y += piece.velocity.y;
      piece.velocity.x -= piece.velocity.x * drag;
      piece.velocity.y = Math.min(piece.velocity.y + gravity, endVelocity);
      piece.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

      piece.scale.y = Math.cos(piece.position.y * 0.1);
      canvasContext.fillStyle =
        piece.scale.y > 0 ? piece.color[0] : piece.color[1];

      canvasContext.translate(piece.position.x, piece.position.y);
      canvasContext.rotate(piece.rotation);
      canvasContext.fillRect(-w / 2, -h / 2, w, h);
      canvasContext.setTransform(1, 0, 0, 1, 0, 0);

      if (piece.position.x > canvas.current.width) piece.position.x = 0;
      if (piece.position.x < 0) piece.position.x = canvas.current.width;

      if (piece.position.y >= canvas.current.height) confetti.splice(index, 1);

      if (confetti.length === 0) {
        setConfetti([]);
      }
    });

    window.requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  React.useEffect(() => {
    setCanvasContext(canvas.current.getContext("2d"));
  }, [getConfetti]);

  React.useEffect(() => {
    if (confetti && confetti.length > 0 && canvas.current && start) {
      animate();
    }
  }, [canvas.current, start, confetti.length, colors.length]);

  React.useEffect(() => {
    if (colors.length > 0) setConfetti(start ? getConfetti() : []);
  }, [colors.length, setConfetti, start]);

  return <canvas ref={canvas} />;
};

export default Confetti;
