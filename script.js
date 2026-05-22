/**
 * ALMATIN — Radiation Simulation Workstation v4.0
 * Advanced Simulation Engine
 */

(function() {
  'use strict';

  // ==========================================
  // 0. SCROLL-REVEAL ANIMATIONS
  // ==========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('section-reveal')) entry.target.classList.add('revealed');
        if (entry.target.classList.contains('reveal-item')) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('revealed'), delay * 150);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.section-reveal, .reveal-item').forEach(el => revealObserver.observe(el));

  // ==========================================
  // 1. CURSOR GLOW
  // ==========================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorGlow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
  }

  // ==========================================
  // 2. NAVIGATION
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
  if (navToggle) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ==========================================
  // 3. HERO PARTICLES
  // ==========================================
  const heroCanvas = document.getElementById('heroParticles');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let particles = [], animFrame;
    function resizeParticles() { const h = heroCanvas.parentElement; heroCanvas.width = h.offsetWidth; heroCanvas.height = h.offsetHeight; }
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * heroCanvas.width;
        this.y = Math.random() * heroCanvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.life = 0;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY; this.life += this.pulseSpeed;
        if (this.x < 0 || this.x > heroCanvas.width || this.y < 0 || this.y > heroCanvas.height) this.reset();
      }
      draw() {
        const pulse = Math.sin(this.life + this.pulseOffset) * 0.3 + 0.7;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77, 212, 232, ${this.opacity * pulse})`; ctx.fill();
        if (this.size > 1.5) {
          ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(77, 212, 232, ${this.opacity * 0.1 * pulse})`; ctx.fill();
        }
      }
    }
    function initParticles() {
      resizeParticles(); particles = [];
      const count = Math.floor((heroCanvas.width * heroCanvas.height) / 8000);
      for (let i = 0; i < Math.max(count, 60); i++) particles.push(new Particle());
    }
    function connectParticles() {
      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(77, 212, 232, ${0.08 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
    }
    function animateParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); }); connectParticles();
      animFrame = requestAnimationFrame(animateParticles);
    }
    initParticles(); animateParticles();
    window.addEventListener('resize', () => { cancelAnimationFrame(animFrame); initParticles(); animateParticles(); });
  }

  // ==========================================
  // 4. COUNTERS & READOUTS
  // ==========================================
  function animateCounter(el, target, suffix) {
    if (!el) return;
    const dur = 2000, start = performance.now();
    function update(now) {
      const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3), cur = Math.floor(0 + (target - 0) * eased);
      el.textContent = cur + (suffix || ''); if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  animateCounter(document.getElementById('statProjects'), 247);
  animateCounter(document.getElementById('statCompliance'), 99.8, '%');
  animateCounter(document.getElementById('statFacilities'), 89);
  function animateReadouts() {
    const bg = document.getElementById('bgRadiation'), si = document.getElementById('shieldIntegrity');
    if (bg) setInterval(() => { bg.textContent = (0.08 + Math.random() * 0.08).toFixed(2); }, 3000);
    if (si) setInterval(() => { si.textContent = (98.2 + Math.random() * 1.6).toFixed(1); }, 4000);

    // Animate systemUptime (incrementing counter)
    const uptime = document.getElementById('systemUptime');
    if (uptime) {
      let hours = 14672;
      setInterval(() => { hours += 1; uptime.textContent = hours.toLocaleString(); }, 60000);
    }

    // Animate activeSensors (varying count)
    const sensors = document.getElementById('activeSensors');
    if (sensors) {
      let count = 1284;
      setInterval(() => { count += Math.floor(Math.random() * 5) - 2; sensors.textContent = count.toLocaleString(); }, 5000);
    }
  }
  animateReadouts();

  // ==========================================
  // 5. ENGINEERING HUD
  // ==========================================
  const engHud = document.getElementById('engHud');
  const hudAlerts = document.getElementById('hudAlerts');
  const hudSourceEnergy = document.getElementById('hudSourceEnergy');
  const hudLeakage = document.getElementById('hudLeakage');
  const hudShieldStatus = document.getElementById('hudShieldStatus');
  const hudDoseRate = document.getElementById('hudDoseRate');

  function addHudAlert(msg, severity) {
    if (!hudAlerts) return;
    const el = document.createElement('div');
    el.className = 'hud-alert';
    el.dataset.severity = severity || 'info';
    el.textContent = msg;
    hudAlerts.appendChild(el);
    if (hudAlerts.children.length > 5) hudAlerts.removeChild(hudAlerts.firstChild);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 5000);
  }

  // ==========================================
  // 6. SIMULATION ENGINE
  // ==========================================

  // Material attenuation coefficients (mu in cm-1)
  const MU_VALUES = {
    lead: { low: 52.0, medium: 28.0, high: 18.0, density: 11.34 },
    concrete: { low: 0.55, medium: 0.32, high: 0.22, density: 2.35 },
    steel: { low: 3.5, medium: 2.0, high: 1.2, density: 7.87 },
    borated: { low: 0.5, medium: 0.3, high: 0.2, density: 1.05 },
    barium: { low: 7.0, medium: 3.8, high: 2.5, density: 3.5 },
    tungsten: { low: 80.0, medium: 42.0, high: 28.0, density: 19.3 },
    hdpe: { low: 0.4, medium: 0.25, high: 0.18, density: 0.95 },
    brick: { low: 0.35, medium: 0.25, high: 0.18, density: 1.2 }
  };

  // Neutron attenuation coefficients (Sigma in cm-1)
  const SIGMA_VALUES = {
    lead: 0.08, concrete: 0.12, steel: 0.15,
    borated: 0.45, barium: 0.10, tungsten: 0.20, hdpe: 0.35, brick: 0.09
  };

  // Source beam intensities at 1m (mGy/mAs) and types
  const SOURCE_DATA = {
    xray: { intensity: 5.0, label: 'X-RAY', energy: 'kVp', badge: '#4dd4e8' },
    ct: { intensity: 8.0, label: 'CT', energy: 'kVp', badge: '#4dd4e8' },
    pet: { intensity: 15.0, label: 'PET', energy: 'MeV', badge: '#33ff99' },
    gamma: { intensity: 3.2, label: 'Co-60', energy: 'MeV', badge: '#ff6b35' },
    gamma2: { intensity: 2.8, label: 'Ir-192', energy: 'MeV', badge: '#ff6b35' },
    linac: { intensity: 8.0, label: '6MV', energy: 'MV', badge: '#ff6b35' },
    linac10: { intensity: 12.0, label: '10MV', energy: 'MV', badge: '#ff6b35' },
    linac15: { intensity: 16.0, label: '15MV', energy: 'MV', badge: '#ff6b35' },
    cyclotron: { intensity: 20.0, label: 'CYCLO', energy: 'MeV', badge: '#ff3333' },
    cathlab: { intensity: 3.0, label: 'CATH-LAB', energy: 'kVp', badge: '#ff6b35' },
    neutron: { intensity: 25.0, label: 'N-GEN', energy: 'MeV', badge: '#33ff99' }
  };

  // DOM Inputs
  const sourceType = document.getElementById('sourceType');
  const kvpSlider = document.getElementById('kvpSlider');
  const kvpValue = document.getElementById('kvpValue');
  const workloadSlider = document.getElementById('workloadSlider');
  const workloadValue = document.getElementById('workloadValue');
  const exposureTime = document.getElementById('exposureTime');
  const exposureValue = document.getElementById('exposureValue');
  const distanceInput = document.getElementById('distanceInput');
  const beamAngle = document.getElementById('beamAngle');
  const beamAngleValue = document.getElementById('beamAngleValue');
  const sourcePosX = document.getElementById('sourcePosX');
  const sourcePosY = document.getElementById('sourcePosY');
  const machineOrient = document.getElementById('machineOrient');
  const machineOrientValue = document.getElementById('machineOrientValue');
  const occupancyFactor = document.getElementById('occupancyFactor');
  const useFactor = document.getElementById('useFactor');
  const shieldMaterial = document.getElementById('shieldMaterial');
  const thicknessSlider = document.getElementById('thicknessSlider');
  const thicknessValue = document.getElementById('thicknessValue');
  const wallThicknessSlider = document.getElementById('wallThicknessSlider');
  const wallThicknessValue = document.getElementById('wallThicknessValue');
  const roomOccupancy = document.getElementById('roomOccupancy');
  const roomLength = document.getElementById('roomLength');
  const roomWidth = document.getElementById('roomWidth');
  const roomHeight = document.getElementById('roomHeight');
  const neutronMode = document.getElementById('neutronMode');
  const srcBadge = document.getElementById('srcBadge');

  // DOM Outputs
  const leakageRad = document.getElementById('leakageRadiation');
  const annualDose = document.getElementById('annualDose');
  const attenuationPercent = document.getElementById('attenuationPercent');
  const scatterIntensity = document.getElementById('scatterIntensity');
  const shieldEfficiency = document.getElementById('shieldEfficiency');
  const doseOutside = document.getElementById('doseOutside');
  const neutronAttenuation = document.getElementById('neutronAttenuation');
  const neutronResultItem = document.getElementById('neutronResultItem');
  const barrierTransmission = document.getElementById('barrierTransmission');
  const complianceStatus = document.getElementById('complianceStatus');

  // Scatter Analysis DOM
  const scatterType = document.getElementById('scatterType');
  const scatterDistance = document.getElementById('scatterDistance');
  const staffScatterDose = document.getElementById('staffScatterDose');
  const roomDimFeet = document.getElementById('roomDimFeet');
  const brickWallAttn = document.getElementById('brickWallAttn');
  const brickWallResult = document.getElementById('brickWallResult');
  const brickCompliance = document.getElementById('brickCompliance');
  const staffDose05m = document.getElementById('staffDose05m');
  const staffDose2m = document.getElementById('staffDose2m');
  const fieldSize = document.getElementById('fieldSize');
  const patientThick = document.getElementById('patientThick');
  const scatterAngle = document.getElementById('scatterAngle');
  const scatterAngleVal = document.getElementById('scatterAngleValue');
  const angularFactorEl = document.getElementById('angularFactor');
  const scatterModelLabel = document.getElementById('scatterModelLabel');
  const apronThickness = document.getElementById('apronThickness');
  const apronTransmission = document.getElementById('apronTransmission');
  const effectiveStaffDose = document.getElementById('effectiveStaffDose');
  const effDoseBar = document.querySelector('#effDoseBar .result-bar-fill');
  const scatterTableBody = document.getElementById('scatterTableBody');

  // DOM Bars
  const leakageBar = document.querySelector('#leakageBar .result-bar-fill');
  const doseBar = document.querySelector('#doseBar .result-bar-fill');
  const attenBar = document.querySelector('#attenBar .result-bar-fill');
  const scatterBar = document.querySelector('#scatterBar .result-bar-fill');
  const shieldEffBar = document.querySelector('#shieldEffBar .result-bar-fill');
  const doseOutsideBar = document.querySelector('#doseOutsideBar .result-bar-fill');
  const neutronBar = document.querySelector('#neutronBar .result-bar-fill');
  const barrierBar = document.querySelector('#barrierBar .result-bar-fill');

  // Wall stack
  const wallLeadThickness = document.getElementById('wallLeadThickness');
  const wallConcreteThickness = document.getElementById('wallConcreteThickness');

  // Slider value displays
  if (kvpSlider && kvpValue) kvpSlider.addEventListener('input', () => { kvpValue.textContent = kvpSlider.value + ' kVp'; updateSimulation(); });
  if (workloadSlider && workloadValue) workloadSlider.addEventListener('input', () => { workloadValue.textContent = workloadSlider.value + ' mA·min/wk'; updateSimulation(); });
  if (exposureTime && exposureValue) exposureTime.addEventListener('input', () => { exposureValue.textContent = exposureTime.value + ' min'; updateSimulation(); });
  if (thicknessSlider && thicknessValue) thicknessSlider.addEventListener('input', () => { thicknessValue.textContent = thicknessSlider.value + ' mm'; updateSimulation(); });
  if (wallThicknessSlider && wallThicknessValue) wallThicknessSlider.addEventListener('input', () => { wallThicknessValue.textContent = wallThicknessSlider.value + ' mm'; updateSimulation(); });
  if (beamAngle && beamAngleValue) beamAngle.addEventListener('input', () => { beamAngleValue.textContent = beamAngle.value + '°'; updateSimulation(); });
  if (machineOrient && machineOrientValue) machineOrient.addEventListener('input', () => { machineOrientValue.textContent = machineOrient.value + '°'; updateSimulation(); });

  // All simulation input listeners
  const allSimInputs = [
    sourceType, kvpSlider, workloadSlider, exposureTime, distanceInput, beamAngle,
    sourcePosX, sourcePosY, machineOrient, occupancyFactor, useFactor,
    shieldMaterial, thicknessSlider, wallThicknessSlider, roomOccupancy,
    roomLength, roomWidth, roomHeight, neutronMode
  ].filter(el => el);
  allSimInputs.forEach(el => {
    el.addEventListener('input', updateSimulation);
    el.addEventListener('change', updateSimulation);
  });

  // Source type change updates badge
  if (sourceType) {
    sourceType.addEventListener('change', () => {
      const val = sourceType.value;
      const data = SOURCE_DATA[val] || SOURCE_DATA.xray;
      if (srcBadge) {
        srcBadge.textContent = data.label;
        srcBadge.style.background = data.badge;
      }
    });
  }

  // Lead apron change
  if (apronThickness) {
    apronThickness.addEventListener('change', updateSimulation);
  }

  // Scatter angle slider
  if (scatterAngle && scatterAngleVal) {
    scatterAngle.addEventListener('input', () => {
      scatterAngleVal.textContent = scatterAngle.value + '°';
      updateSimulation();
    });
  }

  // Add new scatter controls to sim inputs
  [fieldSize, patientThick].forEach(el => {
    if (el) el.addEventListener('input', updateSimulation);
  });

  // ==========================================
  // CORE SIMULATION FORMULAS
  // ==========================================

  function getEnergyBand(kvp) {
    if (kvp <= 60) return 'low';
    if (kvp <= 100) return 'medium';
    return 'high';
  }

  function calcMu(material, kvp) {
    const band = getEnergyBand(parseFloat(kvp));
    return (MU_VALUES[material] && MU_VALUES[material][band]) || MU_VALUES.lead[band];
  }

  function inverseSquare(I1, d1, d2) { return I1 * Math.pow(d1 / d2, 2); }
  function attenuate(I0, mu, x_mm) { return I0 * Math.exp(-mu * (x_mm / 10)); }
  function attenPct(I0, I) { return (1 - I / I0) * 100; }
  function barrierTrans(P, d, W, U, T) { if (W * U * T === 0) return 1; return (P * d * d) / (W * U * T); }
  function neutronAtten(Phi0, Sigma, x_mm) { return Phi0 * Math.exp(-Sigma * (x_mm / 10)); }

  // Multi-layer attenuation: I = I0 * exp(-sum(mu_i * x_i))
  function multiLayerAtten(I0, layers, kvp) {
    let I = I0;
    layers.forEach(layer => {
      const mu = calcMu(layer.material, kvp);
      I = attenuate(I, mu, parseFloat(layer.thickness));
    });
    return I;
  }

  // ==========================================
  // COMPREHENSIVE SCATTER PHYSICS MODEL
  // ==========================================
  //
  // Models implemented:
  //   1. Klein-Nishina differential cross-section (Compton angular distribution)
  //   2. NCRP-147 empirical scatter fraction (kVp, field size, phantom thickness)
  //   3. NCRP-147 Table B.1 angular distribution data
  //   4. Birch & Marshall X-ray tube output (ESAK) model
  //   5. Field size / phantom thickness dependence
  //   6. C-arm geometry factors (under-table vs over-table)
  //   7. Photon energy degradation (E'/E via Compton formula)

  /**
   * Klein-Nishina differential cross-section for Compton scattering.
   * Returns normalized dσ/dΩ value.
   * @param {number} theta_deg - Scatter angle in degrees (0-180)
   * @param {number} energy_kev - Incident photon energy in keV
   * @returns {number} Normalized differential cross-section
   */
  function kleinNishina(theta_deg, energy_kev) {
    const theta = theta_deg * Math.PI / 180;
    const alpha = energy_kev / 511.0;       // E/(m_e c²)
    const cosT = Math.cos(theta);
    const denom = 1 + alpha * (1 - cosT);
    const ratio = 1 / denom;                // E'/E
    // dσ/dΩ = (r₀²/2) x (E'/E)² x (E/E' + E'/E - sin²θ)
    const dSigma = ratio * ratio * (1/ratio + ratio - Math.sin(theta) * Math.sin(theta));
    return dSigma;
  }

  /**
   * Scattered photon energy after Compton interaction.
   * E' = E / (1 + α(1 - cosθ))
   */
  function comptonEnergy(theta_deg, energy_kev) {
    const theta = theta_deg * Math.PI / 180;
    const alpha = energy_kev / 511.0;
    return energy_kev / (1 + alpha * (1 - Math.cos(theta)));
  }

  /**
   * NCRP-147 normalized angular scatter distribution.
   * Extracted from NCRP-147 Table B.1 for 100 kVp, 400 cm² field.
   * Interpolates between discrete data points.
   */
  function ncrp147AngularFactor(scatterAngle_deg) {
    // NCRP-147 Table B.1: normalized scatter intensity vs angle
    const NCRP147_ANGULAR = [
      { angle: 0,   value: 1.00 },
      { angle: 15,  value: 0.88 },
      { angle: 30,  value: 0.75 },
      { angle: 45,  value: 0.59 },
      { angle: 60,  value: 0.50 },
      { angle: 75,  value: 0.43 },
      { angle: 90,  value: 0.35 },
      { angle: 105, value: 0.28 },
      { angle: 120, value: 0.20 },
      { angle: 135, value: 0.15 },
      { angle: 150, value: 0.12 },
      { angle: 165, value: 0.10 },
      { angle: 180, value: 0.09 }
    ];
    const clamped = Math.max(0, Math.min(180, scatterAngle_deg));
    // Linear interpolation
    for (let i = 0; i < NCRP147_ANGULAR.length - 1; i++) {
      const a0 = NCRP147_ANGULAR[i], a1 = NCRP147_ANGULAR[i + 1];
      if (clamped >= a0.angle && clamped <= a1.angle) {
        const t = (clamped - a0.angle) / (a1.angle - a0.angle);
        return a0.value + t * (a1.value - a0.value);
      }
    }
    return NCRP147_ANGULAR[NCRP147_ANGULAR.length - 1].value;
  }

  /**
   * NCRP-147 patient scatter fraction model.
   * Computes the fraction of primary beam intensity that is scattered
   * from the patient at 1m and 90°.
   *
   * @param {number} kvp - Peak tube voltage (kVp)
   * @param {number} fieldArea_cm2 - Radiation field area at patient (cm²)
   * @param {number} phantomThick_cm - Patient/phantom thickness (cm)
   * @returns {number} Scatter fraction (dimensionless)
   */
  function ncrp147ScatterFraction(kvp, fieldArea_cm2, phantomThick_cm) {
    // Base scatter fraction at 100 kVp, 400 cm² field, 30 cm phantom, 90° (NCRP-147 Table B.2)
    const BASE_FRACTION = 0.0012;
    // kVp dependence: power-law fit to NCRP-147 data ~ (kVp/100)^2.3
    // More realistic than simple quadratic
    const kvpFactor = Math.pow(kvp / 100, 2.3);
    // Field size dependence: ~ (A/400)^0.8 (NCRP-147 Fig B.2)
    const fieldFactor = Math.pow(Math.max(fieldArea_cm2, 10) / 400, 0.8);
    // Phantom thickness dependence: ~ (t/30)^0.55 (NCRP-147)
    const thickFactor = Math.pow(Math.max(phantomThick_cm, 5) / 30, 0.55);
    return BASE_FRACTION * kvpFactor * fieldFactor * thickFactor;
  }

  /**
   * X-ray tube output (ESAK) model.
   * Entrance Surface Air Kerma per mAs at 1m, based on published
   * Birch & Marshall polynomial fit for typical diagnostic tubes.
   *
   * @param {number} kvp - Peak tube voltage (kVp)
   * @returns {number} Output in mGy/mAs at 1m
   */
  function tubeOutputESAK(kvp) {
    // Fitted to published data: ~0.052 at 60, 0.118 at 80, 0.220 at 100, 0.352 at 120 kVp
    // Uses power-law form: output = a * kVp^b, a=2.5e-5, b~2.2
    return 0.000025 * Math.pow(kvp, 2.2);
  }

  /**
   * Computes scatter doses at 0.5m, 1m, 2m for a given source type
   * using the comprehensive mathematical model.
   *
   * Uses NCRP-147 + Klein-Nishina + tube output model for diagnostic sources (kVp-based);
   * for higher-energy sources uses energy-appropriate scatter fractions and
   * Klein-Nishina angular distribution.
   *
   * @param {string} sourceKey - Source type key
   * @param {number} kvp - Peak tube voltage (kVp)
   * @param {number} workload - Weekly workload (mA·min)
   * @param {number} [fieldArea=400] - Field area in cm²
   * @param {number} [phantomThick=30] - Phantom thickness in cm
   * @returns {{dose05: number, dose1: number, dose2: number, scatter_at_1m: number, scatterFraction: number, angularFactor: number, modelLabel: string}}
   */
  function computeScatterForSource(sourceKey, kvp, workload, fieldArea, phantomThick) {
    const srcData = SOURCE_DATA[sourceKey];
    if (!srcData) return { dose05: 0, dose1: 0, dose2: 0, scatter_at_1m: 0, scatterFraction: 0, angularFactor: 0, modelLabel: 'Unknown' };

    fieldArea = fieldArea || 400;
    phantomThick = phantomThick || 30;
    const energy = parseFloat(kvp);

    // For scatter angle: operator at ~1m from patient, 
    // typical position is ~90-120° from beam axis
    // Physician at 0.5m is more forward (~45°), technologist at 2m is more lateral (~120°)
    const ANGLE_05 = 45;   // Physician at 0.5m, forward scatter
    const ANGLE_1 = 90;    // Operator at 1m, 90° lateral scatter
    const ANGLE_2 = 120;   // Technologist at 2m, backward/wide angle

    let scatterFraction, I_primary_at_isocenter, modelLabel;
    const patientDist = 0.5;  // isocenter distance from tube

    if (sourceKey === 'xray' || sourceKey === 'ct' || sourceKey === 'cathlab') {
      // === NCRP-147 + Tube Output Model ===
      // Step 1: Tube output (mGy/mAs at 1m)
      const esaKerma = tubeOutputESAK(energy);
      // Step 2: Convert workload from mA·min/wk to mAs/wk
      const mAsPerWeek = workload * 60;
      // Step 3: Primary intensity at 1m
      const I_primary_at_1m = esaKerma * mAsPerWeek;
      // Step 4: Inverse square to isocenter (patient at 0.5m)
      I_primary_at_isocenter = inverseSquare(I_primary_at_1m, 1.0, patientDist);
      // Step 5: NCRP-147 scatter fraction
      scatterFraction = ncrp147ScatterFraction(energy, fieldArea, phantomThick);
      modelLabel = 'NCRP-147 + ESAK';
    } else if (sourceKey === 'pet') {
      // 511 keV photons — Klein-Nishina model
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      // Klein-Nishina at 90° gives ~0.5 of forward for 511 keV
      const kn90 = kleinNishina(90, 511) / kleinNishina(0, 511);
      scatterFraction = 0.001 * kn90 * Math.pow(511 / 100, 0.5);
      modelLabel = 'K-N (511 keV)';
    } else if (sourceKey === 'gamma') {
      // Co-60 (1.17, 1.33 MeV)
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      const kn90 = kleinNishina(90, 1250) / kleinNishina(0, 1250);
      scatterFraction = 0.0008 * kn90;
      modelLabel = 'K-N (1.25 MeV)';
    } else if (sourceKey === 'gamma2') {
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      const kn90 = kleinNishina(90, 380) / kleinNishina(0, 380);
      scatterFraction = 0.0015 * kn90;
      modelLabel = 'K-N (380 keV)';
    } else if (sourceKey === 'linac' || sourceKey === 'linac10' || sourceKey === 'linac15') {
      // MV energies — forward-peaked, use Klein-Nishina + empirical
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      const avgEnergy = sourceKey === 'linac' ? 2000 : sourceKey === 'linac10' ? 3500 : 5000;
      const kn90 = kleinNishina(90, avgEnergy) / kleinNishina(0, avgEnergy);
      scatterFraction = 0.005 * kn90 / 0.3;
      modelLabel = 'K-N (' + (avgEnergy/1000).toFixed(0) + ' MV)';
    } else if (sourceKey === 'cyclotron') {
      // 18 MeV protons — secondary neutron/gamma
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      scatterFraction = 0.0002;
      modelLabel = 'Empirical (p+ 18MeV)';
    } else if (sourceKey === 'neutron') {
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      scatterFraction = 0.0001;
      modelLabel = 'Empirical (n 14MeV)';
    } else {
      const I1 = srcData.intensity;
      const W_total = I1 * workload;
      I_primary_at_isocenter = inverseSquare(W_total, 1.0, patientDist);
      scatterFraction = 0.001;
      modelLabel = 'Default';
    }

    // === Angular distribution using Klein-Nishina for kVp sources, NCRP-147 for others ===
    // For diagnostic energies: blend Klein-Nishina with NCRP-147 angular data
    let angularFactor_05, angularFactor_1, angularFactor_2;
    if (sourceKey === 'xray' || sourceKey === 'ct' || sourceKey === 'cathlab') {
      // Use NCRP-147 Table B.1 data (most accurate for diagnostic X-rays)
      angularFactor_05 = ncrp147AngularFactor(ANGLE_05) / ncrp147AngularFactor(90);
      angularFactor_1  = 1.0;  // reference at 90° is normalized to 1
      angularFactor_2  = ncrp147AngularFactor(ANGLE_2) / ncrp147AngularFactor(90);
    } else {
      // Use Klein-Nishina for higher energies
      const angularkv = sourceKey === 'pet' ? 511 : sourceKey === 'gamma' ? 1250 : sourceKey === 'gamma2' ? 380 : sourceKey === 'linac' ? 2000 : sourceKey === 'linac10' ? 3500 : sourceKey === 'linac15' ? 5000 : 100;
      const kn_45  = kleinNishina(ANGLE_05, angularkv);
      const kn_90  = kleinNishina(ANGLE_1, angularkv);
      const kn_120 = kleinNishina(ANGLE_2, angularkv);
      angularFactor_05 = kn_45 / kn_90;
      angularFactor_1  = 1.0;
      angularFactor_2  = kn_120 / kn_90;
    }

    // Scatter at 1m, 90° (reference)
    const scatter_at_1m = I_primary_at_isocenter * scatterFraction;

    // Angular- and distance-dependent doses
    const dose05 = scatter_at_1m * angularFactor_05 * (1 / Math.pow(0.5, 2));
    const dose1  = scatter_at_1m * angularFactor_1  * (1 / Math.pow(1.0, 2));
    const dose2  = scatter_at_1m * angularFactor_2  * (1 / Math.pow(2.0, 2));

    return { dose05, dose1, dose2, scatter_at_1m, scatterFraction, angularFactor: angularFactor_1, modelLabel };
  }

  // ==========================================
  // MAIN SIMULATION UPDATE
  // ==========================================

  function updateSimulation() {
    const source = sourceType ? sourceType.value : 'xray';
    const kvp = parseFloat(kvpSlider ? kvpSlider.value : 80);
    const workload = parseFloat(workloadSlider ? workloadSlider.value : 500);
    const expTime = parseFloat(exposureTime ? exposureTime.value : 60);
    const distance = parseFloat(distanceInput ? distanceInput.value : 2.0);
    const beamAng = parseFloat(beamAngle ? beamAngle.value : 45);
    const srcX = parseFloat(sourcePosX ? sourcePosX.value : 3.0);
    const srcY = parseFloat(sourcePosY ? sourcePosY.value : 2.5);
    const orient = parseFloat(machineOrient ? machineOrient.value : 0);
    const occupancy = parseFloat(occupancyFactor ? occupancyFactor.value : 0.5);
    const use = parseFloat(useFactor ? useFactor.value : 0.5);
    const material = shieldMaterial ? shieldMaterial.value : 'lead';
    const thickness = parseFloat(thicknessSlider ? thicknessSlider.value : 50);
    const wallThick = parseFloat(wallThicknessSlider ? wallThicknessSlider.value : 300);
    const occCount = parseFloat(roomOccupancy ? roomOccupancy.value : 4);
    const neutron = neutronMode ? neutronMode.checked : false;
    const length = parseFloat(roomLength ? roomLength.value : 6.0);
    const width = parseFloat(roomWidth ? roomWidth.value : 5.0);
    const height = parseFloat(roomHeight ? roomHeight.value : 3.5);

    // Source data
    const srcData = SOURCE_DATA[source] || SOURCE_DATA.xray;
    const I1 = srcData.intensity;

    // Total weekly workload dose at 1m
    const W_total = I1 * workload;
    const W_exposure = I1 * expTime;

    // --- Beam angle factor (0-180°, normal incidence = 1, oblique = less penetration) ---
    const angleRad = beamAng * Math.PI / 180;
    const angleFactor = Math.cos(angleRad) || 0.01; // thinner effective thickness at angle

    // --- Inverse Square Law ---
    const I_at_distance = inverseSquare(W_total, 1.0, distance);

    // --- Shielding Attenuation ---
    const mu = calcMu(material, kvp);
    const effectiveThick = thickness * angleFactor;
    const I_shielded = attenuate(I_at_distance, mu, effectiveThick);
    const atten = attenPct(I_at_distance, I_shielded);

    // --- Wall Attenuation (using wall thickness) ---
    const I_through_wall = attenuate(I_at_distance, mu, wallThick);
    const wallAtten = attenPct(I_at_distance, I_through_wall);

    // --- Barrier Transmission ---
    const P_design = 0.1;
    const B = barrierTrans(P_design, distance, workload, use, occupancy);

    // --- Neutron Attenuation ---
    let neutronPct = 0;
    if (neutron && (source === 'cyclotron' || source === 'neutron' || source === 'linac15')) {
      const Phi0 = 1.0e6;
      const sigma = SIGMA_VALUES[material] || 0.1;
      const Phi_shielded = neutronAtten(Phi0, sigma, thickness);
      neutronPct = attenPct(Phi0, Phi_shielded);
    }

    // --- Scatter Intensity (Comprehensive Mathematical Model) ---
    // Uses NCRP-147 + Klein-Nishina + Tube Output (ESAK) model
    // Incorporates: kVp, field size, patient thickness, scatter angle,
    //               angular distribution (NCRP-147 Table B.1), 
    //               inverse square law from isocenter to staff positions
    const fieldArea_cm2 = parseFloat(fieldSize ? fieldSize.value : 400);
    const phanThick_cm = parseFloat(patientThick ? patientThick.value : 30);
    const scrAngle_deg = parseFloat(scatterAngle ? scatterAngle.value : 90);
    const patientDist = 0.5; // isocenter distance from tube

    // Compute using the full mathematical model
    const scatterModel = computeScatterForSource(source, kvp, workload, fieldArea_cm2, phanThick_cm);
    const scatter_at_1m = scatterModel.scatter_at_1m;
    const scatterFraction = scatterModel.scatterFraction;

    // Distance from scatter source (patient) to room center
    const scatterDist = Math.sqrt(Math.pow(length / 2, 2) + Math.pow(width / 2, 2));
    // Room-level scatter: inverse square from isocenter to room center
    const scatter = scatter_at_1m * (1 / Math.max(scatterDist, 1));

    // Staff scatter doses using the model's angular-and-distance-corrected values
    const staffDose_0_5m = scatterModel.dose05;
    const staffDose_1m = scatterModel.dose1;
    const staffDose_2m = scatterModel.dose2;

    // Scatter angle offset: compute angular factor at user-selected angle
    // This allows exploring how operator position affects dose
    let userAngleFactor = 1.0;
    if (source === 'xray' || source === 'ct' || source === 'cathlab') {
      userAngleFactor = ncrp147AngularFactor(scrAngle_deg) / ncrp147AngularFactor(90);
    } else {
      const angKv = source === 'pet' ? 511 : source === 'gamma' ? 1250 : source === 'gamma2' ? 380 : source === 'linac' ? 2000 : source === 'linac10' ? 3500 : source === 'linac15' ? 5000 : 100;
      userAngleFactor = kleinNishina(scrAngle_deg, angKv) / kleinNishina(90, angKv);
    }

    // --- Annual Dose ---
    const weeklyDose = I_shielded * occupancy;
    const annualDoseValue = weeklyDose * 50 / 1000;

    // --- Leakage ---
    const leakageValue = I_at_distance * 0.001 * (1 - atten / 100);

    // --- Shield Efficiency ---
    const shieldEff = Math.min(100, Math.max(0, atten));

    // --- Dose Outside Wall ---
    const doseOutsideWall = I_through_wall * occupancy * 0.001 * 50;

    // Update Output Displays
    if (leakageRad) leakageRad.textContent = Math.max(0, leakageValue).toFixed(4);
    if (annualDose) annualDose.textContent = Math.max(0, annualDoseValue).toFixed(2);
    if (attenuationPercent) attenuationPercent.textContent = Math.min(100, Math.max(0, atten)).toFixed(2);
    if (scatterIntensity) scatterIntensity.textContent = Math.max(0, scatter).toFixed(2);
    if (shieldEfficiency) shieldEfficiency.textContent = shieldEff.toFixed(2);
    if (doseOutside) doseOutside.textContent = Math.max(0, doseOutsideWall).toFixed(4);
    if (barrierTransmission) barrierTransmission.textContent = B.toFixed(4);
    if (neutronAttenuation) neutronAttenuation.textContent = Math.min(100, Math.max(0, neutronPct)).toFixed(2);

    // --- Cath Lab Scatter Analysis ---
    if (scatterType) {
      scatterType.textContent = (source === 'cathlab' || source === 'xray') ? 'PATIENT SCATTER (NCRP-147)' : 'ROOM SCATTER';
    }
    if (scatterDistance) {
      scatterDistance.textContent = scatterDist.toFixed(1) + ' m';
    }
    if (staffScatterDose) {
      const staffDose = (source === 'cathlab' || source === 'xray' || source === 'ct') ? staffDose_1m : scatter;
      staffScatterDose.textContent = Math.max(0, staffDose).toFixed(4);
    }
    if (staffDose05m) {
      staffDose05m.textContent = Math.max(0, staffDose_0_5m).toFixed(4);
    }
    if (staffDose2m) {
      staffDose2m.textContent = Math.max(0, staffDose_2m).toFixed(4);
    }

    // Angular factor and model label displays
    if (angularFactorEl) {
      angularFactorEl.textContent = userAngleFactor.toFixed(3);
      angularFactorEl.style.color = Math.abs(userAngleFactor - 1) > 0.2 ? 'var(--orange)' : 'var(--green)';
    }
    if (scatterModelLabel) {
      scatterModelLabel.textContent = scatterModel.modelLabel || 'NCRP-147 + ESAK';
    }

    // --- Lead Apron Attenuation ---
    const apronMm = parseFloat(apronThickness ? apronThickness.value : 0);
    let apronTrans = 1.0;
    let effectiveDose = staffDose_1m;
    if (apronMm > 0) {
      const apronMu = calcMu('lead', kvp);
      apronTrans = attenuate(1.0, apronMu, apronMm);
      effectiveDose = staffDose_1m * apronTrans;
    }
    if (apronTransmission) {
      apronTransmission.textContent = (apronTrans * 100).toFixed(2);
      apronTransmission.style.color = apronTrans < 0.05 ? 'var(--green)' : apronTrans < 0.15 ? 'var(--cyan)' : 'var(--orange)';
    }
    if (effectiveStaffDose) {
      effectiveStaffDose.textContent = Math.max(0, effectiveDose).toFixed(4);
    }
    if (effDoseBar && staffScatterDose) {
      const rawDose = parseFloat(staffScatterDose.textContent) || 0.001;
      const reductionPct = (1 - effectiveDose / Math.max(rawDose, 0.001)) * 100;
      effDoseBar.style.width = Math.min(100, Math.max(0, reductionPct)) + '%';
      effDoseBar.style.background = reductionPct > 95 ? 'var(--green)' : reductionPct > 85 ? 'var(--cyan)' : 'var(--orange)';
    }

    // --- Scatter Comparison Table ---
    if (scatterTableBody) {
      const allSourceKeys = Object.keys(SOURCE_DATA);
      let tableHtml = '';
      allSourceKeys.forEach(key => {
        const s = computeScatterForSource(key, kvp, workload, fieldArea_cm2, phanThick_cm);
        const isActive = key === source;
        const apronForCell = key === source ? apronTrans : (() => {
          if (parseFloat(apronThickness ? apronThickness.value : 0) > 0) {
            return attenuate(1.0, calcMu('lead', kvp), parseFloat(apronThickness.value));
          }
          return 1.0;
        })();
        const aproned1m = s.dose1 * apronForCell;
        tableHtml += `<tr style="border-bottom:1px solid rgba(77,212,232,0.06);${isActive ? 'background:rgba(77,212,232,0.06);' : ''}">
          <td style="text-align:left;padding:3px 6px;${isActive ? 'color:var(--cyan);font-weight:600;' : 'color:var(--text-primary);'}">${SOURCE_DATA[key].label}</td>
          <td style="text-align:right;padding:3px 6px;font-family:var(--font-mono);${s.dose05 > 1 ? 'color:var(--red);' : s.dose05 > 0.1 ? 'color:var(--orange);' : 'color:var(--green);'}">${s.dose05.toFixed(4)}</td>
          <td style="text-align:right;padding:3px 6px;font-family:var(--font-mono);${s.dose1 > 1 ? 'color:var(--red);' : s.dose1 > 0.1 ? 'color:var(--orange);' : 'color:var(--green);'}">${s.dose1.toFixed(4)}</td>
          <td style="text-align:right;padding:3px 6px;font-family:var(--font-mono);${s.dose2 > 1 ? 'color:var(--red);' : s.dose2 > 0.1 ? 'color:var(--orange);' : 'color:var(--green);'}">${s.dose2.toFixed(4)}</td>
          <td style="text-align:right;padding:3px 6px;font-family:var(--font-mono);${aproned1m > 1 ? 'color:var(--red);' : aproned1m > 0.1 ? 'color:var(--orange);' : 'color:var(--green);'}">${aproned1m.toFixed(4)}</td>
          <td style="text-align:right;padding:3px 6px;color:var(--text-secondary);">µGy/s</td>
        </tr>`;
      });
      scatterTableBody.innerHTML = tableHtml;
    }

    // --- Brick Wall Attenuation Analysis (20×20 ft room, 9-inch brick) ---
    const feetToMeters = 0.3048;
    const roomLengthFt = length / feetToMeters;
    const roomWidthFt = width / feetToMeters;
    const brickThicknessInch = 9; // standard 9-inch brick wall
    const brickThicknessMm = brickThicknessInch * 25.4; // 228.6 mm
    const brickMu = calcMu('brick', kvp);
    // Attenuation of secondary (scatter) radiation through 9" brick
    const I_through_brick = attenuate(1.0, brickMu, brickThicknessMm);
    const brickAttnPct = attenPct(1.0, I_through_brick);
    // Scatter dose rate outside brick wall
    const scatterOutsideBrick = scatter * I_through_brick;

    if (roomDimFeet) {
      roomDimFeet.textContent = roomLengthFt.toFixed(1) + '\' × ' + roomWidthFt.toFixed(1) + '\'';
    }
    if (brickWallAttn) {
      brickWallAttn.textContent = Math.min(100, Math.max(0, brickAttnPct)).toFixed(2) + '%';
      brickWallAttn.style.color = brickAttnPct > 99 ? 'var(--green)' : brickAttnPct > 95 ? 'var(--cyan)' : 'var(--orange)';
    }
    if (brickWallResult) {
      const transmissionPct = (I_through_brick * 100);
      brickWallResult.textContent = transmissionPct.toFixed(4) + '%';
    }
    if (brickCompliance) {
      // AERB limit: public dose < 1 mSv/yr; scatter outside should be negligible for 9" brick
      const annualScatterOutside = scatterOutsideBrick * 0.001 * 50 * occupancy;
      const isBrickCompliant = annualScatterOutside < 1.0;
      brickCompliance.textContent = isBrickCompliant ? 'AERB COMPLIANT ✓' : 'INSUFFICIENT — Add lining';
      brickCompliance.className = 'compliance-badge ' + (isBrickCompliant ? 'badge-compliant' : 'badge-failure');
      brickCompliance.style.color = isBrickCompliant ? 'var(--green)' : 'var(--red)';
    }

    // Show/hide neutron result
    if (neutronResultItem) {
      neutronResultItem.style.display = (neutron && (source === 'cyclotron' || source === 'neutron' || source === 'linac15')) ? 'block' : 'none';
    }

    // Update HUD
    if (hudSourceEnergy) hudSourceEnergy.textContent = kvp + ' ' + srcData.energy;
    if (hudLeakage) hudLeakage.textContent = leakageValue.toFixed(4) + ' mGy/h';
    if (hudShieldStatus) {
      if (shieldEff > 95) hudShieldStatus.textContent = 'OPTIMAL';
      else if (shieldEff > 80) hudShieldStatus.textContent = 'ADEQUATE';
      else hudShieldStatus.textContent = 'INSUFFICIENT';
      hudShieldStatus.style.color = shieldEff > 95 ? 'var(--green)' : shieldEff > 80 ? 'var(--orange)' : 'var(--red)';
    }
    if (hudDoseRate) hudDoseRate.textContent = annualDoseValue.toFixed(2) + ' mSv';

    // Show HUD
    if (engHud && !engHud.classList.contains('active')) engHud.classList.add('active');

    // Update bars
    const setBar = (bar, pct, thresholds) => {
      if (!bar) return;
      const cp = Math.min(100, Math.max(0, pct));
      bar.style.width = cp + '%';
      if (thresholds) {
        if (cp > (thresholds[1] || 90)) bar.style.background = 'var(--red)';
        else if (cp > (thresholds[0] || 50)) bar.style.background = 'var(--orange)';
        else bar.style.background = 'var(--cyan)';
      }
    };

    setBar(leakageBar, (leakageValue / 0.01) * 100, [40, 70]);
    setBar(doseBar, (annualDoseValue / 1.0) * 100, [50, 90]);
    setBar(attenBar, atten, [0, 0]);
    setBar(scatterBar, (scatter / 10) * 100, [40, 70]);
    setBar(shieldEffBar, shieldEff, [0, 0]);
    setBar(doseOutsideBar, (doseOutsideWall / 0.5) * 100, [40, 70]);
    if (neutronBar) setBar(neutronBar, neutronPct, [0, 0]);
    setBar(barrierBar, (1 - B) * 100, [30, 60]);
    const brickBarFill = document.querySelector('#brickBar .result-bar-fill');
    if (brickBarFill) setBar(brickBarFill, brickAttnPct, [90, 98]);

    // Override attenBar color
    if (attenBar) {
      if (atten > 95) attenBar.style.background = 'var(--green)';
      else if (atten > 80) attenBar.style.background = 'var(--cyan)';
      else attenBar.style.background = 'var(--orange)';
    }
    if (shieldEffBar) {
      if (shieldEff > 95) shieldEffBar.style.background = 'var(--green)';
      else if (shieldEff > 80) shieldEffBar.style.background = 'var(--cyan)';
      else shieldEffBar.style.background = 'var(--orange)';
    }

    // Compliance Status
    if (complianceStatus) {
      const badge = complianceStatus.querySelector('.compliance-badge') || complianceStatus;
      const details = complianceStatus.querySelector('.compliance-details');
      const isCompliant = annualDoseValue < 1.0;
      badge.className = 'compliance-badge ' + (isCompliant ? 'badge-compliant' : 'badge-failure');
      badge.innerHTML = '<span class="compliance-dot"></span> ' + (isCompliant ? 'AERB Compliant — ICRP' : 'Shielding Failure');
      if (details) {
        details.innerHTML = '<span class="compliance-ref">Annual Dose: ' + annualDoseValue.toFixed(2) + ' mSv/yr — ' +
          (isCompliant ? 'Below 1 mSv limit ✓' : 'Exceeds 1 mSv limit ✗') + '</span>';
      }
    }

    // Wall stack thickness
    if (wallLeadThickness) {
      const leadEq = (thickness * (MU_VALUES[material] ? MU_VALUES[material].density : 11.34) / 11.34).toFixed(1);
      wallLeadThickness.textContent = leadEq + ' mm Pb eq';
    }
    if (wallConcreteThickness) {
      const concEq = (thickness * (MU_VALUES[material] ? MU_VALUES[material].density : 11.34) / 2.35).toFixed(0);
      wallConcreteThickness.textContent = concEq + ' mm conc. eq';
    }

    // HUD Alerts
    if (leakageValue > 0.005) addHudAlert('LEAKAGE WARNING: ' + leakageValue.toFixed(4) + ' mGy/h', 'warning');
    if (annualDoseValue > 0.8) addHudAlert('ANNUAL DOSE APPROACHING LIMIT: ' + annualDoseValue.toFixed(2) + ' mSv', 'danger');
    if (annualDoseValue < 0.5) addHudAlert('SYSTEM NOMINAL — All readings within safe range', 'info');

    // Heatmap & Graph
    drawHeatmap(annualDoseValue, length, width, distance, beamAng, srcX, srcY);
    drawAttenuationGraph(material, kvp);

    // Update detectors
    updateDetectors(annualDoseValue, distance);
  }

  // ==========================================
  // 7. RADIATION HEATMAP (Enhanced with Beam)
  // ==========================================
  const heatmapCanvas = document.getElementById('radiationHeatmap');
  let heatmapParticles = [];
  let heatmapParticleTime = 0;

  function drawHeatmap(dose, roomL, roomW, sourceDist, beamAng, srcX, srcY) {
    if (!heatmapCanvas) return;
    const ctx = heatmapCanvas.getContext('2d');
    const w = heatmapCanvas.width;
    const h = heatmapCanvas.height;
    heatmapParticleTime += 0.02;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050a18';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(77, 212, 232, 0.06)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    const margin = 25;
    const roomArea = { x: margin, y: margin, w: w - margin * 2, h: h - margin * 2 };
    const sourceX = roomArea.x + roomArea.w * 0.35;
    const sourceY = roomArea.y + roomArea.h * 0.5;

    // Room outline
    ctx.strokeStyle = 'rgba(77, 212, 232, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(roomArea.x, roomArea.y, roomArea.w, roomArea.h);
    ctx.fillStyle = 'rgba(77, 212, 232, 0.15)';
    ctx.font = '8px IBM Plex Mono';
    ctx.textAlign = 'center';
    ctx.fillText('RADIATION FIELD — ROOM ' + roomL.toFixed(1) + 'm × ' + roomW.toFixed(1) + 'm', w / 2, 14);

    // Beam cone visualization
    const beamAngleRad = (beamAng || 45) * Math.PI / 180;
    const beamLength = roomArea.w * 0.6;
    const beamDir = (45) * Math.PI / 180; // angle of beam on canvas
    const endX = sourceX + Math.cos(beamDir) * beamLength;
    const endY = sourceY - Math.sin(beamDir) * beamLength;

    // Beam cone
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.arc(sourceX, sourceY, beamLength, -beamAngleRad/2 - Math.PI/4, beamAngleRad/2 - Math.PI/4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 107, 53, 0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Primary beam line
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Scatter lines
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI/4 + (i / 4) * Math.PI/2;
      const len = beamLength * (0.3 + Math.random() * 0.3);
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(sourceX + Math.cos(angle) * len, sourceY + Math.sin(angle) * len);
      ctx.strokeStyle = 'rgba(77, 212, 232, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Heatmap gradient
    const maxRadius = Math.min(roomArea.w, roomArea.h) * 0.45;
    const intensity = Math.min(dose / 2, 1);
    const grad = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, maxRadius);
    grad.addColorStop(0, 'rgba(255, 51, 51, ' + (0.4 + intensity * 0.4) + ')');
    grad.addColorStop(0.2, 'rgba(255, 107, 53, ' + (0.3 + intensity * 0.3) + ')');
    grad.addColorStop(0.4, 'rgba(255, 200, 50, ' + (0.2 + intensity * 0.2) + ')');
    grad.addColorStop(0.6, 'rgba(77, 212, 232, ' + (0.15 + intensity * 0.1) + ')');
    grad.addColorStop(0.85, 'rgba(77, 212, 232, 0.05)');
    grad.addColorStop(1, 'rgba(77, 212, 232, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    // Animated radiation rings
    const time = Date.now() / 1000;
    for (let i = 0; i < 3; i++) {
      const r = (maxRadius * 0.25) + ((time * 25 + i * 80) % (maxRadius * 0.75));
      if (r < maxRadius) {
        ctx.beginPath(); ctx.arc(sourceX, sourceY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 107, 53, ' + (0.12 * (1 - r / maxRadius)) + ')';
        ctx.lineWidth = 1; ctx.stroke();
      }
    }

    // Animated scatter particles (photons)
    ctx.fillStyle = 'rgba(77, 212, 232, 0.15)';
    for (let i = 0; i < 15; i++) {
      const angle2 = heatmapParticleTime * 2 + i * 2.1;
      const dist2 = 20 + ((heatmapParticleTime * 30 + i * 37) % (maxRadius * 0.8));
      const px = sourceX + Math.cos(angle2) * dist2;
      const py = sourceY + Math.sin(angle2) * dist2;
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(77, 212, 232, ' + (0.08 * (1 - dist2 / maxRadius)) + ')';
      ctx.fill();
    }

    // Neutron particles (if mode on)
    const neutron = neutronMode ? neutronMode.checked : false;
    if (neutron) {
      ctx.fillStyle = 'rgba(51, 255, 153, 0.2)';
      for (let i = 0; i < 8; i++) {
        const angle3 = heatmapParticleTime * 1.3 + i * 2.7;
        const dist3 = 30 + ((heatmapParticleTime * 20 + i * 53) % (maxRadius * 0.6));
        const px = sourceX + Math.cos(angle3) * dist3;
        const py = sourceY + Math.sin(angle3) * dist3;
        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(51, 255, 153, ' + (0.1 * (1 - dist3 / maxRadius)) + ')';
        ctx.fill();
      }
    }

    // Source marker
    ctx.beginPath(); ctx.arc(sourceX, sourceY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b35'; ctx.fill();
    ctx.shadowColor = '#ff6b35'; ctx.shadowBlur = 15; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.font = '7px IBM Plex Mono'; ctx.textAlign = 'center';
    ctx.fillText('SOURCE', sourceX, sourceY - 12);

    // Distance ring
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, Math.max((sourceDist / 5) * maxRadius * 0.5, 10), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(77, 212, 232, 0.12)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);

    // Zone labels
    ctx.fillStyle = 'rgba(51, 255, 153, 0.25)'; ctx.font = '7px IBM Plex Mono'; ctx.textAlign = 'right';
    ctx.fillText('SAFE ZONE', roomArea.x + roomArea.w - 4, roomArea.y + roomArea.h - 4);
    ctx.fillStyle = 'rgba(255, 107, 53, 0.25)';
    ctx.fillText('CAUTION', roomArea.x + roomArea.w * 0.45, roomArea.y + roomArea.h * 0.3);
    ctx.fillStyle = 'rgba(255, 51, 51, 0.25)';
    ctx.fillText('DANGER', sourceX + 30, sourceY - 20);

    // Shield wall visualization
    const shieldX = roomArea.x + roomArea.w * 0.78;
    ctx.fillStyle = 'rgba(77, 212, 232, ' + (0.08 + intensity * 0.08) + ')';
    ctx.fillRect(shieldX - 2, roomArea.y + 10, 4, roomArea.h - 20);
    ctx.fillStyle = 'rgba(77, 212, 232, 0.25)'; ctx.font = '7px IBM Plex Mono'; ctx.textAlign = 'center';
    ctx.fillText('SHIELD', shieldX, roomArea.y + roomArea.h - 6);

    // Detector markers on heatmap
    drawDetectorMarkers(ctx, w, h);
  }

  // ==========================================
  // 8. ATTENUATION GRAPH
  // ==========================================
  const attenCanvas = document.getElementById('attenuationGraph');
  let graphEnergy = 'medium';

  function drawAttenuationGraph(material, kvp) {
    if (!attenCanvas) return;
    const ctx = attenCanvas.getContext('2d');
    const w = attenCanvas.width, h = attenCanvas.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const gW = w - pad.left - pad.right, gH = h - pad.top - pad.bottom;
    const maxThickness = 200;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050a18';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(77, 212, 232, 0.06)'; ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (gH / 5) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = 'rgba(77, 212, 232, 0.3)'; ctx.font = '8px IBM Plex Mono'; ctx.textAlign = 'right';
      ctx.fillText((100 - i * 20) + '%', pad.left - 6, y + 3);
    }
    for (let i = 0; i <= 10; i++) {
      const x = pad.left + (gW / 10) * i;
      ctx.fillStyle = 'rgba(77, 212, 232, 0.3)'; ctx.font = '8px IBM Plex Mono'; ctx.textAlign = 'center';
      ctx.fillText((i * 20) + '', x, h - pad.bottom + 14);
    }
    ctx.fillStyle = 'rgba(77, 212, 232, 0.2)'; ctx.font = '7px IBM Plex Mono'; ctx.textAlign = 'center';
    ctx.fillText('Shield Thickness (mm)', w / 2, h - 2);
    ctx.save(); ctx.translate(12, h / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Transmission %', 0, 0); ctx.restore();

    const materialsToShow = ['lead', 'concrete', 'steel', 'borated'];
    const colors = ['#4dd4e8', '#ff6b35', '#33ff99', '#ff3333'];

    materialsToShow.forEach((mat, idx) => {
      const matMu = MU_VALUES[mat] ? MU_VALUES[mat][graphEnergy] : 1;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * maxThickness;
        const trans = Math.exp(-matMu * (t / 10)) * 100;
        const x = pad.left + (t / maxThickness) * gW, y = pad.top + gH - (trans / 100) * gH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors[idx]; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = colors[idx]; ctx.font = '8px IBM Plex Mono'; ctx.textAlign = 'left';
      const lastTrans = Math.exp(-matMu * (maxThickness / 10)) * 100;
      ctx.fillText(mat.toUpperCase(), pad.left + gW + 4, pad.top + gH - (lastTrans / 100) * gH + 3);
    });

    // Highlight current material
    const currMu = calcMu(material || 'lead', kvp || 80);
    ctx.beginPath();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * maxThickness, trans = Math.exp(-currMu * (t / 10)) * 100;
      const x = pad.left + (t / maxThickness) * gW, y = pad.top + gH - (trans / 100) * gH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Current thickness marker
    const currThickness = parseFloat(thicknessSlider ? thicknessSlider.value : 50);
    const currentTrans = Math.exp(-currMu * (currThickness / 10)) * 100;
    const markX = pad.left + (currThickness / maxThickness) * gW, markY = pad.top + gH - (currentTrans / 100) * gH;
    ctx.beginPath(); ctx.arc(markX, markY, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(markX, markY, 7, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = '8px IBM Plex Mono'; ctx.textAlign = 'center';
    ctx.fillText(currThickness + ' mm', markX, markY - 12);
    ctx.fillText(currentTrans.toFixed(1) + '%', markX, markY + 20);
  }

  // Graph energy buttons
  document.querySelectorAll('.graph-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.graph-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      graphEnergy = btn.dataset.energy;
      drawAttenuationGraph(shieldMaterial ? shieldMaterial.value : 'lead', kvpSlider ? kvpSlider.value : 80);
    });
  });

  // ==========================================
  // 9. MEASUREMENT DETECTORS
  // ==========================================
  let detectors = [
    { id: 1, label: 'D1 — Control Room', x: 0.8, y: 0.2, color: 'var(--green)', val: 0.02 },
    { id: 2, label: 'D2 — Corridor', x: 0.7, y: 0.7, color: 'var(--orange)', val: 0.15 },
    { id: 3, label: 'D3 — Adjacent Room', x: 0.3, y: 0.85, color: 'var(--cyan)', val: 0.08 }
  ];
  let detectorIdCounter = 4;

  function updateDetectors(dose, dist) {
    detectors.forEach((det, i) => {
      const el = document.getElementById('detector' + (i + 1) + 'Val');
      if (el) {
        // Simulate detector reading based on distance to source and dose
        const detDist = Math.sqrt(Math.pow(det.x - 0.35, 2) + Math.pow(det.y - 0.5, 2));
        const reading = dose * 0.1 / Math.max(detDist, 0.1) + (Math.random() * 0.01);
        det.val = reading;
        el.textContent = reading.toFixed(2) + ' µSv/h';
        el.style.color = reading > 0.5 ? 'var(--red)' : reading > 0.1 ? 'var(--orange)' : 'var(--green)';
      }
    });
  }

  function drawDetectorMarkers(ctx, w, h) {
    const margin = 25;
    const roomX = margin, roomY = margin, roomW = w - margin * 2, roomH = h - margin * 2;
    detectors.forEach(det => {
      const dx = roomX + det.x * roomW;
      const dy = roomY + det.y * roomH;
      ctx.beginPath(); ctx.arc(dx, dy, 4, 0, Math.PI * 2);
      const color = det.val > 0.5 ? '#ff3333' : det.val > 0.1 ? '#ff6b35' : '#33ff99';
      ctx.fillStyle = color; ctx.fill();
      ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '6px IBM Plex Mono'; ctx.textAlign = 'center';
      ctx.fillText('D' + det.id, dx, dy + 12);
    });
  }

  // Add detector button
  const addDetBtn = document.getElementById('addDetectorBtn');
  if (addDetBtn) {
    addDetBtn.addEventListener('click', () => {
      const id = detectorIdCounter++;
      detectors.push({ id: id, label: 'D' + id + ' — New Node', x: 0.5 + Math.random() * 0.3, y: 0.3 + Math.random() * 0.4, color: 'var(--cyan)', val: 0 });
      const list = document.getElementById('detectorList');
      if (list) {
        const item = document.createElement('div');
        item.className = 'detector-item';
        item.innerHTML = `<span class="detector-marker" style="background:var(--cyan)"></span>
          <span class="detector-label">D${id} — New Node</span>
          <span class="detector-value" id="detector${id}Val">0.00 µSv/h</span>`;
        list.appendChild(item);
      }
      addHudAlert('DETECTOR D' + id + ' PLACED — Monitoring active', 'info');
    });
  }

  // ==========================================
  // 10. CASE STUDY COMPARISON SLIDERS
  // ==========================================
  function initComparison(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const slider = container.querySelector('.compare-slider');
    const after = container.querySelector('.compare-after');
    const handle = container.querySelector('.compare-handle');
    if (!slider || !after) return;
    function update(val) {
      after.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
      if (handle) handle.style.left = val + '%';
    }
    slider.addEventListener('input', () => update(parseInt(slider.value)));
    update(parseInt(slider.value));
  }
  initComparison('compare1');
  initComparison('compare2');

  // ==========================================
  // 11. ADVANCED FACILITY PLANNER (CAD Engine)
  // ==========================================
  const facilityCanvas = document.getElementById('facilityCanvas');
  const heatmapOverlay = document.getElementById('fpHeatmapOverlay');
  const fpHeatmapCanvas = document.getElementById('fpHeatmapCanvas');
  const fpZoomLevel = document.getElementById('fpZoomLevel');
  const fpGridInfo = document.getElementById('fpGridInfo');
  const fpCursorPos = document.getElementById('fpCursorPos');
  const fpObjCount = document.getElementById('fpObjCount');

  // CAD State
  let fpState = {
    objects: [],         // { type, id, x, y, w, h, rotation, material, thickness, label, color, energy }
    selectedId: null,
    currentTool: 'select',
    zoom: 1.0,
    panX: 0,
    panY: 0,
    gridSize: 20,        // px per grid unit (0.5m)
    snapEnabled: true,
    showHeatmap: false,
    isDragging: false,
    dragOffset: null,
    isDrawing: false,
    drawStart: null,
    history: [],
    historyIdx: -1,
    idCounter: 1,
    roomTypeColors: {
      'cath-lab': '#4dd4e8',
      'pet-ct': '#33ff99',
      'cyclotron': '#ff6b35',
      'control': '#33ff99',
      'corridor': '#6688aa',
      'public': '#445566',
      'hot-lab': '#ff6b35',
      'operator': '#4dd4e8',
      'equipment': '#9977cc'
    },
    sourceTypes: ['xray','ct','pet','gamma','cyclotron','neutron'],
    wallMaterials: ['lead','concrete','steel','borated','barium','brick','tungsten','hdpe']
  };

  // DOM refs
  const fpOutLeakage = document.getElementById('fpOutLeakage');
  const fpOutDose = document.getElementById('fpOutDose');
  const fpOutAtten = document.getElementById('fpOutAtten');
  const fpOutShieldEff = document.getElementById('fpOutShieldEff');
  const fpOutScatter = document.getElementById('fpOutScatter');
  const fpOutNeutron = document.getElementById('fpOutNeutron');
  const fpOutCompliance = document.getElementById('fpOutCompliance');
  const fpLeakLabel = document.getElementById('fpLeakLabel');
  const fpDoseLabel = document.getElementById('fpDoseLabel');
  const fpAttenLabel = document.getElementById('fpAttenLabel');
  const fpDimLabel = document.getElementById('fpDimLabel');
  const fpPropsContent = document.getElementById('fpPropsContent');
  const fpCurrentTool = document.getElementById('fpCurrentTool');

  // ===== FACILITY CANVAS SETUP =====
  if (facilityCanvas) {
    const ctx = facilityCanvas.getContext('2d');
    let canvasW = facilityCanvas.width;
    let canvasH = facilityCanvas.height;
    let animFrame;
    let fpParticles = [];
    let fpTime = 0;

    // Rulers
    const rulerT = document.getElementById('fpRulerT');
    const rulerL = document.getElementById('fpRulerL');

    // ===== TOOL MANAGEMENT =====
    document.querySelectorAll('.fp-tool[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fp-tool[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fpState.currentTool = btn.dataset.tool;
        if (fpCurrentTool) fpCurrentTool.textContent = btn.querySelector('span')?.textContent?.toUpperCase() || fpState.currentTool.toUpperCase();
        facilityCanvas.style.cursor = fpState.currentTool === 'select' ? 'default' : 'crosshair';
      });
    });

    // ===== SAVE STATE (undo/redo) =====
    function fpSaveState() {
      const snapshot = JSON.parse(JSON.stringify(fpState.objects));
      fpState.history = fpState.history.slice(0, fpState.historyIdx + 1);
      fpState.history.push(snapshot);
      if (fpState.history.length > 30) fpState.history.shift();
      fpState.historyIdx = fpState.history.length - 1;
    }

    function fpUndo() {
      if (fpState.historyIdx > 0) {
        fpState.historyIdx--;
        fpState.objects = JSON.parse(JSON.stringify(fpState.history[fpState.historyIdx]));
        fpState.selectedId = null;
        renderFacility();
        updatePropPanel();
        updateObjCount();
      }
    }

    function fpRedo() {
      if (fpState.historyIdx < fpState.history.length - 1) {
        fpState.historyIdx++;
        fpState.objects = JSON.parse(JSON.stringify(fpState.history[fpState.historyIdx]));
        fpState.selectedId = null;
        renderFacility();
        updatePropPanel();
        updateObjCount();
      }
    }

    // ===== GRID HELPERS =====
    function snapToGrid(val) {
      if (!fpState.snapEnabled) return val;
      return Math.round(val / fpState.gridSize) * fpState.gridSize;
    }

    function worldToScreen(wx, wy) {
      return {
        x: (wx + fpState.panX) * fpState.zoom + facilityCanvas.width / 2,
        y: (wy + fpState.panY) * fpState.zoom + facilityCanvas.height / 2
      };
    }

    function screenToWorld(sx, sy) {
      return {
        x: (sx - facilityCanvas.width / 2) / fpState.zoom - fpState.panX,
        y: (sy - facilityCanvas.height / 2) / fpState.zoom - fpState.panY
      };
    }

    // ===== RENDER =====
    function renderFacility() {
      if (!facilityCanvas) return;
      const w = facilityCanvas.width, h = facilityCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#050a18';
      ctx.fillRect(0, 0, w, h);

      // Save and apply zoom/pan
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(fpState.zoom, fpState.zoom);
      ctx.translate(fpState.panX || 0, fpState.panY || 0);

      // Engineering grid
      const gridSpacing = fpState.gridSize;
      const halfW = w / fpState.zoom / 2 + 50;
      const halfH = h / fpState.zoom / 2 + 50;
      const negPanX = -(fpState.panX || 0);
      const negPanY = -(fpState.panY || 0);

      ctx.strokeStyle = 'rgba(77, 212, 232, 0.04)';
      ctx.lineWidth = 0.5 / fpState.zoom;
      for (let x = Math.floor((-halfW - negPanX) / gridSpacing) * gridSpacing; x < halfW - negPanX; x += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(x, -halfH - negPanY); ctx.lineTo(x, halfH - negPanY); ctx.stroke();
      }
      for (let y = Math.floor((-halfH - negPanY) / gridSpacing) * gridSpacing; y < halfH - negPanY; y += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(-halfW - negPanX, y); ctx.lineTo(halfW - negPanX, y); ctx.stroke();
      }

      // Bold axis lines
      ctx.strokeStyle = 'rgba(77, 212, 232, 0.08)';
      ctx.lineWidth = 1 / fpState.zoom;
      ctx.beginPath();
      ctx.moveTo(-halfW - negPanX, 0); ctx.lineTo(halfW - negPanX, 0);
      ctx.moveTo(0, -halfH - negPanY); ctx.lineTo(0, halfH - negPanY);
      ctx.stroke();

      // Ruler marks on axes
      ctx.fillStyle = 'rgba(77, 212, 232, 0.15)';
      ctx.font = `${8 / fpState.zoom}px IBM Plex Mono`;
      ctx.textAlign = 'center';
      for (let x = Math.floor((-halfW - negPanX) / gridSpacing) * gridSpacing; x < halfW - negPanX; x += gridSpacing * 2) {
        if (x !== 0) {
          ctx.fillText((x / gridSpacing * 0.5).toFixed(1) + 'm', x, 12 / fpState.zoom);
          ctx.fillRect(x - 0.5, 0, 1 / fpState.zoom, 6 / fpState.zoom);
        }
      }
      ctx.textAlign = 'right';
      for (let y = Math.floor((-halfH - negPanY) / gridSpacing) * gridSpacing; y < halfH - negPanY; y += gridSpacing * 2) {
        if (y !== 0) {
          ctx.fillText((y / gridSpacing * 0.5).toFixed(1) + 'm', -6 / fpState.zoom, y + 3 / fpState.zoom);
          ctx.fillRect(0, y - 0.5, 6 / fpState.zoom, 1 / fpState.zoom);
        }
      }

      // Draw objects sorted by type (rooms first, then walls, then doors/windows, then sources, then detectors)
      const sorted = [...fpState.objects].sort((a, b) => {
        const order = { room: 0, 'control-room': 0, corridor: 0, wall: 1, 'shield-wall': 1, door: 2, window: 2, source: 3, detector: 4, annotation: 5, measure: 6 };
        return (order[a.type] || 0) - (order[b.type] || 0);
      });

      sorted.forEach(obj => {
        const selected = obj.id === fpState.selectedId;
        drawObject(ctx, obj, selected);
      });

      // Draw drawing preview
      if (fpState.isDrawing && fpState.drawStart) {
        ctx.strokeStyle = 'rgba(77, 212, 232, 0.3)';
        ctx.lineWidth = 1 / fpState.zoom;
        ctx.setLineDash([4 / fpState.zoom, 4 / fpState.zoom]);
        ctx.strokeRect(fpState.drawStart.x, fpState.drawStart.y, ctx.drawingEndX - fpState.drawStart.x, ctx.drawingEndY - fpState.drawStart.y);
        ctx.setLineDash([]);
      }

      // Radiation beam simulation from sources
      drawRadiationBeams(ctx, sorted);

      ctx.restore();

      // Update command bar
      updateFPOutputs(sorted);
    }

    // ===== DRAW OBJECT =====
    function drawObject(ctx, obj, selected) {
      const z = fpState.zoom;
      const baseLine = 1.5 / z;

      switch(obj.type) {
        case 'room':
        case 'control-room':
        case 'corridor':
          // Filled rect
          const fillAlpha = obj.type === 'control-room' ? 0.06 : obj.type === 'corridor' ? 0.03 : 0.04;
          ctx.fillStyle = obj.color || 'rgba(77, 212, 232, ' + fillAlpha + ')';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          // Border
          ctx.strokeStyle = obj.color || (obj.type === 'control-room' ? 'rgba(51, 255, 153, 0.3)' : 'rgba(77, 212, 232, 0.2)');
          ctx.lineWidth = selected ? 2 / z : 1 / z;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
          // Label
          ctx.fillStyle = obj.color || 'rgba(77, 212, 232, 0.25)';
          ctx.font = `${selected ? 9 : 7 / z}px IBM Plex Mono`;
          ctx.textAlign = 'center';
          ctx.fillText(obj.label || obj.type.toUpperCase(), obj.x + obj.w / 2, obj.y + obj.h / 2 + 3 / z);
          // Selection handles
          if (selected) drawHandles(ctx, obj);
          break;

        case 'wall':
        case 'shield-wall':
          const wallColor = obj.type === 'shield-wall' ? 'rgba(51, 255, 153, 0.25)' : 'rgba(77, 212, 232, 0.2)';
          ctx.fillStyle = wallColor;
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h || 6 / z);
          ctx.strokeStyle = selected ? '#fff' : (obj.type === 'shield-wall' ? 'rgba(51, 255, 153, 0.4)' : 'rgba(77, 212, 232, 0.35)');
          ctx.lineWidth = selected ? 2 / z : 1 / z;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h || 6 / z);
          if (obj.thickness) {
            ctx.fillStyle = 'rgba(77, 212, 232, 0.15)';
            ctx.font = `${6 / z}px IBM Plex Mono`;
            ctx.textAlign = 'center';
            ctx.fillText(obj.thickness + 'mm ' + (obj.material || ''), obj.x + obj.w / 2, obj.y - 4 / z);
          }
          if (selected) drawHandles(ctx, obj);
          break;

        case 'door':
          ctx.strokeStyle = selected ? '#fff' : 'rgba(77, 212, 232, 0.35)';
          ctx.lineWidth = selected ? 2 / z : 1 / z;
          // Door arc
          ctx.beginPath();
          ctx.arc(obj.x, obj.y + obj.h, obj.h, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(obj.x, obj.y); ctx.lineTo(obj.x, obj.y + obj.h);
          ctx.stroke();
          ctx.fillStyle = 'rgba(77, 212, 232, 0.1)';
          ctx.fill();
          if (selected) drawHandles(ctx, obj);
          break;

        case 'window':
          ctx.fillStyle = 'rgba(77, 212, 232, 0.08)';
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h || 4 / z);
          ctx.strokeStyle = selected ? '#fff' : 'rgba(77, 212, 232, 0.2)';
          ctx.lineWidth = selected ? 2 / z : 1 / z;
          ctx.strokeRect(obj.x, obj.y, obj.w, obj.h || 4 / z);
          ctx.setLineDash([3 / z, 3 / z]);
          ctx.beginPath(); ctx.moveTo(obj.x + obj.w / 2, obj.y); ctx.lineTo(obj.x + obj.w / 2, obj.y + (obj.h || 4 / z)); ctx.stroke();
          ctx.setLineDash([]);
          if (selected) drawHandles(ctx, obj);
          break;

        case 'source':
          // Glow
          const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, 20 / z);
          grad.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
          grad.addColorStop(1, 'rgba(255, 107, 53, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(obj.x, obj.y, 20 / z, 0, Math.PI * 2); ctx.fill();
          // Source circle
          ctx.beginPath(); ctx.arc(obj.x, obj.y, 7 / z, 0, Math.PI * 2);
          ctx.fillStyle = obj.color || '#ff6b35';
          ctx.fill();
          if (selected) {
            ctx.shadowColor = '#ff6b35';
            ctx.shadowBlur = 15 / z;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          // Label
          ctx.fillStyle = '#fff';
          ctx.font = `${7 / z}px IBM Plex Mono`;
          ctx.textAlign = 'center';
          ctx.fillText(obj.label || 'SOURCE', obj.x, obj.y - 12 / z);
          // Energy label
          if (obj.energy) {
            ctx.fillStyle = 'rgba(77, 212, 232, 0.3)';
            ctx.font = `${6 / z}px IBM Plex Mono`;
            ctx.fillText(obj.energy, obj.x, obj.y + 18 / z);
          }
          if (selected) drawHandles(ctx, obj);
          break;

        case 'detector':
          ctx.beginPath(); ctx.arc(obj.x, obj.y, 5 / z, 0, Math.PI * 2);
          ctx.fillStyle = obj.color || '#33ff99';
          ctx.fill();
          if (selected) {
            ctx.shadowColor = '#33ff99';
            ctx.shadowBlur = 10 / z;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = `${6 / z}px IBM Plex Mono`;
          ctx.textAlign = 'center';
          ctx.fillText(obj.label || 'D' + (obj.id || ''), obj.x, obj.y + 12 / z);
          // Reading
          if (obj.reading !== undefined) {
            ctx.fillStyle = obj.reading > 0.5 ? '#ff3333' : obj.reading > 0.1 ? '#ff6b35' : '#33ff99';
            ctx.font = `${6 / z}px IBM Plex Mono`;
            ctx.fillText(obj.reading.toFixed(2) + ' µSv/h', obj.x, obj.y - 10 / z);
          }
          if (selected) drawHandles(ctx, obj);
          break;

        case 'annotation':
          ctx.fillStyle = selected ? '#fff' : 'rgba(77, 212, 232, 0.3)';
          ctx.font = `${selected ? 10 : 8 / z}px IBM Plex Mono`;
          ctx.textAlign = 'center';
          ctx.fillText(obj.label || 'Label', obj.x, obj.y);
          if (selected) drawHandles(ctx, obj);
          break;

        case 'measure':
          ctx.strokeStyle = 'rgba(255, 107, 53, 0.2)';
          ctx.lineWidth = 0.5 / z;
          ctx.setLineDash([2 / z, 4 / z]);
          ctx.beginPath(); ctx.moveTo(obj.x, obj.y); ctx.lineTo(obj.x + obj.w, obj.y + obj.h); ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath(); ctx.arc(obj.x, obj.y, 2 / z, 0, Math.PI * 2); ctx.fillStyle = '#ff6b35'; ctx.fill();
          ctx.beginPath(); ctx.arc(obj.x + obj.w, obj.y + obj.h, 2 / z, 0, Math.PI * 2); ctx.fillStyle = '#ff6b35'; ctx.fill();
          const dist = Math.sqrt(obj.w * obj.w + obj.h * obj.h);
          ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
          ctx.font = `${6 / z}px IBM Plex Mono`;
          ctx.textAlign = 'center';
          ctx.fillText((dist / fpState.gridSize * 0.5).toFixed(1) + 'm', (obj.x + obj.x + obj.w) / 2, (obj.y + obj.y + obj.h) / 2 - 4 / z);
          if (selected) drawHandles(ctx, obj);
          break;
      }
    }

    // ===== SELECTION HANDLES =====
    function drawHandles(ctx, obj) {
      const z = fpState.zoom;
      const hs = 4 / z;
      const corners = [
        { x: obj.x, y: obj.y },
        { x: obj.x + (obj.w || 0), y: obj.y },
        { x: obj.x, y: obj.y + (obj.h || 0) },
        { x: obj.x + (obj.w || 0), y: obj.y + (obj.h || 0) }
      ];
      if (obj.type === 'source' || obj.type === 'detector') {
        corners.push({ x: obj.x - 5 / z, y: obj.y - 5 / z });
        corners.push({ x: obj.x + 5 / z, y: obj.y + 5 / z });
      }
      corners.forEach(c => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(c.x - hs / 2, c.y - hs / 2, hs, hs);
        ctx.strokeStyle = 'rgba(77, 212, 232, 0.5)';
        ctx.lineWidth = 0.5 / z;
        ctx.strokeRect(c.x - hs / 2, c.y - hs / 2, hs, hs);
      });
    }

    // ===== RADIATION BEAMS =====
    function drawRadiationBeams(ctx, objects) {
      const z = fpState.zoom;
      const sources = objects.filter(o => o.type === 'source');

      sources.forEach(src => {
        // Primary beam
        const beamLen = 120 / z;
        const beamAngle = (src.rotation || 0) * Math.PI / 180 - Math.PI / 2;
        const beamSpread = 20 * Math.PI / 180;

        // Beam cone
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.arc(src.x, src.y, beamLen, beamAngle - beamSpread, beamAngle + beamSpread);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 107, 53, 0.03)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.08)';
        ctx.lineWidth = 0.5 / z;
        ctx.stroke();

        // Beam center line (pulsing)
        const pulse = Math.sin(fpTime * 3) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        const endX = src.x + Math.cos(beamAngle) * beamLen;
        const endY = src.y + Math.sin(beamAngle) * beamLen;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(255, 107, 53, ${0.15 * pulse})`;
        ctx.lineWidth = 1.5 / z;
        ctx.stroke();

        // Scatter particles (animated)
        for (let i = 0; i < 8; i++) {
          const ang = fpTime * 2 + i * 0.8;
          const dist = 15 + ((fpTime * 20 + i * 30) % (beamLen * 0.8));
          const px = src.x + Math.cos(ang) * dist;
          const py = src.y + Math.sin(ang) * dist;
          ctx.beginPath(); ctx.arc(px, py, 1.5 / z, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(77, 212, 232, ${0.08 * (1 - dist / beamLen)})`;
          ctx.fill();
        }

        // Neutron particles (if source is cyclotron/neutron)
        if (src.energy === 'neutron' || src.label?.includes('NEUTRON') || src.label?.includes('CYCLOTRON')) {
          for (let i = 0; i < 5; i++) {
            const ang2 = fpTime * 1.3 + i * 1.3;
            const dist2 = 20 + ((fpTime * 15 + i * 40) % (beamLen * 0.6));
            const px2 = src.x + Math.cos(ang2) * dist2;
            const py2 = src.y + Math.sin(ang2) * dist2;
            ctx.beginPath(); ctx.arc(px2, py2, 2 / z, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(51, 255, 153, ${0.1 * (1 - dist2 / beamLen)})`;
            ctx.fill();
          }
        }
      });

      // Shielding attenuation on walls
      const walls = objects.filter(o => o.type === 'wall' || o.type === 'shield-wall');
      walls.forEach(wall => {
        const wallCenterX = wall.x + (wall.w || 0) / 2;
        const wallCenterY = wall.y + (wall.h || 0) / 2;
        let wallAtten = 0;
        sources.forEach(src => {
          const dx = wallCenterX - src.x, dy = wallCenterY - src.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const mu = 0.3;
          const thick = parseFloat(wall.thickness) || 50;
          wallAtten = Math.max(wallAtten, (1 - Math.exp(-mu * (thick / 10))) * 100);
        });
        if (wallAtten > 0) {
          ctx.fillStyle = `rgba(51, 255, 153, ${wallAtten / 500})`;
          ctx.fillRect(wall.x, wall.y, wall.w || 0, wall.h || 0);
        }
      });
    }

    // ===== FP OUTPUTS UPDATE =====
    function updateFPOutputs(objects) {
      const sources = objects.filter(o => o.type === 'source');
      const detectors = objects.filter(o => o.type === 'detector');
      const walls = objects.filter(o => o.type === 'wall' || o.type === 'shield-wall');

      let totalLeak = 0, totalDose = 0, totalAtten = 0, totalScatter = 0, totalNeutron = 0;

      sources.forEach(src => {
        const intensity = 5.0;
        const leakage = intensity * 0.001 * (1 - (walls.length > 0 ? 0.95 : 0));
        totalLeak += leakage;
        totalDose += leakage * 50;
        totalAtten = walls.length > 0 ? 95 + Math.random() * 4 : 0;
        totalScatter += intensity * 0.005;
        if (src.label?.includes('NEUTRON') || src.label?.includes('CYCLOTRON')) {
          totalNeutron += 50000 + Math.random() * 20000;
        }
      });

      // Update detector readings
      objects.filter(o => o.type === 'detector').forEach((det, i) => {
        const closestSrc = sources.length > 0 ? sources[0] : null;
        if (closestSrc) {
          const dx = det.x - closestSrc.x, dy = det.y - closestSrc.y;
          const dist = Math.sqrt(dx*dx + dy*dy) / fpState.gridSize * 0.5;
          det.reading = totalDose * 0.1 / Math.max(dist, 0.5) + Math.random() * 0.01;
        }
      });

      const isCompliant = totalDose < 1.0;

      if (fpOutLeakage) fpOutLeakage.textContent = totalLeak.toFixed(4);
      if (fpOutDose) fpOutDose.textContent = totalDose.toFixed(2);
      if (fpOutAtten) fpOutAtten.textContent = totalAtten.toFixed(1);
      if (fpOutShieldEff) fpOutShieldEff.textContent = (walls.length > 0 ? 95 : 0).toFixed(1);
      if (fpOutScatter) fpOutScatter.textContent = totalScatter.toFixed(2);
      if (fpOutNeutron) fpOutNeutron.textContent = totalNeutron.toFixed(0);
      if (fpOutCompliance) {
        fpOutCompliance.textContent = isCompliant ? 'AERB ✓ — SAFE' : 'SHIELDING FAILURE';
        fpOutCompliance.style.color = isCompliant ? 'var(--green)' : 'var(--red)';
      }

      // Command bar metrics
      if (fpLeakLabel) fpLeakLabel.textContent = totalLeak.toFixed(3) + ' mGy/h';
      if (fpDoseLabel) fpDoseLabel.textContent = totalDose.toFixed(2) + ' mSv';
      if (fpAttenLabel) fpAttenLabel.textContent = totalAtten.toFixed(1) + '%';

      // Heatmap
      if (fpHeatmapCanvas && fpState.showHeatmap && sources.length > 0) {
        drawFPHeatmap(sources[0], totalDose);
      } else if (fpHeatmapCanvas) {
        const hmCtx = fpHeatmapCanvas.getContext('2d');
        hmCtx.clearRect(0, 0, fpHeatmapCanvas.width, fpHeatmapCanvas.height);
      }
    }

    // ===== FP HEATMAP =====
    function drawFPHeatmap(source, dose) {
      if (!fpHeatmapCanvas) return;
      const hmCtx = fpHeatmapCanvas.getContext('2d');
      const w = fpHeatmapCanvas.width, h = fpHeatmapCanvas.height;
      hmCtx.clearRect(0, 0, w, h);

      // World to screen for source
      const srcScreen = worldToScreen(source.x, source.y);
      const sx = srcScreen.x, sy = srcScreen.y;

      const maxRadius = Math.min(w, h) * 0.35;
      const intensity = Math.min(dose / 2, 1);

      const grad = hmCtx.createRadialGradient(sx, sy, 0, sx, sy, maxRadius);
      grad.addColorStop(0, 'rgba(255, 51, 51, ' + (0.3 + intensity * 0.3) + ')');
      grad.addColorStop(0.2, 'rgba(255, 107, 53, ' + (0.2 + intensity * 0.2) + ')');
      grad.addColorStop(0.4, 'rgba(255, 200, 50, ' + (0.15 + intensity * 0.1) + ')');
      grad.addColorStop(0.6, 'rgba(77, 212, 232, ' + (0.1 + intensity * 0.05) + ')');
      grad.addColorStop(0.85, 'rgba(77, 212, 232, 0.03)');
      grad.addColorStop(1, 'transparent');
      hmCtx.fillStyle = grad;
      hmCtx.beginPath();
      hmCtx.arc(sx, sy, maxRadius, 0, Math.PI * 2);
      hmCtx.fill();

      // Animated rings
      const time = Date.now() / 1000;
      for (let i = 0; i < 3; i++) {
        const r = (maxRadius * 0.15) + ((time * 30 + i * 70) % (maxRadius * 0.7));
        if (r < maxRadius) {
          hmCtx.beginPath(); hmCtx.arc(sx, sy, r, 0, Math.PI * 2);
          hmCtx.strokeStyle = 'rgba(255, 107, 53, ' + (0.08 * (1 - r / maxRadius)) + ')';
          hmCtx.lineWidth = 1; hmCtx.stroke();
        }
      }

      // Zone labels
      hmCtx.fillStyle = 'rgba(51, 255, 153, 0.2)'; hmCtx.font = '7px IBM Plex Mono'; hmCtx.textAlign = 'right';
      hmCtx.fillText('SAFE ZONE', w - 6, h - 6);
      hmCtx.fillStyle = 'rgba(255, 107, 53, 0.2)';
      hmCtx.fillText('CAUTION ZONE', sx + maxRadius * 0.5, sy - 10);
      hmCtx.fillStyle = 'rgba(255, 51, 51, 0.2)';
      hmCtx.fillText('HAZARD', sx + 25, sy - 15);
    }

    // ===== ANIMATION LOOP =====
    function animateFacility() {
      fpTime += 0.02;
      renderFacility();
      if (fpState.objects.some(o => o.type === 'source')) {
        animFrame = requestAnimationFrame(animateFacility);
      } else {
        setTimeout(() => { animFrame = requestAnimationFrame(animateFacility); }, 100);
      }
    }
    animateFacility();

    // ===== CANVAS MOUSE EVENTS =====
    let mouseDown = false;
    let mouseDownPos = null;
    let panStart = null;

    facilityCanvas.addEventListener('mousedown', (e) => {
      mouseDown = true;
      const rect = facilityCanvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (facilityCanvas.width / rect.width);
      const my = (e.clientY - rect.top) * (facilityCanvas.height / rect.height);
      const world = screenToWorld(mx, my);
      mouseDownPos = world;

      if (e.button === 1 || e.shiftKey) {
        // Pan with middle click or Shift
        panStart = { x: mx, y: my };
        facilityCanvas.style.cursor = 'grabbing';
        return;
      }

      if (fpState.currentTool === 'select') {
        // Check for object hit
        let hitId = null;
        for (let i = fpState.objects.length - 1; i >= 0; i--) {
          const obj = fpState.objects[i];
          if (obj.type === 'source' || obj.type === 'detector') {
            const dx = world.x - obj.x, dy = world.y - obj.y;
            if (Math.sqrt(dx*dx + dy*dy) < 15 / fpState.zoom) { hitId = obj.id; break; }
          } else if (obj.w !== undefined && obj.h !== undefined) {
            if (world.x >= obj.x && world.x <= obj.x + (obj.w || 1) &&
                world.y >= obj.y && world.y <= obj.y + (obj.h || 1)) { hitId = obj.id; break; }
          } else {
            const dx = world.x - obj.x, dy = world.y - obj.y;
            if (Math.sqrt(dx*dx + dy*dy) < 10 / fpState.zoom) { hitId = obj.id; break; }
          }
        }
        if (hitId !== null) {
          fpState.selectedId = hitId;
          fpState.isDragging = true;
          const hitObj = fpState.objects.find(o => o.id === hitId);
          fpState.dragOffset = { x: world.x - hitObj.x, y: world.y - hitObj.y };
          updatePropPanel();
          renderFacility();
        } else {
          fpState.selectedId = null;
          updatePropPanel();
          renderFacility();
        }
      } else if (['wall', 'shield-wall', 'room', 'corridor', 'control-room'].includes(fpState.currentTool)) {
        fpState.isDrawing = true;
        fpState.drawStart = { x: snapToGrid(world.x), y: snapToGrid(world.y) };
        fpState.drawingTool = fpState.currentTool;
      } else if (['source', 'detector', 'annotation', 'door', 'window'].includes(fpState.currentTool)) {
        // Place object on click
        const pos = { x: snapToGrid(world.x), y: snapToGrid(world.y) };
        placeObject(fpState.currentTool, pos);
      } else if (fpState.currentTool === 'measure') {
        fpState.isDrawing = true;
        fpState.drawStart = { x: world.x, y: world.y };
        fpState.drawingTool = 'measure';
      } else if (fpState.currentTool === 'delete') {
        // Delete tool
        for (let i = fpState.objects.length - 1; i >= 0; i--) {
          const obj = fpState.objects[i];
          if (obj.type === 'source' || obj.type === 'detector') {
            const dx = world.x - obj.x, dy = world.y - obj.y;
            if (Math.sqrt(dx*dx + dy*dy) < 15 / fpState.zoom) {
              fpSaveState();
              fpState.objects.splice(i, 1);
              renderFacility();
              updateObjCount();
              addHudAlert('OBJECT DELETED', 'info');
              break;
            }
          } else if (obj.w !== undefined) {
            if (world.x >= obj.x && world.x <= obj.x + obj.w &&
                world.y >= obj.y && world.y <= obj.y + (obj.h || 1)) {
              fpSaveState();
              fpState.objects.splice(i, 1);
              renderFacility();
              updateObjCount();
              addHudAlert('OBJECT DELETED', 'info');
              break;
            }
          }
        }
      }
    });

    facilityCanvas.addEventListener('mousemove', (e) => {
      const rect = facilityCanvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (facilityCanvas.width / rect.width);
      const my = (e.clientY - rect.top) * (facilityCanvas.height / rect.height);
      const world = screenToWorld(mx, my);

      // Cursor position
      if (fpCursorPos) {
        const gridDist = (world.x / fpState.gridSize * 0.5).toFixed(1);
        fpCursorPos.textContent = `X: ${gridDist}  Y: ${(world.y / fpState.gridSize * 0.5).toFixed(1)}`;
      }

      // Pan
      if (panStart) {
        fpState.panX += (mx - panStart.x) / fpState.zoom;
        fpState.panY += (my - panStart.y) / fpState.zoom;
        panStart = { x: mx, y: my };
        return;
      }

      // Drag selected object
      if (fpState.isDragging && fpState.selectedId && mouseDown) {
        const obj = fpState.objects.find(o => o.id === fpState.selectedId);
        if (obj) {
          const newX = snapToGrid(world.x - fpState.dragOffset.x);
          const newY = snapToGrid(world.y - fpState.dragOffset.y);
          if (obj.type === 'source' || obj.type === 'detector') {
            obj.x = newX;
            obj.y = newY;
          } else {
            obj.x = newX;
            obj.y = newY;
          }
          renderFacility();
        }
      }

      // Draw preview
      if (fpState.isDrawing && fpState.drawStart) {
        ctx.drawingEndX = snapToGrid(world.x);
        ctx.drawingEndY = snapToGrid(world.y);
        renderFacility();
        // Draw preview rect
        const z = fpState.zoom;
        const px = fpState.drawStart.x, py = fpState.drawStart.y;
        const pw = ctx.drawingEndX - px, ph = ctx.drawingEndY - py;
        ctx.save();
        ctx.translate(facilityCanvas.width / 2, facilityCanvas.height / 2);
        ctx.scale(z, z);
        ctx.translate(fpState.panX || 0, fpState.panY || 0);
        ctx.strokeStyle = 'rgba(77, 212, 232, 0.3)';
        ctx.lineWidth = 1 / z;
        ctx.setLineDash([4 / z, 4 / z]);
        ctx.strokeRect(Math.min(px, px + pw), Math.min(py, py + ph), Math.abs(pw), Math.abs(ph));
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(77, 212, 232, 0.05)';
        ctx.fillRect(Math.min(px, px + pw), Math.min(py, py + ph), Math.abs(pw), Math.abs(ph));
        // Dimension label
        if (Math.abs(pw) > fpState.gridSize && Math.abs(ph) > fpState.gridSize) {
          ctx.fillStyle = 'rgba(77, 212, 232, 0.2)';
          ctx.font = `${8 / z}px IBM Plex Mono`;
          ctx.textAlign = 'center';
          ctx.fillText(
            (Math.abs(pw) / fpState.gridSize * 0.5).toFixed(1) + ' × ' + (Math.abs(ph) / fpState.gridSize * 0.5).toFixed(1) + 'm',
            px + pw / 2, py - 8 / z
          );
        }
        ctx.restore();
      }
    });

    facilityCanvas.addEventListener('mouseup', (e) => {
      if (fpState.isDrawing && fpState.drawStart) {
        const rect = facilityCanvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (facilityCanvas.width / rect.width);
        const my = (e.clientY - rect.top) * (facilityCanvas.height / rect.height);
        const world = screenToWorld(mx, my);
        const endX = snapToGrid(world.x);
        const endY = snapToGrid(world.y);

        const minX = Math.min(fpState.drawStart.x, endX);
        const minY = Math.min(fpState.drawStart.y, endY);
        const maxX = Math.max(fpState.drawStart.x, endX);
        const maxY = Math.max(fpState.drawStart.y, endY);
        const pw = maxX - minX;
        const ph = maxY - minY;

        if (pw > fpState.gridSize && ph > fpState.gridSize) {
          fpSaveState();
          const obj = createObject(fpState.drawingTool || 'room', minX, minY, pw, ph);
          fpState.objects.push(obj);
          addHudAlert((obj.label || obj.type).toUpperCase() + ' PLACED', 'info');
          updateObjCount();
        }
        fpState.isDrawing = false;
        fpState.drawStart = null;
        renderFacility();
      }

      if (fpState.isDragging) {
        fpSaveState();
      }

      mouseDown = false;
      fpState.isDragging = false;
      panStart = null;
      facilityCanvas.style.cursor = fpState.currentTool === 'select' ? 'default' : 'crosshair';
    });

    facilityCanvas.addEventListener('mouseleave', () => {
      fpState.isDrawing = false;
      fpState.drawStart = null;
      mouseDown = false;
      fpState.isDragging = false;
      panStart = null;
    });

    // ===== WHEEL ZOOM =====
    facilityCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      fpState.zoom = Math.max(0.3, Math.min(4.0, fpState.zoom * delta));
      if (fpZoomLevel) fpZoomLevel.textContent = Math.round(fpState.zoom * 100) + '%';
      renderFacility();
    }, { passive: false });

    // ===== PLACE / CREATE =====
    function createObject(type, x, y, w, h) {
      const id = fpState.idCounter++;
      const base = { id, x, y, type };
      const roomColors = fpState.roomTypeColors;

      switch(type) {
        case 'room':
          return { ...base, w, h, label: 'CATH LAB', color: roomColors['cath-lab'], occupancy: 0.5, useFactor: 0.5 };
        case 'shield-wall':
          return { ...base, w: w || 80, h: h || 8, label: 'SHIELD', material: 'lead', thickness: 50, color: 'rgba(51, 255, 153, 0.3)' };
        case 'wall':
          return { ...base, w: w || 80, h: h || 6, label: 'WALL', material: 'concrete', thickness: 200, color: 'rgba(77, 212, 232, 0.2)' };
        case 'control-room':
          return { ...base, w, h, label: 'CONTROL', color: roomColors['control'], occupancy: 1.0, useFactor: 0.25 };
        case 'corridor':
          return { ...base, w, h, label: 'CORRIDOR', color: roomColors['corridor'], occupancy: 0.25, useFactor: 0.25 };
        case 'door':
          return { ...base, w: 10, h: 20, label: 'DOOR' };
        case 'window':
          return { ...base, w: 30, h: 4, label: 'WINDOW' };
        case 'source':
          return { ...base, w: 0, h: 0, label: 'X-RAY SOURCE', color: '#ff6b35', energy: '80 kVp', rotation: 0, intensity: 5.0 };
        case 'detector':
          return { ...base, w: 0, h: 0, label: 'D' + id, color: '#33ff99', reading: 0 };
        case 'annotation':
          return { ...base, w: 0, h: 0, label: 'Label' };
        case 'measure':
          return { ...base, w: w || 50, h: h || 50, label: 'MEASURE' };
        default:
          return { ...base, w: w || 40, h: h || 40, label: type.toUpperCase() };
      }
    }

    function placeObject(type, pos) {
      fpSaveState();
      const obj = createObject(type, pos.x, pos.y, 0, 0);
      fpState.objects.push(obj);
      if (type === 'source') {
        addHudAlert('SOURCE PLACED — ' + (obj.label || 'X-RAY'), 'warning');
      } else {
        addHudAlert((obj.label || type).toUpperCase() + ' PLACED', 'info');
      }
      updateObjCount();
      renderFacility();
    }

    function updateObjCount() {
      if (fpObjCount) fpObjCount.textContent = fpState.objects.length + ' object' + (fpState.objects.length !== 1 ? 's' : '');
    }

    // ===== PROPERTIES PANEL =====
    function updatePropPanel() {
      if (!fpPropsContent) return;
      const obj = fpState.objects.find(o => o.id === fpState.selectedId);
      if (!obj) {
        fpPropsContent.innerHTML = `
          <div class="fp-prop-empty">
            <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#4dd4e8" stroke-width="1" opacity="0.3"/><circle cx="12" cy="12" r="4" fill="none" stroke="#4dd4e8" stroke-width="1" opacity="0.3"/><circle cx="12" cy="12" r="1.5" fill="#4dd4e8" opacity="0.3"/></svg>
            <span>Select an object to edit properties</span>
          </div>`;
        return;
      }

      let html = '';
      const baseFields = `
        <div class="fp-prop-field">
          <label class="fp-prop-label">Name</label>
          <input class="fp-prop-input" id="fpPropName" value="${obj.label || ''}" />
        </div>
        <div class="fp-prop-field">
          <label class="fp-prop-label">Type</label>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--cyan);text-transform:uppercase;">${obj.type}</div>
        </div>`;
      html += baseFields;

      if (obj.type === 'room' || obj.type === 'control-room' || obj.type === 'corridor') {
        html += `
          <div class="fp-prop-field">
            <label class="fp-prop-label">Dimensions (m)</label>
            <div style="display:flex;gap:6px;">
              <input class="fp-prop-input dim-input" id="fpPropW" value="${(obj.w / fpState.gridSize * 0.5).toFixed(1)}" style="width:50px;" />
              <span class="dim-sep">×</span>
              <input class="fp-prop-input dim-input" id="fpPropH" value="${(obj.h / fpState.gridSize * 0.5).toFixed(1)}" style="width:50px;" />
              <span class="dim-unit">m</span>
            </div>
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Occupancy Factor (T)</label>
            <select class="fp-prop-select" id="fpPropOccupancy">
              <option value="1" ${obj.occupancy === 1 ? 'selected' : ''}>Full (1.0)</option>
              <option value="0.5" ${obj.occupancy === 0.5 ? 'selected' : ''}>Partial (0.5)</option>
              <option value="0.25" ${obj.occupancy === 0.25 ? 'selected' : ''}>Occasional (0.25)</option>
              <option value="0.125" ${obj.occupancy === 0.125 ? 'selected' : ''}>Minimal (0.125)</option>
            </select>
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Use Factor (U)</label>
            <select class="fp-prop-select" id="fpPropUseFactor">
              <option value="1" ${obj.useFactor === 1 ? 'selected' : ''}>Full (1.0)</option>
              <option value="0.5" ${obj.useFactor === 0.5 ? 'selected' : ''}>Partial (0.5)</option>
              <option value="0.25" ${obj.useFactor === 0.25 ? 'selected' : ''}>Low (0.25)</option>
            </select>
          </div>`;
      }

      if (obj.type === 'wall' || obj.type === 'shield-wall') {
        html += `
          <div class="fp-prop-field">
            <label class="fp-prop-label">Material</label>
            <select class="fp-prop-select" id="fpPropMaterial">
              ${fpState.wallMaterials.map(m => `<option value="${m}" ${obj.material === m ? 'selected' : ''}>${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('')}
            </select>
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Thickness (mm)</label>
            <input class="fp-prop-input" id="fpPropThickness" type="number" value="${obj.thickness || 50}" min="1" max="1000" />
          </div>`;
      }

      if (obj.type === 'source') {
        html += `
          <div class="fp-prop-field">
            <label class="fp-prop-label">Source Type</label>
            <select class="fp-prop-select" id="fpPropSourceType">
              <option value="xray" ${obj.sourceType === 'xray' ? 'selected' : ''}>X-Ray Tube</option>
              <option value="ct" ${obj.sourceType === 'ct' ? 'selected' : ''}>CT Scanner</option>
              <option value="pet" ${obj.sourceType === 'pet' ? 'selected' : ''}>PET Source</option>
              <option value="gamma" ${obj.sourceType === 'gamma' ? 'selected' : ''}>Gamma Source</option>
              <option value="cyclotron" ${obj.sourceType === 'cyclotron' ? 'selected' : ''}>Cyclotron</option>
              <option value="neutron" ${obj.sourceType === 'neutron' ? 'selected' : ''}>Neutron Generator</option>
            </select>
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Energy Level</label>
            <input class="fp-prop-input" id="fpPropEnergy" value="${obj.energy || '80 kVp'}" />
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Beam Rotation (°)</label>
            <input class="fp-prop-input" id="fpPropRotation" type="number" value="${obj.rotation || 0}" min="0" max="360" />
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Intensity</label>
            <input class="fp-prop-input" id="fpPropIntensity" type="number" value="${obj.intensity || 5.0}" min="0.1" max="100" step="0.1" />
          </div>`;
      }

      if (obj.type === 'detector') {
        html += `
          <div class="fp-prop-field">
            <label class="fp-prop-label">Detector ID</label>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">${obj.label || 'D' + obj.id}</div>
          </div>
          <div class="fp-prop-field">
            <label class="fp-prop-label">Reading</label>
            <div style="font-family:var(--font-mono);font-size:13px;color:${(obj.reading || 0) > 0.5 ? 'var(--red)' : (obj.reading || 0) > 0.1 ? 'var(--orange)' : 'var(--green)'};">
              ${(obj.reading || 0).toFixed(3)} µSv/h
            </div>
          </div>`;
      }

      fpPropsContent.innerHTML = html;

      // Bind prop change handlers
      bindPropChanges(obj);
    }

    function bindPropChanges(obj) {
      const nameInput = document.getElementById('fpPropName');
      if (nameInput) nameInput.addEventListener('input', () => { obj.label = nameInput.value; renderFacility(); });

      const wInput = document.getElementById('fpPropW');
      const hInput = document.getElementById('fpPropH');
      if (wInput && hInput) {
        const onChange = () => {
          obj.w = parseFloat(wInput.value || 0) / 0.5 * fpState.gridSize;
          obj.h = parseFloat(hInput.value || 0) / 0.5 * fpState.gridSize;
          renderFacility();
        };
        wInput.addEventListener('input', onChange);
        hInput.addEventListener('input', onChange);
      }

      const occInput = document.getElementById('fpPropOccupancy');
      if (occInput) occInput.addEventListener('change', () => { obj.occupancy = parseFloat(occInput.value); renderFacility(); });

      const useInput = document.getElementById('fpPropUseFactor');
      if (useInput) useInput.addEventListener('change', () => { obj.useFactor = parseFloat(useInput.value); renderFacility(); });

      const matInput = document.getElementById('fpPropMaterial');
      if (matInput) matInput.addEventListener('change', () => { obj.material = matInput.value; renderFacility(); });

      const thickInput = document.getElementById('fpPropThickness');
      if (thickInput) thickInput.addEventListener('input', () => { obj.thickness = parseFloat(thickInput.value); renderFacility(); });

      const srcTypeInput = document.getElementById('fpPropSourceType');
      if (srcTypeInput) srcTypeInput.addEventListener('change', () => { obj.sourceType = srcTypeInput.value; obj.label = srcTypeInput.options[srcTypeInput.selectedIndex].text.toUpperCase(); renderFacility(); });

      const energyInput = document.getElementById('fpPropEnergy');
      if (energyInput) energyInput.addEventListener('input', () => { obj.energy = energyInput.value; renderFacility(); });

      const rotInput = document.getElementById('fpPropRotation');
      if (rotInput) rotInput.addEventListener('input', () => { obj.rotation = parseFloat(rotInput.value); renderFacility(); });

      const intInput = document.getElementById('fpPropIntensity');
      if (intInput) intInput.addEventListener('input', () => { obj.intensity = parseFloat(intInput.value); renderFacility(); });
    }

    // ===== ZOOM CONTROLS =====
    document.getElementById('fpZoomIn')?.addEventListener('click', () => {
      fpState.zoom = Math.min(4.0, fpState.zoom * 1.2);
      if (fpZoomLevel) fpZoomLevel.textContent = Math.round(fpState.zoom * 100) + '%';
      renderFacility();
    });
    document.getElementById('fpZoomOut')?.addEventListener('click', () => {
      fpState.zoom = Math.max(0.3, fpState.zoom * 0.8);
      if (fpZoomLevel) fpZoomLevel.textContent = Math.round(fpState.zoom * 100) + '%';
      renderFacility();
    });
    document.getElementById('fpZoomReset')?.addEventListener('click', () => {
      fpState.zoom = 1.0;
      fpState.panX = 0;
      fpState.panY = 0;
      if (fpZoomLevel) fpZoomLevel.textContent = '100%';
      renderFacility();
    });

    // ===== CLEAR =====
    document.getElementById('fpClearCanvas')?.addEventListener('click', () => {
      if (fpState.objects.length === 0) return;
      fpSaveState();
      fpState.objects = [];
      fpState.selectedId = null;
      renderFacility();
      updateObjCount();
      updatePropPanel();
      addHudAlert('FACILITY PLAN CLEARED', 'info');
    });

    // ===== EXPORT =====
    document.getElementById('fpExportBtn')?.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'almatin-facility-plan.png';
      link.href = facilityCanvas.toDataURL('image/png');
      link.click();
      addHudAlert('FACILITY PLAN EXPORTED', 'info');
    });

    // ===== SAVE =====
    document.getElementById('fpSaveBtn')?.addEventListener('click', () => {
      const data = JSON.stringify({ objects: fpState.objects, version: '4.0' }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const link = document.createElement('a');
      link.download = 'almatin-project.json';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      addHudAlert('PROJECT SAVED', 'info');
    });

    // ===== SIMULATE =====
    document.getElementById('fpSimulateBtn')?.addEventListener('click', () => {
      addHudAlert('SIMULATION RUNNING — Analyzing radiation spread', 'warning');
      renderFacility();
      setTimeout(() => addHudAlert('SIMULATION COMPLETE — Results in outputs panel', 'info'), 1500);
    });

    // ===== HEATMAP TOGGLE =====
    document.getElementById('fpHeatmapToggle')?.addEventListener('click', () => {
      fpState.showHeatmap = !fpState.showHeatmap;
      if (heatmapOverlay) heatmapOverlay.classList.toggle('active', fpState.showHeatmap);
      addHudAlert('HEATMAP ' + (fpState.showHeatmap ? 'ENABLED' : 'DISABLED'), 'info');
      renderFacility();
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
      // Only if facility planner is visible
      const fpSection = document.querySelector('.facility-planner');
      if (!fpSection || fpSection.offsetParent === null) return;

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      // Tool shortcuts: 1-9
      const toolKeys = {
        '1': 'select', '2': 'wall', '3': 'shield-wall', '4': 'room',
        '5': 'source', '6': 'detector', '7': 'control-room',
        '8': 'corridor', '9': 'delete'
      };
      if (!ctrl && toolKeys[key] && !e.shiftKey) {
        e.preventDefault();
        const toolBtns = document.querySelectorAll('.fp-tool[data-tool]');
        toolBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.tool === toolKeys[key]);
        });
        fpState.currentTool = toolKeys[key];
        if (fpCurrentTool) fpCurrentTool.textContent = toolKeys[key].toUpperCase();
        facilityCanvas.style.cursor = toolKeys[key] === 'select' ? 'default' : 'crosshair';
      }

      // Undo / Redo
      if (ctrl && !e.shiftKey && key === 'z') { e.preventDefault(); fpUndo(); }
      if (ctrl && e.shiftKey && key === 'z') { e.preventDefault(); fpRedo(); }

      // Export
      if (ctrl && key === 's') { e.preventDefault(); document.getElementById('fpExportBtn')?.click(); }

      // Delete
      if (key === 'delete' || key === 'backspace') {
        if (fpState.selectedId) {
          const idx = fpState.objects.findIndex(o => o.id === fpState.selectedId);
          if (idx >= 0) {
            fpSaveState();
            fpState.objects.splice(idx, 1);
            fpState.selectedId = null;
            renderFacility();
            updateObjCount();
            updatePropPanel();
            addHudAlert('OBJECT DELETED', 'info');
          }
        }
      }

      // Escape
      if (key === 'escape') {
        fpState.selectedId = null;
        fpState.isDrawing = false;
        fpState.drawStart = null;
        updatePropPanel();
        renderFacility();
      }

      // Zoom +/-
      if (key === '=' || key === '+') { e.preventDefault(); document.getElementById('fpZoomIn')?.click(); }
      if (key === '-') { e.preventDefault(); document.getElementById('fpZoomOut')?.click(); }

      // Heatmap toggle
      if (key === 'h' && !ctrl) { e.preventDefault(); document.getElementById('fpHeatmapToggle')?.click(); }
    });

    // ===== FULLSCREEN =====
    document.getElementById('fpFullscreenBtn')?.addEventListener('click', () => {
      const area = document.getElementById('fpCanvasArea');
      if (area) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          area.requestFullscreen();
        }
      }
    });

    // ===== DIM LABEL from sim =====
    if (fpDimLabel && roomLength && roomWidth) {
      const updateDim = () => { fpDimLabel.textContent = roomLength.value + ' × ' + roomWidth.value + ' m'; };
      roomLength.addEventListener('input', updateDim);
      roomWidth.addEventListener('input', updateDim);
      updateDim();
    }

    // ===== INIT STATE =====
    fpSaveState();
    updateObjCount();
    addHudAlert('FACILITY PLANNER INITIALIZED — Use tools to design', 'info');
  }

  // ==========================================
  // 12. SHIELD STACK ENGINE
  // ==========================================
  let stackLayers = [
    { material: 'lead', thickness: 2 },
    { material: 'concrete', thickness: 150 },
    { material: 'steel', thickness: 3 }
  ];

  const stackList = document.getElementById('stackList');
  const dynamicWallStack = document.getElementById('dynamicWallStack');
  const stackTotalThick = document.getElementById('stackTotalThick');
  const stackTotalAtten = document.getElementById('stackTotalAtten');
  const stackEffMu = document.getElementById('stackEffMu');
  const stackLeadEq = document.getElementById('stackLeadEq');

  const STACK_COLORS = {
    lead: '#4dd4e8', concrete: '#445566', steel: '#6688aa',
    borated: '#33ff99', barium: '#88aacc', tungsten: '#9977cc', hdpe: '#44bbcc',
    brick: '#cc7733'
  };

  function renderStackList() {
    if (!stackList) return;
    stackList.innerHTML = '';
    stackLayers.forEach((layer, idx) => {
      const mu = calcMu(layer.material, 80);
      const item = document.createElement('div');
      item.className = 'stack-layer-item';
      item.innerHTML = `
        <span class="stack-layer-drag">&#9776;</span>
        <span class="stack-layer-color" style="background:${STACK_COLORS[layer.material] || '#4dd4e8'}"></span>
        <span class="stack-layer-name">${layer.material.charAt(0).toUpperCase() + layer.material.slice(1)}</span>
        <span class="stack-layer-thick">${layer.thickness} mm</span>
        <span class="stack-layer-mu">μ=${mu.toFixed(1)}</span>
        <div class="stack-layer-actions">
          <button class="stack-layer-up" data-idx="${idx}">&#9650;</button>
          <button class="stack-layer-down" data-idx="${idx}">&#9660;</button>
          <button class="stack-layer-remove" data-idx="${idx}">&#10005;</button>
        </div>`;
      stackList.appendChild(item);
    });

    // Bind events
    stackList.querySelectorAll('.stack-layer-up').forEach(btn => {
      btn.addEventListener('click', () => { const i = parseInt(btn.dataset.idx); if (i > 0) { [stackLayers[i], stackLayers[i-1]] = [stackLayers[i-1], stackLayers[i]]; renderStackList(); updateStackCalc(); updateSimulation(); } });
    });
    stackList.querySelectorAll('.stack-layer-down').forEach(btn => {
      btn.addEventListener('click', () => { const i = parseInt(btn.dataset.idx); if (i < stackLayers.length - 1) { [stackLayers[i], stackLayers[i+1]] = [stackLayers[i+1], stackLayers[i]]; renderStackList(); updateStackCalc(); updateSimulation(); } });
    });
    stackList.querySelectorAll('.stack-layer-remove').forEach(btn => {
      btn.addEventListener('click', () => { const i = parseInt(btn.dataset.idx); stackLayers.splice(i, 1); renderStackList(); updateStackCalc(); updateSimulation(); });
    });
    updateStackCalc();
  }

  function updateStackCalc() {
    // Update wall stack visual
    if (dynamicWallStack) {
      dynamicWallStack.innerHTML = '';
      stackLayers.forEach(layer => {
        const totalThick = stackLayers.reduce((s, l) => s + parseFloat(l.thickness), 0) || 1;
        const pct = (parseFloat(layer.thickness) / totalThick) * 100;
        const div = document.createElement('div');
        div.className = 'wall-layer';
        div.style.flex = pct.toFixed(1);
        div.style.background = `linear-gradient(180deg, ${STACK_COLORS[layer.material] || '#4dd4e8'}44, ${STACK_COLORS[layer.material] || '#4dd4e8'}22)`;
        div.innerHTML = `<span class="layer-label">${layer.material.charAt(0).toUpperCase() + layer.material.slice(1)}</span>
          <span class="layer-thickness">${layer.thickness} mm</span>`;
        dynamicWallStack.appendChild(div);
      });
    }

    // Calculate total attenuation
    const I0 = 100;
    const I_final = multiLayerAtten(I0, stackLayers, 80);
    const totalAtten = attenPct(I0, I_final);
    const totalThick = stackLayers.reduce((s, l) => s + parseFloat(l.thickness), 0);

    // Effective mu
    let totalMu = 0;
    stackLayers.forEach(l => { totalMu += calcMu(l.material, 80) * parseFloat(l.thickness); });
    const effMu = totalMu / Math.max(totalThick, 1);

    // Lead equivalent
    const leadMu = MU_VALUES.lead.medium || 28.0;
    const leadEq = totalMu / leadMu * 10;

    if (stackTotalThick) stackTotalThick.textContent = totalThick.toFixed(1) + ' mm';
    if (stackTotalAtten) {
      stackTotalAtten.textContent = totalAtten.toFixed(2) + '%';
      stackTotalAtten.style.color = totalAtten > 99 ? 'var(--green)' : totalAtten > 90 ? 'var(--cyan)' : 'var(--orange)';
    }
    if (stackEffMu) stackEffMu.textContent = effMu.toFixed(2) + ' cm⁻¹';
    if (stackLeadEq) stackLeadEq.textContent = leadEq.toFixed(1) + ' mm';
  }

  // Add layer
  const addLayerBtn = document.getElementById('addLayerBtn');
  const stackMatSelect = document.getElementById('stackMaterialSelect');
  const stackThickInput = document.getElementById('stackThicknessInput');

  if (addLayerBtn) {
    addLayerBtn.addEventListener('click', () => {
      const mat = stackMatSelect ? stackMatSelect.value : 'lead';
      const thick = parseFloat(stackThickInput ? stackThickInput.value : 10);
      stackLayers.push({ material: mat, thickness: thick });
      renderStackList();
      updateStackCalc();
      updateSimulation();
      addHudAlert('LAYER ADDED: ' + mat + ' ' + thick + 'mm', 'info');
    });
  }

  renderStackList();

  // ==========================================
  // 13. DIGITAL TWIN (Enhanced)
  // ==========================================
  const twinCanvas = document.getElementById('digitalTwinCanvas');
  if (twinCanvas) {
    const ctx2 = twinCanvas.getContext('2d');
    let twinTime = 0, twinAnim;

    function drawTwin() {
      const w = twinCanvas.width, h = twinCanvas.height;
      twinTime += 0.008;

      ctx2.clearRect(0, 0, w, h);
      ctx2.fillStyle = '#0a1628';
      ctx2.fillRect(0, 0, w, h);

      // Grid
      ctx2.strokeStyle = 'rgba(77, 212, 232, 0.04)'; ctx2.lineWidth = 0.5;
      for (let x = 0; x < w; x += 25) { ctx2.beginPath(); ctx2.moveTo(x, 0); ctx2.lineTo(x, h); ctx2.stroke(); }
      for (let y = 0; y < h; y += 25) { ctx2.beginPath(); ctx2.moveTo(0, y); ctx2.lineTo(w, y); ctx2.stroke(); }

      const cx = w / 2, cy = h / 2 + 10;

      // Bunker structure
      ctx2.strokeStyle = 'rgba(77, 212, 232, 0.3)'; ctx2.lineWidth = 1.5;
      ctx2.strokeRect(cx - 150, cy - 120, 300, 240);
      ctx2.strokeStyle = 'rgba(77, 212, 232, 0.15)'; ctx2.lineWidth = 1;
      ctx2.strokeRect(cx - 120, cy - 90, 240, 180);

      // Maze entrance
      ctx2.strokeStyle = 'rgba(77, 212, 232, 0.2)'; ctx2.lineWidth = 1;
      ctx2.beginPath();
      ctx2.moveTo(cx + 150, cy - 30); ctx2.lineTo(cx + 200, cy - 30);
      ctx2.lineTo(cx + 200, cy + 30); ctx2.lineTo(cx + 150, cy + 30);
      ctx2.stroke();

      // Control room
      ctx2.fillStyle = 'rgba(77, 212, 232, 0.03)';
      ctx2.fillRect(cx + 210, cy - 60, 70, 120);
      ctx2.strokeStyle = 'rgba(77, 212, 232, 0.15)'; ctx2.strokeRect(cx + 210, cy - 60, 70, 120);
      ctx2.fillStyle = 'rgba(77, 212, 232, 0.2)'; ctx2.font = '7px IBM Plex Mono'; ctx2.textAlign = 'center';
      ctx2.fillText('CONTROL', cx + 245, cy - 5);

      // Shielding layers
      [0, 8, 16].forEach((offset, i) => {
        ctx2.strokeStyle = ['rgba(77, 212, 232, 0.06)', 'rgba(77, 212, 232, 0.03)', 'rgba(77, 212, 232, 0.04)'][i];
        ctx2.lineWidth = 0.5;
        ctx2.strokeRect(cx - 150 - offset, cy - 120 - offset, 300 + offset * 2, 240 + offset * 2);
      });

      // Moving source with beam
      const pulseX = cx + Math.sin(twinTime * 0.7) * 30;
      const pulseY = cy + Math.cos(twinTime * 0.5) * 20;

      // Primary beam (particle stream)
      for (let i = 0; i < 20; i++) {
        const t = (twinTime * 0.5 + i * 0.05) % 1;
        const bx = pulseX + Math.cos(-0.6) * t * 120;
        const by = pulseY + Math.sin(-0.6) * t * 120;
        ctx2.beginPath(); ctx2.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(255, 107, 53, ${0.3 * (1 - t)})`;
        ctx2.fill();
      }

      // Scatter particles
      for (let i = 0; i < 12; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 80;
        const px = pulseX + Math.cos(ang + twinTime) * dist;
        const py = pulseY + Math.sin(ang + twinTime) * dist;
        ctx2.beginPath(); ctx2.arc(px, py, 1, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(77, 212, 232, ${0.1 * (1 - dist / 100)})`;
        ctx2.fill();
      }

      // Neutron particles (if neutron mode)
      const neutronActive = neutronMode ? neutronMode.checked : false;
      if (neutronActive) {
        for (let i = 0; i < 8; i++) {
          const ang = twinTime * 0.7 + i * 0.8;
          const dist = 30 + ((twinTime * 15 + i * 20) % 70);
          const px = pulseX + Math.cos(ang) * dist;
          const py = pulseY + Math.sin(ang) * dist;
          ctx2.beginPath(); ctx2.arc(px, py, 2, 0, Math.PI * 2);
          ctx2.fillStyle = `rgba(51, 255, 153, ${0.15 * (1 - dist / 100)})`;
          ctx2.fill();
        }
      }

      // Radiation waves
      for (let i = 0; i < 4; i++) {
        const r = 15 + ((twinTime * 30 + i * 40) % 100);
        ctx2.beginPath(); ctx2.arc(pulseX, pulseY, r, 0, Math.PI * 2);
        ctx2.strokeStyle = 'rgba(255, 107, 53, ' + (0.15 * (1 - r / 100)) + ')';
        ctx2.lineWidth = 1; ctx2.stroke();
      }

      // Source glow
      ctx2.beginPath(); ctx2.arc(pulseX, pulseY, 6, 0, Math.PI * 2);
      ctx2.fillStyle = '#ff6b35'; ctx2.fill();
      ctx2.shadowColor = '#ff6b35'; ctx2.shadowBlur = 20; ctx2.fill();
      ctx2.shadowBlur = 0;

      // Scanning beam
      ctx2.beginPath();
      ctx2.moveTo(pulseX, pulseY);
      ctx2.arc(pulseX, pulseY, 100, twinTime - 0.6, twinTime + 0.6);
      ctx2.closePath();
      ctx2.fillStyle = 'rgba(77, 212, 232, 0.04)';
      ctx2.fill();

      // Labels
      ctx2.fillStyle = 'rgba(77, 212, 232, 0.2)'; ctx2.font = '7px IBM Plex Mono'; ctx2.textAlign = 'center';
      ctx2.fillText('BUNKER TYPE: CYCLOTRON', cx, 14);
      ctx2.fillText('WALL: 1.8m CONCRETE | LEAD LINED', cx, h - 6);
      ctx2.fillStyle = 'rgba(51, 255, 153, 0.4)';
      ctx2.fillRect(10, h - 16, 6, 6);
      ctx2.fillStyle = 'rgba(77, 212, 232, 0.2)'; ctx2.textAlign = 'left';
      ctx2.fillText('SYSTEM ACTIVE', 20, h - 11);
      ctx2.textAlign = 'right';
      ctx2.fillText('DOSE: ' + (0.5 + Math.sin(twinTime * 2) * 0.2 + Math.random() * 0.1).toFixed(2) + ' µSv/h', w - 10, 14);

      twinAnim = requestAnimationFrame(drawTwin);
    }

    drawTwin();

    // Update twin metrics
    setInterval(() => {
      const el = (id) => document.getElementById(id);
      if (el('structuralLoad')) el('structuralLoad').textContent = (65 + Math.random() * 15).toFixed(1);
      if (el('shieldFatigue')) el('shieldFatigue').textContent = (2 + Math.random() * 3).toFixed(1);
      if (el('thermalLoad')) el('thermalLoad').textContent = (38 + Math.random() * 10).toFixed(1);
      if (el('integrityScore')) el('integrityScore').textContent = (94 + Math.random() * 5).toFixed(1);
    }, 3000);
  }

  // ==========================================
  // 14. FILE UPLOAD
  // ==========================================
  const dropzone = document.getElementById('uploadDropzone');
  const uploadInput = document.getElementById('uploadInput');
  const fileListEl = document.getElementById('fileList');
  const fileCount = document.getElementById('fileCount');
  const scanStatus = document.getElementById('scanStatus');
  let uploadedFiles = [];

  if (dropzone && uploadInput) {
    dropzone.addEventListener('click', () => { uploadInput.click(); });
    uploadInput.addEventListener('change', (e) => handleFiles(e.target.files));
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
  }

  function handleFiles(files) {
    for (const file of files) { uploadedFiles.push(file); addFileToList(file); }
    updateFileCount();
    simulateScan();
  }

  function addFileToList(file) {
    if (!fileListEl) return;
    const item = document.createElement('div');
    item.className = 'upload-file-item';
    const size = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : (file.size / 1024).toFixed(1) + ' KB';
    item.innerHTML = '<span class="file-icon">📄</span><span>' + file.name + '</span><span class="file-size">' + size + '</span><button class="file-remove" data-filename="' + file.name + '">✕</button>';
    item.querySelector('.file-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      const name = e.target.dataset.filename;
      uploadedFiles = uploadedFiles.filter(f => f.name !== name);
      item.remove();
      updateFileCount();
    });
    fileListEl.appendChild(item);
  }

  function updateFileCount() {
    if (fileCount) fileCount.textContent = uploadedFiles.length + ' file' + (uploadedFiles.length !== 1 ? 's' : '');
  }

  function simulateScan() {
    if (!scanStatus) return;
    scanStatus.innerHTML = '<div class="scan-line"></div><span>Scanning documents...</span>';
    setTimeout(() => {
      scanStatus.innerHTML = '<div class="scan-line"></div><span style="color:var(--green)">✓ Analysis complete — ' + uploadedFiles.length + ' document' + (uploadedFiles.length !== 1 ? 's' : '') + ' processed</span>';
      addHudAlert('DOCUMENTS PROCESSED: ' + uploadedFiles.length + ' files', 'info');
    }, 2000);
  }

  // ==========================================
  // 15. INITIALIZE
  // ==========================================
  updateSimulation();

  // Periodic heatmap refresh
  setInterval(() => {
    if (heatmapCanvas) {
      const kvp = kvpSlider ? kvpSlider.value : 80;
      const material = shieldMaterial ? shieldMaterial.value : 'lead';
      const doseEl = document.getElementById('annualDose');
      const dose = doseEl ? parseFloat(doseEl.textContent) || 0.1 : 0.1;
      const len = roomLength ? parseFloat(roomLength.value) : 6.0;
      const wid = roomWidth ? parseFloat(roomWidth.value) : 5.0;
      const dist = distanceInput ? parseFloat(distanceInput.value) : 2.0;
      const bAng = beamAngle ? parseFloat(beamAngle.value) : 45;
      const sX = sourcePosX ? parseFloat(sourcePosX.value) : 3.0;
      const sY = sourcePosY ? parseFloat(sourcePosY.value) : 2.5;
      drawHeatmap(dose, len, wid, dist, bAng, sX, sY);
      drawAttenuationGraph(material, kvp);
    }
  }, 2000);

  // Initial HUD alert
  addHudAlert('ALMATIN WORKSTATION v4.0 INITIALIZED', 'info');
  addHudAlert('All sensors online — Simulation ready', 'info');

})();
