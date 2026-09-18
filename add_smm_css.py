import re

with open('d:\\new-getit\\nexella-html\\css\\smm-sections.css', 'r', encoding='utf-8') as f:
    content = f.read()

additional_css = """
/* ---------------- Why Choose Us ---------------- */
.smm-why {
  padding: 100px 0;
  position: relative;
}

/* Re-using .smm-services-grid and .smm-card for Why Choose Us */

/* ---------------- Process Timeline ---------------- */
.smm-process {
  padding: 120px 0;
  position: relative;
}

.smm-timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}

.timeline-line {
  position: absolute;
  left: 50px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--smm-glass-border);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0,255,102,0.2);
}

.timeline-line::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, var(--smm-neon-primary), transparent);
  animation: glowLine 4s infinite alternate;
}

@keyframes glowLine {
  0% { height: 0%; opacity: 1; }
  100% { height: 100%; opacity: 0; }
}

.timeline-step {
  position: relative;
  margin-bottom: 60px;
  padding-left: 120px;
}

.timeline-step:last-child { margin-bottom: 0; }

.step-num {
  position: absolute;
  left: 35px;
  top: 0;
  width: 34px; height: 34px;
  background: var(--smm-bg);
  border: 2px solid var(--smm-neon-primary);
  border-radius: 50%;
  color: var(--smm-neon-primary);
  font-weight: 800;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px var(--smm-neon-glow);
  z-index: 2;
}

.step-content {
  background: var(--smm-glass-bg);
  border: 1px solid var(--smm-glass-border);
  border-radius: 16px;
  padding: 30px;
  position: relative;
  transition: transform 0.3s, border-color 0.3s;
}

.step-content:hover {
  transform: translateX(10px);
  border-color: var(--smm-neon-primary);
}

.step-content h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #fff;
}

.step-content p {
  color: var(--smm-text-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-line { left: 20px; }
  .step-num { left: 5px; }
  .timeline-step { padding-left: 60px; }
}
"""

with open('d:\\new-getit\\nexella-html\\css\\smm-sections.css', 'a', encoding='utf-8') as f:
    f.write(additional_css)
print("Updated CSS with Why and Process sections")
