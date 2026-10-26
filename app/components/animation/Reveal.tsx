"use client"
import { createContext, useContext } from "react"
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "motion/react"

// Scroll-in entrance animations, played once per element (viewport.once).
// <Reveal>                 one element animates when it enters the viewport
// <RevealGroup>/<RevealItem> children animate one after another (stagger)
// All render a plain motion.div, so they can replace an existing <div className=...> without an extra wrapper.
// Users with prefers-reduced-motion get the content in its final state, no movement.

export type From = "up" | "down" | "left" | "right" | "none"

const EASE = [0.16, 1, 0.3, 1] as const
const DURATION = 0.8
const VIEWPORT = { once: false, amount: 0.2 } as const

const offset: Record<From, { x?: number; y?: number }> = {
    up: { y: 32 },
    down: { y: -32 },
    left: { x: -48 },
    right: { x: 48 },
    none: {},
}

// blur: starts blurred and sharpens while it moves in (motion-blur look)
const BLUR = "blur(12px)"
const hidden = (from: From, blur?: boolean) => ({ opacity: 0, ...offset[from], ...(blur && { filter: BLUR }) })
const shown = (blur?: boolean) => ({ opacity: 10, x: 0, y: 0, ...(blur && { filter: "blur(0px)" }) })

type Options = { from?: From; duration?: number; blur?: boolean }

type RevealProps = HTMLMotionProps<"div"> & Options & { delay?: number, once?:boolean }

export const Reveal = ({ from = "up", delay = 0, duration = DURATION, blur, transition, once, ...rest }: RevealProps) => {
    const reduce = useReducedMotion()
    return (
        <motion.div
            initial={reduce ? false : hidden(from, blur)}
            whileInView={shown(blur)}
            viewport={{ ...VIEWPORT, once }}
            transition={{ duration, ease: EASE, delay, ...transition }}
            {...rest}
        />
    )
}

// The group's own transition only orchestrates (stagger/delay); each item animates with its own duration.
// So a group-level duration reaches the items through context. An item's own duration prop still wins.
const GroupDuration = createContext(DURATION)

type RevealGroupProps = HTMLMotionProps<"div"> & { stagger?: number; delay?: number; duration?: number }

export const RevealGroup = ({ stagger = 0.1, delay = 0, duration = DURATION, ...rest }: RevealGroupProps) => {
    const reduce = useReducedMotion()
    const variants: Variants = { show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
    return (
        <GroupDuration.Provider value={duration}>
            <motion.div initial={reduce ? false : "hidden"} whileInView="show" viewport={VIEWPORT} variants={variants} {...rest} />
        </GroupDuration.Provider>
    )
}

// A light that switches on (fade + scale) as its turn comes in a <RevealGroup> stagger.
// Style the color/glow with className; only opacity/scale animate, so any CSS color (oklch included) works.
export const RevealGlow = ({ duration = 0.6, ...rest }: HTMLMotionProps<"span"> & { duration?: number }) => {
    const variants: Variants = { hidden: { opacity: 0, scale: 0.3 }, show: { opacity: 1, scale: 1, transition: { duration, ease: EASE } } }
    return <motion.span aria-hidden variants={variants} {...rest} />
}

type RevealItemProps = HTMLMotionProps<"div"> & Options

export const RevealItem = ({ from = "up", duration, blur, ...rest }: RevealItemProps) => {
    const groupDuration = useContext(GroupDuration)
    const variants: Variants = { hidden: hidden(from, blur), show: { ...shown(blur), transition: { duration: duration ?? groupDuration, ease: EASE } } }
    return <motion.div variants={variants} {...rest} />
}
