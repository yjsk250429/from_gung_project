import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Matter from 'matter-js';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
    '경치가 너무 멋졌어요!',
    '가이드가 친절하고 설명이 알기 쉬웠어요.',
    '전통 음식 투어 덕분에 맛집을 알게 됐어요.',
    '사진 찍기 좋은 포인트가 많아 인생샷 건졌어요.',
    '도자기 만들기가 색다른 경험이었어요.',
    '한복 체험이 정말 특별했어요!',
    '여행이 조금 타이트했지만 알찬 여행이었어요.',
    '다도 체험으로 한국 문화를 더 깊게 이해할 수 있었어요.',
    '경치가 너무 멋졌어요!',
    '가이드가 친절하고 설명이 알기 쉬웠어요.',
    '전통 음식 투어 덕분에 맛집을 알게 됐어요.',
    '사진 찍기 좋은 포인트가 많아 인생샷 건졌어요.',
    '도자기 만들기가 색다른 경험이었어요.',
    '한복 체험이 정말 특별했어요!',
    '여행이 조금 타이트했지만 알찬 여행이었어요.',
    '다도 체험으로 한국 문화를 더 깊게 이해할 수 있었어요.',
];

const stats = [
    { label: '600+', caption: 'Reservation' },
    { label: '500+', caption: 'review' },
    { label: '300+', caption: 'Rebook' },
    { label: '600+', caption: 'Reservation' },
    { label: '500+', caption: 'review' },
    { label: '300+', caption: 'Rebook' },
    { label: '600+', caption: 'Reservation' },
];

const ctas = ['+', '→', '→'];

const ReviewBlocks = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const itemRefs = useRef([]);

    const items = useMemo(() => {
        const arr = [
            ...reviews.map((t, i) => ({ id: `b-${i}`, role: 'bubble', text: t })),
            ...stats.map((s, i) => ({
                id: `s-${i}`,
                role: 'stat',
                text: s.label,
                caption: s.caption,
            })),
            ...ctas.map((t, i) => ({ id: `c-${i}`, role: 'cta', text: t })),
        ];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const domEls = itemRefs.current.filter(Boolean);
        if (!container || !canvas || domEls.length === 0) return;

        const { Engine, Render, Runner, Bodies, Composite, World, Body } = Matter;

        let engine = null;
        let render = null;
        let runner = null;
        let rafId = null;
        const bodiesMap = {};
        const wallThickness = 80;
        let st; // ScrollTrigger

        const init = () => {
            if (render) return;

            engine = Engine.create();

            // ▼▼▼ 속도/강도 완화 설정 ▼▼▼
            engine.world.gravity.y = 15; // 기본 1 → 더 약한 중력
            engine.timing.timeScale = 0.5; // 전체 시뮬 느리게
            // ▲▲▲

            render = Render.create({
                element: canvas,
                engine,
                options: {
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                    wireframes: false,
                    background: 'transparent',
                },
            });

            const W = container.offsetWidth;
            const H = container.offsetHeight;

            const ground = Bodies.rectangle(W / 2, H + wallThickness / 2, W, wallThickness, {
                isStatic: true,
            });
            const leftWall = Bodies.rectangle(-wallThickness / 2, H / 2, wallThickness, H * 5, {
                isStatic: true,
            });
            const rightWall = Bodies.rectangle(W + wallThickness / 2, H / 2, wallThickness, H * 5, {
                isStatic: true,
            });

            Composite.add(engine.world, [ground, leftWall, rightWall]);

            runner = Runner.create();
            Runner.run(runner, engine);
            Render.run(render);

            const rand = (min, max) => min + Math.random() * (max - min);
            const pickSpawn = () => {
                const r = Math.random();
                if (r < 0.6) return 'top';
                if (r < 0.8) return 'left';
                return 'right';
            };
            const EDGE_MARGIN = Math.min(W, H) * 0.08;

            domEls.forEach((el) => {
                const isCircle = el.dataset.shape === 'circle';
                const w = el.offsetWidth;
                const h = el.offsetHeight;
                const r = w / 2;

                const mode = pickSpawn();
                let x, y, vX, vY;

                switch (mode) {
                    case 'left':
                        x = EDGE_MARGIN;
                        y = rand(EDGE_MARGIN, H * 0.8);
                        vX = rand(1, 2.5);
                        vY = rand(-0.4, 0.4);
                        break;
                    case 'right':
                        x = W - EDGE_MARGIN;
                        y = rand(EDGE_MARGIN, H * 0.8);
                        vX = rand(-2.5, -1);
                        vY = rand(-0.4, 0.4);
                        break;
                    default: // "top"
                        x = rand(EDGE_MARGIN, W - EDGE_MARGIN);
                        y = -rand(EDGE_MARGIN, H * 0.8);
                        vX = rand(-1.5, 1.5);
                        vY = rand(0, 0.6);
                        break;
                }

                // 바디 생성 (튕김↓, 항력↑)
                const common = {
                    restitution: 0.1,
                    friction: 1,
                    frictionAir: 0.1,
                };

                let body;
                if (isCircle) {
                    body = Bodies.circle(x, y, r, common);
                } else {
                    body = Bodies.rectangle(x, y, w, h, {
                        ...common,
                        chamfer: { radius: 24 },
                    });
                }

                Body.setAngle(body, rand(-Math.PI, Math.PI));
                Body.setVelocity(body, { x: vX, y: vY });
                Body.setAngularVelocity(body, rand(-0.35, 0.35));

                el.dataset.bodyId = String(body.id);
                bodiesMap[body.id] = body;
            });

            World.add(engine.world, Object.values(bodiesMap));

            const update = () => {
                domEls.forEach((el) => {
                    const body = bodiesMap[el.dataset.bodyId];
                    if (!body) return;
                    el.style.transform = `translate(${body.position.x - el.offsetWidth / 2}px, ${
                        body.position.y - el.offsetHeight / 2
                    }px) rotate(${body.angle}rad)`;
                });
                rafId = requestAnimationFrame(update);
            };
            rafId = requestAnimationFrame(update);
        };

        const destroy = () => {
            if (!render) return;
            cancelAnimationFrame(rafId);
            Render.stop(render);
            World.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
            render = null;
            engine = null;
            runner = null;
        };

        st = ScrollTrigger.create({
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            invalidateOnRefresh: true,
            onEnter: () => init(),
            onEnterBack: () => init(),
        });

        const onResize = () => {
            destroy();
            domEls.forEach((el) => (el.style.transform = 'translate(-9999px, -9999px)'));
            init();
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            if (st) st.kill();
            destroy();
        };
    }, []);

    return (
        <section className="section6-main" ref={containerRef}>
            <div className="section5_bg">
                <img src="/images/con6_bg1.png" alt="" />
            </div>
            <div className="section6-text">
                <div className="text-box"></div>
            </div>
            <div className="section6-canvas" ref={canvasRef} />

            {items.map((it, i) => {
                if (it.role === 'cta') {
                    return (
                        <span
                            key={it.id}
                            ref={(el) => (itemRefs.current[i] = el)}
                            className="item item--circle circle--cta"
                            data-shape="circle"
                            data-role="cta"
                        >
                            {it.text}
                        </span>
                    );
                }

                if (it.role === 'stat') {
                    return (
                        <span
                            key={it.id}
                            ref={(el) => (itemRefs.current[i] = el)}
                            className="item item--circle circle--stat"
                            data-shape="circle"
                            data-role="stat"
                        >
                            <span className="circle-stat">
                                <strong className="num">{it.text}</strong>
                                <em className="cap">{it.caption}</em>
                            </span>
                        </span>
                    );
                }

                return (
                    <span
                        key={it.id}
                        ref={(el) => (itemRefs.current[i] = el)}
                        className="item item--bubble"
                        data-shape="rect"
                        data-role="bubble"
                    >
                        {it.text}
                    </span>
                );
            })}
        </section>
    );
};

export default ReviewBlocks;
