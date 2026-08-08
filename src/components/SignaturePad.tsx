import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { RotateCcw, PenTool } from "lucide-react";

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, encoderOptions?: number) => string;
  getCanvas: () => HTMLCanvasElement | null;
}

export interface SignaturePadProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  height?: number;
  value?: string;
  onChange?: (dataUrl: string | null) => void;
  onClear?: () => void;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(({
  label = "Authorized Signature",
  error,
  required = false,
  disabled = false,
  height = 180,
  value,
  onChange,
  onClear,
}, ref) => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastEmittedValueRef = useRef<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(500);
  const [isEmptyState, setIsEmptyState] = useState<boolean>(!value);

  // Synchronize canvas physical size with container width to maintain 1:1 touch/mouse coordinates
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        if (width > 0 && Math.abs(width - canvasWidth) > 5) {
          // Save current signature data before resizing
          const currentData = sigCanvasRef.current && !sigCanvasRef.current.isEmpty()
            ? sigCanvasRef.current.toDataURL("image/png")
            : null;

          setCanvasWidth(Math.floor(width));

          // Restore signature after resize
          if (currentData) {
            setTimeout(() => {
              if (sigCanvasRef.current) {
                sigCanvasRef.current.fromDataURL(currentData);
              }
            }, 50);
          }
        }
      }
    };

    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [canvasWidth]);

  // Load existing signature data URL if provided externally (not from canvas drawing)
  useEffect(() => {
    if (value && value !== lastEmittedValueRef.current && sigCanvasRef.current) {
      try {
        sigCanvasRef.current.clear();
        sigCanvasRef.current.fromDataURL(value);
        setIsEmptyState(false);
        lastEmittedValueRef.current = value;
      } catch (err) {
        console.error("Failed to load signature data URL", err);
      }
    } else if (!value && lastEmittedValueRef.current) {
      if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
        sigCanvasRef.current.clear();
      }
      setIsEmptyState(true);
      lastEmittedValueRef.current = null;
    }
  }, [value]);

  const handleClear = () => {
    if (disabled) return;
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
    setIsEmptyState(true);
    lastEmittedValueRef.current = null;
    if (onChange) onChange(null);
    if (onClear) onClear();
  };

  const handleEnd = () => {
    if (sigCanvasRef.current) {
      const empty = sigCanvasRef.current.isEmpty();
      setIsEmptyState(empty);
      if (onChange) {
        if (empty) {
          lastEmittedValueRef.current = null;
          onChange(null);
        } else {
          const dataUrl = sigCanvasRef.current.toDataURL("image/png");
          lastEmittedValueRef.current = dataUrl;
          onChange(dataUrl);
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    clear: () => handleClear(),
    isEmpty: () => {
      if (!sigCanvasRef.current) return true;
      return sigCanvasRef.current.isEmpty();
    },
    toDataURL: (type = "image/png", encoderOptions) => {
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
        return "";
      }
      return sigCanvasRef.current.toDataURL(type, encoderOptions);
    },
    getCanvas: () => {
      return sigCanvasRef.current ? sigCanvasRef.current.getCanvas() : null;
    },
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#374151",
          }}
        >
          {label}
          {required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
        </label>
      )}

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: height,
          border: error ? "2px solid #EF4444" : "1.5px solid #D1D5DB",
          borderRadius: 10,
          backgroundColor: disabled ? "#F9FAFB" : "#FFFFFF",
          overflow: "hidden",
          boxShadow: error ? "0 0 0 3px rgba(239, 68, 68, 0.15)" : "0 1px 2px rgba(0,0,0,0.05)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          cursor: disabled ? "not-allowed" : "crosshair",
          touchAction: "none", // Prevent scrolling while drawing on touch devices
        }}
      >
        {/* Placeholder Watermark / Guide */}
        {isEmptyState && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "#9CA3AF",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <PenTool size={22} style={{ opacity: 0.5 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>User draws here</span>
          </div>
        )}

        {/* Baseline guide line */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
            height: 1,
            borderBottom: "1px dashed #E5E7EB",
            pointerEvents: "none",
          }}
        />

        <SignatureCanvas
          ref={sigCanvasRef}
          canvasProps={{
            width: canvasWidth,
            height: height,
            style: {
              width: "100%",
              height: `${height}px`,
              display: "block",
            },
          }}
          penColor="#1E3A5F"
          minWidth={1.5}
          maxWidth={3.5}
          onEnd={handleEnd}
        />
      </div>

      {/* Clear Signature Button and Validation Error */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        <div>
          {error ? (
            <p style={{ margin: 0, fontSize: 12, color: "#DC2626", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              <span>⚠</span> {error}
            </p>
          ) : (
            <span style={{ fontSize: 11, color: "#6B7280" }}>
              Sign above using mouse, touch, or stylus
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || isEmptyState}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 600,
            color: disabled || isEmptyState ? "#9CA3AF" : "#374151",
            backgroundColor: disabled || isEmptyState ? "#F3F4F6" : "#FFFFFF",
            border: "1px solid",
            borderColor: disabled || isEmptyState ? "#E5E7EB" : "#D1D5DB",
            borderRadius: 6,
            cursor: disabled || isEmptyState ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            boxShadow: disabled || isEmptyState ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <RotateCcw size={13} />
          Clear Signature
        </button>
      </div>
    </div>
  );
});

SignaturePad.displayName = "SignaturePad";
