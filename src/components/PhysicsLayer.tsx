import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface PhysicsLayerProps {
  className?: string;
  particleCount?: number;
}

type ParticleType = 'heart' | 'star' | 'polaroid' | 'gem' | 'balloon';

interface ParticleMeta {
  type: ParticleType;
  color: string;
  size: number;
  label?: string;
  alpha: number;
}

export const PhysicsLayer: React.FC<PhysicsLayerProps> = ({
  className = '',
  particleCount = 18,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const {
      Engine,
      World,
      Bodies,
      Body,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    // 1. Create engine with custom antigravity
    const engine = Engine.create({
      enableSleeping: false,
    });

    // Exact configuration from SPEC
    engine.gravity.y = -0.15; // Gentle negative drift upwards
    engine.gravity.x = 0.02;  // Slight lateral draft

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    // 2. Invisible static walls (Left, Right, and Top sensor boundary)
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: { visible: false },
      restitution: 0.7,
      friction: 0.1,
    };

    let leftWall = Bodies.rectangle(-25, height / 2, 50, height * 3, wallOptions);
    let rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 3, wallOptions);

    World.add(engine.world, [leftWall, rightWall]);

    // 3. Create floating antigravity bodies
    const particles: Matter.Body[] = [];
    const metaMap = new WeakMap<Matter.Body, ParticleMeta>();

    const types: ParticleType[] = ['heart', 'star', 'polaroid', 'gem', 'balloon'];
    const colors = [
      '#F43F5E', // Rose 500
      '#F59E0B', // Amber 500
      '#EC4899', // Pink 500
      '#38BDF8', // Sky 400
      '#A855F7', // Purple 500
      '#FDE047', // Light Amber
    ];

    const polaroidLabels = ['✨ Joy', '🎂 Hebziba', '💖 2026', '🌟 Wish', '🎉 Smile', '🥂 Cheers'];

    for (let i = 0; i < particleCount; i++) {
      const type = types[i % types.length];
      const color = colors[i % colors.length];
      const size = type === 'polaroid' ? 36 : type === 'balloon' ? 24 : 18;
      const x = Math.random() * (width - 80) + 40;
      // Stagger initial Y from below screen to mid-screen
      const y = height + Math.random() * height * 0.8;

      let body: Matter.Body;

      if (type === 'polaroid') {
        body = Bodies.rectangle(x, y, 46, 56, {
          restitution: 0.7,
          frictionAir: 0.03,
          density: 0.001,
          chamfer: { radius: 6 },
        });
      } else if (type === 'heart') {
        body = Bodies.circle(x, y, 22, {
          restitution: 0.75,
          frictionAir: 0.025,
          density: 0.0008,
        });
      } else {
        body = Bodies.circle(x, y, size, {
          restitution: 0.7,
          frictionAir: 0.028,
          density: 0.0009,
        });
      }

      metaMap.set(body, {
        type,
        color,
        size,
        label: polaroidLabels[i % polaroidLabels.length],
        alpha: 0.85,
      });

      // Give slight initial random upward velocity and angular drift
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.5,
        y: -(Math.random() * 1.8 + 0.8),
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.03);

      particles.push(body);
    }

    World.add(engine.world, particles);

    // 4. Infinite floating wrap-around boundary loop
    Events.on(engine, 'beforeUpdate', () => {
      particles.forEach((body) => {
        // When touching or exceeding the top ceiling, teleport back below viewport
        if (body.position.y < -60) {
          Body.setPosition(body, {
            x: Math.random() * (width - 60) + 30,
            y: height + 50 + Math.random() * 80,
          });
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 1.8,
            y: -(Math.random() * 2 + 1.2),
          });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.04);
        }

        // Horizontal bounce safety if drifting too far
        if (body.position.x < 10) {
          Body.setVelocity(body, { x: Math.abs(body.velocity.x) + 0.5, y: body.velocity.y });
        } else if (body.position.x > width - 10) {
          Body.setVelocity(body, { x: -Math.abs(body.velocity.x) - 0.5, y: body.velocity.y });
        }
      });
    });

    // 5. Mount MouseConstraint for interactive flicking, dragging, and tossing
    const mouse = Mouse.create(canvas);
    // Allow touch scrolling on mobile when not dragging a body
    // @ts-expect-error Matter.js mouse element event handling
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    // @ts-expect-error Matter.js mouse element event handling
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    World.add(engine.world, mouseConstraint);

    // 6. Custom high-fidelity canvas rendering loop
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;
    let lastTime = performance.now();

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const s = size * 0.7;
      c.moveTo(0, s * 0.3);
      c.bezierCurveTo(-s, -s * 0.6, -s * 1.4, s * 0.3, 0, s * 1.3);
      c.bezierCurveTo(s * 1.4, s * 0.3, s, -s * 0.6, 0, s * 0.3);
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, r: number) => {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        c.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
        c.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r * 0.45), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r * 0.45));
      }
      c.closePath();
      c.fill();
    };

    const render = (time: number) => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      // Step physics engine
      Engine.update(engine, delta);

      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // Render each body
        particles.forEach((body) => {
          const meta = metaMap.get(body);
          if (!meta) return;

          const { x, y } = body.position;
          const angle = body.angle;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.globalAlpha = meta.alpha;

          if (meta.type === 'polaroid') {
            // Mini floating Polaroid card
            const w = 46;
            const h = 56;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 6;

            // White polaroid base
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, 4);
            ctx.fill();

            // Inner photo square
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = meta.color;
            ctx.beginPath();
            ctx.roundRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 20, 2);
            ctx.fill();

            // Inner icon
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✨', 0, -h / 2 + 18);

            // Caption text at bottom
            if (meta.label) {
              ctx.fillStyle = '#1E293B';
              ctx.font = 'bold 9px "Caveat", cursive, sans-serif';
              ctx.fillText(meta.label, 0, h / 2 - 6);
            }
          } else if (meta.type === 'heart') {
            ctx.shadowColor = meta.color;
            ctx.shadowBlur = 14;
            ctx.fillStyle = meta.color;
            drawHeart(ctx, meta.size);
          } else if (meta.type === 'star') {
            ctx.shadowColor = meta.color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = meta.color;
            drawStar(ctx, meta.size);
          } else if (meta.type === 'balloon') {
            // Floating festive balloon with shine
            ctx.shadowColor = meta.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = meta.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, meta.size * 0.9, meta.size * 1.15, 0, 0, Math.PI * 2);
            ctx.fill();

            // Balloon shine reflection
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.ellipse(-meta.size * 0.35, -meta.size * 0.4, meta.size * 0.22, meta.size * 0.38, -0.4, 0, Math.PI * 2);
            ctx.fill();

            // Balloon knot & string
            ctx.fillStyle = meta.color;
            ctx.beginPath();
            ctx.moveTo(-3, meta.size * 1.15);
            ctx.lineTo(3, meta.size * 1.15);
            ctx.lineTo(0, meta.size * 1.15 + 4);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, meta.size * 1.15 + 4);
            ctx.bezierCurveTo(4, meta.size * 1.15 + 12, -4, meta.size * 1.15 + 20, 2, meta.size * 1.15 + 28);
            ctx.stroke();
          } else {
            // Sparkling gemstone
            ctx.shadowColor = meta.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = meta.color;
            ctx.beginPath();
            ctx.arc(0, 0, meta.size * 0.7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-meta.size * 0.25, -meta.size * 0.25, meta.size * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // 7. Responsive resize listener
    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;

      // Update static wall positions
      Body.setPosition(leftWall, { x: -25, y: height / 2 });
      Body.setPosition(rightWall, { x: width + 25, y: height / 2 });
    };

    window.addEventListener('resize', handleResize);

    // 8. Performance optimization: Pause simulation when out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      Events.off(engine, 'beforeUpdate', () => {});
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-auto overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
