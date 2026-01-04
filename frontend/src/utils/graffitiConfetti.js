import confetti from "canvas-confetti";

export function graffitiBurst() {
 const colors = [
  "#21bede",
  "#4ecbe4",
  "#1b98b1",
  "#147285",
  "#7ad8eb",
 ];

 confetti({
  particleCount: 120,
  spread: 80,
  origin: { y: 0.6 },
  colors,
  scalar: 1.2,
 });

 // Second burst (chaotic graffiti feel)
 setTimeout(() => {
  confetti({
   particleCount: 80,
   angle: 60,
   spread: 100,
   origin: { x: 0 },
   colors,
  });

  confetti({
   particleCount: 80,
   angle: 120,
   spread: 100,
   origin: { x: 1 },
   colors,
  });
 }, 120);
}
