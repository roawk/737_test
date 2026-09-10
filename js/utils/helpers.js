/* ==========================================================================
   Utility Helpers (Date, Random Numbers, Canvas Exporter, Clipboard)
   ========================================================================== */

// Generate 4 unique random lucky numbers (1 to 99)
export function generateLuckyNumbers() {
  const set = new Set();
  while (set.size < 4) {
    set.add(Math.floor(Math.random() * 99) + 1);
  }
  return Array.from(set).sort((a, b) => a - b);
}

// Copy text to user clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

// Wrap text in HTML5 Canvas
export function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

// Export fortune card as downloadable PNG image
export function downloadCardCanvas(fortune) {
  if (!fortune) return;

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 600, 700);
  grad.addColorStop(0, '#fffdf8');
  grad.addColorStop(1, '#f4e9d6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 700);

  // Border & Ornament
  ctx.strokeStyle = '#9a651a';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 560, 660);
  ctx.strokeStyle = '#e0ceaa';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 548, 648);

  // Header Tag
  ctx.fillStyle = '#9a651a';
  ctx.font = 'bold 20px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`🥠 ${fortune.categoryName} 🥠`, 300, 80);

  // Quote Text
  ctx.fillStyle = '#21160a';
  ctx.font = 'bold 26px "Gowun Batang", serif';
  wrapCanvasText(ctx, `"${fortune.quote}"`, 300, 220, 480, 42);

  // Author
  ctx.fillStyle = '#9a651a';
  ctx.font = '500 20px "Noto Sans KR", sans-serif';
  ctx.fillText(`- ${fortune.author} -`, 300, 420);

  // Divider Line
  ctx.strokeStyle = '#e0ceaa';
  ctx.beginPath();
  ctx.moveTo(100, 470);
  ctx.lineTo(500, 470);
  ctx.stroke();

  // Lucky Details Section
  ctx.fillStyle = '#6e5a42';
  ctx.font = '18px "Noto Sans KR", sans-serif';
  ctx.fillText(`행운의 번호: ${fortune.luckyNums.join(', ')}`, 300, 520);
  ctx.fillText(`오늘의 컬러: ${fortune.colorName}`, 300, 555);
  ctx.fillText(`행운의 시각/방향: ${fortune.advice}`, 300, 590);

  // Footer Watermark
  ctx.fillStyle = '#a89cb8';
  ctx.font = '14px "Outfit", sans-serif';
  ctx.fillText('GOLDEN FORTUNE COOKIE', 300, 650);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `fortune-cookie-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
