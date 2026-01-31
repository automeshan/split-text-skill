"use client";

import React, { useRef } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function TextAnimation({
    children,
    animateOnScroll = true,
    delay = 0,
    // Optional scroll animation props
    useScrub = false,
    scrubValue = 1,
    pin = false,
    pinSpacing = true,
    start = "top 75%",
    end = "+=100%",
    rotation = 15,
    stagger = 0.2,
    duration = 1,
    className = "",
    style = {},
}) {
    const containerRef = useRef(null);
    const elementRefs = useRef([]);
    const splitRefs = useRef([]);
    const words = useRef([]);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            splitRefs.current = [];
            words.current = [];
            elementRefs.current = [];

            let elements = [];
            // Prefer splitting children elements (spans) to preserve their styles/classes
            if (containerRef.current.children.length > 0) {
                elements = Array.from(containerRef.current.children);
            } else {
                // Fallback for plain text nodes directly in the container
                elements = [containerRef.current];
            }

            // Helper function to wrap words in parent divs for overflow mask
            const wrapWords = (wordElements) => {
                wordElements.forEach(word => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'split-parent';
                    wrapper.style.overflow = 'hidden';
                    wrapper.style.display = 'inline-block';
                    wrapper.style.lineHeight = '0.75em'; // Tight mask around text
                    wrapper.style.verticalAlign = 'top';
                    word.parentNode.insertBefore(wrapper, word);
                    wrapper.appendChild(word);
                });
            };

            elements.forEach((element) => {
                elementRefs.current.push(element);

                // Split by words like About.jsx
                const split = new SplitText(element, {
                    type: 'words',
                    wordsClass: 'split-child'
                });

                splitRefs.current.push(split);

                // Wrap each word in a parent for overflow mask
                wrapWords(split.words);

                words.current.push(...split.words);
            });

            // Initial state: translated down, rotated, and invisible
            gsap.set(words.current, {
                y: "100%",
                rotation: rotation,
                opacity: 0,
            });

            // Animation properties
            const animationProps = {
                y: "0%",
                rotation: 0,
                opacity: 1,
                duration: duration,
                stagger: stagger,
                ease: "power4.out",
                delay: delay,
            };

            if (animateOnScroll) {
                const scrollTriggerConfig = {
                    trigger: containerRef.current,
                    start: start,
                };

                // Add scrub if enabled
                if (useScrub) {
                    scrollTriggerConfig.scrub = scrubValue;
                    scrollTriggerConfig.end = end;
                } else {
                    scrollTriggerConfig.once = true;
                }

                // Add pin if enabled
                if (pin) {
                    scrollTriggerConfig.pin = true;
                    scrollTriggerConfig.pinSpacing = pinSpacing;
                }

                gsap.to(words.current, {
                    ...animationProps,
                    scrollTrigger: scrollTriggerConfig,
                });
            } else {
                gsap.to(words.current, animationProps);
            }

            return () => {
                splitRefs.current.forEach((split) => {
                    if (split) {
                        split.revert();
                    }
                });
            };
        },
        { scope: containerRef, dependencies: [animateOnScroll, delay, useScrub, scrubValue, pin, pinSpacing, start, end, rotation, stagger, duration] }
    );

    return (
        <div
            ref={containerRef}
            className={className}
            style={style}
            data-copy-wrapper={React.Children.count(children) > 1 ? "true" : undefined}
        >
            {children}
        </div>
    );
}
