import { useEffect, useRef } from 'react';

interface HalftoneGeneratorProps {
  imageUrl: string;
  glyphs: string;
  tileSize: number;
  fontName: string;
  whiteOnBlack: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  customColors: boolean;
  textColor: string;
  backgroundColor: string;
  contrast: number;
  brightness: number;
  saturation: number;
  invertImage: boolean;
  letterSpacing: number;
  rotation: number;
  textStroke: number;
  strokeColor: string;
  opacity: number;
  minGlyphSize: number;
  randomizeGlyphs: boolean;
  sizeRandomness: number;
  threshold: number;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  skewX: number;
  rotationRandomness: number;
  positionNoise: number;
}

export function HalftoneGenerator({
  imageUrl,
  glyphs,
  tileSize,
  fontName,
  whiteOnBlack,
  canvasRef,
  customColors,
  textColor,
  backgroundColor,
  contrast,
  brightness,
  saturation,
  invertImage,
  letterSpacing,
  rotation,
  textStroke,
  strokeColor,
  opacity,
  minGlyphSize,
  randomizeGlyphs,
  sizeRandomness,
  threshold,
  shadowBlur,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor,
  skewX,
  rotationRandomness,
  positionNoise,
}: HalftoneGeneratorProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imgRef.current = img;
      generateHalftone();
    };

    img.src = imageUrl;
  }, [
    imageUrl,
    glyphs,
    tileSize,
    fontName,
    whiteOnBlack,
    customColors,
    textColor,
    backgroundColor,
    contrast,
    brightness,
    saturation,
    invertImage,
    letterSpacing,
    rotation,
    textStroke,
    strokeColor,
    opacity,
    minGlyphSize,
    randomizeGlyphs,
    sizeRandomness,
    threshold,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowColor,
    skewX,
    rotationRandomness,
    positionNoise,
  ]);

  const applyImageAdjustments = (ctx: CanvasRenderingContext2D, imageData: ImageData) => {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply brightness
      const brightnessFactor = brightness / 100;
      r *= brightnessFactor;
      g *= brightnessFactor;
      b *= brightnessFactor;
      
      // Apply contrast
      const contrastFactor = contrast / 100;
      r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;
      
      // Apply saturation (for grayscale, we calculate it first)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const saturationFactor = saturation / 100;
      r = gray + (r - gray) * saturationFactor;
      g = gray + (g - gray) * saturationFactor;
      b = gray + (b - gray) * saturationFactor;
      
      // Convert to grayscale after adjustments
      const finalGray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Apply invert
      const invertedGray = invertImage ? 255 - finalGray : finalGray;
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, invertedGray));
      data[i + 1] = Math.max(0, Math.min(255, invertedGray));
      data[i + 2] = Math.max(0, Math.min(255, invertedGray));
    }
    
    return imageData;
  };

  const generateHalftone = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const sourceImg = imgRef.current;
    
    // Create a temporary canvas to process the image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;

    // Set temp canvas to original image size
    tempCanvas.width = sourceImg.width;
    tempCanvas.height = sourceImg.height;
    
    // Draw the original image
    tempCtx.drawImage(sourceImg, 0, 0);
    
    // Get image data and apply adjustments
    let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    imageData = applyImageAdjustments(tempCtx, imageData);
    tempCtx.putImageData(imageData, 0, 0);
    
    // Calculate downsized dimensions with letter spacing
    const gridWidth = Math.floor(sourceImg.width / tileSize);
    const gridHeight = Math.floor(sourceImg.height / tileSize);
    
    // Calculate effective tile size with letter spacing
    const spacingMultiplier = 1 + (letterSpacing / 100);
    const effectiveTileSize = tileSize * spacingMultiplier;
    
    // Create output canvas
    const canvas = canvasRef.current;
    canvas.width = gridWidth * effectiveTileSize;
    canvas.height = gridHeight * effectiveTileSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set background color
    const bgColor = customColors ? backgroundColor : (whiteOnBlack ? '#000000' : '#FFFFFF');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text color and opacity
    const fgColor = customColors ? textColor : (whiteOnBlack ? '#FFFFFF' : '#000000');
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = fgColor;
    
    // Set text stroke if enabled
    if (textStroke > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = textStroke;
    }
    
    // Set shadow if enabled
    if (shadowBlur > 0) {
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
      ctx.shadowColor = shadowColor;
    }
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    let glyphPosition = 0;
    
    // For each grid cell
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        // Sample the center pixel of this tile from the original image
        const sampleX = Math.floor((x * tileSize + tileSize / 2) * (sourceImg.width / (gridWidth * tileSize)));
        const sampleY = Math.floor((y * tileSize + tileSize / 2) * (sourceImg.height / (gridHeight * tileSize)));
        
        // Get pixel data
        const pixelData = tempCtx.getImageData(sampleX, sampleY, 1, 1).data;
        const pixelBrightness = pixelData[0]; // Already grayscale, so any channel works
        
        // Apply threshold - skip if below threshold
        const brightnessPercent = (pixelBrightness / 255) * 100;
        if (brightnessPercent < threshold) {
          if (!randomizeGlyphs) {
            glyphPosition = (glyphPosition + 1) % glyphs.length;
          }
          continue;
        }
        
        // Map brightness to glyph size
        let glyphSize;
        if (customColors) {
          // For custom colors, use brightness directly
          glyphSize = Math.round((pixelBrightness / 255) * tileSize);
        } else if (whiteOnBlack) {
          // White character is bigger when brightness is higher
          glyphSize = Math.round((pixelBrightness / 255) * tileSize);
        } else {
          // Black character is bigger when brightness is lower
          glyphSize = Math.round(((255 - pixelBrightness) / 255) * tileSize);
        }
        
        // Apply size randomness
        if (sizeRandomness > 0) {
          const randomFactor = 1 + ((Math.random() - 0.5) * 2 * (sizeRandomness / 100));
          glyphSize = Math.round(glyphSize * randomFactor);
          glyphSize = Math.max(0, Math.min(tileSize, glyphSize)); // Clamp to valid range
        }
        
        // Skip if size is too small
        if (glyphSize < minGlyphSize) {
          if (!randomizeGlyphs) {
            glyphPosition = (glyphPosition + 1) % glyphs.length;
          }
          continue;
        }
        
        // Get current character
        const character = randomizeGlyphs 
          ? glyphs.charAt(Math.floor(Math.random() * glyphs.length))
          : glyphs.charAt(glyphPosition);
        
        // Calculate position with letter spacing and position noise
        let xPos = x * effectiveTileSize;
        let yPos = y * effectiveTileSize;
        
        if (positionNoise > 0) {
          xPos += (Math.random() - 0.5) * 2 * positionNoise;
          yPos += (Math.random() - 0.5) * 2 * positionNoise;
        }
        
        // Save context for transformations
        ctx.save();
        
        // Move to position
        ctx.translate(xPos + effectiveTileSize / 2, yPos + effectiveTileSize / 2);
        
        // Apply skew
        if (skewX !== 0) {
          const skewRad = (skewX * Math.PI) / 180;
          ctx.transform(1, 0, Math.tan(skewRad), 1, 0, 0);
        }
        
        // Apply rotation (base rotation + random rotation)
        let totalRotation = rotation;
        if (rotationRandomness > 0) {
          totalRotation += (Math.random() - 0.5) * 2 * rotationRandomness;
        }
        if (totalRotation !== 0) {
          ctx.rotate((totalRotation * Math.PI) / 180);
        }
        
        // Move back
        ctx.translate(-(xPos + effectiveTileSize / 2), -(yPos + effectiveTileSize / 2));
        
        // Set font and draw character
        ctx.font = `${glyphSize}px "${fontName}"`;
        
        // Draw stroke if enabled
        if (textStroke > 0) {
          ctx.strokeText(character, xPos, yPos);
        }
        
        // Draw fill
        ctx.fillText(character, xPos, yPos);
        
        // Restore context
        ctx.restore();
        
        // Move to next character
        if (!randomizeGlyphs) {
          glyphPosition = (glyphPosition + 1) % glyphs.length;
        }
      }
    }
    
    // Reset global alpha
    ctx.globalAlpha = 1;
  };

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full h-auto rounded shadow-md"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
