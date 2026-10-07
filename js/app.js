/**
 * APP ENTRY POINT & CITY ORCHESTRATOR
 * Coordinates Three.js 3D City, Procedural Audio, Cinematic Intro,
 * HUD Navigation, Sections, and Fallback Modes.
 */

import { portfolioConfig } from "./config.js";
import { sound } from "./audio.js";
import { CinematicCursor } from "./cursor.js";
import { CityScene } from "./city/CityScene.js";
import { IntroExperience } from "./ui/Intro.js";
import { NavigationBar } from "./ui/Navigation.js";
import { LocationDock } from "./ui/LocationDock.js";
import { BuildingHUD } from "./ui/BuildingHUD.js";
import { SectionManager } from "./ui/SectionManager.js";
import { SimpleModeView } from "./ui/SimpleMode.js";
import { AccessibilityPanel } from "./ui/Accessibility.js";

// RELIABLE CENTRAL SECTOR MAPPING
export const SECTOR_MAP = {
  "01": "about",
  "1": "about",
  "about": "about",
  "home": "about",

  "02": "education",
  "2": "education",
  "education": "education",

  "03": "skills",
  "3": "skills",
  "skills": "skills",

  "04": "projects",
  "4": "projects",
  "projects": "projects",

  "05": "github",
  "5": "github",
  "github": "github",

  "06": "goals",
  "6": "goals",
  "goals": "goals",

  "07": "resume",
  "7": "resume",
  "resume": "resume",

  "08": "contact",
  "8": "contact",
  "contact": "contact",

  "09": "innovation",
  "9": "innovation",
  "innovation": "innovation"
};

class App {
  constructor() {
    this.cityScene = null;
    this.cursor = null;
    this.intro = null;
    this.nav = null;
    this.dock = null;
    this.hud = null;
    this.sections = null;
    this.simpleMode = null;
    this.accessibility = null;

    this.isCityReady = false;
    this.hasEntered = false;
    this.activeSection = null;

    this.init();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  init() {
    // 1. Desktop Cinematic Cursor
    this.cursor = new CinematicCursor();

    const appContainer = document.getElementById("app");
    const canvasContainer = document.getElementById("city-canvas-container");

    // Check WebGL availability
    const webglSupported = this.isWebGLAvailable();

    if (!webglSupported) {
      console.warn("WebGL unsupported. Activating 2D Schematic Mode fallback.");
      this.initFallbackMode();
      return;
    }

    // 2. Initialize 3D City Scene
    try {
      this.cityScene = new CityScene(canvasContainer, portfolioConfig, {
        onBuildingHover: (bData) => {
          if (!this.activeSection) {
            this.hud?.showHover(bData);
            if (bData) sound.playHover();
          }
        },
        onBuildingSelect: (bData) => {
          // Central navigation triggered from 3D raycast click
          this.navigateToSector(bData.id);
        },
        onCameraModeChange: (mode) => {
          if (mode === "MAP" && !this.activeSection) {
            this.hud?.show();
          } else {
            this.hud?.hide();
          }
        }
      });
    } catch (e) {
      console.error("Three.js City Scene initialization failed:", e);
      this.initFallbackMode();
      return;
    }

    // 3. Building HUD (Monospace 3D Labels & Previews)
    this.hud = new BuildingHUD(
      appContainer,
      portfolioConfig.buildings,
      this.cityScene.camera,
      (bData) => this.navigateToSector(bData.id)
    );

    // Continuous update of projected 3D labels
    const syncHud = () => {
      this.hud?.updatePositions();
      requestAnimationFrame(syncHud);
    };
    requestAnimationFrame(syncHud);

    // 4. Section Manager (All 9 sector modals)
    this.sections = new SectionManager(
      appContainer,
      portfolioConfig,
      () => {
        // Return to City callback
        this.returnToCity();
      },
      sound
    );

    // 5. Navigation Bar
    this.nav = new NavigationBar(
      portfolioConfig,
      (targetId) => {
        if (!targetId) {
          this.returnToCity();
        } else {
          this.navigateToSector(targetId);
        }
      },
      (isDark) => this.cityScene.setTheme(isDark),
      () => sound.toggle(),
      () => this.accessibility.open(),
      () => this.toggleSimpleMode(true)
    );

    // 6. Location Dock (CITY SECTORS bottom panel)
    this.dock = new LocationDock(portfolioConfig.buildings, (id) => {
      this.navigateToSector(id);
    });

    // 7. Simple 2D Mode Fallback
    this.simpleMode = new SimpleModeView(
      appContainer,
      portfolioConfig,
      (id) => this.navigateToSector(id),
      () => this.toggleSimpleMode(false)
    );

    // 8. Accessibility Settings Panel
    this.accessibility = new AccessibilityPanel({
      onMotionChange: (reduced) => {
        this.cityScene.cameraController.setReducedMotion(reduced);
      },
      onRainChange: (enabled) => {
        this.cityScene.rain.toggle(enabled);
      },
      onSimpleModeChange: (enabled) => {
        this.toggleSimpleMode(enabled);
      }
    });

    // 9. Cinematic Intro Experience
    this.intro = new IntroExperience(
      portfolioConfig,
      () => this.onEnterWorld(),
      () => this.navigateToSector("resume"),
      sound
    );

    // 10. Global Keyboard Navigation
    this.bindKeyboardShortcuts();
  }

  initFallbackMode() {
    const appContainer = document.getElementById("app");
    this.sections = new SectionManager(appContainer, portfolioConfig, () => {}, sound);
    this.simpleMode = new SimpleModeView(
      appContainer,
      portfolioConfig,
      (id) => this.navigateToSector(id),
      () => window.location.reload()
    );
    this.simpleMode.show();
  }

  onEnterWorld() {
    this.hasEntered = true;

    // Trigger camera flythrough over skyline into map view
    this.cityScene.cameraController.startEnterFlythrough(() => {
      this.nav.show();
      this.dock.show();
      this.hud.show();
    });
  }

  /**
   * CENTRAL NAVIGATION FUNCTION
   * Unified entry point for:
   * - CITY SECTOR clicks (Bottom Dock)
   * - Top Navigation Bar
   * - 3D Building Raycast clicks
   * - Screen-space 3D Labels
   * - Keyboard Shortcuts (1-9)
   */
  navigateToSector(sectorKey) {
    if (!sectorKey) return;

    // Normalize identifier using central mapping
    const rawKey = sectorKey.toString().toLowerCase().trim();
    const normalizedId = SECTOR_MAP[rawKey] || rawKey;

    const bData = portfolioConfig.buildings.find((b) => b.id === normalizedId);
    if (!bData) {
      console.warn("Sector not found in portfolio configuration:", sectorKey);
      return;
    }

    // Dismiss intro if still active
    if (!this.hasEntered && this.intro) {
      this.intro.triggerEnter();
    }

    sound.playClick();
    this.activeSection = normalizedId;

    // Sync UI indicators
    this.nav?.setActive(normalizedId);
    this.dock?.setActive(normalizedId);
    this.hud?.hide();

    // Smooth camera transition toward corresponding building
    if (this.cityScene && !this.simpleMode?.isActive()) {
      this.cityScene.navigateToBuilding(bData);
    }

    // Open corresponding section component
    this.sections.open(normalizedId);
  }

  /**
   * RETURN TO CITY
   * Triggered by:
   * - 'BACK TO CITY' button
   * - Modal close button [X]
   * - ESC key
   * - Brand logo click
   */
  returnToCity() {
    this.activeSection = null;
    this.sections?.close();
    this.cityScene?.returnToMap();
    this.nav?.setActive(null);
    this.dock?.setActive(null);
    this.hud?.show();
  }

  toggleSimpleMode(enable) {
    if (enable) {
      this.simpleMode.show();
      this.hud?.hide();
      this.dock?.hide();
    } else {
      this.simpleMode.hide();
      if (this.hasEntered) {
        this.hud?.show();
        this.dock?.show();
      }
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Don't intercept when user is typing in form inputs
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      if (e.key === "Escape") {
        this.returnToCity();
        return;
      }

      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
        const targetBuilding = portfolioConfig.buildings[keyNum - 1];
        if (targetBuilding) {
          this.navigateToSector(targetBuilding.id);
        }
      }
    });
  }
}

// Boot application when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  new App();
});
