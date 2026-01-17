'use client';

import { useState } from 'react';
import { Settings, X, Type, Palette, Move, Layout, Edit3, Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

export interface NavLink {
  id: string;
  href: string;
  label: string;
  enabled: boolean;
}

export interface NavbarCustomization {
  height: number;
  horizontalPadding: number;
  logoSize: number;
  logoTextSize: number;
  navLinkSize: number;
  navLinkSpacing: number;
  buttonPadding: number;
  buttonTextSize: number;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontWeight: string;
  glassEffect: boolean;
  showShadow: boolean;
  // Content controls
  logoText: string;
  showLogo: boolean;
  showLogoIcon: boolean;
  showLogoText: boolean;
  buttonText: string;
  showButton: boolean;
  navLinks: NavLink[];
  // Layout controls
  logoPosition: 'left' | 'center' | 'right';
  navPosition: 'left' | 'center' | 'right';
  elementOrder: ('logo' | 'nav' | 'button')[];
}

interface NavbarCustomizationPanelProps {
  customization: NavbarCustomization;
  onChange: (customization: NavbarCustomization) => void;
  onClose: () => void;
}

export default function NavbarCustomizationPanel({ 
  customization, 
  onChange, 
  onClose 
}: NavbarCustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'spacing' | 'typography' | 'colors'>('layout');

  const handleChange = (key: keyof NavbarCustomization, value: any) => {
    onChange({ ...customization, [key]: value });
  };

  const handleAddNavLink = () => {
    const newLink: NavLink = {
      id: Date.now().toString(),
      href: '#section',
      label: 'New Link',
      enabled: true,
    };
    onChange({ ...customization, navLinks: [...customization.navLinks, newLink] });
  };

  const handleUpdateNavLink = (id: string, updates: Partial<NavLink>) => {
    const updatedLinks = customization.navLinks.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    onChange({ ...customization, navLinks: updatedLinks });
  };

  const handleDeleteNavLink = (id: string) => {
    onChange({ 
      ...customization, 
      navLinks: customization.navLinks.filter(link => link.id !== id) 
    });
  };

  const handleMoveNavLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...customization.navLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newLinks.length) {
      [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
      onChange({ ...customization, navLinks: newLinks });
    }
  };

  const handleMoveElement = (index: number, direction: 'left' | 'right') => {
    const newOrder = [...customization.elementOrder];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      onChange({ ...customization, elementOrder: newOrder });
    }
  };

  const resetToDefaults = () => {
    onChange({
      height: 64,
      horizontalPadding: 24,
      logoSize: 32,
      logoTextSize: 24,
      navLinkSize: 16,
      navLinkSpacing: 32,
      buttonPadding: 24,
      buttonTextSize: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      textColor: '#ffffff',
      accentColor: '#39CCCC',
      fontFamily: 'Inter',
      fontWeight: '600',
      glassEffect: true,
      showShadow: true,
      logoText: 'SAMUDRASATHI',
      showLogo: true,
      showLogoIcon: true,
      showLogoText: true,
      buttonText: 'Report Now',
      showButton: true,
      navLinks: [
        { id: '1', href: '#home', label: 'Home', enabled: true },
        { id: '2', href: '#map', label: 'Map', enabled: true },
        { id: '3', href: '#alerts', label: 'Alerts', enabled: true },
      ],
      logoPosition: 'left',
      navPosition: 'right',
      elementOrder: ['logo', 'nav', 'button'],
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-end p-4 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative glass rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mt-20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Navbar Customization</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('layout')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'layout'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4 inline-block mr-1" />
            Layout
          </button>
          <button
            onClick={() => setActiveTab('spacing')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'spacing'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Move className="w-4 h-4 inline-block mr-1" />
            Spacing
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'typography'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4 inline-block mr-1" />
            Text
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'colors'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 inline-block mr-1" />
            Colors
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'layout' && (
            <>
              {/* Logo Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Logo</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customization.showLogo}
                      onChange={(e) => handleChange('showLogo', e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-500"
                    />
                    <span className="text-sm text-gray-300">Show</span>
                  </label>
                </div>

                {customization.showLogo && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Logo Text</label>
                      <input
                        type="text"
                        value={customization.logoText}
                        onChange={(e) => handleChange('logoText', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ocean Watch"
                      />
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customization.showLogoIcon}
                          onChange={(e) => handleChange('showLogoIcon', e.target.checked)}
                          className="w-4 h-4 rounded accent-cyan-500"
                        />
                        <span className="text-sm text-gray-300">Show Icon</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customization.showLogoText}
                          onChange={(e) => handleChange('showLogoText', e.target.checked)}
                          className="w-4 h-4 rounded accent-cyan-500"
                        />
                        <span className="text-sm text-gray-300">Show Text</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Nav Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Navigation Links</h3>
                  <button
                    onClick={handleAddNavLink}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {customization.navLinks.map((link, index) => (
                    <div key={link.id} className="glass rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveNavLink(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <GripVertical className="w-3 h-3 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleMoveNavLink(index, 'down')}
                            disabled={index === customization.navLinks.length - 1}
                            className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <GripVertical className="w-3 h-3 text-gray-400 rotate-180" />
                          </button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateNavLink(link.id, { label: e.target.value })}
                            className="px-2 py-1.5 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => handleUpdateNavLink(link.id, { href: e.target.value })}
                            className="px-2 py-1.5 bg-white/5 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="#section"
                          />
                        </div>
                        <button
                          onClick={() => handleUpdateNavLink(link.id, { enabled: !link.enabled })}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        >
                          {link.enabled ? (
                            <Eye className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteNavLink(link.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">CTA Button</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customization.showButton}
                      onChange={(e) => handleChange('showButton', e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-500"
                    />
                    <span className="text-sm text-gray-300">Show</span>
                  </label>
                </div>

                {customization.showButton && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={customization.buttonText}
                      onChange={(e) => handleChange('buttonText', e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Report Now"
                    />
                  </div>
                )}
              </div>

              {/* Element Order */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Element Order</h3>
                <div className="flex gap-2">
                  {customization.elementOrder.map((element, index) => (
                    <div key={element} className="flex-1 glass rounded-lg p-3 text-center">
                      <div className="text-white font-medium capitalize mb-2">{element}</div>
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleMoveElement(index, 'left')}
                          disabled={index === 0}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => handleMoveElement(index, 'right')}
                          disabled={index === customization.elementOrder.length - 1}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'spacing' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Navbar Height: {customization.height}px
                </label>
                <input
                  type="range"
                  min="48"
                  max="96"
                  step="4"
                  value={customization.height}
                  onChange={(e) => handleChange('height', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Horizontal Padding: {customization.horizontalPadding}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  step="4"
                  value={customization.horizontalPadding}
                  onChange={(e) => handleChange('horizontalPadding', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Logo Icon Size: {customization.logoSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="48"
                  step="2"
                  value={customization.logoSize}
                  onChange={(e) => handleChange('logoSize', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Nav Link Spacing: {customization.navLinkSpacing}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="64"
                  step="4"
                  value={customization.navLinkSpacing}
                  onChange={(e) => handleChange('navLinkSpacing', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Button Padding: {customization.buttonPadding}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="40"
                  step="2"
                  value={customization.buttonPadding}
                  onChange={(e) => handleChange('buttonPadding', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </>
          )}

          {activeTab === 'typography' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Font Family
                </label>
                <select
                  value={customization.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Inter">Inter (Default)</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="system-ui">System UI</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Font Weight
                </label>
                <select
                  value={customization.fontWeight}
                  onChange={(e) => handleChange('fontWeight', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra-Bold (800)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Logo Text Size: {customization.logoTextSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="40"
                  step="2"
                  value={customization.logoTextSize}
                  onChange={(e) => handleChange('logoTextSize', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Nav Link Size: {customization.navLinkSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={customization.navLinkSize}
                  onChange={(e) => handleChange('navLinkSize', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Button Text Size: {customization.buttonTextSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  step="1"
                  value={customization.buttonTextSize}
                  onChange={(e) => handleChange('buttonTextSize', Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </>
          )}

          {activeTab === 'colors' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Text Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={customization.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Accent Color (Hover)
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={customization.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    placeholder="#39CCCC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Background Color (when scrolled)
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={customization.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border-2 border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    placeholder="rgba(255, 255, 255, 0.1)"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.glassEffect}
                    onChange={(e) => handleChange('glassEffect', e.target.checked)}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                  <span className="text-gray-200">Enable Glass Effect</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.showShadow}
                    onChange={(e) => handleChange('showShadow', e.target.checked)}
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                  <span className="text-gray-200">Show Shadow on Scroll</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 glass border-t border-white/10 p-6 flex gap-3">
          <button
            onClick={resetToDefaults}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
