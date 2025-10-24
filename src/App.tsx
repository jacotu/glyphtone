/*****************************
 * HALFTONE GLYPH GENERATOR
 * Web version by AI
 * Original by: Sofia Salvatori
 * License: GPL-3.0
 ******************************/

import { useState, useRef } from 'react';
import { HalftoneGenerator } from './components/HalftoneGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';
import { Switch } from './components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Upload, Download, Settings2, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { Separator } from './components/ui/separator';

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [glyphs, setGlyphs] = useState('inserthereyourtext');
  const [tileSize, setTileSize] = useState(20);
  const [fontName, setFontName] = useState('Arial');
  const [uploadedFonts, setUploadedFonts] = useState<string[]>([]);
  const [whiteOnBlack, setWhiteOnBlack] = useState(true);
  const [isGenerated, setIsGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Advanced settings
  const [customColors, setCustomColors] = useState(false);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(0);
  const [invertImage, setInvertImage] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [textStroke, setTextStroke] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [opacity, setOpacity] = useState(100);
  const [minGlyphSize, setMinGlyphSize] = useState(0);
  const [randomizeGlyphs, setRandomizeGlyphs] = useState(false);
  const [sizeRandomness, setSizeRandomness] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [skewX, setSkewX] = useState(0);
  const [rotationRandomness, setRotationRandomness] = useState(0);
  const [positionNoise, setPositionNoise] = useState(0);

  const baseFonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Palatino',
  ];

  const fonts = [...uploadedFonts, ...baseFonts];

  const glyphPresets = [
    { name: 'Custom', value: glyphs },
    { name: 'Circles', value: '●○◐◑◒◓◔◕' },
    { name: 'Squares', value: '█▓▒░' },
    { name: 'Lines', value: '|||//\\\\' },
    { name: 'Numbers', value: '0123456789' },
    { name: 'Letters', value: 'abcdefghijklmnopqrstuvwxyz' },
    { name: 'Symbols', value: '@#$%&*+=~' },
    { name: 'Dots', value: '·•●⬤' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setIsGenerated(false);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'halftone-glyph-output.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const inferredName = file.name.replace(/\.(woff2?|ttf|otf)$/i, '') || 'CustomFont';
      const font = new FontFace(inferredName, arrayBuffer);
      await font.load();
      (document as any).fonts.add(font);
      setUploadedFonts((prev) => Array.from(new Set([inferredName, ...prev])));
      setFontName(inferredName);
    } catch (err) {
      console.error('Failed to load font', err);
    } finally {
      // reset input so the same file can be uploaded again if needed
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#E8F7F6' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: '#095D65' }}>
            Glyphtone made by{' '}
            <a
              href="https://www.are.na/daniel-tulchinsky/channels"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center"
              aria-label="Open Jacotu channel"
            >
              Jacotu
              <img
                src="/Jacotu Emoji/jacotu.png"
                alt=""
                aria-hidden="true"
                style={{ height: '1.5em', width: 'auto', marginLeft: '0.35em' }}
              />
            </a>
          </h1>
          <p className="text-gray-600">
            Transform your images into artistic halftone text compositions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls Panel */}
          <Card 
            className="shadow-lg lg:sticky lg:top-8"
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 4rem)',
              overflow: 'hidden'
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#095D65' }}>Configuration</CardTitle>
              <CardDescription>Customize your halftone glyph artwork</CardDescription>
            </CardHeader>
            <CardContent 
              className="space-y-6"
              style={{
                flex: 1,
                overflowY: 'auto',
                minHeight: 0
              }}
            >
              {/* Image Upload */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <Label htmlFor="image-upload">Upload Image</Label>
                <label 
                  htmlFor="image-upload" 
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#095D65' }}
                >
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <Upload className="w-7 h-7 mb-2" style={{ color: '#095D65' }} />
                    <p className="mb-1 text-xs font-medium" style={{ color: '#095D65' }}>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[10px] text-gray-500 mb-2">PNG, JPG, GIF, WEBP (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imageFile && (
                  <p className="text-xs text-gray-600 bg-white px-3 py-2 rounded border border-gray-200">
                    Selected: <span className="font-medium">{imageFile.name}</span>
                  </p>
                )}
              </div>

              {/* Glyphs Input */}
              <div className="space-y-2">
                <Label htmlFor="glyphs">Text Characters</Label>
                <Input
                  id="glyphs"
                  type="text"
                  value={glyphs}
                  onChange={(e) => setGlyphs(e.target.value || 'a')}
                  placeholder="Enter characters to use"
                />
                <p className="text-sm text-gray-500">Characters used to draw the image</p>
              </div>

              {/* Font Selection */}
              <div className="space-y-2">
                <Label htmlFor="font">Font Family</Label>
                <Select
                  value={fontName}
                  onValueChange={setFontName}
                >
                  <SelectTrigger id="font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    id="font-upload"
                    type="file"
                    accept=".woff,.woff2,.ttf,.otf"
                    onChange={handleFontUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="font-upload" className="cursor-pointer">Upload Font</label>
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Upload custom font files (.ttf, .otf, .woff, .woff2) to use in your halftone artwork.</p>
              </div>

              {/* Tile Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tile-size">Tile Size</Label>
                  <span className="text-sm text-gray-600 inline-block w-[52px] text-right">{tileSize}px</span>
                </div>
                <Slider
                  id="tile-size"
                  min={5}
                  max={100}
                  step={1}
                  value={[tileSize]}
                  onValueChange={(value) => setTileSize(value[0])}
                />
                <p className="text-sm text-gray-500">Size of the largest character (5-100px)</p>
              </div>

              {/* Color Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="color-mode">Color Mode</Label>
                  <p className="text-sm text-gray-500">
                    {whiteOnBlack ? 'White on black' : 'Black on white'}
                  </p>
                </div>
                <Switch
                  id="color-mode"
                  checked={whiteOnBlack}
                  onCheckedChange={setWhiteOnBlack}
                  disabled={customColors}
                />
              </div>

              <Separator />

              {/* Advanced Settings */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4" />
                      <span>Advanced Settings</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    {/* Glyph Presets */}
                    <div className="space-y-2">
                      <Label>Glyph Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {glyphPresets.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => preset.name !== 'Custom' && setGlyphs(preset.value)}
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Custom Colors */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="custom-colors">Custom Colors</Label>
                          <p className="text-sm text-gray-500">Use custom color scheme</p>
                        </div>
                        <Switch
                          id="custom-colors"
                          checked={customColors}
                          onCheckedChange={setCustomColors}
                        />
                      </div>

                      {customColors && (
                        <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-purple-200">
                          <div className="space-y-2">
                            <Label htmlFor="text-color">
                              <Palette className="w-3 h-3 inline mr-1" />
                              Text Color
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="text-color"
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bg-color">
                              <Palette className="w-3 h-3 inline mr-1" />
                              Background
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="bg-color"
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Image Adjustments */}
                    <div className="space-y-4">
                      <h4 className="text-sm" style={{ color: '#095D65' }}>Image Adjustments</h4>
                      
                      {/* Contrast */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="contrast">Contrast</Label>
                          <span className="text-sm text-gray-600">{contrast}%</span>
                        </div>
                        <Slider
                          id="contrast"
                          min={0}
                          max={200}
                          step={1}
                          value={[contrast]}
                          onValueChange={(value) => setContrast(value[0])}
                        />
                      </div>

                      {/* Brightness */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="brightness">Brightness</Label>
                          <span className="text-sm text-gray-600">{brightness}%</span>
                        </div>
                        <Slider
                          id="brightness"
                          min={0}
                          max={200}
                          step={1}
                          value={[brightness]}
                          onValueChange={(value) => setBrightness(value[0])}
                        />
                      </div>

                      {/* Saturation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="saturation">Saturation</Label>
                          <span className="text-sm text-gray-600">{saturation}%</span>
                        </div>
                        <Slider
                          id="saturation"
                          min={0}
                          max={200}
                          step={1}
                          value={[saturation]}
                          onValueChange={(value) => setSaturation(value[0])}
                        />
                      </div>

                      {/* Invert */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="invert">Invert Image</Label>
                        <Switch
                          id="invert"
                          checked={invertImage}
                          onCheckedChange={setInvertImage}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Text Effects */}
                    <div className="space-y-4">
                      <h4 className="text-sm" style={{ color: '#095D65' }}>Text Effects</h4>

                      {/* Opacity */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="opacity">Opacity</Label>
                          <span className="text-sm text-gray-600">{opacity}%</span>
                        </div>
                        <Slider
                          id="opacity"
                          min={0}
                          max={100}
                          step={1}
                          value={[opacity]}
                          onValueChange={(value) => setOpacity(value[0])}
                        />
                      </div>

                      {/* Letter Spacing */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="letter-spacing">Letter Spacing</Label>
                          <span className="text-sm text-gray-600">{letterSpacing}%</span>
                        </div>
                        <Slider
                          id="letter-spacing"
                          min={0}
                          max={100}
                          step={5}
                          value={[letterSpacing]}
                          onValueChange={(value) => setLetterSpacing(value[0])}
                        />
                        <p className="text-xs text-gray-500">Add space between characters</p>
                      </div>

                      {/* Rotation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="rotation">Rotation</Label>
                          <span className="text-sm text-gray-600">{rotation}°</span>
                        </div>
                        <Slider
                          id="rotation"
                          min={0}
                          max={360}
                          step={1}
                          value={[rotation]}
                          onValueChange={(value) => setRotation(value[0])}
                        />
                      </div>

                      {/* Text Stroke */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="text-stroke">Text Outline</Label>
                          <span className="text-sm text-gray-600">{textStroke}px</span>
                        </div>
                        <Slider
                          id="text-stroke"
                          min={0}
                          max={5}
                          step={0.5}
                          value={[textStroke]}
                          onValueChange={(value) => setTextStroke(value[0])}
                        />
                        {textStroke > 0 && (
                          <div className="flex gap-2 items-center">
                            <Label htmlFor="stroke-color" className="text-xs">Outline Color:</Label>
                            <Input
                              id="stroke-color"
                              type="color"
                              value={strokeColor}
                              onChange={(e) => setStrokeColor(e.target.value)}
                              className="w-12 h-8 p-1 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    <Separator />

                    {/* Glyph Rendering */}
                    <div className="space-y-4">
                      <h4 className="text-sm" style={{ color: '#095D65' }}>Glyph Rendering</h4>

                      {/* Min Glyph Size */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="min-glyph">Minimum Glyph Size</Label>
                          <span className="text-sm text-gray-600">{minGlyphSize}px</span>
                        </div>
                        <Slider
                          id="min-glyph"
                          min={0}
                          max={20}
                          step={1}
                          value={[minGlyphSize]}
                          onValueChange={(value) => setMinGlyphSize(value[0])}
                        />
                        <p className="text-xs text-gray-500">Skip glyphs smaller than this size</p>
                      </div>

                      {/* Size Randomness */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="size-randomness">Size Randomness</Label>
                          <span className="text-sm text-gray-600">{sizeRandomness}%</span>
                        </div>
                        <Slider
                          id="size-randomness"
                          min={0}
                          max={100}
                          step={5}
                          value={[sizeRandomness]}
                          onValueChange={(value) => setSizeRandomness(value[0])}
                        />
                        <p className="text-xs text-gray-500">Add random variation to glyph sizes</p>
                      </div>

                      {/* Randomize */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="randomize">Randomize Glyphs</Label>
                          <p className="text-xs text-gray-500">Pick random characters instead of sequential</p>
                        </div>
                        <Switch
                          id="randomize"
                          checked={randomizeGlyphs}
                          onCheckedChange={setRandomizeGlyphs}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Effects & Transformations */}
                    <div className="space-y-4">
                      <h4 className="text-sm" style={{ color: '#095D65' }}>Effects & Transformations</h4>

                      {/* Threshold */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threshold">Brightness Threshold</Label>
                          <span className="text-sm text-gray-600">{threshold}%</span>
                        </div>
                        <Slider
                          id="threshold"
                          min={0}
                          max={100}
                          step={1}
                          value={[threshold]}
                          onValueChange={(value) => setThreshold(value[0])}
                        />
                        <p className="text-xs text-gray-500">Hide glyphs below this brightness level</p>
                      </div>

                      {/* Position Noise */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="position-noise">Position Noise</Label>
                          <span className="text-sm text-gray-600">{positionNoise}px</span>
                        </div>
                        <Slider
                          id="position-noise"
                          min={0}
                          max={20}
                          step={1}
                          value={[positionNoise]}
                          onValueChange={(value) => setPositionNoise(value[0])}
                        />
                        <p className="text-xs text-gray-500">Random position offset for each glyph</p>
                      </div>

                      {/* Rotation Randomness */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="rotation-randomness">Rotation Randomness</Label>
                          <span className="text-sm text-gray-600">{rotationRandomness}°</span>
                        </div>
                        <Slider
                          id="rotation-randomness"
                          min={0}
                          max={180}
                          step={5}
                          value={[rotationRandomness]}
                          onValueChange={(value) => setRotationRandomness(value[0])}
                        />
                        <p className="text-xs text-gray-500">Random rotation for each glyph</p>
                      </div>

                      {/* Skew X */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="skew-x">Horizontal Skew</Label>
                          <span className="text-sm text-gray-600">{skewX}°</span>
                        </div>
                        <Slider
                          id="skew-x"
                          min={-45}
                          max={45}
                          step={1}
                          value={[skewX]}
                          onValueChange={(value) => setSkewX(value[0])}
                        />
                        <p className="text-xs text-gray-500">Italic/slant effect for all glyphs</p>
                      </div>

                      {/* Shadow */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="shadow-blur">Text Shadow</Label>
                          <span className="text-sm text-gray-600">{shadowBlur}px</span>
                        </div>
                        <Slider
                          id="shadow-blur"
                          min={0}
                          max={20}
                          step={1}
                          value={[shadowBlur]}
                          onValueChange={(value) => setShadowBlur(value[0])}
                        />
                        
                        {shadowBlur > 0 && (
                          <div className="pl-4 border-l-2 border-purple-200 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label htmlFor="shadow-x" className="text-xs">Offset X</Label>
                                <div className="flex items-center gap-2">
                                  <Slider
                                    id="shadow-x"
                                    min={-20}
                                    max={20}
                                    step={1}
                                    value={[shadowOffsetX]}
                                    onValueChange={(value) => setShadowOffsetX(value[0])}
                                  />
                                  <span className="text-xs text-gray-600 w-8">{shadowOffsetX}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="shadow-y" className="text-xs">Offset Y</Label>
                                <div className="flex items-center gap-2">
                                  <Slider
                                    id="shadow-y"
                                    min={-20}
                                    max={20}
                                    step={1}
                                    value={[shadowOffsetY]}
                                    onValueChange={(value) => setShadowOffsetY(value[0])}
                                  />
                                  <span className="text-xs text-gray-600 w-8">{shadowOffsetY}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Label htmlFor="shadow-color" className="text-xs">Shadow Color:</Label>
                              <Input
                                id="shadow-color"
                                type="color"
                                value={shadowColor}
                                onChange={(e) => setShadowColor(e.target.value)}
                                className="w-12 h-8 p-1 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={shadowColor}
                                onChange={(e) => setShadowColor(e.target.value)}
                                className="flex-1 text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                className="w-full"
                disabled={!imageUrl}
              >
                Generate Halftone
              </Button>

              {/* Download Button */}
              {isGenerated && (
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="shadow-lg lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] flex flex-col">
            <CardHeader>
              <CardTitle style={{ color: '#095D65' }}>Preview</CardTitle>
              <CardDescription>Your halftone glyph artwork</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Generated</TabsTrigger>
                  <TabsTrigger value="original">Original</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4 flex-1 overflow-hidden">
                  <div className="bg-gray-100 rounded-lg p-4 h-full flex items-center justify-center overflow-hidden" style={{ minHeight: '500px' }}>
                    {!imageUrl ? (
                      <p className="text-gray-400 text-center text-lg">Upload an image to begin</p>
                    ) : !isGenerated ? (
                      <p className="text-gray-400 text-center text-lg">Click "Generate Halftone" to create your artwork</p>
                    ) : (
                      <HalftoneGenerator
                        imageUrl={imageUrl}
                        glyphs={glyphs}
                        tileSize={tileSize}
                        fontName={fontName}
                        whiteOnBlack={whiteOnBlack}
                        canvasRef={canvasRef}
                        customColors={customColors}
                        textColor={textColor}
                        backgroundColor={backgroundColor}
                        contrast={contrast}
                        brightness={brightness}
                        saturation={saturation}
                        invertImage={invertImage}
                        letterSpacing={letterSpacing}
                        rotation={rotation}
                        textStroke={textStroke}
                        strokeColor={strokeColor}
                        opacity={opacity}
                        minGlyphSize={minGlyphSize}
                        randomizeGlyphs={randomizeGlyphs}
                        sizeRandomness={sizeRandomness}
                        threshold={threshold}
                        shadowBlur={shadowBlur}
                        shadowOffsetX={shadowOffsetX}
                        shadowOffsetY={shadowOffsetY}
                        shadowColor={shadowColor}
                        skewX={skewX}
                        rotationRandomness={rotationRandomness}
                        positionNoise={positionNoise}
                      />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="original" className="mt-4 flex-1 overflow-hidden">
                  <div className="bg-gray-100 rounded-lg p-4 h-full flex items-center justify-center overflow-auto">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Original" 
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    ) : (
                      <p className="text-gray-400 text-center">No image uploaded</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle style={{ color: '#095D65' }}>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 style={{ color: '#095D65' }}>
                  <span className="block">1. Image Processing</span>
                  <span className="block">Converts to grayscale</span>
                </h3>
              </div>
              <div>
                <h3 style={{ color: '#095D65' }}>
                  <span className="block">2. Brightness Analysis</span>
                  <span className="block">Maps to character sizes</span>
                </h3>
              </div>
              <div>
                <h3 style={{ color: '#095D65' }}>
                  <span className="block">3. Text Rendering</span>
                  <span className="block">Creates halftone effect</span>
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
