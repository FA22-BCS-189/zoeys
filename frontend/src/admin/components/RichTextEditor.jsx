import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Strikethrough, Code, Link, Image, Type } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Enter description..." }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});
  const [showFontSize, setShowFontSize] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentContent = editorRef.current.innerHTML;
      const newValue = value || '';
      
      if (currentContent !== newValue) {
        editorRef.current.innerHTML = newValue;
      }
    }
  }, [value]);

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const applyFormat = (command, value = null) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    document.execCommand(command, false, value);
    
    setTimeout(() => {
      handleInput();
      updateActiveFormats();
    }, 10);
  };

  const handleInput = () => {
    if (!onChange || !editorRef.current) return;
    
    isUpdatingRef.current = true;
    const content = editorRef.current.innerHTML;
    onChange(content);
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
    
    updateActiveFormats();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        applyFormat('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        applyFormat('italic');
      } else if (e.key === 'u') {
        e.preventDefault();
        applyFormat('underline');
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    
    setTimeout(() => {
      handleInput();
    }, 10);
  };

  const handleBlur = () => {
    if (onChange && editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      applyFormat('insertImage', url);
    }
  };

  const changeFontSize = (size) => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size;
      
      try {
        range.surroundContents(span);
      } catch (e) {
        // If surroundContents fails, use execCommand fallback
        document.execCommand('fontSize', false, '3');
        const fontElements = editorRef.current.querySelectorAll('font[size="3"]');
        fontElements.forEach(el => {
          el.removeAttribute('size');
          el.style.fontSize = size;
        });
      }
    }
    
    setShowFontSize(false);
    handleInput();
  };

  const changeBackgroundColor = (color) => {
    applyFormat('hiliteColor', color);
    setShowColor(false);
  };

  const ToolbarButton = ({ onClick, icon: Icon, title, command, active }) => {
    const isActive = command ? activeFormats[command] : active;
    
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`p-2 rounded transition-colors ${
          isActive 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        title={title}
        tabIndex={-1}
      >
        <Icon size={18} />
      </button>
    );
  };

  const fontSizes = [
    { label: '10px', value: '10px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
    { label: '36px', value: '36px' },
    { label: '48px', value: '48px' },
    { label: '64px', value: '64px' }
  ];

  const colors = [
    '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc',
    '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc',
    '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66',
    '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00',
    '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000',
    '#663d00', '#666600', '#003700', '#002966', '#3d1466'
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400 transition-all">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFontSize(!showFontSize);
            }}
            className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-700 flex items-center gap-1"
            title="Font Size"
            tabIndex={-1}
          >
            <Type size={18} />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => changeFontSize(size.value)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 min-w-24"
                  style={{ fontSize: size.value }}
                  tabIndex={-1}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => applyFormat('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
          command="bold"
        />
        <ToolbarButton
          onClick={() => applyFormat('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
          command="italic"
        />
        <ToolbarButton
          onClick={() => applyFormat('underline')}
          icon={Underline}
          title="Underline (Ctrl+U)"
          command="underline"
        />
        <ToolbarButton
          onClick={() => applyFormat('strikeThrough')}
          icon={Strikethrough}
          title="Strikethrough"
          command="strikeThrough"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton
          onClick={() => applyFormat('insertUnorderedList')}
          icon={List}
          title="Bullet List"
          command="insertUnorderedList"
        />
        <ToolbarButton
          onClick={() => applyFormat('insertOrderedList')}
          icon={ListOrdered}
          title="Numbered List"
          command="insertOrderedList"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton
          onClick={() => applyFormat('justifyLeft')}
          icon={AlignLeft}
          title="Align Left"
          command="justifyLeft"
        />
        <ToolbarButton
          onClick={() => applyFormat('justifyCenter')}
          icon={AlignCenter}
          title="Align Center"
          command="justifyCenter"
        />
        <ToolbarButton
          onClick={() => applyFormat('justifyRight')}
          icon={AlignRight}
          title="Align Right"
          command="justifyRight"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={insertLink}
          icon={Link}
          title="Insert Link"
        />
        <ToolbarButton
          onClick={insertImage}
          icon={Image}
          title="Insert Image"
        />
        <ToolbarButton
          onClick={() => applyFormat('formatBlock', '<pre>')}
          icon={Code}
          title="Code Block"
        />
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onClick={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          onBlur={handleBlur}
          className="min-h-[200px] max-h-[500px] overflow-y-auto p-4 focus:outline-none"
          style={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
          suppressContentEditableWarning
        />
        
        {(!value || value === '') && (
          <div 
            className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none"
            style={{ userSelect: 'none' }}
          >
            {placeholder}
          </div>
        )}
      </div>

      <style>{`
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 20px;
          padding-left: 10px;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 20px;
          padding-left: 10px;
        }
        [contenteditable] li {
          margin: 4px 0;
        }
        [contenteditable] pre {
          background-color: #f5f5f5;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        [contenteditable] a {
          color: #0066cc;
          text-decoration: underline;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;