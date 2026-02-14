import React, { useState, useRef, useContext } from 'react';
import { Upload, RotateCcw, ShoppingCart, Image as ImageIcon, Type, Move } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import tshirtMockup from '../assets/tshirt-front.jpg';

const TShirtDesigner = () => {
    const { addToCart } = useContext(ShopContext);
    const navigate = useNavigate();
    const [view, setView] = useState('front'); // 'front' or 'back'
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [designName, setDesignName] = useState('');
    const [tshirtColor, setTshirtColor] = useState('#000000'); // Default to Black since photo is black
    const [textColor, setTextColor] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [selectedSize, setSelectedSize] = useState('M');
    
    const [isAutoRotating, setIsAutoRotating] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedElement, setDraggedElement] = useState(null); // 'image' or 'text'
    const designerOverlayRef = useRef(null);
    
    // Position states
    const [frontImagePos, setFrontImagePos] = useState({ x: 50, y: 35 });
    const [backImagePos, setBackImagePos] = useState({ x: 50, y: 35 });
    const [frontTextPos, setFrontTextPos] = useState({ x: 50, y: 70 });
    const [backTextPos, setBackTextPos] = useState({ x: 50, y: 70 });
    
    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);

    // Draggable handlers
    const handleMouseDown = (e, type) => {
        if (isAutoRotating) return;
        setIsDragging(true);
        setDraggedElement(type);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !designerOverlayRef.current) return;

        const rect = designerOverlayRef.current.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;

        // Constraint within overlay
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        if (draggedElement === 'image') {
            if (view === 'front') setFrontImagePos({ x, y });
            else setBackImagePos({ x, y });
        } else if (draggedElement === 'text') {
            if (view === 'front') setFrontTextPos({ x, y });
            else setBackTextPos({ x, y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedElement(null);
    };

    const handleImageUpload = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (side === 'front') {
                    setFrontImage(reader.result);
                } else {
                    setBackImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setFrontImage(null);
        setBackImage(null);
        setFrontText('');
        setBackText('');
        setDesignName('');
        setTshirtColor('#000000');
        setTextColor('#ffffff');
        setFontSize(24);
        setSelectedSize('M');
        setFrontImagePos({ x: 50, y: 35 });
        setBackImagePos({ x: 50, y: 35 });
        setFrontTextPos({ x: 50, y: 70 });
        setBackTextPos({ x: 50, y: 70 });
        setIsAutoRotating(false);
        setIsDragging(false);
    };

    const handleAddToCart = () => {
        if (!frontImage && !backImage && !frontText && !backText) {
            alert('Please add at least one design (image or text)!');
            return;
        }

        const customProduct = {
            id: Date.now(),
            name: designName || 'Custom DTF T-Shirt',
            price: 3500,
            image: frontImage || backImage || tshirtMockup,
            description: `Custom ${tshirtColor === '#000000' ? 'Black' : 'White'} t-shirt (Size: ${selectedSize}) with personalized design`,
            category: 'Custom',
            size: selectedSize,
            customDesign: {
                front: frontImage,
                back: backImage,
                frontText,
                backText,
                color: tshirtColor,
                textColor,
                fontSize,
                fontFamily
            }
        };

        addToCart(customProduct);
        alert(`Custom design (Size: ${selectedSize}) added to cart!`);
        navigate('/cart');
    };

    const currentText = view === 'front' ? frontText : backText;
    const setCurrentText = view === 'front' ? setFrontText : setBackText;
    const currentImage = view === 'front' ? frontImage : backImage;
    const currentImagePos = view === 'front' ? frontImagePos : backImagePos;
    const setCurrentImagePos = view === 'front' ? setFrontImagePos : setBackImagePos;
    const currentTextPos = view === 'front' ? frontTextPos : backTextPos;
    const setCurrentTextPos = view === 'front' ? setFrontTextPos : setBackTextPos;

    // T-Shirt Component using the photo
    const TShirtBase = () => (
        <div className="tshirt-base-photo-container">
            <img 
                src={tshirtMockup} 
                alt="T-Shirt Base" 
                className="tshirt-base-photo"
                style={{ 
                    filter: tshirtColor === '#ffffff' ? 'invert(0.9) brightness(1.2)' : 'none' 
                }}
            />
        </div>
    );

    // Touch handlers for mobile
    const handleTouchStart = (e, type) => {
        if (isAutoRotating) return;
        setIsDragging(true);
        setDraggedElement(type);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !designerOverlayRef.current) return;
        // Use the first touch point
        const touch = e.touches[0];
        const rect = designerOverlayRef.current.getBoundingClientRect();
        let x = ((touch.clientX - rect.left) / rect.width) * 100;
        let y = ((touch.clientY - rect.top) / rect.height) * 100;

        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        if (draggedElement === 'image') {
            if (view === 'front') setFrontImagePos({ x, y });
            else setBackImagePos({ x, y });
        } else if (draggedElement === 'text') {
            if (view === 'front') setFrontTextPos({ x, y });
            else setBackTextPos({ x, y });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setDraggedElement(null);
    };

    return (
        <div 
            className="designer-page" 
            onMouseMove={handleMouseMove} 
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="container">
                <div className="designer-header">
                    <h1>Design Your Own T-Shirt</h1>
                    <p>Create a unique custom DTF printed t-shirt with your own designs</p>
                </div>

                <div className="designer-container">
                    {/* T-Shirt Preview */}
                    <div className="tshirt-preview">
                        <div className="view-toggle">
                            <button 
                                className={`toggle-btn ${view === 'front' ? 'active' : ''}`}
                                onClick={() => { setView('front'); setIsAutoRotating(false); }}
                            >
                                Front
                            </button>
                            <button 
                                className={`toggle-btn ${view === 'back' ? 'active' : ''}`}
                                onClick={() => { setView('back'); setIsAutoRotating(false); }}
                            >
                                Back
                            </button>
                            <button 
                                className={`toggle-btn ${isAutoRotating ? 'active' : ''}`}
                                onClick={() => setIsAutoRotating(!isAutoRotating)}
                            >
                                <RotateCcw size={16} /> 3D View
                            </button>
                        </div>

                        <div className="tshirt-canvas">
                            <div className={`tshirt-3d-container ${view === 'back' ? 'view-back' : ''} ${isAutoRotating ? 'auto-rotate' : ''}`}>
                                {/* Front Side */}
                                <div className="tshirt-side front">
                                    <div className="tshirt-base">
                                        <TShirtBase />
                                        <div 
                                            ref={designerOverlayRef}
                                            className="design-overlay designer-photo-overlay"
                                        >
                                            {frontImage && (
                                                <div 
                                                    className="design-element draggable" 
                                                    style={{ left: `${frontImagePos.x}%`, top: `${frontImagePos.y}%`, cursor: isDragging ? 'grabbing' : 'grab' }}
                                                    onMouseDown={(e) => handleMouseDown(e, 'image')}
                                                    onTouchStart={(e) => handleTouchStart(e, 'image')}
                                                >
                                                    <img src={frontImage} alt="Front Design" className="design-image" />
                                                </div>
                                            )}
                                            {frontText && (
                                                <div 
                                                    className="design-element design-text draggable" 
                                                    style={{ left: `${frontTextPos.x}%`, top: `${frontTextPos.y}%`, color: textColor, fontSize: `${fontSize}px`, fontFamily: fontFamily, cursor: isDragging ? 'grabbing' : 'grab' }}
                                                    onMouseDown={(e) => handleMouseDown(e, 'text')}
                                                    onTouchStart={(e) => handleTouchStart(e, 'text')}
                                                >
                                                    {frontText}
                                                </div>
                                            )}
                                            {!frontImage && !frontText && (
                                                <div className="placeholder-text">
                                                    <ImageIcon size={48} />
                                                    <span>Add Front Design</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Back Side */}
                                <div className="tshirt-side back">
                                    <div className="tshirt-base">
                                        <TShirtBase />
                                        <div 
                                            ref={view === 'back' ? designerOverlayRef : null}
                                            className="design-overlay designer-photo-overlay"
                                        >
                                            {backImage && (
                                                <div 
                                                    className="design-element draggable" 
                                                    style={{ left: `${backImagePos.x}%`, top: `${backImagePos.y}%`, cursor: isDragging ? 'grabbing' : 'grab' }}
                                                    onMouseDown={(e) => handleMouseDown(e, 'image')}
                                                    onTouchStart={(e) => handleTouchStart(e, 'image')}
                                                >
                                                    <img src={backImage} alt="Back Design" className="design-image" />
                                                </div>
                                            )}
                                            {backText && (
                                                <div 
                                                    className="design-element design-text draggable" 
                                                    style={{ left: `${backTextPos.x}%`, top: `${backTextPos.y}%`, color: textColor, fontSize: `${fontSize}px`, fontFamily: fontFamily, cursor: isDragging ? 'grabbing' : 'grab' }}
                                                    onMouseDown={(e) => handleMouseDown(e, 'text')}
                                                    onTouchStart={(e) => handleTouchStart(e, 'text')}
                                                >
                                                    {backText}
                                                </div>
                                            )}
                                            {!backImage && !backText && (
                                                <div className="placeholder-text">
                                                    <ImageIcon size={48} />
                                                    <span>Add Back Design</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Design Controls */}
                    <div className="design-controls">
                        <div className="control-section">
                            <h3>T-Shirt Color</h3>
                            <div className="preset-colors" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <div 
                                    onClick={() => setTshirtColor('#ffffff')} 
                                    className={`preset-color ${tshirtColor === '#ffffff' ? 'active-border' : ''}`} 
                                    style={{ backgroundColor: '#ffffff', width: '50px', height: '50px', border: '2px solid var(--glass-border)', cursor: 'pointer', borderRadius: '8px' }}
                                    title="White"
                                ></div>
                                <div 
                                    onClick={() => setTshirtColor('#000000')} 
                                    className={`preset-color ${tshirtColor === '#000000' ? 'active-border' : ''}`} 
                                    style={{ backgroundColor: '#000000', width: '50px', height: '50px', border: '2px solid var(--glass-border)', cursor: 'pointer', borderRadius: '8px' }}
                                    title="Black"
                                ></div>
                            </div>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Selected: {tshirtColor === '#ffffff' ? 'White' : 'Black'}
                            </p>
                        </div>

                        <div className="control-section">
                            <h3><Type size={20} /> Add Text</h3>
                            <input
                                type="text"
                                placeholder={`Enter text for ${view} side`}
                                value={currentText}
                                onChange={(e) => setCurrentText(e.target.value)}
                                className="design-name-input"
                            />
                            
                            <div className="text-controls">
                                <div className="text-control-group">
                                    <label>Text Color</label>
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className="color-picker-small"
                                    />
                                </div>
                                <div className="text-control-group">
                                    <label>Font Size</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="72"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(e.target.value)}
                                        className="slider"
                                    />
                                    <span>{fontSize}px</span>
                                </div>
                                <div className="text-control-group">
                                    <label>Font</label>
                                    <select 
                                        value={fontFamily} 
                                        onChange={(e) => setFontFamily(e.target.value)}
                                        className="font-select"
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Impact">Impact</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Comic Sans MS">Comic Sans</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="position-controls">
                                <label><Move size={16} /> Text Position</label>
                                <div className="position-sliders">
                                    <div className="slider-group">
                                        <span>Horizontal: {currentTextPos.x}%</span>
                                        <input
                                            type="range"
                                            min="20"
                                            max="80"
                                            value={currentTextPos.x}
                                            onChange={(e) => setCurrentTextPos({...currentTextPos, x: parseInt(e.target.value)})}
                                            className="slider"
                                        />
                                    </div>
                                    <div className="slider-group">
                                        <span>Vertical: {currentTextPos.y}%</span>
                                        <input
                                            type="range"
                                            min="20"
                                            max="80"
                                            value={currentTextPos.y}
                                            onChange={(e) => setCurrentTextPos({...currentTextPos, y: parseInt(e.target.value)})}
                                            className="slider"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="control-section">
                            <h3>Upload Image Design</h3>
                            
                            <label className="upload-card-single">
                                <div className="upload-icon">
                                    <Upload size={32} />
                                </div>
                                <span className="upload-label">Upload {view === 'front' ? 'Front' : 'Back'} Image</span>
                                {currentImage && <span className="upload-status">✓ Uploaded</span>}
                                <input
                                    type="file"
                                    ref={view === 'front' ? frontInputRef : backInputRef}
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, view)}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            
                            {currentImage && (
                                <div className="position-controls">
                                    <label><Move size={16} /> Image Position</label>
                                    <div className="position-sliders">
                                        <div className="slider-group">
                                            <span>Horizontal: {currentImagePos.x}%</span>
                                            <input
                                                type="range"
                                                min="20"
                                                max="80"
                                                value={currentImagePos.x}
                                                onChange={(e) => setCurrentImagePos({...currentImagePos, x: parseInt(e.target.value)})}
                                                className="slider"
                                            />
                                        </div>
                                        <div className="slider-group">
                                            <span>Vertical: {currentImagePos.y}%</span>
                                            <input
                                                type="range"
                                                min="20"
                                                max="80"
                                                value={currentImagePos.y}
                                                onChange={(e) => setCurrentImagePos({...currentImagePos, y: parseInt(e.target.value)})}
                                                className="slider"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="control-section">
                            <h3>Design Name (Optional)</h3>
                            <input
                                type="text"
                                placeholder="Enter design name"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                                className="design-name-input"
                            />
                        </div>

                        <div className="control-section">
                            <h3>Select Size</h3>
                            <div className="size-selector">
                                {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="control-section">
                            <h3>Price</h3>
                            <div className="price-display">
                                <span className="price-label">Custom T-Shirt:</span>
                                <span className="price-amount">LKR 3,500</span>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button onClick={handleReset} className="btn-reset">
                                <RotateCcw size={20} />
                                Reset Design
                            </button>
                            <button onClick={handleAddToCart} className="btn-add-to-cart">
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TShirtDesigner;

